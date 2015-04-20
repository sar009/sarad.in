from django.http import HttpResponse
from django_server.exceptions.exceptions import GenericException
import simplejson as json


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        try:
            json_data = json.dumps(data)
        except TypeError:
            for each_key in data:
                data[each_key] = str(data[each_key])
            json_data = json.dumps(data)
        content = HttpResponse(json_data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


def process_exception(response, exception):
    if isinstance(exception, GenericException):
        response['message'] = exception.message
        response['error_code'] = exception.error_code
    else:
        response['message'] = exception.message
        response['error_code'] = 500
    return response