FROM python:3.10

WORKDIR GantBackend/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

COPY . .

RUN pip install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py migrate
RUN python manage.py createsuperuser --username=admin --email=admin@example.com --password=admin


CMD python manage.py runserver 0.0.0.0:10000
