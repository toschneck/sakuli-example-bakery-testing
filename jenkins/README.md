# Notes for build up docker-based Jenkins environment

## Build / Start / Shutdown

### automatic environment deployment

    ./deploy_jenkins.sh
   
The automatic environment deploy script will do the following steps:
1) stop and remove all running containers
2) rebuild all containers
3) start the new containers

### manual environment deployment

    docker-compose build
    docker-compose up

(use for updates) shutdown and remove all started jenkins containers
    
    docker-compose stop
    docker-compose rm
   
# Clean up temporary data

__(optional)__ remove all _temporary data_ as logs and so on

    ./rm_temp_conf_files.sh 
    
# Server / Nodes
  
* Jenkins Build Server:  [localhost:8080](http://localhost:8080)


## ssh-key handling

    master -> ssh -> slave
    .ssh/id_rsa (pk)   ./ssh/authorized_hosts <-id_rsa.pub

certificate private key `id_rsa` have to be the user rights `chmod 600` (rw for owner, nothing for group and others)

# Known Problem and Issues

### jenkins_conf user rights
Be aware that the jenkinsmaster image will create some stuff under the `jenkins_conf` path with the user id `1000` and 
have to be able to rw on this directory. If the rights are not matching, you can modify the local user id with:
`usermod -u 1000 <user_name>`

* other solution is to give all users access, but __ATTENTION ALL USERS!__: `chmod -R a+rw jenkins_conf` 

  

### SSH-Key permissions
If an repository is setup from scratch, it could be possible, that the permission of the files in `jenkins_conf/.ssh` 
are not set correctly. Maybe you have to change the ownership and the permissions like follow

    chmod 600 labs-build/jenkins_conf/.ssh/*
    chown build:build -hR labs-build
