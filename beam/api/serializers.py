from rest_framework import serializers
from .models import  BeamModel



class BeamModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeamModel
        fields = "__all__"
