from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient

from django.core.management import call_command

from core.models import Lead
from accounts.models import User


def create_lead(client, uniq_id):
    lead = {
            'name': f'test{uniq_id}', 
            'email': f'test{uniq_id}@test.com', 
            'address': f'test street #{uniq_id}', 
            'mobile_phone': '+380681111111', 
            'property_amount': f'{uniq_id}', 
            'mortgage_amount': f'{uniq_id}', 
            'message': f'{uniq_id}', 
        }
    return client.post('/api/leads/', lead)


class CreateLeadTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()

    def test_create_lead(self):
        for i in range(1, 21):
            response = create_lead(self.client, i)
            self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetAllLeadTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.uri = '/api/leads/'

        for i in range(1, 21):
            create_lead(self.client, i)

        # create test
        self.test_email = "test@test.com"
        self.test_password = "passwordtest"

        User.objects.create_user(
            email=self.test_email, password=self.test_password, is_admin=True
        )

        # test login
        self.client.login(
            email=self.test_email, password=self.test_password
        )

    def test_get_all_leads(self):
        response = self.client.get(self.uri, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 20)


class DeactivateLeadTest(APITestCase):
    def setUp(self):
        self.uri = '/api/leads/{id}/deactivate/'
        self.client = APIClient()
        
        for i in range(1, 21):
            create_lead(self.client, i)

        # create admin
        self.broker_email = "admin@admin.com"
        self.broker_password = "passwordadmin"

        User.objects.create_user(
            email=self.broker_email, password=self.broker_password, is_admin=True
        )

        # admin login
        self.client.login(
            email=self.broker_email, password=self.broker_password
        )

    def test_deactivate_lead(self):
        lead_ids = Lead.objects.all().values_list('id', flat=True)
        for id in lead_ids:
            response = self.client.post(self.uri.format(id=id))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_deactivate_invalid_lead(self):
        response = self.client.post(self.uri.format(id=1000))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class BuyLeadTest(APITestCase):
    def setUp(self):
        # self.client = APIClient()
        self.uri = '/api/leads/{id}/buy/'
        call_command('loaddata', 'status.json', verbosity=0)

        for i in range(1, 21):
            create_lead(self.client, i)

        # create user
        self.broker_email = "test@test.com"
        self.broker_password = "passwordtest"

        User.objects.create_user(
            email=self.broker_email, password=self.broker_password
        )

        # broker login
        self.client.login(
            email=self.broker_email, password=self.broker_password
        )

    def test_buy_lead(self):
        lead_ids = Lead.objects.all().values_list('id', flat=True)
        for id in list(lead_ids):
            response = self.client.post(self.uri.format(id=id))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_buy_invalid_lead(self):
        response = self.client.post(self.uri.format(id=1000))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)