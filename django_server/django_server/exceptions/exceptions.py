from django_server.exceptions.error_codes import ErrorCodes


class GenericException(Exception):
    def __init__(self):
        self.error_code = ErrorCodes.generic_exception.get('code')
        self.message = ErrorCodes.generic_exception.get('message')


class EmptyTableException(GenericException):
    def __init__(self):
        self.error_code = ErrorCodes.empty_table.get('code')
        self.message = ErrorCodes.empty_table.get('message')