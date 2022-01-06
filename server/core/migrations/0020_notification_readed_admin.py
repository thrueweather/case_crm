# Generated by Django 2.2.5 on 2021-12-13 10:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0019_auto_20211210_1217'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='readed_admin',
            field=models.ManyToManyField(related_name='notifications', to=settings.AUTH_USER_MODEL),
        ),
    ]