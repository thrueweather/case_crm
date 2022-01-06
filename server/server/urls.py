from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers

from accounts import views as account_views
from core import views as core_views

router = routers.DefaultRouter()
router.register(r"users", account_views.UserViewSet, basename="users")
router.register(r"brokers", account_views.BrokerViewSet, basename="brokers")
router.register(r"companies", account_views.CompanyViewSet, basename="companies")
router.register(r"leads", core_views.LeadViewSet, basename="leads")
router.register(r"deals", core_views.DealViewSet, basename="deals")
router.register(r"status", core_views.StatusViewSet, basename="status")
router.register(r"lenders", core_views.LenderViewSet, basename="lenders")
router.register(r"product-form", core_views.Product, basename="product-form")
router.register(r"notification", core_views.Notification, basename="notification")
router.register(r"tasks", core_views.TaskViewSet, basename="tasks")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('api/', include(router.urls)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)