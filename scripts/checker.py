import time
import requests

while True:
     r = requests.get('127.0.0.1/check_movies')
     time.sleep(10)