#!/usr/bin/env bash
cd $(dirname `which $0`)
FOLDER=$(pwd)

echo "ARGS: $1"
if [[ $1 =~ kill ]]; then
    OS_DELETE_ONLY=true
fi
if [[ $1 =~ build ]]; then
    OS_BUILD_ONLY=true
fi

TEMPLATE=$FOLDER/openshift.worker.build.yaml
count=0


function createOpenshiftObject(){
    app_name=$1
    echo "CREATE POD for $app_name"
    oc process -f "$TEMPLATE" -v APP_NAME=$app_name| oc apply -f -
    oc get pod -l application=$app_name
}

function deleteOpenshiftObject(){
    app_name=$1
    echo "DELETE Config for $app_name"
    oc process -f "$TEMPLATE" -v APP_NAME=$app_name | oc delete -f -
    echo ".... wait" && sleep 5
}

function buildOpenshiftObject(){
    app_name=$1
    echo "Trigger Build for $app_name"
    oc process -f "$TEMPLATE" -v APP_NAME=$app_name| oc apply -f -
    oc start-build "$app_name" --follow --wait
    exit $?
}


function deployToOpenshift() {
    app_name=$1
    echo "--------------------- APP $count ---------------------------------------"
    if [[ $OS_BUILD_ONLY == "true" ]]; then
        buildOpenshiftObject $app_name
    elif [[ $OS_DELETE_ONLY == "true" ]]; then
        deleteOpenshiftObject $app_name
    else
        createOpenshiftObject $app_name
    fi
    echo "-------------------------------------------------------------------"
    ((count++))

}

deployToOpenshift 'bakery-worker'

wait
exit $?
