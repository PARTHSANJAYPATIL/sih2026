from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from common.response import api_response, api_error
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return api_response(
                data=user_data,
                message="User registered successfully.",
                status_code=201
            )
        return api_error(code="VALIDATION_ERROR", message="Registration failed", details=serializer.errors)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            access_token = serializer.validated_data['access']
            refresh_token = serializer.validated_data['refresh']
            user_data = UserSerializer(user).data
            
            return api_response(
                data={
                    "access": access_token,
                    "refresh": refresh_token,
                    "user": user_data,
                    "role": user.role
                },
                message="Login successful."
            )
        return api_error(code="INVALID_CREDENTIALS", message="Invalid email or password", details=serializer.errors, status_code=401)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return api_response(data=serializer.data)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Client side discards tokens
        return api_response(message="Logged out successfully.")
