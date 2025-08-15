#!/bin/sh
set -e

echo "Запускаем миграции Prisma..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  npx prisma migrate deploy
else
  echo "Миграций нет — выполняем db push"
  npx prisma db push
fi

echo "Генерируем Prisma Client..."
npx prisma generate

echo "Генерируем сертификаты..."
/app/add-certs.sh

echo "Запускаем приложение..."
node /app/dist/main.js