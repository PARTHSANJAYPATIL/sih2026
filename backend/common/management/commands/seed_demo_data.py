import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from accounts.models import User, FPO, FarmerProfile, BuyerProfile, DriverProfile
from products.models import Product, ProduceListing
from orders.models import Order, OrderItem, FarmerOrderAllocation, Harvest
from collection_centers.models import CollectionCenter, CollectionReceipt, QualityCheck, ProduceBatch
from logistics.models import Vehicle, Pickup, Delivery, Route
from payments.models import Payment
from notifications.models import Notification
from complaints.models import Complaint
from analytics.models import DemandForecast, PriceRecommendation

class Command(BaseCommand):
    help = 'Populates the database with realistic Indian agricultural supply chain demo data.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Seeding Indian agricultural supply chain demo data..."))

        # Precompute password hash once to ensure near-instant execution
        demo_password_hash = make_password("123456")

        # 1. Clear existing domain data (safe re-seeding)
        self.stdout.write("Clearing previous records...")
        Complaint.objects.all().delete()
        Notification.objects.all().delete()
        Payment.objects.all().delete()
        Route.objects.all().delete()
        Delivery.objects.all().delete()
        Pickup.objects.all().delete()
        Vehicle.objects.all().delete()
        ProduceBatch.objects.all().delete()
        QualityCheck.objects.all().delete()
        CollectionReceipt.objects.all().delete()
        CollectionCenter.objects.all().delete()
        FarmerOrderAllocation.objects.all().delete()
        OrderItem.objects.all().delete()
        Harvest.objects.all().delete()
        Order.objects.all().delete()
        ProduceListing.objects.all().delete()
        Product.objects.all().delete()
        DemandForecast.objects.all().delete()
        PriceRecommendation.objects.all().delete()

        # 2. Create FPOs
        fpos_data = [
            {"name": "Sahyadri Farmers Producer Co.", "registration_number": "FPO-MH-SANGLI-001", "phone": "+91 98220 11001", "district": "Sangli", "state": "Maharashtra", "contact_person": "Anandrao Patil"},
            {"name": "Godavari FPO", "registration_number": "FPO-MH-NASHIK-002", "phone": "+91 98220 11002", "district": "Nashik", "state": "Maharashtra", "contact_person": "Vilasrao Kadam"},
            {"name": "Krishna Valley Agro Producer", "registration_number": "FPO-MH-SATARA-003", "phone": "+91 98220 11003", "district": "Satara", "state": "Maharashtra", "contact_person": "Subhash Shinde"},
            {"name": "Haridra Waigaon Spice Cluster", "registration_number": "FPO-MH-SANGLI-004", "phone": "+91 98220 11004", "district": "Sangli", "state": "Maharashtra", "contact_person": "Kailas Salunkhe"},
            {"name": "Maval Indrayani Krishi Sangh", "registration_number": "FPO-MH-PUNE-005", "phone": "+91 98220 11005", "district": "Pune", "state": "Maharashtra", "contact_person": "Dattatray Gaikwad"},
        ]
        fpo_objs = {}
        for f in fpos_data:
            obj, _ = FPO.objects.get_or_create(registration_number=f["registration_number"], defaults=f)
            fpo_objs[f["name"]] = obj

        # 3. Create Key Demo Accounts
        demo_users_data = [
            {
                "email": "farmer@demo.com", "name": "Ramesh Patil", "role": User.Role.FARMER,
                "phone": "+91 98220 14589", "fpo": fpo_objs["Sahyadri Farmers Producer Co."], "district": "Sangli"
            },
            {
                "email": "consumer@demo.com", "name": "Pooja Kulkarni", "role": User.Role.CONSUMER,
                "phone": "+91 98500 78210", "district": "Pune"
            },
            {
                "email": "buyer@demo.com", "name": "Chef Rajesh (Hotel ABC)", "role": User.Role.BULK_BUYER,
                "phone": "+91 94230 65421", "district": "Kolhapur"
            },
            {
                "email": "admin@demo.com", "name": "Vikram Shinde", "role": User.Role.ADMIN,
                "phone": "+91 98811 00234", "is_staff": True, "is_superuser": True
            },
            {
                "email": "center@demo.com", "name": "Anand Deshmukh", "role": User.Role.COLLECTION_MANAGER,
                "phone": "+91 97630 11980", "district": "Sangli"
            },
            {
                "email": "driver@demo.com", "name": "Rahul Patil", "role": User.Role.DRIVER,
                "phone": "+91 99750 33812", "district": "Sangli"
            }
        ]

        for u in demo_users_data:
            fpo = u.pop("fpo", None)
            district = u.pop("district", "Sangli")
            user, _ = User.objects.get_or_create(
                email=u["email"],
                defaults={
                    "name": u["name"],
                    "role": u["role"],
                    "phone": u.get("phone", ""),
                    "is_staff": u.get("is_staff", False),
                    "is_superuser": u.get("is_superuser", False),
                    "is_verified": True,
                    "password": demo_password_hash
                }
            )
            if u["role"] == User.Role.FARMER:
                FarmerProfile.objects.get_or_create(
                    user=user,
                    defaults={"fpo": fpo, "farm_size": Decimal('4.5'), "district": district, "address": "Miraj Farm Plot #14, Sangli"}
                )
            elif u["role"] == User.Role.BULK_BUYER:
                BuyerProfile.objects.get_or_create(
                    user=user,
                    defaults={"business_name": "Hotel ABC Hospitality Group", "gst_number": "27AABCH1234F1Z5", "address": "Main Kitchen Bay, Tarabai Park, Kolhapur"}
                )
            elif u["role"] == User.Role.DRIVER:
                DriverProfile.objects.get_or_create(
                    user=user,
                    defaults={"license_number": "MH10-2018-0045231"}
                )

        farmer_demo = User.objects.get(email="farmer@demo.com")
        consumer_demo = User.objects.get(email="consumer@demo.com")
        buyer_demo = User.objects.get(email="buyer@demo.com")
        manager_demo = User.objects.get(email="center@demo.com")
        driver_demo = User.objects.get(email="driver@demo.com")

        # 4. Create 20 Farmers across Sangli, Kolhapur, Pune, Nashik, Satara
        farmers_list = [farmer_demo]
        farmer_names = [
            ("Suresh More", "Nashik", "Godavari FPO", Decimal('6.0')),
            ("Babanrao Jadhav", "Pune", "Maval Indrayani Krishi Sangh", Decimal('3.5')),
            ("Ganesh Jagtap", "Satara", "Krishna Valley Agro Producer", Decimal('5.0')),
            ("Dattatray Gaikwad", "Pune", "Maval Indrayani Krishi Sangh", Decimal('8.0')),
            ("Ankush Rao", "Sangli", "Sahyadri Farmers Producer Co.", Decimal('4.0')),
            ("Pandurang Mane", "Sangli", "Sahyadri Farmers Producer Co.", Decimal('5.5')),
            ("Tanaji Shinde", "Sangli", "Sahyadri Farmers Producer Co.", Decimal('3.8')),
            ("Kailas Salunkhe", "Sangli", "Haridra Waigaon Spice Cluster", Decimal('7.2')),
            ("Mahadev Chougule", "Kolhapur", "Sahyadri Farmers Producer Co.", Decimal('4.2')),
            ("Vilas Kadam", "Nashik", "Godavari FPO", Decimal('10.0')),
            ("Rajendra Pawar", "Pune", "Maval Indrayani Krishi Sangh", Decimal('3.0')),
            ("Shivaji Thorat", "Satara", "Krishna Valley Agro Producer", Decimal('6.5')),
            ("Balasaheb Deshmukh", "Sangli", "Haridra Waigaon Spice Cluster", Decimal('4.8')),
            ("Nitin Shirole", "Pune", "Maval Indrayani Krishi Sangh", Decimal('5.2')),
            ("Arjun Bhosale", "Kolhapur", "Sahyadri Farmers Producer Co.", Decimal('3.9')),
            ("Ashok Gaikwad", "Nashik", "Godavari FPO", Decimal('4.5')),
            ("Santosh Pisal", "Satara", "Krishna Valley Agro Producer", Decimal('7.0')),
            ("Govind Mohite", "Kolhapur", "Sahyadri Farmers Producer Co.", Decimal('5.1')),
            ("Kishor Chavan", "Sangli", "Sahyadri Farmers Producer Co.", Decimal('4.0')),
        ]

        for i, (fname, fcity, ffpo, facres) in enumerate(farmer_names, start=2):
            femail = f"farmer{i}@demo.com"
            fuser, _ = User.objects.get_or_create(
                email=femail,
                defaults={
                    "name": fname,
                    "role": User.Role.FARMER,
                    "phone": f"+91 9822{i:02d} 11223",
                    "is_verified": True,
                    "password": demo_password_hash
                }
            )
            FarmerProfile.objects.get_or_create(
                user=fuser,
                defaults={"fpo": fpo_objs.get(ffpo), "farm_size": facres, "district": fcity, "address": f"Agri Belt {fcity}"}
            )
            farmers_list.append(fuser)

        # 5. Create 10 Bulk Buyers
        bulk_buyers_data = [
            ("Chef Rajesh (Hotel ABC)", "buyer@demo.com", "Kolhapur", "Hotel ABC Hospitality Group"),
            ("Sayaji Hotels Kolhapur", "sayaji@demo.com", "Kolhapur", "Sayaji Hospitality Ltd."),
            ("Kothrud Central Supermarket", "kothrud.market@demo.com", "Pune", "Central Retail Hubs"),
            ("Vaishali Restaurant Group", "vaishali@demo.com", "Pune", "Vaishali FC Road"),
            ("Royal Palms Catering Co.", "royalpalms@demo.com", "Pune", "Royal Hospitality Services"),
            ("Reliance Smart Point Sangli", "smartpoint.sangli@demo.com", "Sangli", "Reliance Retail Agro"),
            ("Maratha Food Corp", "marathafoods@demo.com", "Kolhapur", "Maratha Food Processing"),
            ("Green Basket Organics Pune", "greenbasket@demo.com", "Pune", "Green Basket Organics"),
            ("Nisarga Agro Retailers", "nisarga@demo.com", "Satara", "Nisarga Fresh Outlets"),
            ("Grand Exotica Caterers", "grandexotica@demo.com", "Kolhapur", "Grand Exotica Banquets"),
        ]
        buyers_list = [buyer_demo]
        for bname, bemail, bcity, bbiz in bulk_buyers_data[1:]:
            buser, _ = User.objects.get_or_create(
                email=bemail,
                defaults={"name": bname, "role": User.Role.BULK_BUYER, "phone": "+91 94230 88990", "is_verified": True, "password": demo_password_hash}
            )
            BuyerProfile.objects.get_or_create(user=buser, defaults={"business_name": bbiz, "address": f"{bcity} Commercial Hub"})
            buyers_list.append(buser)

        # 6. Create 30 Consumers
        consumer_cities = ["Pune", "Kolhapur", "Sangli"]
        consumers_list = [consumer_demo]
        for c_idx in range(2, 31):
            cemail = f"consumer{c_idx}@demo.com"
            ccity = consumer_cities[c_idx % 3]
            cuser, _ = User.objects.get_or_create(
                email=cemail,
                defaults={"name": f"Consumer {c_idx} ({ccity})", "role": User.Role.CONSUMER, "phone": f"+91 98500 {c_idx:05d}", "is_verified": True, "password": demo_password_hash}
            )
            consumers_list.append(cuser)

        # 7. Create 5 Collection Centers
        centers_data = [
            {"name": "Sangli Agro Collection Hub (Partner Hub #4)", "address": "Miraj Industrial Estate, Sangli", "district": "Sangli", "manager": manager_demo, "capacity": Decimal('15000'), "current_capacity": Decimal('8400'), "latitude": Decimal('16.8524'), "longitude": Decimal('74.5815')},
            {"name": "Pune Western Agri Gateway Hub", "address": "Hadapsar Agro Logistics Park, Pune", "district": "Pune", "manager": manager_demo, "capacity": Decimal('25000'), "current_capacity": Decimal('16200'), "latitude": Decimal('18.5074'), "longitude": Decimal('73.9318')},
            {"name": "Kolhapur Southern Aggregation Mid-point", "address": "Shirol Agro Corridor, Kolhapur", "district": "Kolhapur", "manager": manager_demo, "capacity": Decimal('18000'), "current_capacity": Decimal('9500'), "latitude": Decimal('16.7050'), "longitude": Decimal('74.2433')},
            {"name": "Satara Agro Terminal Facility", "address": "MIDC Satara Corridor", "district": "Satara", "manager": manager_demo, "capacity": Decimal('12000'), "current_capacity": Decimal('6200'), "latitude": Decimal('17.6805'), "longitude": Decimal('74.0183')},
            {"name": "Nashik Onion & Grape Transit Center", "address": "Niphad Agro Hub, Nashik", "district": "Nashik", "manager": manager_demo, "capacity": Decimal('30000'), "current_capacity": Decimal('21000'), "latitude": Decimal('19.9975'), "longitude": Decimal('73.7898')},
        ]
        center_objs = {}
        for c in centers_data:
            cobj, _ = CollectionCenter.objects.get_or_create(name=c["name"], defaults=c)
            center_objs[c["name"]] = cobj

        # 8. Create 15 Drivers and 15 Vehicles
        vehicle_types = [
            Vehicle.VehicleType.PICKUP,
            Vehicle.VehicleType.VAN,
            Vehicle.VehicleType.MINI_CARGO,
            Vehicle.VehicleType.TRUCK,
            Vehicle.VehicleType.EV
        ]
        drivers_list = [driver_demo]
        for d_idx in range(2, 16):
            demail = f"driver{d_idx}@demo.com"
            duser, _ = User.objects.get_or_create(
                email=demail,
                defaults={"name": f"Driver {d_idx} (MH-{(10+d_idx%4):02d})", "role": User.Role.DRIVER, "phone": f"+91 99750 {d_idx:05d}", "is_verified": True, "password": demo_password_hash}
            )
            DriverProfile.objects.get_or_create(user=duser, defaults={"license_number": f"MH10-2020-{d_idx:07d}"})
            drivers_list.append(duser)

        vehicles_list = []
        for v_idx, d_user in enumerate(drivers_list, start=1):
            vnum = f"MH-{(10+v_idx%4):02d}-AB-{1000+v_idx}"
            vtype = vehicle_types[v_idx % len(vehicle_types)]
            vcap = 1000 if "1 Ton" in vtype else (1500 if "1.5 Ton" in vtype else (750 if "750 kg" in vtype else 3000))
            vobj, _ = Vehicle.objects.get_or_create(
                vehicle_number=vnum,
                defaults={
                    "vehicle_type": vtype,
                    "capacity_kg": Decimal(str(vcap)),
                    "current_load_kg": Decimal(str(vcap * 0.65)),
                    "driver": d_user,
                    "current_location_name": f"Sector {v_idx}, Maharashtra Corridor",
                    "status": Vehicle.Status.AVAILABLE if v_idx % 2 == 0 else Vehicle.Status.ON_PICKUP
                }
            )
            vehicles_list.append(vobj)

        # 9. Create Core Agricultural Products (without 'variety' field)
        products_data = [
            ("Tomato", Product.Category.VEGETABLES, "Perishable fruit-vegetable rich in lycopene"),
            ("Onion", Product.Category.VEGETABLES, "High shelf-life pungent red onions"),
            ("Potato", Product.Category.VEGETABLES, "High dry matter white potatoes"),
            ("Wheat", Product.Category.GRAINS_PULSES, "High gluten heavy golden wheat"),
            ("Rice", Product.Category.GRAINS_PULSES, "Fragrant unpolished traditional Indrayani"),
            ("Soybean", Product.Category.GRAINS_PULSES, "High oil & protein content legume"),
            ("Turmeric", Product.Category.SPICES, "5.8% natural active curcumin rhizomes"),
            ("Pomegranate", Product.Category.FRUITS, "Deep crimson sweet arils export grade"),
            ("Capsicum", Product.Category.VEGETABLES, "Thick fleshed crisp bell peppers"),
            ("Cauliflower", Product.Category.VEGETABLES, "Dense milk-white curd heads"),
            ("Cabbage", Product.Category.VEGETABLES, "Solid round light-green compact heads"),
            ("Ginger", Product.Category.SPICES, "Low fibre high essential oil fresh rhizomes"),
            ("Garlic", Product.Category.SPICES, "Pure white bold cloves with strong pungency"),
            ("Green Chilli", Product.Category.VEGETABLES, "Spicy dark green slender culinary chillies"),
            ("Spinach", Product.Category.VEGETABLES, "Broad lush tender dark green leaves"),
            ("Banana", Product.Category.FRUITS, "Premium Cavendish table banana"),
            ("Grapes", Product.Category.FRUITS, "Crisp elongated high brix table grapes"),
        ]
        product_objs = {}
        for pname, pcat, pdesc in products_data:
            pobj, _ = Product.objects.get_or_create(
                name=pname,
                defaults={"category": pcat, "description": pdesc}
            )
            product_objs[pname] = pobj

        # 10. Create 40+ Produce Listings
        images = {
            "Tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
            "Onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80",
            "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80",
            "Wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80",
            "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
            "Soybean": "https://images.unsplash.com/photo-1588645242598-a28efbc27926?w=500&auto=format&fit=crop&q=80",
            "Turmeric": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
            "Pomegranate": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
            "Capsicum": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80",
            "Cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80",
            "Cabbage": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=80",
            "Ginger": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
            "Garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80",
            "Green Chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80",
            "Spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
            "Banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
            "Grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80"
        }

        # Key primary listing for Demo
        primary_tomato, _ = ProduceListing.objects.get_or_create(
            id=uuid.UUID('00000000-0000-0000-0000-000000000001'),
            defaults={
                "farmer": farmer_demo,
                "product": product_objs["Tomato"],
                "variety": "Shivam Hybrid (High Lycopene)",
                "initial_quantity": Decimal('500'),
                "quantity_available": Decimal('500'),
                "harvest_date": "25 Sept",
                "harvest_status": ProduceListing.HarvestStatus.READY_FOR_HARVEST,
                "quality_grade": ProduceListing.QualityGrade.GRADE_A,
                "price_per_unit": Decimal('24.00'),
                "market_ref_price": Decimal('23.00'),
                "ai_suggested_min": Decimal('22.00'),
                "ai_suggested_max": Decimal('26.00'),
                "organic": True,
                "location": "Sangli",
                "description": "Farm fresh farm-gate harvested tomatoes. High juice content, firm texture, ideal for salad or culinary processing. Zero toxic spray in last 25 days.",
                "image_url": images["Tomato"],
                "status": ProduceListing.Status.ACTIVE
            }
        )

        crops_cycle = list(product_objs.keys())
        base_prices = {
            "Tomato": 24, "Onion": 18, "Potato": 22, "Wheat": 34, "Rice": 45,
            "Soybean": 48, "Turmeric": 115, "Pomegranate": 85, "Capsicum": 36,
            "Cauliflower": 28, "Cabbage": 16, "Ginger": 75, "Garlic": 140,
            "Green Chilli": 42, "Spinach": 15, "Banana": 25, "Grapes": 95
        }

        for idx in range(2, 46):
            c_name = crops_cycle[(idx - 2) % len(crops_cycle)]
            f_owner = farmers_list[(idx - 1) % len(farmers_list)]
            f_profile = getattr(f_owner, 'farmer_profile', None)
            f_dist = f_profile.district if f_profile else "Sangli"
            b_price = Decimal(str(base_prices.get(c_name, 30)))
            qty = Decimal(str(300 + (idx * 50) % 2000))
            is_org = (idx % 3 == 0)

            ProduceListing.objects.get_or_create(
                farmer=f_owner,
                product=product_objs[c_name],
                variety=f"Standard Select {c_name}",
                defaults={
                    "initial_quantity": qty,
                    "quantity_available": qty,
                    "harvest_date": f"{20 + (idx % 10)} Sept",
                    "harvest_status": ProduceListing.HarvestStatus.READY_FOR_HARVEST if idx % 2 == 0 else ProduceListing.HarvestStatus.GROWING,
                    "quality_grade": ProduceListing.QualityGrade.GRADE_A if idx % 4 != 0 else ProduceListing.QualityGrade.GRADE_B,
                    "price_per_unit": b_price,
                    "market_ref_price": b_price - Decimal('1.5'),
                    "ai_suggested_min": b_price - Decimal('2.0'),
                    "ai_suggested_max": b_price + Decimal('2.0'),
                    "organic": is_org,
                    "location": f_dist,
                    "description": f"Quality {c_name} grown with traditional precision in {f_dist} farm belt. High nutrient retention.",
                    "image_url": images.get(c_name, images["Tomato"]),
                    "status": ProduceListing.Status.ACTIVE
                }
            )

        # 11. Create Realistic Orders
        # Order 1: Consumer Order FM1024
        order_1, _ = Order.objects.get_or_create(
            order_number="FM1024",
            defaults={
                "buyer": consumer_demo,
                "order_type": Order.OrderType.CONSUMER,
                "delivery_address": "Flat 402, Green Meadows, Paud Road, Kothrud",
                "delivery_city": "Pune",
                "delivery_slot": "5:00 PM – 7:00 PM",
                "status": Order.Status.OUT_FOR_DELIVERY,
                "subtotal": Decimal('156.00'),
                "collection_fee": Decimal('7.00'),
                "transport_fee": Decimal('14.00'),
                "platform_fee": Decimal('7.00'),
                "total_amount": Decimal('184.00')
            }
        )

        OrderItem.objects.get_or_create(
            order=order_1,
            produce_listing=primary_tomato,
            defaults={
                "crop_name": "Tomato",
                "farmer": farmer_demo,
                "quantity": Decimal('5.0'),
                "price_per_unit": Decimal('28.00'),
                "subtotal": Decimal('140.00')
            }
        )

        Payment.objects.get_or_create(
            order=order_1,
            defaults={
                "amount": Decimal('184.00'),
                "farmer_payout": Decimal('156.00'),
                "collection_fee": Decimal('7.00'),
                "logistics_fee": Decimal('14.00'),
                "platform_fee": Decimal('7.00'),
                "payment_method": Payment.PaymentMethod.UPI,
                "status": Payment.Status.PAID,
                "transaction_id": "TXN-UPI-99482103",
                "paid_at": timezone.now()
            }
        )

        # Order 2: Bulk Buyer Order FM1025
        order_2, _ = Order.objects.get_or_create(
            order_number="FM1025",
            defaults={
                "buyer": buyer_demo,
                "order_type": Order.OrderType.BULK,
                "delivery_address": "Main Kitchen Bay, Hotel ABC, Tarabai Park",
                "delivery_city": "Kolhapur",
                "delivery_slot": "10:00 AM – 12:00 PM",
                "status": Order.Status.QUALITY_CHECKED,
                "subtotal": Decimal('24000.00'),
                "collection_fee": Decimal('1000.00'),
                "transport_fee": Decimal('2000.00'),
                "platform_fee": Decimal('1000.00'),
                "total_amount": Decimal('28000.00')
            }
        )

        OrderItem.objects.get_or_create(
            order=order_2,
            produce_listing=primary_tomato,
            defaults={
                "crop_name": "Tomato",
                "farmer": farmer_demo,
                "quantity": Decimal('1000.0'),
                "price_per_unit": Decimal('28.00'),
                "subtotal": Decimal('28000.00')
            }
        )

        Payment.objects.get_or_create(
            order=order_2,
            defaults={
                "amount": Decimal('28000.00'),
                "farmer_payout": Decimal('24000.00'),
                "collection_fee": Decimal('1000.00'),
                "logistics_fee": Decimal('2000.00'),
                "platform_fee": Decimal('1000.00'),
                "payment_method": Payment.PaymentMethod.CARD,
                "status": Payment.Status.PAID,
                "transaction_id": "TXN-CARD-44281902",
                "paid_at": timezone.now()
            }
        )

        # 4 Matched farmers allocated to FM1025
        allocations_data = [
            (farmer_demo, Decimal('300.0'), Decimal('24.00')),
            (farmers_list[5], Decimal('250.0'), Decimal('24.00')),
            (farmers_list[6], Decimal('200.0'), Decimal('24.00')),
            (farmers_list[7], Decimal('250.0'), Decimal('24.00')),
        ]
        for f_user, a_qty, a_price in allocations_data:
            FarmerOrderAllocation.objects.get_or_create(
                order=order_2,
                farmer=f_user,
                defaults={
                    "requested_quantity": a_qty,
                    "confirmed_quantity": a_qty,
                    "agreed_price": a_price,
                    "status": FarmerOrderAllocation.Status.AT_CENTER
                }
            )

        # 12. Collection Receipts & Quality Checks
        hub_center = center_objs["Sangli Agro Collection Hub (Partner Hub #4)"]
        receipt_1, _ = CollectionReceipt.objects.get_or_create(
            collection_center=hub_center,
            order=order_2,
            farmer=farmer_demo,
            defaults={
                "expected_quantity": Decimal('500.0'),
                "actual_quantity": Decimal('485.0'),
                "verified_by": manager_demo,
                "status": CollectionReceipt.Status.VERIFIED
            }
        )

        QualityCheck.objects.get_or_create(
            collection_receipt=receipt_1,
            defaults={
                "inspector": manager_demo,
                "quality_grade": QualityCheck.Grade.GRADE_A,
                "quality_score": Decimal('96.5'),
                "notes": "Premium grade tomatoes, excellent firmness, uniform size, color index 5/5."
            }
        )

        # 13. Pickups and Deliveries
        Pickup.objects.get_or_create(
            pickup_number="PU-101",
            defaults={
                "farmer": farmer_demo,
                "driver": driver_demo,
                "vehicle": vehicles_list[0],
                "collection_center": hub_center,
                "scheduled_date": "Today",
                "scheduled_time": "07:30 AM – 08:30 AM",
                "pickup_address": "Plot 14, Miraj Shivar, Sangli",
                "quantity_kg": Decimal('300.0'),
                "status": Pickup.Status.ACCEPTED
            }
        )

        Pickup.objects.get_or_create(
            pickup_number="PU-102",
            defaults={
                "farmer": farmers_list[5],
                "driver": driver_demo,
                "vehicle": vehicles_list[0],
                "collection_center": hub_center,
                "scheduled_date": "Today",
                "scheduled_time": "08:45 AM – 09:30 AM",
                "pickup_address": "Tasgaon Grape & Vegetable Belt, Sangli",
                "quantity_kg": Decimal('250.0'),
                "status": Pickup.Status.REQUESTED
            }
        )

        deliv_1, _ = Delivery.objects.get_or_create(
            delivery_number="DEL-FM1024",
            defaults={
                "order": order_1,
                "vehicle": vehicles_list[0],
                "driver": driver_demo,
                "source": "Sangli Agro Collection Hub #4",
                "destination": "Flat 402, Green Meadows, Paud Road, Kothrud, Pune",
                "scheduled_time": "05:00 PM – 07:00 PM",
                "estimated_time": "06:15 PM",
                "status": Delivery.Status.OUT_FOR_DELIVERY
            }
        )

        Route.objects.get_or_create(
            delivery=deliv_1,
            defaults={
                "distance_km": Decimal('42.5'),
                "estimated_duration": "1 hr 35 min",
                "route_data": {"waypoints": ["Sangli Hub", "Satara Toll", "Katraj Bypass", "Kothrud Destination"]},
                "is_optimal_claimed": False
            }
        )

        # 14. Seed Notifications
        notifications_data = [
            {"target_role": "farmer", "user": farmer_demo, "title": "Order Matched with Hotel ABC", "message": "Your 300 kg Tomato lot has been matched for Hotel ABC requirement at ₹24/kg.", "notification_type": "order", "is_read": False},
            {"target_role": "farmer", "user": farmer_demo, "title": "Farm-Gate Pickup Scheduled", "message": "Driver Rahul Patil (MH-10-AB-1234) scheduled pickup for 8:30 AM tomorrow.", "notification_type": "logistics", "is_read": False},
            {"target_role": "farmer", "user": farmer_demo, "title": "Quality Inspection Passed", "message": "Produce batch verified as Grade A at Sangli Collection Hub.", "notification_type": "qc", "is_read": True},
            {"target_role": "consumer", "user": consumer_demo, "title": "Order #FM1024 Dispatched", "message": "Your order is out for delivery! Estimated arrival between 5:00 PM – 7:00 PM.", "notification_type": "order", "is_read": False},
            {"target_role": "driver", "user": driver_demo, "title": "New Farm Pickup Route Assigned", "message": "Pickup route across 4 Sangli farms assigned for Hotel ABC 1,000 kg order.", "notification_type": "logistics", "is_read": False},
            {"target_role": "admin", "user": None, "title": "Logistics Optimization Alert", "message": "12 orders consolidated into 2 fuel-optimized cluster delivery routes in Pune.", "notification_type": "system", "is_read": False},
        ]
        for n in notifications_data:
            Notification.objects.create(**n)

        # 15. Seed Complaints
        Complaint.objects.get_or_create(
            reporter=consumer_demo,
            order=order_1,
            defaults={
                "category": Complaint.Category.DAMAGED,
                "description": "A 500g portion of tomatoes in the bottom layer arrived crushed during local transit.",
                "status": Complaint.Status.UNDER_INVESTIGATION,
                "resolution_notes": "Collection Center team requested transit buffer packaging photos; refund coupon of ₹50 initiated."
            }
        )

        # 16. Seed Analytics
        DemandForecast.objects.get_or_create(
            crop_name="Tomato",
            region="Western Maharashtra",
            defaults={
                "predicted_demand_kg": Decimal('12500'),
                "available_supply_kg": Decimal('10000'),
                "demand_status": "High",
                "warning_message": "Possible supply shortage in the next 7 days in Western Maharashtra corridor.",
                "ai_explanation": "Demand is predicted to increase based on historical sales, seasonal festive demand patterns, and forward orders from hotels.",
            }
        )

        PriceRecommendation.objects.get_or_create(
            crop_name="Tomato",
            defaults={
                "market_ref_price": Decimal('23.00'),
                "suggested_min": Decimal('22.00'),
                "suggested_max": Decimal('26.00'),
                "quality_grade": "Grade A",
                "logistics_cost_per_kg": Decimal('3.00'),
                "handling_cost_per_kg": Decimal('1.00'),
                "platform_fee_per_kg": Decimal('1.00'),
                "confidence_score": Decimal('0.93'),
                "explanation": "Derived from regional Mandi arrivals and Sangli-Pune consumption corridor velocity."
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded comprehensive Indian agricultural supply chain demo data!"))
