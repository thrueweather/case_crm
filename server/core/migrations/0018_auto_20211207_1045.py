# Generated by Django 2.2.5 on 2021-12-07 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_notification_deal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='note',
            field=models.TextField(),
        ),
    ]
