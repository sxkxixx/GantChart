from django.urls import path
from .views import *


urlpatterns = [
    path('tasks', ...),
    path('tasks/all', ...),
    path('task/edit/<str:id>', ...)
]