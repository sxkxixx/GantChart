from django.contrib import admin
from .models import Task, User


# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'task_name', 'status')
    list_filter = ('id', 'task_name')
    search_fields = ('id', 'task_name')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'last_name')

