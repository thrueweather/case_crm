# Generated by Django 2.2.5 on 2021-11-24 13:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_remove_dealproduct_lender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dealproduct',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Product'),
        ),
    ]
