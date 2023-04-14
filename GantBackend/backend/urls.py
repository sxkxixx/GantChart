from django.urls import path
from .views import *


urlpatterns = [
    path('tasks', get_all_tasks),
    path('task/<int:id>', get_task_by_id),
]