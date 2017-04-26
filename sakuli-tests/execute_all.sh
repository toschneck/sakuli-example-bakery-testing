#!/usr/bin/env bash
cd $(dirname `which $0`)
FOLDER=$(pwd)

### does the same as the jenkins job
#TESTSUITE='blueberry' $FOLDER/execute_compose_test.sh $@ &
#TESTSUITE='blueberry' BROWSER='firefox' $FOLDER/execute_compose_test.sh $@ &
#TESTSUITE='caramel' $FOLDER/execute_compose_test.sh $@ &
#TESTSUITE='chocolate' $FOLDER/execute_compose_test.sh $@ &
#TESTSUITE='chocolate' BROWSER='firefox' $FOLDER/execute_compose_test.sh $@ &
TESTSUITE='order-pdf' TEST_OS=centos $FOLDER/execute_compose_test.sh $@ &
wait
exit $?
