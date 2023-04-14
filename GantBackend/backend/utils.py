from .models import Comment, User, TaskStage


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
