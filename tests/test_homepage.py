import os
import time
from selenium import webdriver
from unittest import TestCase


class TestHomePage(TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome('./chromedriver')

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

    def test_typing_nothing_shows_warning(self):
        self.driver.get('http://localhost:3000')

        with self.assertRaises(Exception) as cm:
            self.assertIsNone(self.driver.find_element_by_id('invalidWarning'))

        x = self.driver.find_element_by_id('submitButton')
        x.click()

        self.assertIsNotNone(self.driver.find_element_by_id('invalidWarning'))
        self.driver.close()