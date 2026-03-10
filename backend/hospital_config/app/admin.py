from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import HospitalResource
from .models import Staff

admin.site.register(Staff)
admin.site.register(HospitalResource)