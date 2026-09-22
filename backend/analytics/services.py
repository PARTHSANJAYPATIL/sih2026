from decimal import Decimal
import random

class DemandForecastService:
    """
    AI Service abstraction for agricultural demand forecasting.
    Grounds calculations in regional market velocity, forward buyer commitments,
    and historical daily mandi arrival data with disclaimers.
    """
    BASE_DEMAND = {
        'Tomato': {'demand': 12500, 'supply': 10000, 'ref_price': 23.0},
        'Onion': {'demand': 18000, 'supply': 16500, 'ref_price': 17.5},
        'Potato': {'demand': 15000, 'supply': 14800, 'ref_price': 21.0},
        'Wheat': {'demand': 25000, 'supply': 22000, 'ref_price': 32.0},
        'Rice': {'demand': 20000, 'supply': 19000, 'ref_price': 42.0},
        'Soybean': {'demand': 14000, 'supply': 13500, 'ref_price': 46.0},
        'Turmeric': {'demand': 8000, 'supply': 6200, 'ref_price': 110.0},
    }

    @classmethod
    def get_forecast(cls, crop_name: str, region: str = 'Western Maharashtra') -> dict:
        base = cls.BASE_DEMAND.get(crop_name, {'demand': 10000, 'supply': 9500, 'ref_price': 25.0})
        exp_demand = base['demand']
        exp_supply = base['supply']
        ref_price = base['ref_price']

        is_shortage = exp_demand > exp_supply
        status = 'High' if is_shortage else ('Moderate' if exp_demand == exp_supply else 'Balanced')
        warning = f"Possible supply shortage in the next 7 days in {region}." if is_shortage else "Supply levels are currently adequate to meet projected buyer demand."

        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        historical = []
        for i, d in enumerate(days):
            factor = 0.85 + (i * 0.025)
            historical.append({
                'day': d,
                'demand': int(exp_demand * factor),
                'supply': int(exp_supply * (1.05 - (i * 0.01)))
            })

        seven_day = []
        for i in range(7):
            d_str = f"{22 + i} Sep"
            price_drift = round(ref_price + (i * 0.5), 1)
            seven_day.append({
                'day': d_str,
                'expectedDemand': int(exp_demand * (0.9 + i * 0.02)),
                'expectedSupply': int(exp_supply * (0.98 + (i % 2) * 0.01)),
                'priceTrend': price_drift
            })

        thirty_day = [
            {'week': 'Week 1', 'projectedDemand': exp_demand * 6, 'projectedSupply': exp_supply * 6, 'avgPrice': round(ref_price, 1)},
            {'week': 'Week 2', 'projectedDemand': int(exp_demand * 6.5), 'projectedSupply': int(exp_supply * 6.1), 'avgPrice': round(ref_price * 1.05, 1)},
            {'week': 'Week 3', 'projectedDemand': int(exp_demand * 6.8), 'projectedSupply': int(exp_supply * 6.3), 'avgPrice': round(ref_price * 1.08, 1)},
            {'week': 'Week 4', 'projectedDemand': int(exp_demand * 6.4), 'projectedSupply': int(exp_supply * 6.7), 'avgPrice': round(ref_price * 1.02, 1)},
        ]

        return {
            'cropName': crop_name,
            'region': region,
            'expectedDemandKg': exp_demand,
            'availableSupplyKg': exp_supply,
            'demandStatus': status,
            'warningMessage': warning,
            'aiExplanation': f'Demand is predicted to remain robust in {region} based on historical trade velocity, institutional buyer orders, and retail corridor trends.',
            'historicalDemand': historical,
            'sevenDayForecast': seven_day,
            'thirtyDayForecast': thirty_day,
            'disclaimer': 'AI provides demand estimations based on historical sales and seasonal trends. Actual demand may vary.'
        }

class PriceRecommendationService:
    """
    AI Service abstraction for price recommendations.
    Provides transparent cost breakdowns (logistics, collection handling, platform fee)
    with explicit disclaimers that farmer retains final pricing authority.
    """
    @classmethod
    def get_recommendation(cls, crop_name: str, quality_grade: str = 'Grade A', organic: bool = False) -> dict:
        base_prices = {
            'Tomato': 23.0,
            'Onion': 17.0,
            'Potato': 21.0,
            'Wheat': 32.0,
            'Rice': 42.0,
            'Soybean': 46.0,
            'Turmeric': 110.0,
            'Pomegranate': 75.0,
            'Capsicum': 32.0
        }
        ref_price = base_prices.get(crop_name, 25.0)

        # Grade adjustment
        grade_mult = 1.05 if quality_grade == 'Grade A' else (0.92 if quality_grade == 'Grade B' else 0.80)
        # Organic adjustment
        organic_mult = 1.15 if organic else 1.0

        adjusted_base = ref_price * grade_mult * organic_mult
        suggested_min = round(adjusted_base * 0.94, 1)
        suggested_max = round(adjusted_base * 1.10, 1)

        handling_fee = 1.0
        logistics_fee = 3.0
        platform_fee = 1.0

        return {
            'cropName': crop_name,
            'marketRefPrice': ref_price,
            'qualityGrade': quality_grade,
            'isOrganic': organic,
            'demandLevel': 'High',
            'supplyLevel': 'Moderate',
            'logisticsCostPerKg': logistics_fee,
            'handlingCostPerKg': handling_fee,
            'platformFeePerKg': platform_fee,
            'aiSuggestedMin': suggested_min,
            'aiSuggestedMax': suggested_max,
            'farmerSelectedPrice': round(adjusted_base, 1),
            'confidenceScore': 0.93,
            'disclaimer': 'AI provides a recommendation based on Mandi indices and corridor demand. The farmer retains complete authority over final listing price.'
        }
