from django.contrib.auth import authenticate
from django_server.utilities import JSONResponse, process_exception
from functools import wraps


def validate_user(view_func):
    def _decorator(request, *args, **kwargs):
        response = {
            'status': 0,
            'error_code': 401,
            'message': 'unauthorized access'
        }
        try:
            user = authenticate(username=request.POST.get('username'), password=request.POST.get('password'))
            if user is not None:
                return view_func(request, user, *args, **kwargs)
        except Exception as e:
            response = process_exception(response, e)
        return JSONResponse(response)
    return wraps(view_func)(_decorator)