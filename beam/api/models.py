from django.db import models

# Create your models here.


class BeamModel(models.Model):
    # elasticity = models.FloatField()
    # inertia = models.FloatField()
    # length = models.FloatField()
    # nodes = models.IntegerField()
    elasticity = models.FloatField(blank=True, null=True)
    inertia = models.FloatField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    nodes = models.IntegerField(blank=True, null=True)
    distributedload_input = models.JSONField(blank=True, null=True)
    point_load_input = models.JSONField(blank=True, null=True)
    support_input = models.JSONField(blank=True, null=True)
    plots = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Beam no. {self.pk}: Length {self.length}m and {self.nodes} nodes"


#   calculation_data = models.JSONField()
class MyModel(models.Model):
    field1 = models.CharField(max_length=100)
    field2 = models.TextField()