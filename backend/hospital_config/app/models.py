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
    @staticmethod
    def triage_distribution():
        from django.db.models import Count
        return PatientQueue.objects.values('triage_level').annotate(count=Count('id'))

    @staticmethod
    def queue_alerts():
        alerts = []
        waiting_count = PatientQueue.objects.filter(status="waiting").count()
        critical_count = PatientQueue.objects.filter(triage_level="P1", status="waiting").count()
        if waiting_count > 10:
            alerts.append(f"High queue: {waiting_count} patients waiting.")
        if critical_count > 0:
            alerts.append(f"Critical patients waiting: {critical_count}.")
        if not alerts:
            alerts.append("Queue is normal.")
        return alerts

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

    def wait_time_seconds(self):
        from django.utils import timezone
        return (timezone.now() - self.arrival_time).total_seconds()

    def wait_time_minutes(self):
        return int(self.wait_time_seconds() // 60)

    def wait_time_display(self):
        mins = self.wait_time_minutes()
        if mins < 1:
            return "<1 min"
        elif mins < 60:
            return f"{mins} min"
        else:
            hours = mins // 60
            return f"{hours} hr {mins % 60} min"

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
    last_updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.department} - {self.status}"
    
class WardBed(models.Model):

    ward_name = models.CharField(max_length=100)

    total_beds = models.IntegerField()
    occupied_beds = models.IntegerField()
    available_beds = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    def occupancy_percentage(self):
        if self.total_beds > 0:
            return int((self.occupied_beds / self.total_beds) * 100)
        return 0

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

class Equipment(models.Model):
    EQUIPMENT_STATUS = [
        ("active", "In Use / Active"),
        ("available", "Available / Standby"),
        ("maintenance", "Under Maintenance"),
    ]
    name = models.CharField(max_length=100)
    total = models.IntegerField()
    in_use = models.IntegerField()
    available = models.IntegerField()
    maintenance = models.IntegerField()
    status = models.CharField(max_length=20, choices=EQUIPMENT_STATUS)
    last_updated = models.DateTimeField(auto_now=True)

    def usage_pct(self):
        return int((self.in_use / self.total) * 100) if self.total else 0

    def __str__(self):
        return f"{self.name} ({self.status})"
