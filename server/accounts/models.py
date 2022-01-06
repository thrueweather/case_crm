
from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager

class Company(models.Model):
    name = models.CharField(max_length=75)

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=75, blank=True)
    last_name = models.CharField(max_length=75, blank=True)
    company = models.ForeignKey("accounts.Company", 
        on_delete=models.SET_NULL, null=True
    )
    owner = models.BooleanField(default=False)
    
    is_token_paying_broker = models.BooleanField(default=False)
    email = models.EmailField(_("email address"), unique=True)
    
    is_active = models.BooleanField(_("active"), default=True)
    is_staff = models.BooleanField(_("staff"), default=True)
    
    is_admin = models.BooleanField(_("admin"), default=False)

    read_only = models.BooleanField(default=False)

    create_date = models.DateTimeField(_("date joined"), auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)
