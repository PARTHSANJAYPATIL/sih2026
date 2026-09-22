from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, FarmerProfile, FPO, BuyerProfile, DriverProfile

class FarmerProfileSerializer(serializers.ModelSerializer):
    fpo_name = serializers.CharField(source='fpo.name', read_only=True)

    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'farm_name', 'address', 'village', 'taluka', 
            'district', 'state', 'pincode', 'latitude', 'longitude', 
            'farm_size', 'verification_status', 'fpo', 'fpo_name'
        ]

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = [
            'id', 'business_name', 'business_type', 'address', 
            'latitude', 'longitude', 'gst_number', 'verification_status'
        ]

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = [
            'id', 'license_number', 'availability', 'rating', 'verification_status'
        ]

class UserSerializer(serializers.ModelSerializer):
    farmer_profile = FarmerProfileSerializer(read_only=True)
    buyer_profile = BuyerProfileSerializer(read_only=True)
    driver_profile = DriverProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'role', 'is_verified', 
            'created_at', 'farmer_profile', 'buyer_profile', 'driver_profile'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    # Optional role-specific attributes
    farm_name = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    business_name = serializers.CharField(required=False, allow_blank=True)
    business_type = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'name', 'email', 'phone', 'password', 'role',
            'farm_name', 'district', 'business_name', 'business_type'
        ]

    def create(self, validated_data):
        farm_name = validated_data.pop('farm_name', '')
        district = validated_data.pop('district', 'Sangli')
        business_name = validated_data.pop('business_name', '')
        business_type = validated_data.pop('business_type', BuyerProfile.BusinessType.RESTAURANT)

        password = validated_data.pop('password')
        role = validated_data.get('role', User.Role.CONSUMER)

        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data.get('phone', ''),
            role=role,
            password=password,
            is_verified=True # auto-verify for demonstration ease
        )

        if role == User.Role.FARMER:
            FarmerProfile.objects.create(
                user=user,
                farm_name=farm_name or f"{user.name}'s Farm",
                district=district or 'Sangli'
            )
        elif role == User.Role.BULK_BUYER:
            BuyerProfile.objects.create(
                user=user,
                business_name=business_name or f"{user.name}'s Kitchen",
                business_type=business_type or BuyerProfile.BusinessType.RESTAURANT
            )
        elif role == User.Role.DRIVER:
            DriverProfile.objects.create(user=user)

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            # Fallback to direct check if backend username mismatch
            try:
                user_obj = User.objects.get(email=email)
                if user_obj.check_password(password):
                    user = user_obj
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('User account is deactivated.')

        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }
