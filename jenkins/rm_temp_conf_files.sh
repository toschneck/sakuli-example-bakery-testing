#!/bin/bash
#script to delete all temporary files in jenkins_conf

conf=./jenkins_conf

cd $conf
rm -rvf .bash_history
rm -rvf *.log*
rm -rvf logs
rm -rvf .java
rm -rvf plugins/*/
rm -rvf updates
rm -rvf war
rm -rvf fingerprints
rm -rvf jobs/**/modules
rm -rvf config-history
rm -rvf .owner
rm -rvf queue.xml*

cd -

