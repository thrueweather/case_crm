from datetime import date, datetime, timedelta

from django.db.models import Q
from django.shortcuts import get_object_or_404

from core import models
from core import utils
from core import tasks
from accounts import models as accounts_models


def get_deals(broker_id, is_admin, filt):
    status = filt.get('status')
    filt = {}

    if status == 'active':
        filt['active'] = True
    elif status == 'inactive':
        filt['active'] = False
    elif status == 'completed':
        filt['completed'] = True

    if not is_admin:
        filt["broker_id"] = broker_id

    return models.Deal.objects.filter(**filt)


def create_deal(lead, broker):
    status = models.Status.objects.get(
        pk=utils.STATUS.Customer_Contact_1.value
    )
    try:
        deal = models.Deal.objects.create(
            lead=lead,
            broker=broker,
            status=status
        )
    except:
        return 

    lead.purchased = True
    lead.save()

    return deal


def create_customer(data):
    customer, _ = models.Customer.objects.get_or_create(
        email=data["email"],
        defaults={
            'first_name': data["name"],
            'mobile_phone': data["mobile_phone"]
        }
    )

    return customer


def create_lead(customer, data, converted=False):
    return models.Lead.objects.create(
        customer=customer,
        property_amount=data["property_amount"],
        mortgage_amount=data["mortgage_amount"],
        message=data["message"],
        converted=converted
    )


def update_or_create_customer(data):
    cust = data.copy()

    address_fields = ["address", "post_code"]
    address_data = {
        address_field: cust.pop(address_field)
        for address_field in address_fields
    }

    l = ["property_amount", "mortgage_amount", "message"]
    list(map(cust.__delitem__, filter(cust.__contains__, l)))

    cust['age'] = 0 if not cust['age'] else cust['age']
    cust['gender'] = 0 if not cust['gender'] else cust['gender']
    customer, _ = models.Customer.objects.update_or_create(
        email=cust["email"],
        defaults=cust
    )

    address = models.Address.objects.create(
        **address_data
    )
    customer.address = address
    customer.save()

    return customer


def update_deal(pk, data):
    deal = get_object_or_404(models.Deal, pk=pk)

    lead = deal.lead
    lead.property_amount = data["property_amount"]
    lead.mortgage_amount = data["mortgage_amount"]
    lead.message = data["message"]
    lead.save()

    customer = lead.customer
    customer.first_name = data["first_name"]
    customer.last_name = data["last_name"]
    customer.email = data["email"]
    customer.mobile_phone = data["mobile_phone"]
    customer.age = data["age"]
    customer.save()

    customer_address = customer.address
    customer_address.post_code = data["post_code"]
    customer_address.address = data["address"]
    customer_address.save()

    return deal


def add_status_to_deal(deal, status_id: int, message: str):
    status_obj = get_object_or_404(models.Status, pk=status_id)
    deal.status = status_obj
    deal.note = message
    deal.save()

    return status_obj


def add_product_to_deal(deal, data):
    if data.pop('productType') == 'insurance':
        data['product_type'] = models.DealProduct.INSURANCE
        product = data.pop('product')
        provider = data.pop('provider')

        if all((
            isinstance(provider, str),
            isinstance(product, str),)
        ):
            provider = models.Provider.objects.create(
                name=provider
            )
            data['product_id'] = models.Product.objects.create(
                name=product, provider=provider
            ).id
        else:
            data['product_id'] = product
    else:
        lender = data.pop('lender')
        data['product_type'] = models.DealProduct.MORTGAGE
        if isinstance(lender, str):
            data['lender_id'] = models.Lender.objects.create(
                name=lender
            ).id
        else:
            data['lender_id'] = lender

    return models.DealProduct.objects.create(
        deal=deal,
        **data
    )


def add_note_to_status(history_pk: int, note: str):
    history = get_object_or_404(models.HistoryDeal, pk=history_pk)
    history.note = note
    history.save()

    return history


def update_notes(notes):
    history_objs = models.HistoryDeal.objects.filter(
        id__in=[note['history_pk'] for note in notes]
    )

    for note, obj in zip(notes, history_objs):
        obj.note = note['note']

    models.HistoryDeal.objects.bulk_update(
        history_objs, ["note"]
    )

    return history_objs


def add_notification(
    broker_id, msg, status_id=None, deal_id=None, personal=False
    ):
    if msg:
        models.Notification.objects.create(
            broker_id=broker_id,
            message=msg,
            status_id=status_id,
            deal_id=deal_id,
            personal=personal
        )


def get_notification(is_admin, broker_id, params):
    filt = utils.notification_filter(params, is_admin, broker_id)

    return models.Notification.objects.filter(
        filt
    ).values(
        "id", 
        "message", 
        "create_date", 
        "deal", 
        "status", 
        "broker__first_name",
        "broker",
    )


def mark_notification(user_pk, notification_ids: list, readed: bool):
    broker = get_object_or_404(accounts_models.User, pk=user_pk)
    if readed:    
        broker.notifications.add(*notification_ids)
    else:
        broker.notifications.remove(*notification_ids)


def delete_notification(notification_ids: list):
    models.Notification.objects.filter(
        pk__in=notification_ids
    ).delete()


def create_task(broker_pk, deal_pk, message, due_date, note):    
    models.Task.objects.create(
        broker_id=broker_pk,
        deal_id=deal_pk,
        message=message,
        due_date=datetime.strptime(
            due_date, '%Y-%m-%dT%H:%M:%S.%fZ'
        ),
        note=note
    )


def delete_history(pk):
    models.HistoryDeal.objects.get(
        pk=pk
    ).delete()


def get_tasks(broker_id, params):
    filt = dict()
    filt['broker_id'] = broker_id

    current_date = date.today() -  timedelta(days=1)

    if params.get('completed') == 'true':
        filt['due_date__lt'] = current_date
    elif params.get('completed') == 'false':
        filt['due_date__gte'] = current_date

    return models.Task.objects.filter(
        **filt
    ).order_by("due_date")
