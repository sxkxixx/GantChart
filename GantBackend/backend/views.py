from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.request import Request
from .models import *
from .utils import get_task_comments, get_task_stages, many_requests_db_tasks, validate_dates, validate_date_term


@api_view(['GET'])
def get_all_tasks(request: Request):
    """Возвращает задачи во вложенном виде, с полями, необходимыми для диаграммы Ганта."""
    tasks = many_requests_db_tasks(None, [])
    return Response(tasks)


@api_view(['GET'])
def get_task_by_id(request, id):
    """
    Выдает полная информацию по задаче. Если задачи с таким id нет, возвращается ошибка с 404-статус кодом.
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
    data = request.data
    validate_dates(
        data.get('planned_start_date', None),
        data.get('planned_finish_date', None),
        data.get('deadline', None)
    )
    validate_date_term(
        data.get('planned_start_date', task.planned_start_date),
        data.get('planned_finish_date', task.planned_finish_date),
        data.get('deadline', task.deadline)
    )
    task.planned_start_date = data.get('planned_start_date', task.planned_start_date)
    task.planned_finish_date = data.get('planned_finish_date', task.planned_finish_date)
    task.deadline = data.get('deadline', task.deadline)
    task.save()
    return Response(request.data)


@api_view(['POST'])
def create_task(request: Request):
    """Создать задачу:
    {"parent_id":0,
    "project_id":0,
    "team_id":0,
    "name":"string",
    "description":"string",
    "planned_start_date":"%Y-%m-%d",
    "planned_finish_date":"%Y-%m-%d",
    "deadline":"%Y-%m-%d"}
    """
    data = request.data
    try:
        parent_task = Task.objects.get(id=data['parent_id'])
    except:
        parent_task = None

    validate_dates(data['planned_start_date'], data['planned_finish_date'], data['deadline'])
    validate_date_term(data['planned_start_date'], data['planned_finish_date'], data['deadline'])
    task = Task.objects.create(
        parent_id=parent_task,
        project_id=Project.objects.get(id=data['project_id']),
        team_id=Team.objects.get(id=data['team_id']),
        name=data['name'],
        description=data.get('description', None),
        status_id=Status.objects.get(name='В работу'),
        planned_start_date=data['planned_start_date'],
        planned_finish_date=data['planned_finish_date'],
        deadline=data['deadline']
    )
    return Response(model_to_dict(task))


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
