import os
import time
from selenium import webdriver
from unittest import TestCase


class TestHomePage(TestCase):
    def setUp(self):
        chromedriver = './chromedriver'
        self.driver = webdriver.Chrome(chromedriver)

    def shutDown(self):
        self.driver.quit()

    def test_typing_literally_anything_shows_warning(self):
        self.driver.get('http://localhost:3000')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('anyWarning'))

        x = self.driver.find_element_by_id('x')
        x.send_keys('anything')

        self.assertIsNotNone(self.driver.find_element_by_id('anyWarning'))
        self.driver.close()

    def test_typing_duplicate_entries_shows_warning(self):
        self.driver.get('http://localhost:3000')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('anyWarning'))

        x = self.driver.find_element_by_id('x')
        z = self.driver.find_element_by_id('z')
        s = self.driver.find_element_by_id('submitButton')
        
        x.send_keys('python')
        z.send_keys('python')
        s.click()

        self.assertIsNotNone(self.driver.find_element_by_id('invalidWarning'))
        self.driver.close()

    def test_typing_nothing_shows_warning(self):
        self.driver.get('http://localhost:3000')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('invalidWarning'))

        x = self.driver.find_element_by_id('submitButton')
        x.click()

        self.assertIsNotNone(self.driver.find_element_by_id('invalidWarning'))
        self.driver.close()
    
    def test_proper_entries_work(self):
        self.driver.get('http://localhost:3000')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('anyWarning'))

        x = self.driver.find_element_by_id('x')
        y = self.driver.find_element_by_id('y')
        z = self.driver.find_element_by_id('z')
        s = self.driver.find_element_by_id('submitButton')
        
        x.send_keys('Ruby')
        y.send_keys('.get()')
        z.send_keys('Python')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('anyWarning'))
            self.assertIsNone(self.driver.find_element_by_id('invalidWarning'))

        s.click()

        self.assertEqual(self.driver.current_url, 'http://localhost:3000/search?x=Ruby&y=.get()&z=Python')
        self.driver.close()