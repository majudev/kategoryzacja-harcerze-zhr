#!/bin/bash
TAG="v1.4"

if [[ "$1" != "" ]]; then
	TAG="$1"
fi

set -e

cd backend
sudo docker build -t michalmajzhr/kategoryzacja-harcerze-zhr-backend:$TAG .
sudo docker build -t michalmajzhr/kategoryzacja-harcerze-zhr-cron:$TAG . -f Dockerfile.cron
cd ../frontend
sudo docker build -t michalmajzhr/kategoryzacja-harcerze-zhr-frontend:$TAG .
cd ../nginx
sudo docker build -t michalmajzhr/kategoryzacja-harcerze-zhr-nginx:$TAG .
cd ..

sudo docker push michalmajzhr/kategoryzacja-harcerze-zhr-backend:$TAG
sudo docker push michalmajzhr/kategoryzacja-harcerze-zhr-frontend:$TAG
sudo docker push michalmajzhr/kategoryzacja-harcerze-zhr-nginx:$TAG
sudo docker push michalmajzhr/kategoryzacja-harcerze-zhr-cron:$TAG
