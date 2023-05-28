from django.db import models


class Role(models.Model):
    id = models.SmallAutoField(verbose_name='Role ID', primary_key=True, auto_created=True)
    name = models.CharField(verbose_name='Role Name', unique=True, max_length=31)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    class Meta:
        db_table = 'roles'


class Status(models.Model):
    id = models.SmallAutoField(verbose_name='ID статуса', primary_key=True, auto_created=True)
    name = models.CharField(verbose_name='Название статуса', unique=True, null=False, max_length=31)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    class Meta:
        db_table = 'statuses'


class Task(models.Model):
    id = models.BigAutoField(verbose_name='ID задачи', primary_key=True, auto_created=True)
    parent_id = models.ForeignKey('self', null=True, blank=True, verbose_name='Ссылка на родительскую задачу',
                                  on_delete=models.PROTECT, db_column='parent_id', to_field='id')
    project_id = models.IntegerField()
    team_id = models.IntegerField()
    name = models.CharField(verbose_name='Название задачи', max_length=31, null=False)
    description = models.CharField(verbose_name='Описание задачи', null=True, blank=True, max_length=255)
    is_on_kanban = models.BooleanField(verbose_name='Отображение на канбане', default=True)
    is_completed = models.BooleanField(verbose_name='Готовность задачи', default=False)
    status_id = models.ForeignKey(Status, on_delete=models.PROTECT, db_column='status_id', to_field='id')
    planned_start_date = models.DateField(verbose_name='Время начала задачи')
    planned_finish_date = models.DateField(verbose_name='Время окончания задачи')
    deadline = models.DateField(verbose_name='Жесткий дедлайн')
    completed_at = models.DateField(verbose_name='Время завершения', null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    def update(self, **kwargs):
        self.name = kwargs.get('name', self.name)
        self.description = kwargs.get('description', self.description)
        self.planned_start_date = kwargs.get('planned_start_date', self.planned_start_date)
        self.planned_finish_date = kwargs.get('planned_finish_date', self.planned_finish_date)
        self.deadline = kwargs.get('deadline', self.deadline)
        self.save()

    class Meta:
        db_table = 'tasks'


class Executor(models.Model):
    id = models.BigAutoField(verbose_name='ID исполнителя', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, db_column='task_id', to_field='id')
    user_id = models.IntegerField()
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='role_id', to_field='id')
    time_spent = models.TimeField(verbose_name='Время выполнения задачи')
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    class Meta:
        db_table = 'executors'


class Stage(models.Model):
    id = models.BigAutoField(verbose_name='ID подэтапа', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, null=False, on_delete=models.CASCADE, db_column='task_id', to_field='id')
    description = models.CharField(verbose_name='Описание этапа', max_length=255)
    is_ready = models.BooleanField(verbose_name='Подэтап выполнен', default=False)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    class Meta:
        db_table = 'stages'


class Comment(models.Model):
    id = models.BigAutoField(verbose_name='ID комментария', primary_key=True, auto_created=True)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, db_column='task_id', to_field='id')
    user_id = models.IntegerField()
    content = models.CharField(verbose_name='Текст комментария', max_length=255, null=False)
    created_at = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Время обновления', auto_now=True)

    class Meta:
        db_table = 'comments'
