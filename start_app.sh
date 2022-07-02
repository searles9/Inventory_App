#!/bin/bash

DEV=$1

SERVER_FILE="app.js"
SERVER_URL="http://localhost:8080/"

if [ "$DEV" == "-d" ]
then
  echo "* Monitoring the server for changes"
  start $SERVER_URL
  nodemon $SERVER_FILE
elif [ "$DEV" == "-html" ]
then 
  echo "* Opening website file for web dev"
  start "C:\Users\donov\Documents\GitHub\Inventory_App\website\index.html"
else
  echo "* Opening the server in the web browser"
  start $SERVER_URL
  node $SERVER_FILE
fi