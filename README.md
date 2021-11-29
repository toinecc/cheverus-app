# :beers: :dart: Dart Devil App :dart: :beers:

## Overview

A from scratch project, co-developed by a Cheverus flat roomates in Bordeaux.

Initially named "Cheverus App", Dart Devil is an online web application allowing its users to record and analyse their dart games. The first dart game developed is the one called **Killer**.

Technically, has been developed using Python Django Framework (back-end and database management) and React (front-end).

It has been deployed on an AWS micro-instance and is available to the following url: [dartdevil.biz](dartdevil.biz).

## Useful commands

### Git

See current branch

```bash
git branch
```

Change branch

```bash
git checkout mybranch
```

Pull last modifications

```bash
git reset --hard
git pull
```

Putch local modifications

```bash
git add .
git commit -m "my message"
git push
```

### Django

Don't forget to activate your virtual env

```bash
source $PathToYourVEnv/bin/activate
```

Create super user

```bash
python manage.py createsuperuser
```

To run django app:

```bash
python manage.py runserver
```

To update django database, especialy when new django models has been created:

```bash
# Global Django Project
python manage.py makemigrations
python manage.py migrate
# For a particular App
python manage.py makemigrations myapp
python manage.py migrate myapp
```

### Front

Start development server (localhost:3000)

```bash
yarn start
```

Build Front to make it available in production (localhost:8000)

```bash
yarn build
```

To format front code

```bash
yarn format
```

### Docker

TO DOCUMENT

Run dev:

```
docker-compose -f docker-compose.dev.yml up --build
```

```bash
# Go into db
docker-compose -f docker-compose.dev.yml exec db psql --username=cheverus_admin --dbname=cheverus_db
# Migrate db
docker-compose -f docker-compose.dev.yml exec web python manage.py makemigrations --noinput
docker-compose -f docker-compose.dev.yml exec web python manage.py migrate --noinput
```

Run prod:

```
docker-compose -f docker-compose.prod.yml up --build
```

### Gunicorn

TO DO

### Nginx

TO DO

### AWSL

#### Useful commands

Connect to EC2 instance:

```bash
ssh -i dartdevil-micro-01.pem.pem ubuntu@3.141.177.96
```

copy project file to AWS instance

```bash
scp -r $(pwd)/{cheverusapp,nginx,.env.staging,.env.staging.db,.env.staging.proxy-companion,docker-compose.staging.yml} ubuntu@3.141.177.96:/home/ubuntu/cheverusapp
```

#### How to deploy app manually

First make sure that front has been built. Then remove node_modules folder in order to lightened the data transfert to the EC2 instance.

Then transfert project and production files to the instance with :

```bash
scp -r $(pwd)/{cheverusapp,nginx,.env.prod,.env.prod.db,.env.prod.proxy-companion,docker-compose.prod.yml} ubuntu@3.141.177.96:/home/ubuntu/cheverusapp
```

Then back on you instance, launch build and spin up docker containers:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Using django admin, migrate your dockerized db and collect static files:

```
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput
```
