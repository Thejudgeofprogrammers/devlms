# ✅ Техническое задание (LMS — Learning Management System)

📌 Общая цель проекта
Создать веб-приложение для студентов и преподавателей университета, позволяющее проходить курсы, отслеживать успеваемость, взаимодействовать с преподавателями и администрацией.

## 🧩 Модули системы

1. Модуль аутентификации и регистрации

- Регистрация через email/password
- Вход с верификацией через JWT
- Восстановление пароля
- Подтверждение email

2. Система аккаунтов и ролей

- Роли: студент, преподаватель, админ
- Ограничение доступа к страницам/действиям по ролям
- Панель администратора для управления пользователями

3. Модуль курсов

- Создание/редактирование курсов (только для преподавателей/админов)
- Просмотр курсов
- Привязка курса
- Хранение модулей и уроков
- Редактируемые описания и видео, материалы.

4. Модуль уроков и заданий

- Текстовые материалы ссылки, видео
- Прикрепляемые файлы
- Домашние задания с дедлайнами
- Автомаическая ручная проверка

5. Модуль рейтинга и оценок

- Система баллов/рейтинга (гибко настраиваемая)
- Индивидуальные отчеты по успеваемости
- Таблица результатов курса

6. Модуль профиля пользователя

- Персональная страница
- Информация о курсах, оценках, активност
- Возможнось редактировать профиль

7. Модуль уведомлений

- Уведомления о добавлении на курс, заданиях, дедлайнов
- Email/внутренние увеомления

8. Модуль администрирования

- Управления курсами, пользователями
- Просмотр статистики, логов
- Управление ролями

## 🌐 Страницы сайта

### 🏠 Ознакомительные

1. Главная страница (Точка входа в приложение)

- Приветствие, цели системы
- Кнопки "Вход/Регистрация"
- Краткая информация о платформе и возможностях

2. Страница истории университета

- Статическая страница с информацией о ЛГУ

3. Ссылки

- Внешние ресурсы университета (официальный сайт, библиотека, рассписание и т.д.)

### 🔐 Процесс верификации

1. Страница авторизации

- Ввод email и пароля
- Возможность восстановить пароль

2. Страница регистрации

- ФИО, email, пароль
- Выбор роли (по умолчанию студент; преподаватель через подтверждение)

### 📚 Курсы

1. Каталог курсов

- Поиск и фильтрация (по преподавателю, тегам, доступности)
- Посмотреть описаний, рейтинга, преподавателя

2. Страница курса

- Описание курса
- Список модулей и уроков
- Прогресс прохождения
- Список участников
- Информация о преподавателе
- Таблица оценок

### 👤 Пользователи

1. Профиль пользователя

- ФИО, email, аватар, описания, ссылки
- Роль в системе

2. Оценки

- Таблица успеваемости по всем курсам

3. Настройки

- Смена пароля
- Уведомление
- Приватность
- Тема сайта

4. Выход

## 📦 Технические требования

### Требования к архитектуре

- Архитектура (микросервисная)

### Сервисы

#### Nginx

- Обратный прокси
- Docker-compose

#### Api Gateway

- name: api-gateway
- Язык: Typescript
- Фреймворк: NestJS

#### Backend (Auth)

- name: auth-service
- Язык: Golang
- Фреймворк: Fiber

#### Frontend

- name: frontend-service
- Язык: Typescript
- Фреймворк: React
- Стили Tailwind CSS
- Роутинг: React Router
- Подключение к API: Axios / WebSocket
- Контейнеризация Dockerfile
- Прокси: Nginx
- replicas: 3

## 📦 Система тестов

- Unit тесты
- Интеграционные тесты

## 📈 Будущее расширение (необязательно, но планируемое)

- Поддержка видео-конференций (Zoom, WebRTC)
- Форум или чат
- Пуш-уведомления
- Мобильная версия
- Локализация (мультиязычность)

## Проектирование данных

1. PostgreSQL (PrismaORM)
2. MongoDB (PrismaORM)
3. Redis

```ts
// PostgreSQL

interface User {
    user_id: number;
    login: string;
    email: string;
    phone_number: string;
    password: string;
    contacts_id: number;
    user_info_id: number;
    chat_id: number;
    role_id: number;
    photo_url: string;
    first_entry: Date;
    last_entry: Date; // Date.now()
}

// friends table (многие-ко-многим)
interface UserFriends {
    user_id: number;
    friend_id: number;
}

// user_courses table (многие-ко-многим)
interface UserCourses {
    user_id: number;
    course_id: number;
}

interface UserChats {
    user_id: number;
    chat_id: string;
}

interface Role {
    role_id: number;
    role: 'User' | 'Teacher' | 'Admin';
}

interface Contacts {
    contact_id: string;
    contry: string;
    city: string;
    time_zone: string;
}

interface UserInfo {
    user_info_id: number
    name: string;
    fam: string;
    surname: string;
    сitizenship: string;
    faculty: string;
    speciality: string;
    profile: string;
    level_of_training: string;
    form_learning: string;
    study_group: string;
    language: string;
}

interface Cource {
    cource_id: number;
    name: string;
    participants: User.user_id[];
    teachers: Teacher.teacher_id[];
    plan_course: string;
}

interface CourseParticipants {
    course_id: number;
    user_id: number;
}

interface CourseTeachers {
    course_id: number;
    teacher_id: number;
}

interface Teacher {
    teacher_id: number;
    photo_url: string;
    department: string;
    job_title: string;
    education: string;
    disciplines_id: number[];
    advanced_training: number[];
}

interface TeacherDisciplines {
    teacher_id: number;
    discipline_id: number;
}

interface TeacherAdvanced {
    teacher_id: number;
    advanced_id: number;
}

interface Discipline {
    discipline_id: number;
    name: string;
}

interface Advanced {
    advanced_id: number;
    name: string;
    hourse: number;
    year: number;
}

// Mongodb

interface Chat {
    chat_id: string;
    chat_type: enum('bot', 'user');
    owners: User.user_id[]; // 2 user
    messages: Message.message_id[];
    created_at: Date;
    updated_at: Date;
}

interface Message {
    message_id: string;
    owner: User.user_id;
    text: string;
    message: string;
    created_at: Date;
}

// Redis

// Header Authorize: token sha(256 + user_id + secret_salt)
{ 
    user_id: number;
    jwt_token: string
}

```

## Проектирование API

### Авторизация Аутентификация

POST /api/register
Описание: Зарегистрироваться (Создание пользователя)

POST /api/auth
Описание: Вход

### Профиль

GET /api/users/:user_id
Описание: Информация о профиле

PUT /api/users/:user_id
Описание: 
- Изменить профиль (роль user | teacher | admin)
- Изменить разделы образования и квалификации (teacher | admin)
- Изменить роль (admin)
- Если пользователь user, admin то только информация о пользователе
- Если пользователь teacher, то базовая + образование

DELETE /api/users/:user_id
Описание: удалить аккаунт (нцжке токен и пароль)
- User | Teacher - могут удалить аккаунт
- Admin - Не может удалить свой аккаунт, но может User | Teacher

### Курсы

GET /api/users/:user_id/cources
Описание: Все курсы (User | Teacher)

GET /api/course
Описание: Все существующие курсы (admin, teacher)

GET /api/course/:course_id 
Описание: Можно посмотреть курс пользователя (Если он у него есть)

POST /api/course
Описание: Создание курса (роль teacher | admin)

PUT /api/course/:course_id
Описание: Изменить курс (роль admin | teacher (который находится на курсе))

DELETE /api/course/:course_id
Описание: Удалить курс (роль admin | teacher (который находится на курсе))


### Преподаватели

GET /api/teachers
Описание: Получить все преподавателей

GET /api/teachers/:user_id
Описание: Получить преподавателя

### WC








docker exec -it mongo_db mongosh

rs.initiate()

rs.status()