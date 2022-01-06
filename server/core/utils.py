from enum import Enum
from datetime import datetime, timedelta
import dateutil.parser as dt

from django.db.models import Q
from django.shortcuts import get_object_or_404

import core.models as models
from core import tasks
from core import queries


class STATUS(Enum):
    FCR_Client_not_ready_schedule = 1
    FCR_Unable_to_help = 2
    Application_Fee_Made = 3
    Contact_made_Awaiting_docs = 4
    Contact_made_Meeting_scheduled = 5
    Insurance_application_submitted = 6
    Mortgage_application_submitted = 7
    Referred_to_3rd_Party = 8
    Client_proceeding = 9
    Contact_attempt_1 = 10
    Contact_attempt_2 = 11
    Contact_attempt_3 = 12
    Contact_made_Factfind_complete = 13
    Invalid_number = 14
    No_sale_Declined_to_pay_fee = 15
    No_sale_No_further_contact_requested = 16
    No_sale_Went_AWOL = 17
    No_sale_Went_elsewhere = 18
    Sale_made_AIP_approved = 19
    Sale_made_Full_application = 20
    Sale_made_Mortgage_completed = 21
    Sale_made_Mortgage_offered = 22
    Documents_recieved = 23
    Check_my_file = 24
    Customer_Contact_1 = 25

    @classmethod
    def get(cls, name):
        if name in cls.__members__:
            return STATUS[name].value
        return 0


TEMPLATE_MSG_ADD_NEW_STATUS = "\
{full_name} moved case #{deal_pk} to the \
following status: '{status_name}'"
TEMPLATE_MSG_PURCHASE_LEAD = "{full_name} has purchased {lead_name} as a Lead"
TEMPLATE_MSG_REMOVE_DEAL = "\
Admin - {full_name} has removed the lead №{lead_pk} \
from you and added it back to the Lead pot."

TEMPLATE_MSG_ADD_TASK = "\
Hi {full_name} Your Task {task_name} is due."


def process_status(deal_pk, status_pk, data):
    msg = ''
    if status_pk in (
        STATUS.Contact_attempt_1.value,
        STATUS.Contact_attempt_2.value
    ):
        msg = f"Status is not selected within 24 hours, call the client from case #{status_pk}"
        eta = datetime.now() + timedelta(hours=24)
    elif status_pk == STATUS.Contact_attempt_3.value:
        msg = f"Status is not selected within 24 hours, change the status to NO sale - Went AWOL in case #{status_pk}"
        eta = datetime.now() + timedelta(hours=24)
    elif status_pk in (
        STATUS.Insurance_application_submitted.value,
        STATUS.Mortgage_application_submitted.value,
        STATUS.Sale_made_AIP_approved.value,
        STATUS.Sale_made_Full_application.value,
    ):
        try:
            queries.add_product_to_deal(deal_pk, data)
        except:
            pass
    elif status_pk == STATUS.Contact_made_Meeting_scheduled.value:
        msg = f"Status is not selected once the specified date has expired in case #{status_pk}"
        eta = datetime.strptime(
            data, '%Y-%m-%dT%H:%M:%S.%fZ'
        )
    elif status_pk == STATUS.Contact_made_Awaiting_docs.value:
        msg = f"Status is not selected once the specified 7 days in case #{status_pk}"
        eta = datetime.now() + timedelta(days=7)
    elif status_pk == STATUS.No_sale_No_further_contact_requested.value:
        deal = get_object_or_404(models.Deal, pk=deal_pk)
        deal.active = False
        deal.save()

    if msg:
        tasks.check_status.apply_async(
            (deal_pk, status_pk, msg),
            eta=eta
        )


def notification_filter(params, is_admin, broker_id):
    filt = dict()

    if params.get('status_id'):
        filt["status_id"] = params.get('status_id')

    if params.get('date'):
        _date = dt.parse(params.get('date'))

        filt["create_date__gte"] = _date
        filt["create_date__lt"] = _date + timedelta(days=1)

    if params.get('broker_id'):
        filt["broker_id"] = params.get('broker_id')

    if params.get('readed') == 'true':
        readed = Q(readed=broker_id)
    else:
        readed = ~Q(readed=broker_id)

    if is_admin:
        filt = Q(Q(**filt) & readed &
                 Q(Q(personal=False) | Q(broker_id=broker_id)))
    else:
        filt = Q(Q(broker_id=broker_id) & Q(**filt) & readed)

    return filt


def change_msg_current_user(current_user_id, is_admin, notifications):
    for notification in notifications:
        if (
            notification.get('broker') == current_user_id and
            not is_admin
        ):
            notification['message'] = notification['message'].format(
                full_name="You")
        else:
            notification['message'] = notification['message'].format(
                full_name=notification.get('broker__first_name')
            )

    return notifications
