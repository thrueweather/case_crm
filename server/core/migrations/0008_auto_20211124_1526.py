# Generated by Django 2.2.5 on 2021-11-24 15:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_auto_20211124_1525'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dealproduct',
            name='product',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Product'),
        ),
        migrations.AlterField(
            model_name='dealproduct',
            name='provider',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Provider'),
        ),
    ]
