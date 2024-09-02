#!/bin/bash

# Variables
BACKUP_DIR="../../backup"
DB_CONTAINER_NAME="cda_fil_rouge-postgres-1"
DB_USER="user_beginners"
DB_NAME="db_beginners"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DB_NAME_$DATE.sql"

# Commande pour l'exportation
docker exec $DB_CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Affichage d'un message de confirmation
echo "Sauvegarde terminée : $BACKUP_FILE"
