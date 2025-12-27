# Authentication

BlogSpace API использует JWT (JSON Web Tokens) для аутентификации, передаваемые через HTTP-only cookies.

## Обзор механизма аутентификации

```
┌────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Client sends credentials (email + password)                 │
│                         │                                        │
│                         ▼                                        │
│  2. Server validates credentials against database               │
│                         │                                        │
│                         ▼                                        │
│  3. Server generates JWT token with user payload                │
│                         │                                        │
│                         ▼                                        │
│  4. Server sets HTTP-only cookie "access_token"                 │
│                         │                                        │
│                         ▼                                        │
│  5. Client automatically sends cookie with every request        │
│                         │                                        │
│                         ▼                                        │
│  6. Server validates JWT from cookie on protected routes        │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## JWT Token Structure

Токен содержит следующий payload:

```json
{
  "userId": 1,
  "email": "john@example.com",
  "role": "user",
  "userName": "@johndoe",
  "iat": 1642694400,
  "exp": 1642780800
}
```

| Поле | Описание |
|------|----------|
| userId | Уникальный ID пользователя |
| email | Email пользователя |
| role | Роль (user, admin) |
| userName | Username пользователя |
| iat | Время создания токена |
| exp | Время истечения токена |

## Endpoints аутентификации

### Регистрация

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

**Валидация:**
| Поле | Требования |
|------|------------|
| firstName | Минимум 2 символа |
| lastName | Минимум 2 символа |
| email | Валидный email |
| password | Минимум 6 символов |

**Ответ (201 Created):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "isPublicProfile": true,
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Вход

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "remember": false
}
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| email | string | Email пользователя |
| password | string | Пароль |
| remember | boolean | Запомнить (долгий cookie) |

**Response Headers:**
```
Set-Cookie: access_token=eyJhbGc...; HttpOnly; Path=/; SameSite=Lax
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe"
}
```

### Выход

```http
POST /auth/logout
```

Очищает cookie `access_token`.

**Ответ (200 OK):**
```json
{
  "success": true
}
```

### Получение текущего пользователя

```http
GET /auth/me
```

**Требует:** Аутентификацию (cookie)

**Ответ (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "@johndoe",
  "avatar": "avatars/avatar-123.jpg",
  "bio": "Software developer",
  "followersCount": 42,
  "followingCount": 15
}
```

## Сброс пароля

### Запрос сброса

```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Отправляет email со ссылкой для сброса пароля.

**Ответ (200 OK):**
```json
{
  "message": "Reset email sent successfully"
}
```

> **Безопасность:** Ответ всегда успешный, даже если email не существует (для защиты от перебора).

### Подтверждение сброса

```http
POST /auth/reset-password/confirm
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newPassword123"
}
```

| Параметр | Описание |
|----------|----------|
| token | JWT токен из ссылки в email |
| password | Новый пароль (мин. 6 символов) |

**Ответ (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

## Защита маршрутов

### Публичные маршруты
Доступны без аутентификации:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/reset-password`
- `POST /auth/reset-password/confirm`
- `GET /posts` (частично — без персонализации)
- `GET /articles`
- `GET /users/:id`

### Защищённые маршруты
Требуют аутентификации:
- `GET /auth/me`
- `POST /posts`
- `DELETE /posts/:id`
- `PATCH /posts/:id/like`
- `PATCH /posts/:id/save`
- `POST /users/:id/follow`
- `GET /chat`
- И другие...

### Опциональная аутентификация
Работают с и без аутентификации, но авторизованные пользователи получают дополнительные данные:
- `GET /posts` — добавляется `likedByCurrentUser`, `savedByCurrentUser`
- `GET /posts/:id` — добавляется информация о взаимодействии
- `GET /users/:id` — добавляется `isFollowing`

## Обработка ошибок аутентификации

| HTTP Code | Ситуация | Действие |
|-----------|----------|----------|
| 401 Unauthorized | Токен отсутствует или невалиден | Перенаправить на страницу входа |
| 400 Bad Request | Неверный email/пароль | Показать ошибку пользователю |
| 400 Bad Request | User is blocked | Показать сообщение о блокировке |

**Пример ответа при ошибке:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Безопасность

### HTTP-only Cookies
- Cookie недоступен из JavaScript (защита от XSS)
- Автоматически отправляется браузером
- Флаг `SameSite=Lax` для защиты от CSRF

### Рекомендации
1. Всегда используйте HTTPS в production
2. Не храните токены в localStorage
3. Реализуйте refresh token для длительных сессий
4. Установите разумный срок жизни токена

## Примеры интеграции

### Axios interceptor

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true // Важно для cookies!
});

// Response interceptor для обработки 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### React Context

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth on mount
    fetch('/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember) => {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, remember })
    });
    if (res.ok) {
      const user = await res.json();
      setUser(user);
      return user;
    }
    throw new Error('Login failed');
  };

  const logout = async () => {
    await fetch('/auth/logout', { 
      method: 'POST', 
      credentials: 'include' 
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```
