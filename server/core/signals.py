from django.db.models.signals import post_save
from .models import Deal, HistoryDeal

def updateHistoryDeal(sender, instance, created, **kwargs):
    historyDeal = HistoryDeal(
        deal=instance,
        status=instance.status,
        note=instance.note
    )
    historyDeal.save()
    historyDeal.product.add(*instance.products.all())
    
post_save.connect(updateHistoryDeal, sender=Deal, dispatch_uid="updateHistoryDeal")