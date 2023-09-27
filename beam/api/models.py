from django.db import models

# Create your models here.


class BeamModel(models.Model):
    elasticity = models.FloatField(blank=True, null=True)
    inertia = models.FloatField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    lengthunit = models.CharField(max_length=100,null=True)
    loadunit = models.CharField(max_length=100,null=True)
    beam = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Beam reference no. {self.pk}: Length {self.length}{self.lengthunit}"


#   calculation_data = models.JSONField()
class MyModel(models.Model):
    field1 = models.CharField(max_length=100)
    field2 = models.TextField()