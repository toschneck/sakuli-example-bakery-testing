FROM jenkins:2.3
MAINTAINER Tobias Schneck "tobias.schneck@consol.de"
ENV REFRESHED_AT 2016-06-09

USER root
# Let's start with some basic stuff.
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    lxc \
    iptables \
    httping

# Install Docker and docker-compose from Docker Inc. repositories.
RUN curl -sSL https://get.docker.com/ | sh
RUN usermod -aG docker jenkins
RUN curl -L https://github.com/docker/compose/releases/download/1.14.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Install Oracle_JDK 7 & 8
#RUN apt-get -y install software-properties-common
#    && add-apt-repository ppa:webupd8team/java -y \
#    && apt-get -y update
#RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
#RUN apt-get install -y oracle-java8-installer oracle-java8-set-default

#RUN add-apt-repository ppa:andrei-pozolotin/maven3 -y && apt-get update -y && apt-get install -y maven3
RUN apt-get install -y openjdk-7-jdk groovy
RUN curl http://www-eu.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz | tar xvz -C /opt \
    && ln -s /opt/apache-maven-3.3.9/bin/mvn /bin/mvn

# Install the magic wrapper.
#ADD wrapdocker.sh /usr/local/bin/wrapdocker
#RUN chmod +x /usr/local/bin/wrapdocker
#ADD jenkins_conf /var/jenkins_home
#RUN chown -R jenkins /var/jenkins_home


USER jenkins