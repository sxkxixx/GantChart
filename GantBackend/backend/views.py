from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.request import Request
from .models import *
from .utils import get_task_comments, get_task_stages, many_requests_db_tasks, is_valid_date_term, DATE_FORMAT, \
    is_in_parent_terms
from datetime import datetime


@api_view(['GET'])
def get_all_tasks(request: Request):
    """Возвращает задачи во вложенном виде, с полями, необходимыми для диаграммы Ганта."""
    tasks = many_requests_db_tasks(None, [])
    return Response(tasks)


@api_view(['GET'])
def get_task_by_id(request, id):
    """
    Выдает полную информацию по задаче. Если задачи с таким id нет, возвращается ошибка с 404-статус кодом.
    """
    try:
        task = model_to_dict(Task.objects.get(id=id))
        task['comments'] = get_task_comments(id)
        task['stages'] = get_task_stages(id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    return Response(task)


@api_view(['POST'])
def edit_dates(request: Request, id):
    """
    Изменение дат начала, окончания выполнения задачи и дедлайна: Если условие
    planned_start_date < planned_finish_date <= deadline не выполняется или нет задачи с таким id, выбрасывается ошибка с 404-статус кодом

    Структура body в запросе:
    { "planned_start_date":"str", "planned_finish_date":"str", "deadline":"str" }
    """
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    data: dict = request.data
    try:
        start_date = datetime.strptime(data.get('planned_start_date'), DATE_FORMAT).date()
        finish_date = datetime.strptime(data.get('planned_finish_date'), DATE_FORMAT).date()
        deadline = datetime.strptime(data.get('deadline'), DATE_FORMAT).date()
    except:
        raise ValueError(f'Incorrect date format. Must be a "{DATE_FORMAT}" format')
    if not is_valid_date_term(start_date, finish_date, deadline):
        raise ValueError('Must be "start_date < finish_date <= deadline"')
    parent = task.parent_id

    task.planned_start_date = start_date
    task.planned_finish_date = finish_date
    task.deadline = deadline
    if is_in_parent_terms(parent, task):
        task.save()
        return Response(request.data)
    return Response({"msg": "Enter the correct data."}, status=404)


@api_view(['POST'])
def create_task(request: Request):
    """Создать задачу:
    {"parent_id":0, "project_id":0, "team_id":0, "name":"string", "description":"string",
    "planned_start_date":"%Y-%m-%d", "planned_finish_date":"%Y-%m-%d", "deadline":"%Y-%m-%d"}
    """
    data: dict = request.data
    try:
        parent_task = Task.objects.get(id=data['parent_id'])
    except:
        parent_task = None
    try:
        start_date = datetime.strptime(data.get('planned_start_date'), DATE_FORMAT).date()
        finish_date = datetime.strptime(data.get('planned_finish_date'), DATE_FORMAT).date()
        deadline = datetime.strptime(data.get('deadline'), DATE_FORMAT).date()
    except:
        raise ValueError(f'Incorrect date format. Must be a "{DATE_FORMAT}" format')

    if not is_valid_date_term(start_date, finish_date, deadline):
        raise ValueError('Must be "start_date < finish_date <= deadline"')

    task = Task(
        parent_id=parent_task,
        project_id=Project.objects.get(id=data['project_id']),
        team_id=Team.objects.get(id=data['team_id']),
        name=data['name'],
        description=data.get('description', None),
        status_id=Status.objects.get(name='В работу'),
        planned_start_date=start_date,
        planned_finish_date=finish_date,
        deadline=deadline
    )
    if is_in_parent_terms(parent_task, task):
        if parent_task:
            parent_task.is_on_kanban = False
            parent_task.save()
        task.save()
        return Response(model_to_dict(task))
    return Response({"msg": "Enter the correct data."}, status=404)


@api_view(['POST'])
def change_kanban_view(request: Request, id: int):
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    parent_tasks = Task.objects.filter(parent_id=id)
    if parent_tasks:
        task.is_on_kanban = False
        task.save()
        return Response({'task': {'id': id, 'is_on_kanban': False}})
    flag = task.is_on_kanban
    task.is_on_kanban = not flag
    task.save()
    return Response({'task': {'id': id, 'is_on_kanban': task.is_on_kanban}})


@api_view(['DELETE'])
def delete_task(request: Request, id):
    """Удалить задачу"""
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    context = {'task': task.id, 'status': 'deleted'}
    task.delete()
    return Response(context)
