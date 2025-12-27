# BlogSpace API Documentation

## Введение

BlogSpace API — это RESTful API для социальной блог-платформы, которая позволяет пользователям создавать посты, статьи, комментарии, управлять профилями и общаться в реальном времени.

## Базовая информация

| Параметр | Значение |
|----------|----------|
| Base URL | `http://localhost:8080` |
| Формат данных | JSON |
| Аутентификация | JWT (HTTP-only Cookie) |
| Real-time | WebSocket (Socket.IO) |

## Содержание документации

### Начало работы
- [Getting Started](./getting-started.md) — Быстрый старт
- [Authentication](./authentication.md) — Аутентификация и авторизация

### Архитектура
- [Architecture Overview](./architecture.md) — Обзор архитектуры системы
- [Data Models](./models.md) — Модели данных

### API Reference
- [Auth API](./reference/auth.md) — Регистрация, вход, сброс пароля
- [Users API](./reference/users.md) — Профили, подписки, настройки
- [Posts API](./reference/posts.md) — Посты, лайки, сохранения
- [Articles API](./reference/articles.md) — Статьи
- [Comments API](./reference/comments.md) — Комментарии
- [Chat API](./reference/chat.md) — Чаты и сообщения
- [Contact API](./reference/contact.md) — Форма обратной связи

### Туториалы
- [User Authentication Flow](./tutorials/authentication-flow.md)
- [Creating Post with Image](./tutorials/create-post-with-image.md)
- [Real-time Chat Integration](./tutorials/real-time-chat.md)
- [Working with Articles](./tutorials/working-with-articles.md)

### Продвинутые темы
- [Pagination](./advanced/pagination.md)
- [File Uploads](./advanced/file-uploads.md)
- [WebSocket Events](./advanced/websockets.md)
- [Error Handling](./advanced/error-handling.md)

### Дополнительно
- [Error Codes](./errors.md) — Коды ошибок
- [Changelog](./changelog.md) — История изменений

## Быстрый старт

```bash
# 1. Регистрация
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# 2. Авторизация
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@example.com","password":"password123","remember":false}'

# 3. Получение профиля
curl -X GET http://localhost:8080/auth/me \
  -b cookies.txt
```

## Статус API

| Модуль | Статус | Версия |
|--------|--------|--------|
| Auth | ✅ Stable | 1.0 |
| Users | ✅ Stable | 1.0 |
| Posts | ✅ Stable | 1.0 |
| Articles | ✅ Stable | 1.0 |
| Comments | ✅ Stable | 1.0 |
| Chat | ✅ Stable | 1.0 |
| Contact | ✅ Stable | 1.0 |

## Контакты

По вопросам API обращайтесь через [форму обратной связи](./reference/contact.md) или на email: support@blogspace.com
