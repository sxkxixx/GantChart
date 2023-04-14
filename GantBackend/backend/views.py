from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.request import Request
from .models import *
from .utils import get_task_comments, get_task_stages, many_requests_db_tasks


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
def create_task():
    pass


@api_view(['DELETE'])
def delete_task():
    pass

