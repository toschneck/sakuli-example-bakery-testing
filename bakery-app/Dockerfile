FROM jolokia/java-jolokia:7

#ARG NEXUS_URL='nexus-openshift-day-dev.192.168.99.100.nip.io'
ARG NEXUS_URL=nexus
ARG VERS='1.0'

ENV VERS=${VERS}
ADD http://${NEXUS_URL}/nexus/service/local/repositories/releases/content/com/consol/demo/bakery/bakery-worker/${VERS}/bakery-worker-${VERS}.jar /maven/
RUN chmod -R -v a+rw /maven && find /maven -type d -exec chmod -v a+x {} +

CMD java -jar /maven/bakery-worker-${VERS}.jar