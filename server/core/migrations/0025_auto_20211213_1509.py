# Generated by Django 2.2.5 on 2021-12-13 15:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_auto_20211213_1332'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deal',
            name='lead',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='deal', to='core.Lead'),
        ),
    ]
