from django.db import models


class Project(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    title = models.CharField(verbose_name='Название проекта', max_length=100)


class User(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)


class Team(models.Model):
    id = models.SmallAutoField(primary_key=True, auto_created=True)
    name = models.CharField(unique=True, max_length=60)


class Role(models.Model):
    id = models.SmallAutoField(verbose_name='Role ID', primary_key=True, auto_created=True)
    name = models.CharField(verbose_name='Role Name', unique=True, max_length=30)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)


class Status(models.Model):
    id = models.SmallAutoField(verbose_name='ID статуса', primary_key=True, auto_created=True)
    name = models.CharField(verbose_name='Название статуса', unique=True, null=False, max_length=50)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)


class Task(models.Model):
    id = models.BigAutoField(verbose_name='ID задачи', primary_key=True, auto_created=True)
    parent_id = models.ForeignKey('self', null=True, blank=True, verbose_name='Ссылка на родительскую задачу', on_delete=models.PROTECT,
                                  to_field='id')
    project_id = models.ForeignKey(Project, on_delete=models.PROTECT, to_field='id')
    team_id = models.ForeignKey(Team, on_delete=models.PROTECT, to_field='id')
    name = models.CharField(verbose_name='Название задачи', max_length=100, null=False)
    description = models.CharField(verbose_name='Описание задачи', null=True, blank=True, max_length=255)
    is_on_kanban = models.BooleanField(verbose_name='Отображение на канбане', default=True)
    is_completed = models.BooleanField(verbose_name='Готовность задачи', default=False)
    status_id = models.ForeignKey(Status, to_field='id', on_delete=models.PROTECT)
    planned_start_date = models.DateField(verbose_name='Время начала задачи')
    planned_finish_date = models.DateField(verbose_name='Время окончания задачи')
    deadline = models.DateField(verbose_name='Жесткий дедлайн')
    completed_at = models.DateField(verbose_name='Время завершения', null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)


class Executor(models.Model):
    id = models.BigAutoField(verbose_name='ID исполнителя', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, on_delete=models.PROTECT, to_field='id')
    user_id = models.ForeignKey(User, on_delete=models.PROTECT, to_field='id')
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE, to_field='id')
    time_spent = models.TimeField(verbose_name='Время выполнения задачи')
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)


class TaskStage(models.Model):
    id = models.BigAutoField(verbose_name='ID подэтапа', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, null=False, on_delete=models.PROTECT)
    description = models.CharField(verbose_name='Описание этапа', max_length=255)
    is_ready = models.BooleanField(verbose_name='Подэтап выполнен')
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)


class Comment(models.Model):
    id = models.BigAutoField(verbose_name='ID комментария', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, on_delete=models.PROTECT, to_field='id')
    user_id = models.ForeignKey(User, on_delete=models.PROTECT, to_field='id')
    content = models.CharField(verbose_name='Текст комментария', max_length=255, null=False)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)
