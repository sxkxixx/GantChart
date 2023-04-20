from .models import Comment, User, TaskStage, Task
from datetime import datetime

DATE_FORMAT = "%Y-%m-%d"


def get_task_comments(task_id):
    comments = Comment.objects.filter(task_id=task_id).values('id', 'content', 'user_id')
    for comment in comments:
        comment['user'] = User.objects.filter(id=comment['user_id']).values('name', 'surname').get()
        comment['user']['user_id'] = comment['user_id']
        comment.pop('user_id')
    return comments


def get_task_stages(task_id):
    stages = TaskStage.objects.filter(task_id=task_id).values('id', 'description', 'is_ready')
    return stages


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


def validate_dates(*dates):
    for date in dates:
        if date:
            try:
                datetime.strptime(date, DATE_FORMAT)
            except:
                raise ValueError(f'{date} must be a "{DATE_FORMAT}" format')


def validate_date_term(start_date, finish_date, deadline):
    if not (datetime.strptime(start_date, DATE_FORMAT) < datetime.strptime(finish_date, DATE_FORMAT) <= datetime.strptime(deadline, DATE_FORMAT)):
        raise ValueError('Must be start_date < finish_date <= deadline')


def is_valid_task_term(task: Task, parent_task: Task):
    if not parent_task:
        return True
    s_t, f_t, t_d = datetime.strptime(task.planned_start_date, DATE_FORMAT).date(), datetime.strptime(task.planned_finish_date, DATE_FORMAT).date(), datetime.strptime(task.deadline, DATE_FORMAT).date()
    return parent_task.planned_start_date <= s_t <= parent_task.planned_finish_date and parent_task.planned_start_date <= f_t <= parent_task.planned_finish_date and t_d <= parent_task.deadline
