from __future__ import absolute_import, unicode_literals

from django.core import mail

from datetime import date, timedelta
from celery.schedules import crontab

from server.celery import app
from core import models
from core import queries
from core import utils


@app.task
def send_mail(subject, text, from_email, to_email):
    mail.send_mail(
        subject,
        text,
        from_email,
        (to_email,),
    )


@app.task
def check_status(deal_id, status_id, msg):
    deal = models.Deal.objects.get(pk=deal_id)

    if deal.status.pk == status_id:
        queries.add_notification(
            deal.broker.id,
            msg
        )


@app.task
def send_notification(
    broker_id, msg, status_id=None, deal_id=None, personal=False
    ):
    queries.add_notification(
        broker_id, msg, status_id, deal_id, personal
    )


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute=0, hour=0), 
        check_product_expires.s(), 
        name="check_product_expires"
    )  # Execute daily at midnight.
    sender.add_periodic_task(
        crontab(minute=0, hour=1), 
        check_tasks.s(), 
        name="check_tasks"
    )  # Execute daily.


@app.task
def check_product_expires():
    products = models.DealProduct.objects.filter(
        expiry_date__isnull=False
    )

    for product in products:
        expiry_date = product.expiry_date
        today_date = date.today()

        num_months = (expiry_date.year - today_date.year) * 12 + (expiry_date.month - today_date.month)
        if num_months <= 3:
            deal = product.deal
            customer_name = deal.lead.customer.first_name
            if product.product_type == models.DealProduct.INSURANCE:
                msg = f"Call {customer_name}. Their insurance policy expires soon!"
            elif product.product_type == models.DealProduct.MORTGAGE:
                msg = f"Call {customer_name}. They're due to remortgage soon!"
                send_notification.delay()
            
            send_notification.delay(
                broker_id=deal.broker.id, msg=msg, personal=True
            )


@app.task(name='check_tasks')
def check_tasks():
    tasks = models.Task.objects.filter(
        due_date__gt=date.today() - timedelta(days=1),
        due_date__lte=date.today(),
        notified=False
    )

    for task in tasks:
        full_name = f"{task.broker.first_name} {task.broker.last_name}"
        msg = utils.TEMPLATE_MSG_ADD_TASK.format(
            full_name=full_name, task_name=task.message
        )
        send_notification.apply_async(
            kwargs=dict(
                broker_id=task.broker.id, 
                msg=msg, personal=True
            )
        )
        task.notified = True
        task.save()