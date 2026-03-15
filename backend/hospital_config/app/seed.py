from faker import Faker
fake = Faker()
import random
from .models import *

def seed_patientqueue(n=10):
    triage_levels = [choice[0] for choice in PatientQueue.TRIAGE_LEVELS]
    status_choices = [choice[0] for choice in PatientQueue.STATUS_CHOICES]
    for _ in range(n):
        PatientQueue.objects.create(
            patient_id=fake.uuid4(),
            chief_complaint=fake.sentence(nb_words=6),
            triage_level=random.choice(triage_levels),
            assigned_to=fake.name() if random.choice([True, False]) else None,
            status=random.choice(status_choices)
        )

def seed_emergencyresource(n=10):
    status_choices = [choice[0] for choice in EmergencyResource.STATUS_CHOICES]
    for _ in range(n):
        EmergencyResource.objects.create(
            department=fake.company(),
            staff=random.randint(5, 50),
            beds_free=random.randint(0, 20),
            equipment=fake.word(),
            load_percentage=random.randint(0, 100),
            status=random.choice(status_choices)
        )

def seed_wardbed(n=10):
    for _ in range(n):
        total_beds = random.randint(10, 50)
        occupied_beds = random.randint(0, total_beds)
        available_beds = total_beds - occupied_beds
        WardBed.objects.create(
            ward_name=fake.street_name(),
            total_beds=total_beds,
            occupied_beds=occupied_beds,
            available_beds=available_beds
        )

def seed_staff(n=10):
    role_choices = [choice[0] for choice in Staff.ROLE_CHOICES]
    for _ in range(n):
        Staff.objects.create(
            name=fake.name(),
            staff_id=fake.unique.uuid4(),
            role=random.choice(role_choices),
            password=fake.password(length=12)
        )

def seed_hospitalresource(n=10):
    resource_types = [choice[0] for choice in HospitalResource.RESOURCE_TYPES]
    for _ in range(n):
        total = random.randint(10, 100)
        available = random.randint(0, total)
        HospitalResource.objects.create(
            name=fake.company(),
            resource_type=random.choice(resource_types),
            total=total,
            available=available
        )

def seed_equipment(n=10):
    status_choices = [choice[0] for choice in Equipment.EQUIPMENT_STATUS]
    for _ in range(n):
        total = random.randint(10, 100)
        in_use = random.randint(0, total)
        available = random.randint(0, total - in_use)
        maintenance = total - in_use - available
        Equipment.objects.create(
            name=fake.word().capitalize() + " Machine",
            total=total,
            in_use=in_use,
            available=available,
            maintenance=maintenance,
            status=random.choice(status_choices)
        )