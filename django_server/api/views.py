from api.models import Background
from django.db.models import Max
from django.views.decorators.csrf import csrf_exempt
from django_server.decorators.validate_user import validate_user
from django_server.exceptions.exceptions import EmptyTableException
from django_server.tasks import fetch_background_meta
from django_server.utilities import JSONResponse, process_exception
from random import randint


def get_random_background(request):
    response = {'status': 0}
    try:
        background = []
        while len(background) == 0:
            background = Background.objects.all()
            if background.exists():
                background = Background.objects.filter(
                    id=randint(0, background.aggregate(Max('id')).get('id__max')), active=True).values('name', 'url')
            else:
                raise EmptyTableException
        response['background'] = background[0]
        response['status'] = 1
    except Exception as e:
        response = process_exception(response, e)
    return JSONResponse(response)


@csrf_exempt
@validate_user
def add_background_by_request(request):
    response = {'status': 0}
    try:
        background = Background.objects.filter(url=request.POST.get('url'))
        if not background.exists():
            background = Background(
                name=request.POST.get('name'),
                url=request.POST.get('url'),
                found_at=request.POST.get('found_at'),
            )
            background.save()
            fetch_background_meta.delay(background.id)
        response['status'] = 1
    except Exception as e:
        response = process_exception(response, e)
    return JSONResponse(response)