def register(request):
    error = None
    success = False
    if request.method == "POST":
        name = request.POST.get("name")
        staff_id = request.POST.get("staffId")
        password = request.POST.get("password")
        role = request.POST.get("role")

        if role not in ["doctor", "nurse"]:
            error = "Only Doctor and Nurse can register here."
        else:
            if Staff.objects.filter(staff_id=staff_id).exists():
                error = "Staff ID already exists."
            else:
                Staff.objects.create(name=name, staff_id=staff_id, password=password, role=role)
                success = True
                return redirect("login")

    return render(request, "register.html", {"error": error, "success": success})
from django.shortcuts import render, redirect
from .models import *


def index(request):

    context = {
        "beds_available": 48,
        "beds_total": 72,

        "icu_available": 6,
        "icu_total": 12,

        "ventilator_available": 3,
        "ventilator_total": 18,

        "rooms_available": 11,
        "rooms_total": 15
    }

    return render(request, "index.html", context)


def login_page(request):

    error = None
    success = False
    if request.method == "POST":
        staff_id = request.POST.get("staffId")
        password = request.POST.get("password")
        role = request.POST.get("role")

        try:
            staff = Staff.objects.get(staff_id=staff_id, password=password, role=role)
            success = True
            return redirect("/")
        except Staff.DoesNotExist:
            error = "Invalid credentials or role. Please try again."

    return render(request, "login2.html", {"error": error, "success": success})


def patient_queue(request):

    patients = PatientQueue.objects.all().order_by("arrival_time")

    waiting = PatientQueue.objects.filter(status="waiting").count()
    treating = PatientQueue.objects.filter(status="treating").count()
    discharged = PatientQueue.objects.filter(status="discharged").count()
    critical = PatientQueue.objects.filter(triage_level="P1").count()

    patients_total = patients.count()
    waiting_pct = int((waiting / patients_total) * 100) if patients_total else 0
    treating_pct = int((treating / patients_total) * 100) if patients_total else 0
    critical_pct = int((critical / patients_total) * 100) if patients_total else 0
    discharged_pct = int((discharged / patients_total) * 100) if patients_total else 0

    # Calculate average wait time in minutes for all patients
    import math
    wait_times = [p.wait_time_minutes() for p in patients]
    avg_wait = math.ceil(sum(wait_times) / len(wait_times)) if wait_times else 0

    # Triage distribution for chart
    triage_dist = PatientQueue.triage_distribution()
    # Alerts
    queue_alerts = PatientQueue.queue_alerts()

    # Get last updated time (most recent arrival_time)
    last_updated = patients.last().arrival_time if patients.exists() else None

    context = {
        "patients": patients,
        "waiting": waiting,
        "treating": treating,
        "discharged": discharged,
        "critical": critical,
        "avg_wait": avg_wait,
        "triage_dist": triage_dist,
        "queue_alerts": queue_alerts,
        "last_updated": last_updated,
        "waiting_pct": waiting_pct,
        "treating_pct": treating_pct,
        "critical_pct": critical_pct,
        "discharged_pct": discharged_pct
    }

    return render(request, "patient_queue.html", context)


def emergency_allocation(request):

    resources = EmergencyResource.objects.all()

    beds = sum(r.beds_free for r in resources)
    staff = sum(r.staff for r in resources)

    ambulance = 5
    ot_rooms = 3

    # Get last updated time from the most recently updated EmergencyResource
    last_updated = resources.order_by('-last_updated').first().last_updated if resources.exists() else None

    context = {
        "resources": resources,
        "beds": beds,
        "staff": staff,
        "ambulance": ambulance,
        "ot": ot_rooms,
        "last_updated": last_updated
    }

    return render(request, "emergency_allocation.html", context)


def bed_tracking(request):

    wards = WardBed.objects.all()

    total_beds = sum(w.total_beds for w in wards)
    occupied_beds = sum(w.occupied_beds for w in wards)
    available_beds = sum(w.available_beds for w in wards)

    # Calculate occupancy percentages for progress bars
    if total_beds > 0:
        occupied_pct = int((occupied_beds / total_beds) * 100)
        available_pct = int((available_beds / total_beds) * 100)
    else:
        occupied_pct = 0
        available_pct = 0

    # Get last updated time from most recently updated ward
    last_updated = wards.order_by('-id').first()
    last_updated_time = last_updated.updated_at if hasattr(last_updated, 'updated_at') else None

    # Prepare ward data for table
    ward_data = []
    for w in wards:
        ward_data.append({
            'ward_name': w.ward_name,
            'total_beds': w.total_beds,
            'occupied_beds': w.occupied_beds,
            'available_beds': w.available_beds,
            'occupancy_percentage': w.occupancy_percentage(),
            'status': w.status()
        })

    context = {
        "wards": ward_data,
        "total_beds": total_beds,
        "occupied_beds": occupied_beds,
        "available_beds": available_beds,
        "occupied_pct": occupied_pct,
        "available_pct": available_pct,
        "last_updated": last_updated_time
    }

    return render(request, "bed_tracking.html", context)


def equipment_monitoring(request):
    equipment = Equipment.objects.all()
    total_equipment = sum(e.total for e in equipment)
    total_in_use = sum(e.in_use for e in equipment)
    total_available = sum(e.available for e in equipment)
    total_maintenance = sum(e.maintenance for e in equipment)
    last_updated = equipment.order_by('-last_updated').first().last_updated if equipment.exists() else None

    def pct(part, total):
        return int((part / total) * 100) if total else 0

    context = {
        "equipment": equipment,
        "total_equipment": total_equipment,
        "total_in_use": total_in_use,
        "total_available": total_available,
        "total_maintenance": total_maintenance,
        "last_updated": last_updated,
        "in_use_pct": pct(total_in_use, total_equipment),
        "available_pct": pct(total_available, total_equipment),
        "maintenance_pct": pct(total_maintenance, total_equipment),
        "usage_rates": [
            {"name": e.name, "usage_pct": e.usage_pct()} for e in equipment
        ],
        "alerts": [
            f"{e.name} is overloaded!" for e in equipment if e.usage_pct() > 90
        ]
    }
    return render(request, "equipment_monitoring.html", context)