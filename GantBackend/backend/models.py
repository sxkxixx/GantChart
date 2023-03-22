from django.db import models


class User(models.Model):
    name = models.CharField(verbose_name='Имя', max_length=30)
    last_name = models.CharField(verbose_name='Фамилия', max_length=50)

    def __str__(self):
        return f'{self.name} {self.last_name}'


class Task(models.Model):
    STATUS_CHOICE = [
        ('PLANNED', 'Запланирована'),
        ('TO WORK', 'В работу'),
        ('IN WORK', 'В работе'),
        ('COMPLETED', 'Завершена'),
    ]
    id = models.AutoField(verbose_name='ID задачи', primary_key=True, auto_created=True)
    task_name = models.CharField(verbose_name='Название задачи', max_length=100)
    task_description = models.CharField(verbose_name='Описание задачи', max_length=200, null=True, blank=True)
    owner = models.ForeignKey(verbose_name='Постановщик', to=User, on_delete=models.SET_DEFAULT, null=True, default=None, related_name='owner_id')
    executor = models.ManyToManyField(verbose_name='Ответственный', to=User, null=True, default=None)
    start_date = models.DateTimeField(verbose_name='Старт задачи', null=False)
    finish_date = models.DateTimeField(verbose_name='Финиш задачи', null=False)
    deadline = models.DateTimeField(verbose_name='Жесткий дедлайн', null=False)
    status = models.CharField(verbose_name='Статус задачи', choices=STATUS_CHOICE, max_length=20, null=False)

    def __str__(self):
        return self.task_name
