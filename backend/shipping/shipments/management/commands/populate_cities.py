from django.core.management.base import BaseCommand
#from shipping.shipments.models import City
from shipments.models import City
from shipments.utils import EGYPTIAN_CITIES, get_region


class Command(BaseCommand):
    help = 'Populates the database with Egyptian cities and their Arabic names'

    def handle(self, *args, **options):
        added_count = 0

        for eng_name, ar_name in EGYPTIAN_CITIES.items():
            city, created = City.objects.get_or_create(
                name=eng_name,
                defaults={
                    'arabic_name': ar_name,
                    'region': get_region(eng_name)
                }
            )

            if created:
                added_count += 1
                self.stdout.write(f'Added: {eng_name} ({ar_name})')

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully populated cities! {added_count} cities added.')
        )