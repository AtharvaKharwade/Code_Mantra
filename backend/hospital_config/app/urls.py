from django.urls import path
from . import views
from .views import *

urlpatterns = [

    path("", views.index, name="index"),
    path("login/", views.login_page, name="login"),
    path("register/", views.register, name="register"),

    path("beds/", views.bed_tracking, name="bed_tracking"),
    path("equipment/", views.equipment_monitoring, name="equipment_monitoring"),
    path("emergency/", views.emergency_allocation, name="emergency_allocation"),
    path("queue/", views.patient_queue, name="patient_queue"),

]