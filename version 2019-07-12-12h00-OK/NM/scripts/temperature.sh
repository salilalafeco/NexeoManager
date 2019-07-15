#!/bin/bash
#set -x
var1=$(cat /sys/bus/i2c/devices/0-0029/temp0_input)
var2=$((var1/10))
var3=$((var1%10))
echo $[$var2]"."$[$var3]
