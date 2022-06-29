#!/bin/bash

echo "Deploying Server"

# Restart Server
pm2 restart dist/main.js --name solana-api

# If not stated ever
pm2 start dist/main.js --name solana-api

echo "S E R V E R   D E P L O Y E D"