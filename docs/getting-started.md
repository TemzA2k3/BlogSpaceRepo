# Getting Started

Это руководство поможет вам начать работу с BlogSpace API за несколько минут.

## Предварительные требования

- HTTP клиент (cURL, Postman, или любой другой)
- Базовое понимание REST API
- Для WebSocket: клиент Socket.IO

## Базовый URL

```
http://localhost:8080
```

## Шаг 1: Регистрация пользователя

Создайте новый аккаунт, отправив POST запрос на `/auth/register`:

**Запрос:**
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Успешный ответ (201 Created):**
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
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Возможные ошибки:**
| Код | Сообщение | Причина |
|-----|-----------|---------|
| 400 | User with this email already exists | Email уже зарегистрирован |
| 400 | Validation failed | Невалидные данные |

## Шаг 2: Авторизация

После регистрации выполните вход для получения токена аутентификации:

**Запрос:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "remember": false
}
```

**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": null,
  "isPublicProfile": true,
  "role": "user"
}
```

> **Важно:** После успешного входа сервер устанавливает HTTP-only cookie `access_token`. Этот cookie автоматически отправляется с каждым последующим запросом.

**Параметр `remember`:**
- `false` — сессионный cookie (удаляется при закрытии браузера)
- `true` — долгоживущий cookie (30 дней)

## Шаг 3: Проверка аутентификации

Проверьте, что вы авторизованы, запросив данные текущего пользователя:

**Запрос:**
```http
GET /auth/me
```

**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": null,
  "bio": null,
  "followersCount": 0,
  "followingCount": 0
}
```

## Шаг 4: Создание первого поста

Теперь создайте свой первый пост:

**Запрос (только текст):**
```http
POST /posts
Content-Type: multipart/form-data

content=Hello, BlogSpace! This is my first post!
hashtags=["hello", "firstpost"]
```

**Успешный ответ (201 Created):**
```json
{
  "id": 1,
  "content": "Hello, BlogSpace! This is my first post!",
  "image": null,
  "hashtags": ["hello", "firstpost"],
  "authorId": 1,
  "likes": 0,
  "commentsCount": 0,
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

## Шаг 5: Просмотр ленты постов

Получите список всех постов:

**Запрос:**
```http
GET /posts?limit=15&offset=0
```

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1,
    "content": "Hello, BlogSpace!",
    "image": null,
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "likes": 5,
    "commentsCount": 2,
    "likedByCurrentUser": false,
    "savedByCurrentUser": false,
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
]
```

## Шаг 6: Выход из системы

Завершите сессию:

**Запрос:**
```http
POST /auth/logout
```

**Успешный ответ (200 OK):**
```json
{
  "success": true
}
```

## Примеры с cURL

```bash
# Регистрация
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Вход (сохранение cookies)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "remember": false
  }'

# Получение текущего пользователя (с cookies)
curl -X GET http://localhost:8080/auth/me \
  -b cookies.txt

# Создание поста
curl -X POST http://localhost:8080/posts \
  -b cookies.txt \
  -F "content=My first post!" \
  -F 'hashtags=["hello"]'

# Выход
curl -X POST http://localhost:8080/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Примеры с JavaScript (Fetch API)

```javascript
// Регистрация
const registerUser = async () => {
  const response = await fetch('http://localhost:8080/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });
  return response.json();
};

// Вход
const login = async () => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Важно для cookies!
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'password123',
      remember: false
    })
  });
  return response.json();
};

// Получение постов
const getPosts = async () => {
  const response = await fetch('http://localhost:8080/posts?limit=15&offset=0', {
    credentials: 'include'
  });
  return response.json();
};

// Создание поста
const createPost = async (content, hashtags) => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('hashtags', JSON.stringify(hashtags));
  
  const response = await fetch('http://localhost:8080/posts', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  return response.json();
};
```

## Следующие шаги

- [Authentication](./authentication.md) — Подробнее об аутентификации
- [Posts API](./reference/posts.md) — Полное описание API постов
- [Real-time Chat](./tutorials/real-time-chat.md) — Интеграция чата
