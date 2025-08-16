#!/bin/sh
set -e

echo "Запускаем миграции Prisma..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  npx prisma migrate deploy
else
  echo "Миграций нет — выполняем db push"
  # npx prisma db push
  npx prisma db push --accept-data-loss
fi


echo "Генерируем Prisma Client..."
npx prisma generate

echo "Запускаем приложение..."
exec node /app/dist/main.js