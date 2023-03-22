from django.shortcuts import render
from django.forms import model_to_dict
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from rest_framework.decorators import api_view
from .models import *


@api_view(['GET'])
def tasks(request):
    tasks = []
    for task in Task.objects.all():
        tasks.append({
            'id': task.id,
            'task_name': task.task_name,
            'description': task.task_description,
            'owner': {
                'name': task.owner.name,
                'last_name': task.owner.last_name
            },
            'executors': [{
                'first_name': executor.name,
                'last_name': executor.last_name
            } for executor in task.executor.all()],
            'start_date': task.start_date,
            'finish_date': task.finish_date,
            'deadline': task.deadline,
            'status': task.status
        }
        )
    return Response(tasks)


@api_view(['GET'])
def tasks_all(request):
    tasks = map(model_to_dict, Task.objects.all())
    return Response(tasks)


@api_view(['POST'])
def create_task(request):
    """Как-нибудь доделаю этот метод, чтоб можно было создавать задачу через POST-запрос"""
    return Response({'Status': 'Error: Failed to add new task'})
    # try:
    #
    #     data = request.data
    #     if not isinstance(data, list):
    #         data = [data]
    #     new_tasks = []
    #     for task in data:
    #         owner = User.objects.get(name=task['owner']['name'])
    #
    #         task = Task.objects.create(
    #             task_name=task.task_name,
    #             description=task.task_description,
    #
    #         )
    #         new_tasks.append(task)
    #     return Response({"Status": "Tasks succesfully added", "tasks": map(model_to_dict, new_tasks)})
    #
    # except:
    #     return Response({'Status': 'Error: Failed to add new task'})


class TaskAPIView(APIView):
    # Не используется
    def get(self, request):
        output = [
            {
                'task_name': task.task_name,
                'start_date': task.start_date,
                'duration': (task.deadline - task.start_date).days,
                'status': task.status
            }
            for task in Task.objects.all()
        ]
        return Response({'tasks': output})

    def post(self, request):
        try:
            if isinstance(request.data, list):
                tasks = []
                for task in request.data:
                    new_task = Task.objects.create(
                        task_name=task.get('task_name'),
                        task_description=task.get('task_description', None),
                        start_date=task.get('start_date'),
                        deadline=task.get('deadline'),
                        status=task.get('status')
                    )
                    tasks.append(model_to_dict(new_task))
                return Response({'status': 'Success', 'tasks': tasks})
            else:
                task = Task.objects.create(
                    task_name=request.data.get('task_name'),
                    task_description=request.data.get('task_description', None),
                    start_date=request.data.get('start_date'),
                    deadline=request.data.get('deadline'),
                    status=request.data.get('status')
                )
                return Response({'status': 'Success', 'task': model_to_dict(task)})
        except:
            return Response({'status': 'Failed'})
