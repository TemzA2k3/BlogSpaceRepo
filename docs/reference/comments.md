# Comments API Reference

API для управления комментариями к постам и статьям.

## Base URL

```
/comments
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | /article/:id | Создание комментария к статье | ✅ |
| POST | /post/:id | Создание комментария к посту | ✅ |
| GET | /article/:id | Получение комментариев статьи | ❌ |
| GET | /post/:id | Получение комментариев поста | ❌ |
| GET | /:id/replies | Получение ответов (статьи) | ❌ |
| GET | /post/:id/replies | Получение ответов (посты) | ❌ |

---

## POST /comments/article/:id

Создание комментария к статье.

### Request

```http
POST /comments/article/:id
Content-Type: application/json
Cookie: access_token=...
```

| Параметр URL | Тип | Описание |
|--------------|-----|----------|
| id | number | ID статьи |

**Body:**
```json
{
  "content": "Great article! Very helpful.",
  "parentId": null
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| content | string | ✅ | Текст комментария |
| parentId | number | ❌ | ID родительского комментария (для ответов) |

### Response

**201 Created**
```json
{
  "id": 1,
  "content": "Great article! Very helpful.",
  "author": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "avatars/avatar-123.jpg"
  },
  "parentId": null,
  "articleId": 5,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Examples

**Комментарий к статье:**
```bash
curl -X POST http://localhost:8080/comments/article/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content": "Great article!"}'
```

**Ответ на комментарий:**
```bash
curl -X POST http://localhost:8080/comments/article/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content": "I agree!", "parentId": 5}'
```

---

## POST /comments/post/:id

Создание комментария к посту.

### Request

```http
POST /comments/post/:id
Content-Type: application/json
Cookie: access_token=...
```

| Параметр URL | Тип | Описание |
|--------------|-----|----------|
| id | number | ID поста |

**Body:**
```json
{
  "content": "Nice post!",
  "parentId": null
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| content | string | ✅ | Текст комментария |
| parentId | number | ❌ | ID родительского комментария (для ответов) |

### Response

**201 Created**
```json
{
  "id": 10,
  "content": "Nice post!",
  "author": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "avatars/avatar-123.jpg"
  },
  "parentId": null,
  "postId": 3,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Examples

**Комментарий к посту:**
```bash
curl -X POST http://localhost:8080/comments/post/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content": "Nice post!"}'
```

**Ответ на комментарий:**
```bash
curl -X POST http://localhost:8080/comments/post/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content": "Thanks!", "parentId": 10}'
```

---

## GET /comments/article/:id

Получение комментариев статьи (только корневые, без ответов).

### Request

```http
GET /comments/article/:id?offset=0&limit=5
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID статьи |
| offset | number | 0 | Смещение |
| limit | number | 5 | Количество комментариев |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 1,
      "content": "Great article! Very helpful.",
      "author": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "avatars/avatar-123.jpg"
      },
      "parentId": null,
      "repliesCount": 3,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "content": "Thanks for sharing!",
      "author": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "avatars/avatar-456.jpg"
      },
      "parentId": null,
      "repliesCount": 0,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "total": 15,
  "hasMore": true
}
```

### Example

```bash
# Первая страница комментариев
curl -X GET "http://localhost:8080/comments/article/1?offset=0&limit=5"

# Загрузить ещё
curl -X GET "http://localhost:8080/comments/article/1?offset=5&limit=5"
```

---

## GET /comments/post/:id

Получение комментариев поста (только корневые, без ответов).

### Request

```http
GET /comments/post/:id?offset=0&limit=5
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID поста |
| offset | number | 0 | Смещение |
| limit | number | 5 | Количество комментариев |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 10,
      "content": "Nice post!",
      "author": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "avatars/avatar-123.jpg"
      },
      "parentId": null,
      "repliesCount": 2,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 5,
  "hasMore": false
}
```

### Example

```bash
curl -X GET "http://localhost:8080/comments/post/1?offset=0&limit=5"
```

---

## GET /comments/:id/replies

Получение ответов на комментарий (для статей).

### Request

```http
GET /comments/:id/replies?offset=0&limit=3
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID родительского комментария |
| offset | number | 0 | Смещение |
| limit | number | 3 | Количество ответов |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 5,
      "content": "I totally agree!",
      "author": {
        "id": 3,
        "firstName": "Bob",
        "lastName": "Wilson",
        "avatar": null
      },
      "parentId": 1,
      "repliesCount": 0,
      "createdAt": "2024-01-15T10:45:00.000Z"
    },
    {
      "id": 6,
      "content": "Thanks for your feedback!",
      "author": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "avatars/avatar-123.jpg"
      },
      "parentId": 1,
      "repliesCount": 0,
      "createdAt": "2024-01-15T10:50:00.000Z"
    }
  ],
  "total": 3,
  "hasMore": true
}
```

### Example

```bash
# Загрузить первые 3 ответа
curl -X GET "http://localhost:8080/comments/1/replies?offset=0&limit=3"

# Загрузить ещё
curl -X GET "http://localhost:8080/comments/1/replies?offset=3&limit=3"
```

---

## GET /comments/post/:id/replies

Получение ответов на комментарий поста.

### Request

```http
GET /comments/post/:id/replies?offset=0&limit=3
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| id | number | — | ID родительского комментария |
| offset | number | 0 | Смещение |
| limit | number | 3 | Количество ответов |

### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 15,
      "content": "You're welcome!",
      "author": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "avatars/avatar-456.jpg"
      },
      "parentId": 10,
      "repliesCount": 0,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "total": 2,
  "hasMore": true
}
```

### Example

```bash
curl -X GET "http://localhost:8080/comments/post/10/replies?offset=0&limit=3"
```

---

## Comment Structure

### Иерархия комментариев

Комментарии поддерживают один уровень вложенности (ответы на комментарии):

```
Комментарий (parentId: null)
├── Ответ 1 (parentId: commentId)
├── Ответ 2 (parentId: commentId)
└── Ответ 3 (parentId: commentId)
```

### Поле repliesCount

Поле `repliesCount` показывает количество прямых ответов на комментарий. Используйте его для отображения кнопки "Показать N ответов".

### Рекомендации по загрузке

1. **Корневые комментарии:** Загружайте по 5-10 штук с пагинацией
2. **Ответы:** Загружайте по 3-5 штук при раскрытии
3. **Используйте `hasMore`** для определения необходимости кнопки "Загрузить ещё"
