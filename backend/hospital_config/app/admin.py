from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import HospitalResource
from .models import Staff
from .models import PatientQueue
from .models import EmergencyResource
from .models import WardBed
admin.site.register(Staff)
admin.site.register(HospitalResource)
admin.site.register(PatientQueue)



admin.site.register(WardBed)

admin.site.register(EmergencyResource)