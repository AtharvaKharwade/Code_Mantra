from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_page, name='login'),
    path("patient-queue/", views.patient_queue, name="patient_queue"),
    path("emergency-allocation/", views.emergency_allocation, name="emergency_allocation"),
    path("bed-tracking/", views.bed_tracking, name="bed_tracking"),
]