# Generated by Django 2.2.5 on 2021-12-31 12:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0037_auto_20211231_1212'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='task_uuid',
        ),
    ]
