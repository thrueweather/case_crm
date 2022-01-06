from django.http import HttpResponse

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

import pandas as pd

from .models import User, Company
from .serializers import UserSerializer, CompanySerializer, BrokerSerializer
from .utils import get_statistic, get_report, export_in_pdf, export_in_xlsx


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        user = get_object_or_404(User, pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path='me/statistic')
    def statistic(self, request):
        statistic = get_statistic(request.user)

        return Response(statistic, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path='me/report')
    def report(self, request):
        params = request.query_params
        report = get_report(request.user, params)
        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path='me/report/export')
    def export_report(self, request):
        params = request.query_params
        report = get_report(request.user, params)

        header = ["Id","Leads Pruchased", "Leads Converted", "Date", "Conversion", "Broker"]

        df = pd.DataFrame.from_dict(report)
        df.columns = header

        # Remove timezone from columns
        df['Date'] = df['Date'].dt.tz_localize(None)

        if params.get("form") == "csv":
            filename = 'report.csv'
            data = df.to_csv(index=False, header=True, columns=header)
            content_type="text/csv"
        elif params.get("form") == "xlsx":
            filename = 'report.xlsx'
            data=export_in_xlsx(df)
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        elif params.get("form") == "pdf":
            filename='report.pdf'
            data = export_in_pdf(df)
            content_type='application/pdf'
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        response = HttpResponse(data, content_type=content_type)
        response['Content-Disposition'] = f"attachment; filename={filename}"
        return response


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    queryset = Company.objects.all()
    http_method_names = ["get"]


class BrokerViewSet(viewsets.ModelViewSet):
    serializer_class = BrokerSerializer
    http_method_names = ["get"]

    def get_queryset(self):
        params = self.request.query_params
        filt = dict()
        if params.get('company'):
            filt['company'] = params.get('company')

        return User.objects.filter(is_admin=False, **filt)
