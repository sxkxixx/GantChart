from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.request import Request
from .models import *
from .utils import get_task_comments, get_task_stages, many_requests_db_tasks, validate_dates, validate_date_term


@api_view(['GET'])
def get_all_tasks(request: Request):
    tasks = many_requests_db_tasks(None, [])
    return Response(tasks)


@api_view(['GET'])
def get_task_by_id(request, id):
    task = model_to_dict(Task.objects.get(id=id))
    task['comments'] = get_task_comments(id)
    task['stages'] = get_task_stages(id)
    # Пока что без исполнителя задач, потому что этот момент
    # надо уточнить с командой канбана
    return Response(task)


@api_view(['POST'])
def edit_dates():
    pass


@api_view(['POST'])
def create_task(request: Request):
    """
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
    validate_dates(data['planned_start_date'], data['planned_finish_date'], data['deadline'])
    validate_date_term(data['planned_start_date'], data['planned_finish_date'], data['deadline'])
    task = Task.objects.create(
        parent_id=Task.objects.get(id=data['parent_id']),
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
def delete_task():
    pass

