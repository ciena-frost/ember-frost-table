#!/bin/bash

if [ "$EMBER_TRY_SCENARIO" != "default" ]
then
  echo "Skipping coverage publish for EMBER_TRY_SCENARIO ${EMBER_TRY_SCENARIO}"
  exit 0
fi

filename="coverage/coverage-final.json"

name=`cat package.json | grep "\"name\":" | awk -F\" '{print $4;}'`
echo "submitting coverage info for [$name]"

sed -i -e "s/modules\/${name}/addon/g" $filename
bash <(curl -s https://codecov.io/bash) -f $filename
