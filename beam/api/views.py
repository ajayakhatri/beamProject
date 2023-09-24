from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import BeamModelSerializer

from .models import BeamModel
from .beamApp import Beam
import json
import numpy as np
from django.core import serializers


@api_view(["POST", "GET"])
def my_view(request):
    if request.method == "POST":
        # Retrieve the data from the request

        data = json.loads(request.body)
        pointLoad_ = data.get("point_load_input", None)
        distributedload_ = data.get("distributed_load_input", None)
        support_ = data.get("support_input", None)
        # minspan = data.get("minspan", None)
        beamLength = data.get("beam_length")
        # E = data.get("E", None)
        # I = data.get("I", None)
        # unit = data.get("unit", None)

        # distributedload_ = [
        # ["d", 0, [5, 5000, 1000]],
        # ["d", 5, [5, 10000, 5000]],
        # ]
        # support_ = {2.5: 1, 7.5: 1, 10: 0}
        # pointLoad_ = [[3, 12000], [6, 15000]]
        minspan = 0.05 * beamLength
        leng = beamLength

        E: float = 210e9
        I: float = 4.73e-6
        if len(pointLoad_) == 0 and len(distributedload_) == 0 and len(support_) == 0:
            return JsonResponse({"ERROR": "Beam is empty"})

        no_nodes, bars, n, value_ = arrangeData(
            distributedload_, support_, pointLoad_, minspan, leng
        )
        beam_1 = Beam(leng, no_nodes, E, I, bars, n)
        beam_1.add_values(value_)

        beam_1.analysis()
        beam_1.plot()

        # result = beam_1.results()
        plots = beam_1.plots

        calculation = BeamModel(plots=plots)
        calculation.save()

        # data = json.loads(plots)
        return JsonResponse(plots)
     
    else:
        return render(request, "api/index.html")


@api_view(["POST"])
def getit(request):
    try:
        # Assuming data is sent as JSON
        data = json.loads(request.body)
        my_data = data.get("field1")
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


def arrangeData(distributedload_, support_, pointLoad_input, minspan, leng):
    sum_dict = {}
    for sublist in pointLoad_input:
        key = sublist[0]
        value = sublist[1]
        if key in sum_dict:
            sum_dict[key] += value
        else:
            sum_dict[key] = value
    pointLoad_ = sum_dict

    s = {}
    support_ = support_
    for key in support_:
        s[float(key)] = support_[key]
    support_ = s
    # print(support_)

    a = []
    for dl in distributedload_:
        if dl[2][1] != dl[2][2]:
            min_value = min(dl[2][1], dl[2][2])
            a.append(["d", dl[1], [dl[2][0], min_value, min_value]])
            a.append(
                ["d", dl[1], [dl[2][0], dl[2][1] - min_value, dl[2][2] - min_value]]
            )
        else:
            a.append(dl)

    def dl_to_node(list_d, minspan):
        n = {}
        a = {}
        span = minspan
        for list in list_d:
            y1 = list[2][1]
            y2 = list[2][2]
            x1 = list[1]
            x2 = list[1] + list[2][0]
            y = lambda x: round(((y2 - y1) / (x2 - x1)) * (x - x1) + (y1), 6)
            s = x1
            if list[1] % span != 0:
                if x1 not in n:
                    n[x1] = x1
                    a[x1] = ["d", y(x1)]
                else:
                    a[x1] = ["d", a[x1][1] + y(x1)]
                s = (int(list[1] / span) + 1) * span

            e = x2
            if x2 % span != 0:
                e = (int(x2 / span)) * span

            x = s
            while x <= e:
                if x not in n:
                    n[x] = x
                    a[x] = ["d", y(x)]
                else:
                    a[x] = ["d", a[x][1] + y(x)]
                x += span

            if x2 % span != 0:
                if x2 not in n:
                    n[x2] = x2
                    a[x2] = ["d", y(x2)]
                else:
                    a[x2] = ["d", a[x2][1] + y(x2)]
        return n, a

    n, a = dl_to_node(a, minspan)
    for i in pointLoad_:
        if i not in n:
            n[i] = i

    for i in support_:
        if i not in n:
            n[i] = i

    n = dict(sorted(n.items(), key=lambda x: x[0]))
    dldict_ = dict(sorted(a.items(), key=lambda x: x[0]))
    list_n = [[key, value] for key, value in n.items()]

    if list_n[0][0] != 0:
        x = 0
        while x < list_n[0][0]:
            if x not in n:
                n[x] = 0
            x += minspan

    for i in range(len(list_n) - 1):
        x = list_n[i][0]
        while x <= list_n[i + 1][0]:
            if x not in n:
                n[x] = 0
            x += minspan

    if list_n[-1][0] != leng:
        x = list_n[-1][0]
        while x <= leng:
            if x not in n:
                n[x] = 0
            x += minspan

    n = dict(sorted(n.items(), key=lambda x: x[0]))

    node = 1
    pf = {}
    df = {}
    sf = {}
    location2node = {}
    for i in n:
        location2node[i] = node
        node += 1
    for i in list_n:
        if i[0] in pointLoad_:
            pf[location2node[i[0]] - 1] = -1 * pointLoad_[i[0]]
        if i[0] in support_:
            sf[location2node[i[0]] - 1] = support_[i[0]]
        if i[0] in dldict_:
            df[location2node[i[0]] - 1] = dldict_[i[0]]

    list_df = [[key, value] for key, value in df.items()]
    list_pf = [[key, ["p", value]] for key, value in pf.items()]
    list_sf = [[key, ["s", value]] for key, value in sf.items()]

    combined_list = list_pf + list_df + list_sf

    list_f = sorted(combined_list, key=lambda x: x[0])

    no_nodes = len(n)
    bars = []
    dff = {}
    for i in range(len(list_df) - 1):
        if list_df[i][0] == list_df[i + 1][0] - 1:
            dff[list_df[i][0]] = [-1 * list_df[i][1][1], -1 * list_df[i + 1][1][1]]

    def gen_bars(no_nodes):
        bars = []
        for i in range(no_nodes - 1):
            bars.append([i + 1, i + 2])
        return np.array(bars).astype(int)

    def transform_dict_to_list(dictionary):
        result = []
        for key, value in dictionary.items():
            if value == 1:
                result.append((key, 0))
            else:
                result.append((key,))
        return result

    sff = transform_dict_to_list(sf)
    bars = gen_bars(no_nodes)

    value_ = {
        "point_load_input": pf,
        "distributed_load_input": dff,
        "support_input": sff,
    }

    array = [[key, 0] for key, value in n.items()]

    for bar in bars:
        bar[0] = bar[0] - 1
        bar[1] = bar[1] - 1
    n = np.array(array).astype(float)
    # print("N", n)
    # print("N", bars)

    return no_nodes, bars, n, value_
