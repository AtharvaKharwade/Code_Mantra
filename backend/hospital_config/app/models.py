from django.db import models

class HospitalResource(models.Model):
    RESOURCE_TYPES = [
        ('beds', 'Beds'),
        ('icu', 'ICU Units'),
        ('ventilator', 'Ventilators'),
        ('rooms', 'Rooms'),
    ]

    name = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    total = models.IntegerField()
    available = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.available}/{self.total}"

class Staff(models.Model):

    ROLE_CHOICES = [
        ("doctor", "Doctor"),
        ("nurse", "Nurse"),
        ("admin", "Admin"),
    ]

    name = models.CharField(max_length=100)

    staff_id = models.CharField(max_length=50, unique=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    password = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.role}"