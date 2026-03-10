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


class PatientQueue(models.Model):

    TRIAGE_LEVELS = [
        ("P1", "Critical"),
        ("P2", "Urgent"),
        ("P3", "Standard"),
    ]

    STATUS_CHOICES = [
        ("waiting", "Waiting"),
        ("treating", "Being Treated"),
        ("discharged", "Discharged"),
    ]

    patient_id = models.CharField(max_length=50, unique=True)

    chief_complaint = models.CharField(max_length=255)

    triage_level = models.CharField(max_length=5, choices=TRIAGE_LEVELS)

    assigned_to = models.CharField(max_length=100, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="waiting")

    arrival_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_id} - {self.triage_level}"
    
class EmergencyResource(models.Model):

    STATUS_CHOICES = [
        ("ready", "Ready"),
        ("strained", "Strained"),
        ("overloaded", "Overloaded"),
    ]

    department = models.CharField(max_length=100)

    staff = models.IntegerField()

    beds_free = models.IntegerField()

    equipment = models.CharField(max_length=200)

    load_percentage = models.IntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.department} - {self.status}"
    
class WardBed(models.Model):

    ward_name = models.CharField(max_length=100)

    total_beds = models.IntegerField()

    occupied_beds = models.IntegerField()

    available_beds = models.IntegerField()

    def occupancy_percentage(self):
        return int((self.occupied_beds / self.total_beds) * 100)

    def status(self):
        pct = self.occupancy_percentage()
        if pct > 80:
            return "Critical"
        elif pct > 50:
            return "Busy"
        else:
            return "Available"

    def __str__(self):
        return self.ward_name