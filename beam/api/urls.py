from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("add/<str:toAdd>/", views.add, name="add"),
    path("add-beam/", views.taskAddBeam, name="add-beam"),
    path("get-beam/<str:pk>/", views.getBeam, name="get-beam"),
    path("save-beam/", views.saveBeam, name="save-beams"),
    path("remove-beam/", views.removeBeam, name="remove-beams"),
    path("endpoint/", views.getit, name="getit"),
    path("plot/", views.my_view, name="my-view"),
]


urlpatterns+=[   path("info/", views.apiOverview, name="api-overview"),
   ]