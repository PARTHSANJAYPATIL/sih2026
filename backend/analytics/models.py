import uuid
from django.db import models

class DemandForecast(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=100)
    region = models.CharField(max_length=100, default='Western Maharashtra')
    time_horizon = models.CharField(max_length=50, default='7_day')
    predicted_demand_kg = models.DecimalField(max_digits=12, decimal_places=2, default=12500)
    available_supply_kg = models.DecimalField(max_digits=12, decimal_places=2, default=10000)
    demand_status = models.CharField(max_length=50, default='High')
    warning_message = models.TextField(blank=True, default='')
    ai_explanation = models.TextField(blank=True, default='')
    historical_data = models.JSONField(default=list)
    seven_day_forecast = models.JSONField(default=list)
    thirty_day_forecast = models.JSONField(default=list)
    disclaimer = models.CharField(
        max_length=255,
        default='AI provides demand estimations based on historical sales and seasonal trends. Actual demand may vary.'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Forecast: {self.crop_name} in {self.region} ({self.demand_status})"

class PriceRecommendation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=100)
    market_ref_price = models.DecimalField(max_digits=10, decimal_places=2, default=23)
    suggested_min = models.DecimalField(max_digits=10, decimal_places=2, default=22)
    suggested_max = models.DecimalField(max_digits=10, decimal_places=2, default=26)
    quality_grade = models.CharField(max_length=20, default='Grade A')
    logistics_cost_per_kg = models.DecimalField(max_digits=6, decimal_places=2, default=3)
    handling_cost_per_kg = models.DecimalField(max_digits=6, decimal_places=2, default=1)
    platform_fee_per_kg = models.DecimalField(max_digits=6, decimal_places=2, default=1)
    confidence_score = models.DecimalField(max_digits=4, decimal_places=2, default=0.92)
    explanation = models.TextField(default='Price calibrated from regional Mandi arrivals, festive index, and forward retail orders.')
    disclaimer = models.CharField(
        max_length=255,
        default='AI provides a recommendation. The farmer decides the final selling price.'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Price AI: {self.crop_name} (₹{self.suggested_min} - ₹{self.suggested_max})"
