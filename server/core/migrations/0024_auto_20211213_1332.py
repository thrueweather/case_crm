# Generated by Django 2.2.5 on 2021-12-13 13:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_remove_notification_readed'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='readed_admin',
            new_name='readed',
        ),
    ]
