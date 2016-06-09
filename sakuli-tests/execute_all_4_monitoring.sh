#!/usr/bin/env bash
cd $(dirname `which $0`)
FOLDER=$(pwd)

### run each suite every 15 seconds
export ADD_ARGUMENT="-D sakuli.forwarder.gearman.enabled=true"
export OMD_SERVER="omd-nagios"

cleanup ()
{
kill -s SIGTERM $!
exit 0
}

trap cleanup SIGINT SIGTERM

while [ 1 ]
do
    $FOLDER/execute_all.sh &
    wait $!
    echo "sleep 15 seconds"
    sleep 15;
done
exit 0
