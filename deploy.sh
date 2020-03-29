#!/bin/sh
# README: ./deploy.sh <service>

REPO=569663662309.dkr.ecr.ap-southeast-1.amazonaws.com \
    && aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $REPO \
    && docker-compose -f docker-compose.yml -f production.yml build --no-cache $1 \
    && docker tag happynanny_$1:latest $REPO/happynanny_$1:latest && docker push $REPO/happynanny_$1:latest \
    && aws ecs update-service --force-new-deployment --service happynanny-service --cluster happynanny-cluster
