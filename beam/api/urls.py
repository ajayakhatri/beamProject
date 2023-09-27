from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get-beam/<str:pk>/", views.getBeam, name="get-beam"),
    path("save-beam/", views.saveBeam, name="save-beams"),
    path("plot/", views.my_view, name="my-view"),
]

