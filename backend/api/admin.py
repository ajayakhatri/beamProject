from django.contrib import admin
from .models import BeamModel

class BeamModelAdmin(admin.ModelAdmin):
    all_fields = [field.name for field in BeamModel._meta.get_fields()]

    # Set all fields as readonly
    readonly_fields = tuple(all_fields)

admin.site.register(BeamModel, BeamModelAdmin)
