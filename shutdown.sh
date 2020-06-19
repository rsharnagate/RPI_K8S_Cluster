#!/bin/sh
for ip in 192.168.1.103 192.168.1.102 192.168.1.101 192.168.1.100
do
    sshpass -pSam123456 ssh -o StrictHostKeyChecking=no pi@$ip sudo shutdown -r now
    echo "PI($ip) shutdown"
done