# Generated by Django 2.2.5 on 2021-12-31 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0036_auto_20211222_1146'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'to do'), (2, 'done')], null=True),
        ),
    ]
