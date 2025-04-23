#!/bin/sh

export $(xargs < .env)

pwd
cd ./deployment/createLambda
pwd
awk -v LAMBDA_NAME=$LAMBDA_NAME -f prependToSrc.awk ./dist/index.html > ./dist/index.tmp.html
mv ./dist/index.tmp.html ./dist/index.html

cp ./handle.js ./dist/
