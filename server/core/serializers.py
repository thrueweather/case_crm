from os import POSIX_FADV_NOREUSE
import re

from rest_framework import serializers

from core import models 


class CustomerSerializer(serializers.ModelSerializer):
    gender = serializers.SerializerMethodField()
    post_code = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = models.Customer
        fields = "__all__"

    def get_gender(self, obj):
        return obj.get_gender_display()

    def get_post_code(self, obj):
        return obj.address.post_code if obj.address else ''

    def get_address(self, obj):
        return obj.address.address if obj.address else ''


class LeadSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = models.Lead
        fields = "__all__"


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Status

        exclude = ("status_type", )


class lenderMortgageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lender
        fields = ("id", "name", )


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Provider
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    provider = ProviderSerializer()
    class Meta:
        model = models.Product
        fields = (
            "id", 
            "name", 
            "provider",
        )


class ProviderDetailSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)
    class Meta:
        model = models.Provider
        fields = "__all__"


class LenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lender
        fields = "__all__"


class DealProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    product_type = serializers.SerializerMethodField()
    lender = LenderSerializer()

    class Meta:
        model = models.DealProduct
        fields = "__all__"

    def get_product_type(self, obj):
        return obj.get_product_type_display().lower()
        

class HistoryDealSerializer(serializers.ModelSerializer):
    status = StatusSerializer()

    class Meta:
        model = models.HistoryDeal

        exclude = ("product", )       


class NoteSerializer(serializers.ModelSerializer):
    status = StatusSerializer()
    
    class Meta:
        model = models.Note
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Task
        fields = "__all__"


class DealSerializer(serializers.ModelSerializer):
    status = StatusSerializer()
    products = DealProductSerializer(many=True)
    lead = LeadSerializer()
    notes = NoteSerializer(many=True)
    history = HistoryDealSerializer(many=True)
    tasks = TaskSerializer(many=True)
    isnote = serializers.SerializerMethodField()

    class Meta:
        model = models.Deal
        fields = "__all__"
    
    def get_isnote(self, obj):
        return obj.history.filter(
            note__isnull=False
        ).exclude(note__exact='').exists()


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Task
        fields = "__all__"

        
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Task
        fields = "__all__"