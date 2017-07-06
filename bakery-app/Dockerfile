FROM jolokia/java-jolokia:7

#ARG NEXUS_URL='nexus-openshift-day-dev.192.168.99.100.nip.io'
ARG NEXUS_URL=nexus
ARG VERS='1.0'

ADD http://${NEXUS_URL}/nexus/service/local/repositories/releases/content/com/consol/demo/bakery/bakery-worker/${VERS}/bakery-worker-${VERS}.jar /maven/
ENV VERS=${VERS}
CMD java -jar /maven/bakery-worker-${VERS}.jar