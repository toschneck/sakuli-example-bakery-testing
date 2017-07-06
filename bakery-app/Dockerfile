FROM jolokia/java-jolokia:7

ARG NEXUS_HOST=nexus
ARG VERS='1.0'

ENV VERS=${VERS}
RUN env
ADD http://${NEXUS_HOST}/nexus/service/local/repositories/releases/content/com/consol/demo/bakery/bakery-worker/${VERS}/bakery-worker-${VERS}.jar /maven/
RUN chmod -R -v a+rw /maven && find /maven -type d -exec chmod -v a+x {} +

CMD java -jar /maven/bakery-worker-${VERS}.jar