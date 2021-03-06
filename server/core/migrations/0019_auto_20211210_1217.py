# Generated by Django 2.2.5 on 2021-12-10 12:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_auto_20211207_1045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='deal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Deal'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Status'),
        ),
    ]
