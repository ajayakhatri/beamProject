from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import  BeamModelSerializer

from .models import BeamModel
from .beamApp import Beam
import json


@api_view(["POST", "GET"])
def my_view(request):
    if request.method == "POST":
        # Retrieve the data from the request
        # field1 = request.data["field1"]
        data = json.loads(request.body)
        field1 = data.get("field1", None)

        # Render the template with the data
        # return render(
        #     request,
        #     "api/index.html",
        #     {
        #         "data": field1,
        #     },
        # )
        return JsonResponse(data)
    else:
        return render(request, "api/index.html")


@api_view(["POST"])
def getit(request):
    try:
        # Assuming data is sent as JSON
        data = json.loads(request.body)
        my_data = data.get(
            "field1"
        ) 
        # Process the received data

        # Return a JSON response with the processed data
        response_data = {"result": "Data processed successfully", "my_data": my_data}
        return render(request, "api/index.html", response_data)
        # return JsonResponse(response_data)
    except json.JSONDecodeError as e:
        # Handle JSON decoding error
        return JsonResponse({"error": "Invalid JSON data"}, status=400)


@api_view(["GET"])
def apiOverview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail View": "/task-detail/<str:pk>/",
        "Create": "/task-create/",
        "Update": "/task-update/<str:pk>/",
        "Delete": "/task-delete/<str:pk>/",
        "Load": "/app/",
    }

    return Response(api_urls)


@api_view(["GET"])
def index(request):
    return render(request, "api/index.html")


@api_view(["POST"])
def taskAddBeam(request):
    length = request.POST.get("length")
    nodes = request.POST.get("nodes")
    elasticity = request.POST.get("Elasticity")
    inertia = request.POST.get("Inertia")

    beam_instance = BeamModel.objects.create(
        length=length, nodes=nodes, elasticity=elasticity, inertia=inertia
    )
    return Response({"message": f"Beam {beam_instance.pk} created successfully."})



pointLoad_input = []
distributedload_input = []
support_input = []


@api_view(["GET"])
def add(request, toAdd):
    response = {"message": "ERROR"}
    if toAdd == "point_load":
        # point_load_input = request.data.get("point_load", [])
        point_load_input = json.loads(request.body)
        calculation = BeamModel(point_load_input=point_load_input)
        calculation.save()
        response["message"] = "Point Load Added"

    elif toAdd == "distributed_load":
        distributedload_input = json.loads(request.body)
        calculation = BeamModel(distributedload_input=distributedload_input)
        calculation.save()
        response["message"] = "Distributed Load Added"

    elif toAdd == "support":
        support_input = json.loads(request.body)
        calculation = BeamModel(support_input=support_input)
        calculation.save()
        response["message"] = "Supports Added"

        # value = {
        #     "point_load_input": pointLoad_input,
        #     "distributed_load_input": distributedload_input,
        #     "support_input": support_input,
        # }
    return Response(response)


@api_view(["GET"])
def getBeam(request, pk):
    beams = BeamModel.objects.get(pk=pk)
    serializer = BeamModelSerializer(beams, many=False)
    return Response(serializer.data)


@api_view(["GET"])
def getBeams(request):
    beams = BeamModel.objects.all()
    serializer = BeamModelSerializer(beams, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def removeBeam(request):
    beams = BeamModel.objects.all()
    serializer = BeamModelSerializer(beams, many=True)
    return Response(serializer.data)






