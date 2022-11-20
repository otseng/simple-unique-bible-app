ps -ef | grep next |  grep -v grep | awk '{print $2}' | xargs kill
ps -ef | grep next 