from django.shortcuts import render, redirect
from .models import Staff

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

            return render(request, "login.html", {"error": "Invalid credentials"})

    return render(request, "login.html")