from rest_framework.exceptions import APIException


class ApplicationError(APIException):

    status_code = 400
    default_detail = "Application Error"
    default_code = "application_error"

    def __init__(self, detail=None, code=None, status_code=None):
        if status_code is not None:
            self.status_code = status_code

        super().__init__(
            detail=detail or self.default_detail,
            code=code or self.default_code,
        )


class PermissionDeniedError(ApplicationError):

    status_code = 403
    default_detail = "Permission Denied"
    default_code = "permission_denied"