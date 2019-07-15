#!/bin/bash
set -x
var1=$(cat /sys/bus/i2c/devices/0-0029/temp0_input)
var2=$((var1/10))
var3=$((var1%10))
echo $(date +'%m/%d/%Y/%R')"; "$[$var2]"."$[$var3] >> /root/temperature2.csv
 
#i2cget -f -y 0 0x29 1 # MSB
var4=$(/usr/sbin/i2cget -f -y 0 0x29 1)
#i2cget -f -y 0 0x29 0 # LSB
var5=$(/usr/sbin/i2cget -f -y 0 0x29 0)
 
var6=$(($var4 & 0x80))
 
if [ $var6 -eq 128 ]
then
	echo $(date +'%m/%d/%Y/%R')"; "$[$var1] >> /root/tempsNegatif.csv
else
	echo $(date +'%m/%d/%Y/%R')"; "$[$var1] >> /root/tempsPositif.csv
fi
