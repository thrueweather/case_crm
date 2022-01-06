from datetime import date
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import (
    BasePermission, SAFE_METHODS, IsAuthenticated, AllowAny
)

from django.shortcuts import get_object_or_404

import core.models as models
import core.queries as queries
import core.tasks as tasks
import core.serializers as serializers
import core.utils as utils

from server.celery import app


class AdminPermssion(BasePermission):    
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_admin:
            return True
        return request.method in SAFE_METHODS


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LeadSerializer
    queryset = models.Lead.objects.filter(purchased=False, active=True)
    http_method_names = ["get", "post", "head", "list"]

    permission_classes_by_action = {
        'create': [AllowAny], 
        'default': [IsAuthenticated]}

    def get_permissions(self):
        try:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            return [
                permission()
                for permission in self.permission_classes_by_action["default"]
            ]


    def create(self, request):
        data = request.data
    
        customer = queries.create_customer(data)
        queries.create_lead(customer, data)

        return Response(status=status.HTTP_200_OK)


    @action(detail=True, methods=["post"])
    def buy(self, request, pk=None):
        broker = request.user
        lead = get_object_or_404(models.Lead, pk=pk)
        deal = queries.create_deal(lead, broker)

        if not deal:
            return Response(
                status=status.HTTP_205_RESET_CONTENT
            )

        customer = lead.customer
        lead_email = customer.email
        full_name = f"{broker.first_name} {broker.last_name}"
        msg = utils.TEMPLATE_MSG_PURCHASE_LEAD.format(
            full_name='{full_name}', lead_name=customer.first_name
        )
        tasks.send_mail.delay(
            'Buy lead',
            msg.format(full_name=full_name),
            'info@expertmortgageadvisor.co.uk',
            lead_email
        )
        
        tasks.send_notification.delay(broker.pk, msg)

        return Response(status=status.HTTP_200_OK)
    

    @action(
        detail=True, 
        methods=["post"], 
        permission_classes=(AdminPermssion,)
    )
    def deactivate(self, request, pk=None):
        lead = get_object_or_404(models.Lead, pk=pk)
        lead.active = not lead.active
        lead.save()
        return Response(status=status.HTTP_200_OK)


class DealViewSet(viewsets.ViewSet):

    def get_permissions(self):
        if self.action == 'destroy':
            return [AdminPermssion()]
        else:
            return super(DealViewSet, self).get_permissions()
 

    def list(self, request):
        broker = request.user
        params = request.query_params

        dealQuerySet = queries.get_deals(
            broker.id, broker.is_admin, params
        )
        serializer = serializers.DealSerializer(dealQuerySet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


    def retrieve(self, request, pk=None):
        deal = get_object_or_404(models.Deal, pk=pk)
        serializer = serializers.DealSerializer(deal)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def destroy(self, request, pk=None):
        deal = get_object_or_404(models.Deal, pk=pk)
        lead = deal.lead
        lead.purchased = False
        lead.save()
        deal.delete()

        msg = utils.TEMPLATE_MSG_REMOVE_DEAL.format(
            full_name='{full_name}', lead_pk=lead.id
        )
        tasks.send_notification.delay(request.user.id, msg)
        return Response({"success": True}, status=status.HTTP_200_OK)


    def create(self, request):
        data = request.data
        broker = request.user

        customer = queries.update_or_create_customer(data)
        lead = queries.create_lead(customer, data, converted=True)
        deal = queries.create_deal(lead, broker)

        serializer = serializers.DealSerializer(deal)

        customer = lead.customer
        lead_email = customer.email
        full_name = f"{broker.first_name} {broker.last_name}"
        msg = utils.TEMPLATE_MSG_PURCHASE_LEAD.format(
            full_name='{full_name}', lead_name=customer.first_name
        )
        tasks.send_mail.delay(
            'Buy lead',
            msg.format(full_name=full_name),
            'info@expertmortgageadvisor.co.uk',
            lead_email
        )

        tasks.send_notification.delay(broker.pk, msg)

        return Response(
            serializer.data, status=status.HTTP_200_OK
        )


    def update(self, request, pk=None):
        data = request.data
        deal = queries.update_deal(pk, data)
        serializer = serializers.DealSerializer(deal)

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get", "post"])
    def status(self, request, pk=None):
        deal = get_object_or_404(models.Deal, pk=pk)

        if request.method == 'GET':
            serializer = serializers.StatusSerializer(deal.status)

        elif request.method == 'POST':
            data = request.data
            status_id = data['status_id']
            status_obj = queries.add_status_to_deal(
                deal, data['status_id'], data['message']
            )
            
            broker = request.user
            msg = utils.TEMPLATE_MSG_ADD_NEW_STATUS.format(
                full_name='{full_name}', deal_pk=pk, status_name=status_obj.name
            )
            tasks.send_notification.delay(
                broker.pk, msg, status_id, pk
            )
            utils.process_status(pk, status_id, data.get('value'))

            return Response(status=status.HTTP_200_OK)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=["get", "post"])
    def product(self, request, pk=None):
        if request.method == 'GET':
            deal = get_object_or_404(models.Deal, pk=pk)
            serializer = serializers.ProductSerializer(deal.product, many=True)

        elif request.method == 'POST':
            data = request.data
            deal = get_object_or_404(models.Deal, pk=pk)
            product = queries.add_product_to_deal(deal, data)
            serializer = serializers.DealProductSerializer(product)

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get", "post", "put"])
    def notes(self, request, pk=None):
        deal = get_object_or_404(models.Deal, pk=pk)

        if request.method == 'GET':
            serializer = serializers.NoteSerializer(deal.notes, many=True)

        elif request.method == 'POST':
            note = request.data["notes"]
            history_pk = request.data["history_pk"]
            history_obj = queries.add_note_to_status(history_pk, note)
            serializer = serializers.HistoryDealSerializer(history_obj)

        elif request.method == 'PUT':
            notes = request.data.values()
            history_obj = queries.update_notes(notes)
            serializer = serializers.HistoryDealSerializer(
                history_obj, many=True
            )

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get", "post"])
    def tasks(self, request, pk=None):
        deal = get_object_or_404(models.Deal, pk=pk)

        if request.method == 'GET':
            serializer = serializers.TaskSerializer(
                deal.tasks, many=True
            )
        elif request.method == 'POST':
            broker = request.user
            message = request.data["message"]
            due_date = request.data["date"]
            note = request.data.get("note", '')

            queries.create_task(
                broker.pk, pk, message, due_date, note
            )

            return Response(status=status.HTTP_200_OK)

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(
        detail=True, 
        methods=["delete"], 
        url_path=r"history/(?P<history_pk>\d+)")
    def history(self, request, pk=None, history_pk=None):
        if request.method == 'DELETE': 
            queries.delete_history(history_pk)
        return Response({"success": True}, status=status.HTTP_200_OK)


class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StatusSerializer
    queryset = models.Status.objects.all()
    http_method_names = ["get"]


class LenderViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LenderSerializer
    queryset = models.Lender.objects.all()
    http_method_names = ["get"]


class Product(viewsets.ViewSet):
    def list(self, request):        
        lender = models.Lender.objects.all()
        lenderSerializer = serializers.LenderSerializer(
            lender, many=True
        )

        provider = models.Provider.objects.all()
        providerSerializer = serializers.ProviderDetailSerializer(
            provider, many=True
        )
        
        data = {
            "insurance": providerSerializer.data,
            "mortgage": lenderSerializer.data
        }

        return Response(data, status=status.HTTP_200_OK)


class Notification(viewsets.ViewSet):
    def list(self, request):
        params = request.query_params
        user = request.user

        notifications = queries.get_notification(
            user.is_admin, user.id, params
        )
        notifications = utils.change_msg_current_user(
            user.id, user.is_admin, notifications
        )
        
        return Response(
            sorted(
                notifications, 
                key = lambda i: i['create_date'], 
                reverse=True
            ), status=status.HTTP_200_OK)


    @action(detail=False, methods=["post"])
    def delete(self, request):
        notification_ids = request.data.get('notification_ids', [])
        queries.delete_notification(notification_ids)
        return Response({"success": True}, status=status.HTTP_200_OK)


    @action(detail=False, methods=["post"])
    def mark(self, request):
        notification_ids = request.data.get('notification_ids', [])
        queries.mark_notification(request.user.id, notification_ids, True)
        return Response({"success": True}, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["post"])
    def unmark(self, request):
        notification_ids = request.data.get('notification_ids', [])         
        queries.mark_notification(request.user.id, notification_ids, False)
        return Response({"success": True}, status=status.HTTP_200_OK)


class TaskViewSet(viewsets.ViewSet):
    def list(self, request):
        params = request.query_params
        tasks = queries.get_tasks(request.user.id, params)

        serializer = serializers.TaskSerializer(tasks, many=True)
        return Response(
            serializer.data, status=status.HTTP_200_OK
        )

    def update(self, request, pk=None):
        task = get_object_or_404(models.Task, pk=pk)

        data = request.data

        task.message = data.get("message", '')
        task.note = data.get("note", '')
        if data.get("date"):
            task.due_date = data.get("date")

        task.notified=False

        task.save()

        tasks.check_tasks.delay()

        return Response(
            task.message, status=status.HTTP_200_OK
        )

    def retrieve(self, request, pk=None):
        task = get_object_or_404(models.Task, pk=pk)
        serializer = serializers.TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        task = get_object_or_404(models.Task, pk=pk)
        
        task.delete()
        return Response(
            {"success": True}, status=status.HTTP_200_OK
        )