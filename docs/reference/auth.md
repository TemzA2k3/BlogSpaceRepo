# Auth API Reference

API для аутентификации и управления сессиями пользователей.

## Base URL

```
/auth
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | /register | Регистрация нового пользователя | ❌ |
| POST | /login | Вход в систему | ❌ |
| POST | /logout | Выход из системы | ❌ |
| GET | /me | Получение текущего пользователя | ✅ |
| POST | /reset-password | Запрос сброса пароля | ❌ |
| POST | /reset-password/confirm | Подтверждение сброса пароля | ❌ |

---

## POST /auth/register

Регистрация нового пользователя.

### Request

```http
POST /auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| firstName | string | ✅ | Имя (мин. 2 символа) |
| lastName | string | ✅ | Фамилия (мин. 2 символа) |
| email | string | ✅ | Email (уникальный) |
| password | string | ✅ | Пароль (мин. 6 символов) |

### Response

**201 Created**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": null,
  "bio": null,
  "location": null,
  "website": null,
  "isPublicProfile": true,
  "isBlocked": false,
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**400 Bad Request** — Email уже существует
```json
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "error": "Bad Request"
}
```

**400 Bad Request** — Ошибка валидации
```json
{
  "statusCode": 400,
  "message": [
    "firstName must be longer than or equal to 2 characters",
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

### Example

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## POST /auth/login

Аутентификация пользователя. При успешном входе устанавливается HTTP-only cookie `access_token`.

### Request

```http
POST /auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "remember": false
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| email | string | ✅ | Email пользователя |
| password | string | ✅ | Пароль |
| remember | boolean | ✅ | Запомнить (долгий cookie) |

### Response

**200 OK**

Headers:
```
Set-Cookie: access_token=eyJhbGc...; HttpOnly; Path=/; SameSite=Lax
```

Body:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": "avatars/avatar-123.jpg",
  "bio": "Software developer",
  "isPublicProfile": true,
  "isBlocked": false,
  "role": "user"
}
```

**400 Bad Request** — Неверные учётные данные
```json
{
  "statusCode": 400,
  "message": "Invalid email or password",
  "error": "Bad Request"
}
```

**400 Bad Request** — Пользователь заблокирован
```json
{
  "statusCode": 400,
  "message": "User is blocked",
  "error": "Bad Request"
}
```

### Example

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "remember": false
  }'
```

---

## POST /auth/logout

Выход из системы. Очищает cookie `access_token`.

### Request

```http
POST /auth/logout
```

### Response

**200 OK**
```json
{
  "success": true
}
```

### Example

```bash
curl -X POST http://localhost:8080/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

## GET /auth/me

Получение данных текущего аутентифицированного пользователя.

### Request

```http
GET /auth/me
Cookie: access_token=...
```

**Требует аутентификации:** ✅

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": "avatars/avatar-123.jpg",
  "bio": "Software developer",
  "location": "San Francisco",
  "website": "https://johndoe.dev",
  "isPublicProfile": true,
  "followersCount": 150,
  "followingCount": 75
}
```

**401 Unauthorized** — Не аутентифицирован
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Example

```bash
curl -X GET http://localhost:8080/auth/me \
  -b cookies.txt
```

---

## POST /auth/reset-password

Запрос на сброс пароля. Отправляет email со ссылкой для сброса.

### Request

```http
POST /auth/reset-password
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| email | string | ✅ | Email пользователя |

### Response

**200 OK**
```json
{
  "message": "Reset email sent successfully"
}
```

> **Примечание:** Ответ всегда успешный, даже если email не существует (для безопасности).

### Example

```bash
curl -X POST http://localhost:8080/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

## POST /auth/reset-password/confirm

Подтверждение сброса пароля с использованием токена из email.

### Request

```http
POST /auth/reset-password/confirm
Content-Type: application/json
```

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newPassword123"
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| token | string | ✅ | JWT токен из email |
| password | string | ✅ | Новый пароль (мин. 6 символов) |

### Response

**200 OK**
```json
{
  "message": "Password updated successfully"
}
```

**400 Bad Request** — Невалидный токен
```json
{
  "statusCode": 400,
  "message": "Invalid or expired token",
  "error": "Bad Request"
}
```

### Example

```bash
curl -X POST http://localhost:8080/auth/reset-password/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "newPassword123"
  }'
```
