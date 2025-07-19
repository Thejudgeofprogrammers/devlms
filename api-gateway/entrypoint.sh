#!/bin/sh
set -e

echo "Запускаем миграции Prisma..."
# npx prisma migrate dev --name init
npx prisma migrate deploy

echo "Генерируем Prisma Client..."
npx prisma generate

echo "Запускаем приложение..."
node /app/dist/main.js