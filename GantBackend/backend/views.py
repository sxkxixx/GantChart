from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.request import Request
from .models import *
from .utils import is_valid_date_term, DATE_FORMAT, \
    is_in_parent_terms, get_tasks
from datetime import datetime


@api_view(['GET'])
def get_all_tasks(request):
    """Возвращает задачи во вложенном виде, с полями, необходимыми для диаграммы Ганта.
    В BODY запроса указывается поле {'project_id': <ID-проекта>}
    """
    project_filter = int(request.data.get('project_id', 1))
    tasks = Task.objects.filter(project_id=project_filter).values('id', 'parent_id', 'name', 'description',
                                                                  'is_on_kanban', 'is_completed', 'planned_start_date',
                                                                  'planned_finish_date', 'deadline')
    tasks = get_tasks(tasks, None, [])
    return Response(tasks)


@api_view(['GET'])
def get_task_by_id(request, id):
    """
    Выдает полную информацию по задаче. Если задачи с таким id нет, возвращается ошибка с 404-статус кодом.
    """
    try:
        task = {'task': model_to_dict(Task.objects.get(id=id)), 'stages': Stage.objects.filter(task_id=id).values('id', 'description', 'is_ready')}
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
    if not is_valid_date_term(start_date, finish_date):
        raise ValueError('Must be "start_date < finish_date"')
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
    {"task":
    {"parent_id":0, "project_id":0, "team_id":0, "name":"string", "description":"string",
    "planned_start_date":"%Y-%m-%d", "planned_finish_date":"%Y-%m-%d", "deadline":"%Y-%m-%d"},
    "stages": [{"description": "string"}, {"description": "string"}]
    }
    """
    task_data, stages_data = request.data.get('task'), request.data.get('stages')
    try:
        parent_task = Task.objects.get(id=task_data['parent_id'])
    except:
        parent_task = None
    try:
        start_date = datetime.strptime(task_data.get('planned_start_date'), DATE_FORMAT).date()
        finish_date = datetime.strptime(task_data.get('planned_finish_date'), DATE_FORMAT).date()
        deadline = datetime.strptime(task_data.get('deadline'), DATE_FORMAT).date()
    except:
        raise ValueError(f'Incorrect date format. Must be a "{DATE_FORMAT}" format')
    if not is_valid_date_term(start_date, finish_date):
        raise ValueError('Must be "start_date < finish_date"')
    task = Task(
        parent_id=parent_task,
        project_id=task_data['project_id'],
        team_id=task_data['team_id'],
        name=task_data['name'],
        description=task_data.get('description', None),
        status_id=Status.objects.get_or_create(name='Запланирована')[0],
        planned_start_date=start_date,
        planned_finish_date=finish_date,
        deadline=deadline
    )
    if is_in_parent_terms(parent_task, task):
        if parent_task:
            parent_task.is_on_kanban = False
            parent_task.save()
        task.save()
        for stage in stages_data:
            Stage.objects.create(
                task_id_id=task.id,
                description=stage.get('description')
            )
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
def delete_task(request: Request, id: int):
    """Удалить задачу"""
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    context = {'task': task.id, 'status': 'deleted'}
    task.delete()
    return Response(context)


@api_view(['POST'])
def edit_task(request: Request, id: int):
    """{"task":
    {"name":"string", "description":"string",
    "planned_start_date":"%Y-%m-%d", "planned_finish_date":"%Y-%m-%d", "deadline":"%Y-%m-%d"},
    "stages": [{"description": "string"}, {"description": "string"}]
    }"""
    task_data = request.data.get('task')
    stages_data = request.data.get('stages', [])
    try:
        task = Task.objects.get(id=id)
    except:
        return Response({"msg": "Enter the correct data."}, status=404)
    for stage in Stage.objects.filter(task_id=id):
        stage.delete()
    for stage in stages_data:
        Stage.objects.create(
            task_id=task.id,
            description=stage.get('description')
        )
    task.update(
        name=task_data.get('name', task.name),
        description=task_data.get('description', task.description),
        planned_start_date=task_data.get('planned_start_date', task.planned_start_date),
        planned_finish_date=task_data.get('planned_finish_date', task.planned_finish_date),
        deadline=task_data.get('deadline', task.deadline)
    )
    return Response({'task_id': task.id, 'status': 'updated'})

