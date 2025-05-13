import random
from datetime import datetime, timedelta

# Egyptian cities dictionary (English names with Arabic governorates)
EGYPTIAN_CITIES = {
    'Cairo': 'القاهرة',
    'Alexandria': 'الإسكندرية',
    'Giza': 'الجيزة',
    'Shubra El-Kheima': 'القليوبية',
    'Port Said': 'بورسعيد',
    'Suez': 'السويس',
    'El-Mahalla El-Kubra': 'الغربية',
    'Luxor': 'الأقصر',
    'Aswan': 'أسوان',
    'Ismailia': 'الإسماعيلية',
    'Faiyum': 'الفيوم',
    'Tanta': 'الغربية',
    'Damietta': 'دمياط',
    'Mansoura': 'الدقهلية',
    'Beni Suef': 'بني سويف',
    'Qena': 'قنا',
    'Sohag': 'سوهاج',
    'Zagazig': 'الشرقية',
    'Damanhur': 'البحيرة',
    'El Arish': 'شمال سيناء',
    'Marsa Matrouh': 'مطروح'
}


def calculate_distance(origin, destination):
    """
    Calculate distance between two Egyptian cities (in km)
    In production: Use Google Maps Distance Matrix API
    """
    if origin not in EGYPTIAN_CITIES or destination not in EGYPTIAN_CITIES:
        raise ValueError("City not found in database")

    # Distance matrix in km (based on real approximate distances)
    distance_matrix = {
        ('Cairo', 'Alexandria'): 220,
        ('Cairo', 'Giza'): 15,
        ('Cairo', 'Port Said'): 200,
        ('Cairo', 'Suez'): 130,
        ('Cairo', 'Shubra El-Kheima'): 25,
        ('Cairo', 'El-Mahalla El-Kubra'): 110,
        ('Cairo', 'Tanta'): 90,
        ('Cairo', 'Mansoura'): 120,
        ('Cairo', 'Damietta'): 180,
        ('Cairo', 'Ismailia'): 140,
        ('Cairo', 'Zagazig'): 80,
        ('Cairo', 'Beni Suef'): 130,
        ('Cairo', 'Faiyum'): 100,
        ('Cairo', 'Luxor'): 700,
        ('Cairo', 'Aswan'): 900,
        ('Cairo', 'Qena'): 600,
        ('Cairo', 'Sohag'): 500,
        ('Cairo', 'Damanhur'): 170,
        ('Cairo', 'El Arish'): 350,
        ('Cairo', 'Marsa Matrouh'): 500,

        ('Alexandria', 'Giza'): 210,
        ('Alexandria', 'Damanhur'): 60,
        ('Alexandria', 'Tanta'): 120,
        ('Alexandria', 'Mansoura'): 150,
        ('Alexandria', 'Damietta'): 200,

        ('Giza', 'Faiyum'): 90,
        ('Giza', 'Beni Suef'): 120,

        ('Port Said', 'Ismailia'): 50,
        ('Port Said', 'Suez'): 150,

        ('Luxor', 'Aswan'): 200,
        ('Luxor', 'Qena'): 60,
        ('Luxor', 'Sohag'): 150,

        ('Sohag', 'Qena'): 120,
        ('Sohag', 'Aswan'): 300,

        ('Mansoura', 'Tanta'): 40,
        ('Mansoura', 'Damietta'): 70,
        ('Mansoura', 'Zagazig'): 50,

        ('Zagazig', 'Ismailia'): 90
    }

    # Search for distance
    key = (origin, destination)
    reverse_key = (destination, origin)

    if key in distance_matrix:
        return distance_matrix[key]
    elif reverse_key in distance_matrix:
        return distance_matrix[reverse_key]
    else:
        # Estimate distance if not found
        base_distance = {
            'Delta': 100,  # Average Delta cities distance
            'Upper Egypt': 300,  # Average Upper Egypt distance
            'Canal': 150  # Average Canal cities distance
        }

        origin_region = get_region(origin)
        dest_region = get_region(destination)

        if origin_region == dest_region:
            return base_distance[origin_region] * 0.7
        else:
            return base_distance[origin_region] + base_distance[dest_region]


def get_region(city):
    """Determine geographic region of city"""
    if city in ['Cairo', 'Giza', 'Shubra El-Kheima']:
        return 'Greater Cairo'
    elif city in ['Alexandria', 'Damanhur', 'Tanta', 'Mansoura', 'Damietta', 'Zagazig']:
        return 'Delta'
    elif city in ['Port Said', 'Suez', 'Ismailia']:
        return 'Canal'
    elif city in ['El Arish', 'Marsa Matrouh']:
        return 'Sinai'
    else:
        return 'Upper Egypt'


def calculate_cost(distance_km, weight_kg):
    """
    Calculate shipping cost in EGP
    with discounts for heavy weights
    """
    base_rate = 10  # EGP per km
    min_cost = 50  # Minimum cost

    if weight_kg <= 5:
        rate = base_rate
    elif 5 < weight_kg <= 20:
        rate = base_rate * 0.9  # 10% discount
    else:
        rate = base_rate * 0.8  # 20% discount

    cost = distance_km * rate * weight_kg
    return max(min_cost, round(cost, 2))  # Ensure not below minimum


def generate_tracking_id():
    """
    Generate Egyptian tracking ID (EgyptPost standard)
    Format: EG-YYMMDD-XXXX
    """
    now = datetime.now()
    date_part = now.strftime("%y%m%d")
    random_part = random.randint(1000, 9999)
    return f"EG-{date_part}-{random_part}"


def calculate_delivery_time(distance_km):
    """
    Calculate estimated delivery time (in days)
    Faster delivery for nearby cities
    """
    if distance_km <= 50:
        return 1  # 1 day for nearby cities
    else:
        return min(7, int(distance_km / 100) + 1)  # Max 1 week