# Generated by Django 4.1.7 on 2023-04-14 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_alter_task_completed_at_alter_task_description_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='name',
            field=models.CharField(max_length=100, verbose_name='Название задачи'),
        ),
    ]
