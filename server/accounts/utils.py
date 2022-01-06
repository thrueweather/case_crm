from io import BytesIO
import calendar
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
import dateutil.parser as dt

import pandas as pd

from reportlab.platypus import Table,SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

from django.db.models import Q
from django.db.models import Count, Max
from pandas.core.frame import DataFrame

from core import models as core_models
from accounts import models


def get_start_and_end_date_current_month():
    todayDate = date.today()
    if todayDate.day > 25:
        todayDate += timedelta(7)    

    start = todayDate.replace(day=1) 
    end = todayDate.replace(
        day=calendar.monthrange(start.year,start.month)[1]
    )
    return start, end


def get_statistic(broker):
    start, end = get_start_and_end_date_current_month()

    filt = {}
    if not broker.is_admin:
        filt = {'broker': broker}

    deals = core_models.Deal.objects.filter(**filt)

    statistic = deals.aggregate(
        leads_taken=Count('pk', filter=Q(create_date__range=[start, end])),
        leads_converted=Count('pk', filter=Q(
            status__status_type__contains=str(core_models.Status.LEADS_COVERTED)
        )),
        not_proceeding=Count('pk', filter=(
            Q(status__status_type__contains=str(core_models.Status.NOT_PROCEEDING)) & 
            Q(status_from__range=[start, end]))),
        pending_cases=Count('pk', filter=(
            Q(status__status_type__contains=str(core_models.Status.PENDING_CASSES)) & 
            Q(status_from__range=[start, end])
        )),
        referrals_to_3rd_party=Count('pk', filter=Q(
            status__status_type__contains=str(core_models.Status.REFFERRALS_TO_3RD_PARTY)
        )),
        completed_mortgages=Count('pk', filter=Q(
            status__status_type__contains=str(core_models.Status.COMPlETED_MORTGAGES)
        )),
    )

    expiry_date = date.today() + relativedelta(months=+3)
    statistic.update(
        deals.aggregate(
            insurance_policies_sold=Count('pk', filter=Q(
                Q(status__status_type__contains=str(core_models.Status.INSURANCED_POLICIES_SOLD)) |
                Q(products__product_type=core_models.DealProduct.INSURANCE)
            )),
            insurance_renewals_due=Count('pk', filter=Q(
                Q(products__expiry_date__lte=expiry_date) &
                Q(products__product_type=core_models.DealProduct.INSURANCE)
            )),
            remortgages_due=Count('pk', filter=Q(
                Q(products__expiry_date__lte=expiry_date) &
                Q(products__product_type=core_models.DealProduct.MORTGAGE)
            )),
        )
    )

    try:
        conversion_rate = round(
            statistic['leads_converted'] / statistic['leads_taken'] * 100, 2)
    except ArithmeticError:
        conversion_rate = 0
        
    statistic['conversion_rate'] = conversion_rate

    return [{
        'name': ' '.join(key.split('_')).capitalize(),
        'value':value
    }
    for key, value in statistic.items()] 


def get_filter_report(broker, params):
    filt = {}

    if params.get('broker_id'):
        filt['id']=params.get('broker_id')

    if params.get('company_id'):
        filt['company_id']=params.get('company_id')

    if any((params.get('month'), params.get('year'))):
        if params.get('month'):
            filt['deals__create_date__month'] = params.get('month')
        if params.get('year'):
            filt['deals__create_date__year'] = params.get('year')
    else:
        if params.get('start'):
            filt['deals__create_date__gte'] = dt.parse(params.get('start'))
        if params.get('end'):
            filt['deals__create_date__lte'] = dt.parse(params.get('end'))

    if not broker.is_admin:
        filt['id']=broker.id

    return filt


def get_report(broker, params):
    filt = get_filter_report(broker, params)

    report_1 = models.User.objects.filter(**filt).annotate(
        leads_purchased=Count('deals'),
        leads_converted=Count('pk', filter=Q(
            deals__status__status_type__contains=str(
                core_models.Status.LEADS_COVERTED
            )
        )),
        date=Max('deals__create_date')
    ).values(
        'id', 'leads_purchased', 'leads_converted', 
        'first_name', 'last_name', 'date'
    )

    for obj in report_1:            
        obj['conversion'] = round(
            obj.get('leads_converted') / obj.get('leads_purchased') * 100 
            if obj.get('leads_purchased') else 0, 
            2
        )
        obj['broker'] = f"{obj.get('first_name')} {obj.get('last_name')}"

        l = ["first_name", "last_name"]
        list(map(obj.__delitem__, filter(obj.__contains__, l)))

    return report_1


def export_in_pdf(df: DataFrame) -> bytes:
    buffer = BytesIO()

    elements = []
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(buffer)
    elements.append(Paragraph("Report", styles['Title']))

    lista = [df.columns[:,].values.astype(str).tolist()] + df.values.tolist()

    ts = [('ALIGN', (1,1), (-1,-1), 'CENTER'),
        ('LINEABOVE', (0,0), (-1,0), 1, colors.purple),
        ('LINEBELOW', (0,0), (-1,0), 1, colors.purple),
        ('FONT', (0,0), (-1,0), 'Times-Bold'),
        ('LINEABOVE', (0,-1), (-1,-1), 1, colors.purple),
        ('LINEBELOW', (0,-1), (-1,-1), 0.5, colors.purple, 1, None, None, 4,1),
    ]

    table = Table(lista, style=ts)
    elements.append(table)

    doc.build(elements)

    pdf = buffer.getvalue()
    buffer.close()

    return pdf


def export_in_xlsx(df: DataFrame) -> bytes:
    buffer = BytesIO()
    writer = pd.ExcelWriter(buffer, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='Sheet1')
    writer.save()
    return buffer.getvalue()