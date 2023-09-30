# Generated by Django 4.2.4 on 2023-09-29 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_beammodel_elasticity_remove_beammodel_inertia_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='beammodel',
            name='elasticity',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='beammodel',
            name='inertia',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='beammodel',
            name='length',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='beammodel',
            name='lengthunit',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='beammodel',
            name='loadunit',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='beammodel',
            name='beam',
            field=models.JSONField(blank=True),
        ),
    ]