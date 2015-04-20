from api.models import Background
from celery import task


@task()
def fetch_background_meta(background_id):
    try:
        background = Background.objects.get(id=background_id)
        background.save()
    except:
        pass