# Generated by Django 2.2.5 on 2021-12-21 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0034_task_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'in process'), (2, 'done')], null=True),
        ),
    ]