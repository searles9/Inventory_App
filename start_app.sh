#!/bin/bash

DEV=$1

SERVER_FILE="app.js"
SERVER_URL="http://localhost:8080/"

echo $DEV

if [ "$DEV" == "-d" ]
then
  echo "* Monitoring the server for changes"
  nodemon $SERVER_FILE
fi


echo "* Opening the server in the web browser"
start $SERVER_URL