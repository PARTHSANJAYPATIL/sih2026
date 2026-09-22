from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_code = getattr(exc, 'default_code', 'ERROR').upper()
        
        # Extract message
        message = ""
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
            elif 'non_field_errors' in response.data:
                message = " ".join([str(e) for e in response.data['non_field_errors']])
            else:
                first_key = list(response.data.keys())[0]
                val = response.data[first_key]
                if isinstance(val, list) and len(val) > 0:
                    message = f"{first_key}: {val[0]}"
                else:
                    message = f"{first_key}: {val}"
        elif isinstance(response.data, list):
            message = " ".join([str(e) for e in response.data])
        else:
            message = str(response.data)

        custom_data = {
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "details": response.data
            }
        }
        response.data = custom_data

    return response
