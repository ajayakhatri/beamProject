# Generated by Django 4.2.4 on 2023-09-12 07:04

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BeamModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("elasticity", models.FloatField()),
                ("inertia", models.FloatField()),
                ("length", models.FloatField()),
                ("nodes", models.IntegerField()),
                ("distributedload_input", models.JSONField(blank=True, null=True)),
                ("point_load_input", models.JSONField(blank=True, null=True)),
                ("support_input", models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="MyModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("field1", models.CharField(max_length=100)),
                ("field2", models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name="Task",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                (
                    "completed",
                    models.BooleanField(blank=True, default=False, null=True),
                ),
            ],
        ),
    ]