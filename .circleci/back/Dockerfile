# FROM tiangolo/meinheld-gunicorn-flask:python3.7
FROM tiangolo/uwsgi-nginx-flask:python3.8

WORKDIR /app

COPY . /app/
COPY requirements.txt /app/

RUN pip3 install -r requirements.txt
RUN apt-get update && apt-get install vim -y
RUN echo 'Europe/Moscow' > /etc/timezone