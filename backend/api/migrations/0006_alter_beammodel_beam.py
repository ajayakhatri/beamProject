# Generated by Django 4.2.4 on 2023-09-29 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_beammodel_elasticity_beammodel_inertia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='beammodel',
            name='beam',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
