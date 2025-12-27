# Users API Reference

API для управления профилями пользователей, подписками и настройками.

## Base URL

```
/users
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | /:id | Получение профиля пользователя | ⚪ |
| PATCH | /avatar | Изменение аватара | ✅ |
| DELETE | /avatar | Удаление аватара | ✅ |
| POST | /:id/follow | Подписаться на пользователя | ✅ |
| DELETE | /:id/unfollow | Отписаться от пользователя | ✅ |
| GET | /search/users | Поиск пользователей | ❌ |
| GET | /:id/followers | Список подписчиков | ❌ |
| GET | /:id/following | Список подписок | ❌ |
| GET | /:id/settings | Получение настроек | ✅ |
| PATCH | /:id/settings | Обновление настроек | ✅ |
| PATCH | /:id/password | Смена пароля | ✅ |
| DELETE | /:id | Удаление аккаунта | ✅ |

> ⚪ — Опциональная аутентификация (дополнительные данные для авторизованных)

---

## GET /users/:id

Получение профиля пользователя по ID.

### Request

```http
GET /users/:id
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID пользователя |

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "userName": "@johndoe",
  "avatar": "avatars/avatar-123.jpg",
  "bio": "Software developer passionate about web technologies",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "isPublicProfile": true,
  "followersCount": 150,
  "followingCount": 75,
  "isFollowing": false,
  "stats": {
    "postsCount": 42,
    "articlesCount": 5,
    "likesReceived": 320,
    "commentsReceived": 89
  }
}
```

> **Примечание:** Поле `isFollowing` появляется только для авторизованных пользователей.

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### Example

```bash
curl -X GET http://localhost:8080/users/1
```

---

## PATCH /users/avatar

Изменение аватара текущего пользователя.

### Request

```http
PATCH /users/avatar
Content-Type: multipart/form-data
Cookie: access_token=...
```

**Body (form-data):**
| Параметр | Тип | Описание |
|----------|-----|----------|
| avatar | file | Файл изображения (max 2MB) |

**Поддерживаемые форматы:** jpg, jpeg, png, gif

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "avatars/avatar-1234567890.jpg"
}
```

**413 Payload Too Large**
```json
{
  "statusCode": 413,
  "message": "File too large",
  "error": "Payload Too Large"
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/users/avatar \
  -b cookies.txt \
  -F "avatar=@/path/to/avatar.jpg"
```

---

## DELETE /users/avatar

Удаление аватара текущего пользователя.

### Request

```http
DELETE /users/avatar
Cookie: access_token=...
```

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null
}
```

### Example

```bash
curl -X DELETE http://localhost:8080/users/avatar \
  -b cookies.txt
```

---

## POST /users/:id/follow

Подписаться на пользователя.

### Request

```http
POST /users/:id/follow
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID пользователя для подписки |

### Response

**204 No Content**

**400 Bad Request** — Подписка на себя
```json
{
  "statusCode": 400,
  "message": "You cannot follow yourself!",
  "error": "Bad Request"
}
```

### Example

```bash
curl -X POST http://localhost:8080/users/2/follow \
  -b cookies.txt
```

---

## DELETE /users/:id/unfollow

Отписаться от пользователя.

### Request

```http
DELETE /users/:id/unfollow
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID пользователя для отписки |

### Response

**204 No Content**

### Example

```bash
curl -X DELETE http://localhost:8080/users/2/unfollow \
  -b cookies.txt
```

---

## GET /users/search/users

Поиск пользователей по имени или username.

### Request

```http
GET /users/search/users?query=john&offset=0&limit=20
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| query | string | — | Поисковый запрос |
| offset | number | 0 | Смещение |
| limit | number | 20 | Количество результатов |

### Response

**200 OK**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "userName": "@johndoe",
    "avatar": "avatars/avatar-123.jpg",
    "bio": "Software developer"
  },
  {
    "id": 5,
    "firstName": "Johnny",
    "lastName": "Smith",
    "userName": "@johnnysmith",
    "avatar": null,
    "bio": null
  }
]
```

### Example

```bash
curl -X GET "http://localhost:8080/users/search/users?query=john&limit=10"
```

---

## GET /users/:id/followers

Получение списка подписчиков пользователя.

### Request

```http
GET /users/:id/followers?offset=0&limit=20
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID пользователя |
| offset | number | 0 | Смещение |
| limit | number | 20 | Количество результатов |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "@janesmith",
      "avatar": "avatars/avatar-456.jpg"
    }
  ],
  "total": 150,
  "hasMore": true
}
```

### Example

```bash
curl -X GET "http://localhost:8080/users/1/followers?limit=20&offset=0"
```

---

## GET /users/:id/following

Получение списка подписок пользователя.

### Request

```http
GET /users/:id/following?offset=0&limit=20
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID пользователя |
| offset | number | 0 | Смещение |
| limit | number | 20 | Количество результатов |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 3,
      "firstName": "Bob",
      "lastName": "Wilson",
      "userName": "@bobwilson",
      "avatar": null
    }
  ],
  "total": 75,
  "hasMore": true
}
```

### Example

```bash
curl -X GET "http://localhost:8080/users/1/following?limit=20&offset=0"
```

---

## GET /users/:id/settings

Получение настроек пользователя. Доступно только владельцу аккаунта.

### Request

```http
GET /users/:id/settings
Cookie: access_token=...
```

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "userName": "@johndoe",
  "email": "john@example.com",
  "avatar": "avatars/avatar-123.jpg",
  "bio": "Software developer",
  "location": "San Francisco",
  "website": "https://johndoe.dev",
  "isPublicProfile": true
}
```

**403 Forbidden** — Доступ к чужим настройкам
```json
{
  "statusCode": 403,
  "message": "You can only access your own settings",
  "error": "Forbidden"
}
```

### Example

```bash
curl -X GET http://localhost:8080/users/1/settings \
  -b cookies.txt
```

---

## PATCH /users/:id/settings

Обновление настроек пользователя.

### Request

```http
PATCH /users/:id/settings
Content-Type: application/json
Cookie: access_token=...
```

**Body:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "userName": "@jonathandoe",
  "bio": "Full-stack developer",
  "location": "New York",
  "website": "https://jonathandoe.dev",
  "isPublicProfile": true
}
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| firstName | string | Имя |
| lastName | string | Фамилия |
| userName | string | Username |
| bio | string | Описание |
| location | string | Местоположение |
| website | string | Веб-сайт |
| isPublicProfile | boolean | Публичный профиль |

> Все параметры опциональны — можно обновлять только нужные поля.

### Response

**200 OK**
```json
{
  "id": 1,
  "firstName": "Jonathan",
  "lastName": "Doe",
  "userName": "@jonathandoe",
  "bio": "Full-stack developer",
  "location": "New York",
  "website": "https://jonathandoe.dev",
  "isPublicProfile": true
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/users/1/settings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bio": "Full-stack developer",
    "location": "New York"
  }'
```

---

## PATCH /users/:id/password

Смена пароля пользователя.

### Request

```http
PATCH /users/:id/password
Content-Type: application/json
Cookie: access_token=...
```

**Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| currentPassword | string | Текущий пароль |
| newPassword | string | Новый пароль (мин. 6 символов) |

### Response

**200 OK**
```json
{
  "message": "Password changed successfully"
}
```

**400 Bad Request** — Неверный текущий пароль
```json
{
  "statusCode": 400,
  "message": "Current password is incorrect",
  "error": "Bad Request"
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/users/1/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword456"
  }'
```

---

## DELETE /users/:id

Удаление аккаунта пользователя. **Действие необратимо!**

### Request

```http
DELETE /users/:id
Cookie: access_token=...
```

### Response

**204 No Content**

**403 Forbidden** — Удаление чужого аккаунта
```json
{
  "statusCode": 403,
  "message": "You can only delete your own account",
  "error": "Forbidden"
}
```

### Example

```bash
curl -X DELETE http://localhost:8080/users/1 \
  -b cookies.txt
```
