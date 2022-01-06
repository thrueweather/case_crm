import json

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient

from django.core.management import call_command

from core.models import Deal
from accounts.models import User


class GetDealTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.uri = '/api/deals/'

        call_command(
            'loaddata', 'company.json', 
            'status.json', 'core/tests/DealAPI/deal.json',
            verbosity=0
        )

        
    def test_get_deal_broker(self):
        
        for broker in User.objects.all():
            # broker login
            self.client.login(
                email=broker.email, password="qweqweqwe"
            ) 
            response = self.client.get(self.uri, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            for deal in response.data:
                self.assertEqual(deal.get('id'), broker.id)
                

    def test_get_deal_admin(self):
        self.admin_email = "admin@admin.com"
        self.admin_password = "passwordadmin"

        # create admin
        User.objects.create_user(
            email=self.admin_email, 
            password=self.admin_password, is_admin=True
        )

        # admin login
        self.client.login(
            email=self.admin_email, password=self.admin_password
        )

        response = self.client.get(self.uri, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Deal.objects.count())


DEAL_DATA = {
    'first_name': 'test', 
    'last_name': 'test', 
    'email': 'test@test.com', 
    'address': 'test street', 
    'post_code': 'B236GJ', 
    'age': '2', 
    'gender': 1, 
    'mobile_phone': '+447581433281', 
    'property_amount': '21', 
    'mortgage_amount': '21', 
    'message': 'test note'
} 

class CreateUpdateDeal(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.uri = '/api/deals/'

        self.broker_email = "ami.harris@expertmortgageadvisor.com"
        self.broker_password = "qweqweqwe"

        call_command('loaddata', 'company.json', verbosity=0)
        call_command('loaddata', 'broker.json', verbosity=0)
        call_command('loaddata', 'status.json', verbosity=0)

        self.client.login(
            email=self.broker_email, 
            password=self.broker_password
        )


    def test_create_deal(self):
        response = self.client.post(
            self.uri, json.dumps(DEAL_DATA), content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        return response.data.get('id')


    def test_update_deal(self):
        deal_id = self.test_create_deal()

        DEAL_DATA['first_name'] = 'test2'

        response = self.client.put(
            f'{self.uri}{deal_id}/', 
            DEAL_DATA
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['lead']['customer']['first_name'], 'test2'
        )

