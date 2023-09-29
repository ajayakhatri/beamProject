from django.urls import path
from . import views

urlpatterns = [
    path("get-beam/<str:pk>/", views.getBeam, name="get-beam"),
    path("save-beam/", views.saveBeam, name="save-beams"),
    path("plot/", views.chart, name="chart"),
]

