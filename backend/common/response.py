from rest_framework.response import Response
from rest_framework import status

def api_response(data=None, message=None, success=True, status_code=status.HTTP_200_OK):
    payload = {
        "success": success
    }
    if message is not None:
        payload["message"] = message
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)

def api_error(code="ERROR", message="An error occurred", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    payload = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details or {}
        }
    }
    return Response(payload, status=status_code)
