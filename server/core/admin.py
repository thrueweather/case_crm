from django.contrib import admin

from core import models 


class LeadInline(admin.TabularInline):
    model = models.Lead
    extra = 1

@admin.register(models.Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "get_customer__email",
        "mortgage_amount",
        "create_date",
        "update_date",
        "active",
        "converted",
    )

    def get_customer__email(self, obj):
        return obj.customer.email
    get_customer__email.short_description = 'Customer Email'


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "email",
    )
    inlines = (LeadInline,)


class NoteInline(admin.TabularInline):
    model = models.Note
    extra = 1


class HistoryDealInline(admin.TabularInline):
    model = models.HistoryDeal
    extra = 1


class DealProductDealInline(admin.TabularInline):
    model = models.DealProduct
    extra = 1
    
    
@admin.register(models.Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = (
        "lead",
        "status",
        "broker",
    )
    inlines = (
        DealProductDealInline, 
        NoteInline, 
        HistoryDealInline, 
    )


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )


@admin.register(models.HistoryDeal)
class HistoryDealAdmin(admin.ModelAdmin):
    list_display = (
        "deal",
        "status",
        "create_date",
    )


@admin.register(models.Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "broker",
        "message",
        "deal",
        "create_date",
    )


@admin.register(models.Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "get_status_type_display",
    )


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "broker",
        "deal",
        "message",
        "due_date",
    )


admin.site.register(models.Address)
admin.site.register(models.DealProduct)
admin.site.register(models.Lender)
admin.site.register(models.Provider)