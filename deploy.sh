#!/bin/bash

# Variables
USER="back"
HOST="172.31.249.30"
PASSWORD="back"
PORT=8080

# Commande distante
REMOTE_CMD="
echo ' Vérification du port $PORT...'

PID=\$(lsof -t -i:$PORT)

if [ ! -z \"\$PID\" ]; then
  echo \" Port $PORT occupé par le PID \$PID, arrêt du processus\"
  kill -9 \$PID
else
  echo \"Port $PORT libre\"
fi

echo 'Lancement du backend'
cd /home/back/Ing2-CampusConnect/proto-back || exit 1
mvn spring-boot:run
"

# Connexion SSH + lancement du back
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "$REMOTE_CMD"
