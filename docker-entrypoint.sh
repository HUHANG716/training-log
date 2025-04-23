#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# 等待数据库连接，最多重试10次
MAX_RETRIES=10
RETRY_COUNT=0

until npx prisma migrate deploy || [ $RETRY_COUNT -eq $MAX_RETRIES ]
do
  echo "Waiting for database connection... ($RETRY_COUNT/$MAX_RETRIES)"
  RETRY_COUNT=$((RETRY_COUNT+1))
  sleep 5
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Could not connect to database after $MAX_RETRIES attempts. Exiting..."
  exit 1
fi

echo "Database migrations applied successfully!"
echo "Starting application..."
node server.js