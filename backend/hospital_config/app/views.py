from django.shortcuts import render, redirect
from .models import Staff
from .models import PatientQueue

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

    if request.method == "POST":

        staff_id = request.POST.get("staffId")
        password = request.POST.get("password")

        try:
            user = Staff.objects.get(staff_id=staff_id, password=password)

            return redirect("index")

        except Staff.DoesNotExist:

            return render(request, "login2.html", {"error": "Invalid credentials"})

    return render(request, "login2.html")


def patient_queue(request):

    patients = PatientQueue.objects.all().order_by("arrival_time")

    waiting = PatientQueue.objects.filter(status="waiting").count()
    treating = PatientQueue.objects.filter(status="treating").count()
    discharged = PatientQueue.objects.filter(status="discharged").count()

    critical = PatientQueue.objects.filter(triage_level="P1").count()

    context = {
        "patients": patients,
        "waiting": waiting,
        "treating": treating,
        "discharged": discharged,
        "critical": critical
    }

    return render(request, "patient_queue.html", context)

from .models import EmergencyResource


def emergency_allocation(request):

    resources = EmergencyResource.objects.all()

    beds = sum(r.beds_free for r in resources)
    staff = sum(r.staff for r in resources)

    ambulance = 5  # temporary demo
    ot_rooms = 3   # temporary demo

    context = {
        "resources": resources,
        "beds": beds,
        "staff": staff,
        "ambulance": ambulance,
        "ot": ot_rooms
    }

    return render(request, "emergency_allocation.html", context)

from .models import WardBed

def bed_tracking(request):

    wards = WardBed.objects.all()

    total_beds = sum(w.total_beds for w in wards)
    occupied_beds = sum(w.occupied_beds for w in wards)
    available_beds = sum(w.available_beds for w in wards)

    context = {
        "wards": wards,
        "total_beds": total_beds,
        "occupied_beds": occupied_beds,
        "available_beds": available_beds
    }

    return render(request, "bed_tracking.html", context)