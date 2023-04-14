from .models import Comment, User, TaskStage, Task


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
    tasks = Task.objects.filter(parent_id=parent_id).values('id', 'name', 'description')
    if not tasks:
        return []
    task_list += tasks
    for task in tasks:
        task['children'] = many_requests_db_tasks(task['id'], task.get('children', []))
    return task_list




