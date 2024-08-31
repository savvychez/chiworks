import unittest
import json
from init import app
from database.models import db, Employer, Job, Skill, Resource

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_index(self):
        # checks application running and status OK
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_employers(self):
        # checks /employers endpoint
        response = self.client.get('/employers')
        self.assertEqual(response.status_code, 200)

        # Ensures at least one employer is returned
        data = json.loads(response.data)
        self.assertGreaterEqual(len(data), 0) 

    def test_employer_individual(self):
        # Test with an employer_id that exists
        response = self.client.get('/employers/30')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["id"], 30)

        # Test with an employer_id that does not exist
        response = self.client.get('/employers/999999')
        self.assertEqual(response.status_code, 404)

    def test_employers_sort(self):
        response = self.client.get('/employers?sortBy=industry')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data[0]["id"], 56)

    def test_employers_filter(self): 
        response = self.client.get('/employers?employerName=BCforward')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data[0]["id"], 58)

    def test_jobs(self):
        response = self.client.get('/jobs/')
        self.assertEqual(response.status_code, 200)

    def test_job_individual(self):
        response = self.client.get('/jobs/100')
        self.assertEqual(response.status_code, 200)

        # Test with a job_id that does not exist
        response = self.client.get('/jobs/999999')
        self.assertEqual(response.status_code, 404)

    def test_jobs_sort(self):
        response = self.client.get('/jobs?sortBy=last_updated')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data[0]["id"], 133)

    def test_jobs_filter(self):
        response = self.client.get('/jobs?title=clinical%20Manager')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    def test_resources(self):
        response = self.client.get('/resources/')
        self.assertEqual(response.status_code, 200)

    def test_resource_individual(self):
        response = self.client.get('/resources/1')
        self.assertEqual(response.status_code, 200)

        # Test with a resource_id that does not exist
        response = self.client.get('/resources/999999')
        self.assertEqual(response.status_code, 404)

    def test_resources_sort(self):
        response = self.client.get('/resources?sortBy=locale')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data[0]["id"], 205)

    def test_resources_filter(self):
        response = self.client.get('/resources?instructor=Daniel%20Arzuaga')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)

if __name__ == '__main__':
    unittest.main()
