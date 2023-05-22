# Generated by Django 4.1.7 on 2023-05-21 17:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100, verbose_name='Название проекта')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.SmallAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='Role ID')),
                ('name', models.CharField(max_length=30, unique=True, verbose_name='Role Name')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
            ],
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.SmallAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID статуса')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Название статуса')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID задачи')),
                ('name', models.CharField(max_length=100, verbose_name='Название задачи')),
                ('description', models.CharField(blank=True, max_length=255, null=True, verbose_name='Описание задачи')),
                ('is_on_kanban', models.BooleanField(default=True, verbose_name='Отображение на канбане')),
                ('is_completed', models.BooleanField(default=False, verbose_name='Готовность задачи')),
                ('planned_start_date', models.DateField(verbose_name='Время начала задачи')),
                ('planned_finish_date', models.DateField(verbose_name='Время окончания задачи')),
                ('deadline', models.DateField(verbose_name='Жесткий дедлайн')),
                ('completed_at', models.DateField(blank=True, null=True, verbose_name='Время завершения')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
                ('parent_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='backend.task', verbose_name='Ссылка на родительскую задачу')),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.project')),
                ('status_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.status')),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.SmallAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=60, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('surname', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='TaskStage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID подэтапа')),
                ('description', models.CharField(max_length=255, verbose_name='Описание этапа')),
                ('is_ready', models.BooleanField(verbose_name='Подэтап выполнен')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.task')),
            ],
        ),
        migrations.AddField(
            model_name='task',
            name='team_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.team'),
        ),
        migrations.CreateModel(
            name='Executor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID исполнителя')),
                ('time_spent', models.TimeField(verbose_name='Время выполнения задачи')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
                ('role_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.role')),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.task')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.user')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID комментария')),
                ('content', models.CharField(max_length=255, verbose_name='Текст комментария')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Время обновления')),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.task')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.user')),
            ],
        ),
    ]
