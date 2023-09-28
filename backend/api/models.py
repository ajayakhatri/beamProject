from django.db import models


class BeamModel(models.Model):
    elasticity = models.FloatField(blank=True, null=True)
    inertia = models.FloatField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    lengthunit = models.CharField(max_length=100,null=True)
    loadunit = models.CharField(max_length=100,null=True)
    beam = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Beam reference no. {self.pk}: Length {self.length}{self.lengthunit}"
