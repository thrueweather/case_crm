# Generated by Django 2.2.5 on 2021-11-29 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_auto_20211126_1618'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='status_from',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]