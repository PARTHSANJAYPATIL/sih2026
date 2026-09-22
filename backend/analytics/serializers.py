from rest_framework import serializers
from .models import DemandForecast, PriceRecommendation

class DemandForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandForecast
        fields = '__all__'

class PriceRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceRecommendation
        fields = '__all__'
