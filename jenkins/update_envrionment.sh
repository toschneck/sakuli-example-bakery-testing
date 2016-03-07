#!/bin/bash
# script to update the hole environment
# !!! requires: running ssh-agent !!!

echo "--> add all modified files to git and commit"
git add --all
git commit  -m "add configration change automatically from $(date +%Y-%m-%d:%H:%M:%S)"

echo "--> pull all changes from repo"
git pull
docker-compose pull

echo "--> rebuild all containers"
docker-compose build

echo "--> stop and remove all running containers"
docker-compose stop
docker-compose rm -f

echo "--> start the new containers"
docker-compose up -d
docker rm  $(docker ps -aq);

echo "--> push the changes to the git repo"
git push