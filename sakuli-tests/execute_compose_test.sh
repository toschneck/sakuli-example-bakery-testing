#!/usr/bin/env bash
### start local:
#  WORKSPACE=~/sakuli-example-bakery-testing TESTSUITE=order-pdf BROWSER=chrome ./execute_compose_test.sh

function checkDefaults(){
    if [ -z $TESTSUITE ]; then
        export TESTSUITE='blueberry'
    fi
    if [ -z $BROWSER ]; then
        export BROWSER='chrome'
    fi
    if [ -z $TEST_OS ]; then
        export TEST_OS='ubuntu'
    fi
    if [ -z $WORKSPACE ]; then
        cd $(dirname `which $0`)/..
        export WORKSPACE=$(pwd)
    fi
    if [ -z $COMPOSE_FILE ]; then
        export COMPOSE_FILE="$WORKSPACE/sakuli-tests/docker-compose.yml";
    fi
    if [ -z $ADD_ARGUMENT ]; then
        export ADD_ARGUMENT=''
    fi
    if [ -z $OMD_SERVER ]; then
        ### use bakery server as blank dummy
        export OMD_SERVER='bakery-web-server:dummy'
    fi
    echo "TESTSUITE: $TESTSUITE, BROWSER: $BROWSER, TEST_OS:  $TEST_OS, WORKSPACE: $WORKSPACE, COMPOSE_FILE: $COMPOSE_FILE, ADD_ARGUMENT: $ADD_ARGUMENT, OMD_SERVER: $OMD_SERVER"
}

function evaluateResult(){
    if [[ $dcarg = '-d' ]]; then exit 0; fi
    ## copy the runtime data of the container to the workspace
    CONTAINER_INSTANCE=$1
    LOGFOLDER=$WORKSPACE/_logs/$1_$(date +%s)
    LOGFILE=$LOGFOLDER/_logs/_sakuli.log
    echo "LOGFOLDER: $LOGFOLDER, LOGFILE: $LOGFILE"
    mkdir -p $LOGFOLDER \
        && docker cp $CONTAINER_INSTANCE:/opt/tests/$TESTSUITE/_logs $LOGFOLDER \
        && cat $LOGFILE

    ## save SAKULI_RETURN_VAL and interpret the result
    SAKULI_RESULT="not-determined"
    ## grep the LAST match of 'execution FINISHED -' and extract the result string from the $LOGFILE
    SAKULI_RESULT=$(tac $LOGFILE | grep 'execution FINISHED' -B2 -m1 $LOGFILE| sed -n -e 's/^.*execution FINISHED - \(\w*\) =.*/\1/p')

    echo "SAKULI STATUS: $SAKULI_RESULT"
    if [[ "$SAKULI_RESULT" == "ERRORS" ]]; then
        exit -1
    else
        exit 0
    fi
}


### start the sakuli test suite
checkDefaults
CONTAINER_NAME=sakuli-test-$TESTSUITE-$BROWSER-$TEST_OS
echo "start docker container ($TEST_OS): $CONTAINER_NAME"

SERVICENAME=$TESTSUITE
docker-compose -f $COMPOSE_FILE kill $SERVICENAME && docker-compose -f $COMPOSE_FILE rm -f  $SERVICENAME

if [[ $1 =~ kill ]]; then
    exit 0
fi
if [[ $1 = '-d' ]]; then
    dcarg=$1
fi

docker-compose -f $COMPOSE_FILE build $SERVICENAME \
    && docker-compose -f $COMPOSE_FILE up $dcarg $SERVICENAME  \
    && evaluateResult $CONTAINER_NAME

echo "unexpected error starting docker container '$CONTAINER_NAME' in docker-compose file '$COMPOSE_FILE'"
exit -1