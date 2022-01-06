# Generated by Django 2.2.5 on 2021-12-22 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0035_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'in process'), (2, 'done')], null=True),
        ),
    ]
