from datetime import datetime, date, timedelta

from django.db import models

from multiselectfield import MultiSelectField


class TimeStampMixin(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Address(TimeStampMixin):
    address = models.CharField(max_length=254, blank=True)
    address2 = models.CharField(max_length=254, blank=True)
    town = models.CharField(max_length=254, blank=True)
    country = models.CharField(max_length=254, blank=True)
    post_code = models.CharField(max_length=254, blank=True)


class Customer(TimeStampMixin):
    GENDER = [
        (1, "male"),
        (2, "female"),
    ]

    first_name = models.CharField(max_length=75)
    last_name = models.CharField(max_length=75)
    email = models.EmailField(max_length=254, unique=True)
    address = models.ForeignKey(
        "core.Address", on_delete=models.SET_NULL, null=True
    )
    mobile_phone = models.CharField(max_length=15)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    gender = models.PositiveSmallIntegerField(
        choices=GENDER, null=True, blank=True
    )

    def __str__(self):
        return self.email


class Lead(TimeStampMixin):
    customer = models.ForeignKey(
        "core.Customer", on_delete=models.CASCADE, related_name="lead"
    )
    property_amount = models.FloatField(blank=True, null=True)
    mortgage_amount = models.FloatField(blank=True, null=True)
    message = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    converted = models.BooleanField(default=False)
    purchased = models.BooleanField(default=False)


class Deal(TimeStampMixin):
    lead = models.OneToOneField(
        "core.Lead", on_delete=models.CASCADE, related_name="deal"
    )
    status = models.ForeignKey(
        "core.Status", on_delete=models.CASCADE, related_name="status"
    )
    status_from = models.DateTimeField(blank=True, null=True)
    broker = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="deals"
    )
    note = models.TextField(null=True)
    completed = models.BooleanField(default=False)
    active = models.BooleanField(default=True) 


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__status = self.status

    def save(self, *args, **kwargs):
        if self.status != self.__status:
            self.status_from = datetime.now()
        super().save(*args, **kwargs)  


class DealProduct(TimeStampMixin):
    INSURANCE = 1
    MORTGAGE = 2

    PRODUCT_TYPE = [
        (INSURANCE, "Insurance"),
        (MORTGAGE, "Mortgage"),
    ]
    product_type = models.PositiveSmallIntegerField(
        choices=PRODUCT_TYPE, null=True
    )
    lender = models.ForeignKey(
        "core.Lender", on_delete=models.SET_NULL, null=True, blank=True
    )
    product = models.ForeignKey(
        "core.Product", on_delete=models.SET_NULL, null=True, blank=True
    )
    deal = models.ForeignKey(
        "core.Deal", on_delete=models.CASCADE, related_name="products"
    )
    expiry_date = models.DateTimeField(null=True, blank=True)
    application_fee = models.FloatField()
    case_value_pending = models.FloatField()
    case_value_received = models.FloatField()
    gross_total_pending = models.FloatField()
    gross_total_received = models.FloatField()
    offer_completion_fee = models.FloatField()
    proc_fee = models.FloatField()

    received_application_fee = models.BooleanField(default=False)
    received_offer_completion_fee = models.BooleanField(default=False)
    received_proc_fee = models.BooleanField(default=False)

    message = models.TextField(blank=True)


class Note(TimeStampMixin):
    deal = models.ForeignKey("core.Deal", on_delete=models.CASCADE, related_name="notes")
    status = models.ForeignKey("core.Status", on_delete=models.SET_NULL, null=True)
    note = models.TextField()


class Status(models.Model):
    name = models.CharField(max_length=75, unique=True)

    LEADS_COVERTED = 1
    NOT_PROCEEDING = 2
    PENDING_CASSES = 3
    REFFERRALS_TO_3RD_PARTY = 4
    COMPlETED_MORTGAGES = 5
    INSURANCED_POLICIES_SOLD = 6

    STATUS_TYPE = (
        (LEADS_COVERTED, "Leads Converted"),
        (NOT_PROCEEDING, "Not Proceeding"),
        (PENDING_CASSES, "Pending Cases"),
        (REFFERRALS_TO_3RD_PARTY, "Referrals to 3rd Party"),
        (COMPlETED_MORTGAGES, "Completed Mortgages"),
        (INSURANCED_POLICIES_SOLD, "Insurance Policies Sold"),
    )

    status_type = MultiSelectField(
        choices=STATUS_TYPE, null=True, blank=True
    )

    def __str__(self):
        return self.name


class Lender(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Provider(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(TimeStampMixin):
    name = models.CharField(max_length=100, blank=True)
    provider = models.ForeignKey(
        "core.Provider", on_delete=models.CASCADE, related_name="products"
    )


class HistoryDeal(models.Model):
    deal = models.ForeignKey(
        "core.Deal", on_delete=models.CASCADE, related_name="history"
    )
    status = models.ForeignKey(
        "core.Status", on_delete=models.CASCADE
    )
    note = models.TextField(null=True)
    product = models.ManyToManyField("core.DealProduct", blank=True)
    create_date = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    broker = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="notification"
    )
    status = models.ForeignKey(
        "core.Status", on_delete=models.SET_NULL, null=True, blank=True
    )
    deal = models.ForeignKey(
        "core.Deal", on_delete=models.SET_NULL, null=True, blank=True
    )
    personal = models.BooleanField(default=False)
    message = models.CharField(max_length=255)
    readed = models.ManyToManyField(
        "accounts.User", blank=True, related_name="notifications"
    )
    create_date = models.DateTimeField(auto_now_add=True)


class Task(models.Model):
    broker = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="tasks"
    )
    deal = models.ForeignKey(
        "core.Deal", on_delete=models.CASCADE, related_name="tasks"
    )
    message = models.TextField(blank=True)  
    note = models.TextField(blank=True)
    due_date = models.DateTimeField()

    notified = models.BooleanField(default=False)

    TODO = 1
    DONE = 2
    TASK_STATUS = (
        (TODO, "to do"),
        (DONE, "done"),
    )
    status = models.PositiveSmallIntegerField(
        choices=TASK_STATUS, null=True, blank=True
    )
    

    def save(self, *args, **kwargs):
        due_date = self.due_date

        if type(due_date) == str:
            due_date = datetime.strptime(
                due_date, '%Y-%m-%dT%H:%M:%S.%fZ'
            )
        
        if due_date.date() < date.today() -  timedelta(days=1):
            self.status = self.DONE
        else:
            self.status = self.TODO
        super().save(*args, **kwargs)  
    