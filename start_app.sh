#!/bin/bash

DEV=$1

SERVER_FILE="inventory.js"
SERVER_URL="http://localhost:8080/"

if [ "$DEV" == "-d" ]
then
  echo "* Monitoring the server for changes"
  start $SERVER_URL
  nodemon $SERVER_FILE
else
  echo "* Opening the server in the web browser"
  start $SERVER_URL
  node $SERVER_FILE
fi