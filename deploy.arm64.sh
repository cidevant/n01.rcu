#!/usr/bin/env bash

# build image on local machine
docker rmi registry.docker.devant.cz/arm64/n01rcu:latest
docker build -t registry.docker.devant.cz/arm64/n01rcu:latest --platform linux/arm64 .
docker push registry.docker.devant.cz/arm64/n01rcu:latest

# upload docker-compose
scp ./docker-compose.arm64.prod.yml nemo@devant.cz:/var/www/n01.devant.cz/docker-compose.yml

# update image from repository on target machine and start docker composer
ssh nemo@devant.cz 'cd /var/www/n01.devant.cz && sudo docker pull registry.docker.devant.cz/arm64/n01rcu:latest && sudo docker compose up -d'
