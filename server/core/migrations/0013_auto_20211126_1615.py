# Generated by Django 2.2.5 on 2021-11-26 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_status_status_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='status',
            name='message',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='notification',
            name='message',
            field=models.CharField(max_length=255),
        ),
    ]
