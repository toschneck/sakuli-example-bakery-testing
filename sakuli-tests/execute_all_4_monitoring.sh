#!/usr/bin/env bash
cd $(dirname `which $0`)
FOLDER=$(pwd)

export ADD_ARGUMENT="-D sakuli.forwarder.gearman.enabled=true"
export OMD_SERVER="omd-nagios"
# skip the result evaluation - it will be done by the omd monitoring system
export SKIP_EVALUATE_RESULT=true

cleanup ()
{
kill -s SIGTERM $!
exit 0
}

trap cleanup SIGINT SIGTERM

### run each suite every 15 seconds, until CTRL + C
while [ 1 ]
do
    $FOLDER/execute_all.sh &
    wait $!
    echo "sleep 15 seconds"
    sleep 15;
done
exit 0
