FROM openshift/jenkins-slave-maven-centos7
USER 0
COPY . /maven
ENV _JAVA_OPTIONS='-Duser.home=/home/jenkins'
RUN bash -c 'mvn -f /maven/worker/pom.xml package'

FROM jolokia/java-jolokia:7

COPY --from=0 /maven/worker/target/worker.jar /maven/
CMD java -jar /maven/worker.jar