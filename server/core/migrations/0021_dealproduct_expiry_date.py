# Generated by Django 2.2.5 on 2021-12-13 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_notification_readed_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='dealproduct',
            name='expiry_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
