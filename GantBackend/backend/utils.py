from .models import Task
from django.forms import model_to_dict

DATE_FORMAT = "%Y-%m-%d"


def many_requests_db_tasks(parent_id, task_list: list):
    tasks = Task.objects.filter(parent_id=parent_id).values('id', 'name', 'description', 'is_on_kanban',
                                                            'is_completed', 'planned_start_date',
                                                            'planned_finish_date', 'deadline')
    if not tasks:
        return []
    task_list += tasks
    for task in tasks:
        task['children'] = many_requests_db_tasks(task['id'], task.get('children', []))
    return task_list


def get_tasks(initial_tasks_list, parent_id, task_list):
    tasks = list(filter(lambda x: x['parent_id'] == parent_id, initial_tasks_list))
    if not tasks:
        return []
    task_list += tasks
    for task in tasks:
        task['children'] = get_tasks(initial_tasks_list, task.get('id'), task.get('children', []))
    return task_list


def is_valid_date_term(start_date, finish_date):
    return start_date < finish_date


def is_in_parent_terms(parent: Task, task: Task):
    if parent is None:
        return True
    return parent.planned_start_date <= task.planned_start_date and task.planned_finish_date <= parent.planned_finish_date
