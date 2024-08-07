from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import BeamModel
from .beamApp import Beam
import json
from .arrangeData import arrangeData
from .beamOpensees import beamOpensees


@api_view(["POST"])
def chart(request):
    data = json.loads(request.body)

    pointLoad_ = data.get("point_load_input", None)
    distributedload_ = data.get("distributed_load_input", None)
    support_ = data.get("support_input", None)
    beamLength = data.get("beam_length")
    moi = data.get("moi")
    youngModulus = data.get("young_modulus")
    area = data.get("area")
    analysis_method = data.get("analysis_method")

    # maximum span of a beam element
    max_element_span = 0.05 * beamLength
    leng = beamLength
    E: float = youngModulus
    I: float = moi
    A: float = area
    analysis_method: int = analysis_method

    if len(pointLoad_) == 0 and len(distributedload_) == 0 and len(support_) == 0:
        return JsonResponse({"ERROR": "Beam is empty"})

    no_nodes, bars, n, value_ = arrangeData(
        distributedload_, support_, pointLoad_, max_element_span, leng
    )

    if analysis_method == 1:
        beam_1 = Beam(leng, no_nodes, E, I, bars, n)
        beam_1.add_values(value_)
        beam_1.analysis()
        beam_1.plot()
        plots = beam_1.plots
        print("Analysis by FEM")
    else:
        plots = beamOpensees(no_nodes, bars, n, value_, E, A, I)
        print("Analysis by Opensees")

    return JsonResponse({"data": data, "plots": plots})


@api_view(["POST"])
def saveBeam(request):
    data = json.loads(request.body)
    beam = data.get("beam", None)
    last_object = BeamModel.objects.last()
    last_object_pk = 0
    if last_object:
        last_object_pk = last_object.pk
    beam["id"] = last_object_pk+10000
    beam["referenceNo"] = last_object_pk+1

    beamtosave = BeamModel(reference_no=(last_object_pk+1), beam=beam,
                           elasticity=beam["youngModulus"], inertia=beam["moi"], length=beam["length"], lengthunit=beam["unit"], loadunit=beam["loadUnit"])
    beamtosave.save()
    print("beam", beam)
    if beam == None:
        return JsonResponse({"ERROR": "Beam couldnot be saved"})
    return JsonResponse({"referenceNo": last_object_pk+1, "added": beam})


@api_view(["GET"])
def getBeam(request, pk):
    a = BeamModel.objects.get(reference_no=int(pk))
    if not a:
        return JsonResponse({"ERROR": "Beam not found"})
    else:
        plots = {"data": a.beam}
        return JsonResponse(plots)
