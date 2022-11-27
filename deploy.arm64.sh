#!/usr/bin/env bash


echo ''
echo '======== BUILD IMAGE'
docker rmi registry.docker.devant.cz/arm64/n01rcu:latest
docker build -t registry.docker.devant.cz/arm64/n01rcu:latest --platform linux/arm64 .
docker push registry.docker.devant.cz/arm64/n01rcu:latest


echo ''
echo '======== UPDATE DOCKER COMPOSER FILE'
scp ./docker-compose.arm64.prod.yml nemo@devant.cz:/var/www/n01.devant.cz/docker-compose.yml


echo ''
echo '======== UPDATE IMAGE AND RUN DOCKER COMPOSER'
ssh nemo@devant.cz 'cd /var/www/n01.devant.cz && sudo docker pull registry.docker.devant.cz/arm64/n01rcu:latest && sudo docker compose up -d'
