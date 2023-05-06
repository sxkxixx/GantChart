from .models import Comment, User, TaskStage, Task

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


def is_valid_date_term(start_date, finish_date):
    return start_date < finish_date


def is_in_parent_terms(parent: Task, task: Task):
    if parent is None:
        return True
    return parent.planned_start_date <= task.planned_start_date and task.planned_finish_date <= parent.planned_finish_date
