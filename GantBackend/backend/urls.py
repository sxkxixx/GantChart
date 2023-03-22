from django.urls import path
from .views import *


urlpatterns = [
    path('tasks', tasks),
    path('tasks/all', tasks_all),
    path('task/create', create_task)
]