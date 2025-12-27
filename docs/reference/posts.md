# Posts API Reference

API для управления постами (короткими публикациями).

## Base URL

```
/posts
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | / | Создание поста | ✅ |
| GET | / | Получение всех постов | ⚪ |
| GET | /:id | Получение поста по ID | ⚪ |
| DELETE | /:id | Удаление поста | ✅ |
| PATCH | /:id/like | Лайк/анлайк поста | ✅ |
| PATCH | /:id/save | Сохранить/убрать пост | ✅ |
| GET | /recommendations | Рекомендации | ⚪ |
| POST | /report | Жалоба на пост | ⚪ |

> ⚪ — Опциональная аутентификация (дополнительные данные для авторизованных)

---

## POST /posts

Создание нового поста.

### Request

```http
POST /posts
Content-Type: multipart/form-data
Cookie: access_token=...
```

**Body (form-data):**
| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| content | string | ⚪ | Текст поста |
| hashtags | string (JSON) | ⚪ | Массив хэштегов |
| image | file | ⚪ | Изображение (max 5MB) |

> Как минимум один из параметров (content, hashtags, image) должен быть заполнен.

### Response

**201 Created**
```json
{
  "id": 1,
  "content": "Just launched my new project! 🚀",
  "image": "posts/post-1234567890.jpg",
  "authorId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**400 Bad Request** — Пустой пост
```json
{
  "statusCode": 400,
  "message": "Post must have content, image or hashtag",
  "error": "Bad Request"
}
```

### Examples

**С текстом и хэштегами:**
```bash
curl -X POST http://localhost:8080/posts \
  -b cookies.txt \
  -F "content=Hello world!" \
  -F 'hashtags=["hello", "world"]'
```

**С изображением:**
```bash
curl -X POST http://localhost:8080/posts \
  -b cookies.txt \
  -F "content=Check out this photo!" \
  -F "image=@/path/to/photo.jpg"
```

**Только изображение:**
```bash
curl -X POST http://localhost:8080/posts \
  -b cookies.txt \
  -F "image=@/path/to/photo.jpg"
```

---

## GET /posts

Получение списка постов с пагинацией.

### Request

```http
GET /posts?limit=15&offset=0
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| limit | number | 15 | Количество постов |
| offset | number | 0 | Смещение |

### Response

**200 OK**
```json
[
  {
    "id": 1,
    "content": "Just launched my new project!",
    "image": "posts/post-123.jpg",
    "authorId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "userName": "@johndoe",
    "avatar": "avatars/avatar-123.jpg",
    "hashtags": ["launch", "project"],
    "likes": 42,
    "commentsCount": 5,
    "likedByCurrentUser": true,
    "savedByCurrentUser": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

> Поля `likedByCurrentUser` и `savedByCurrentUser` доступны только для авторизованных пользователей.

### Example

```bash
# Первая страница
curl -X GET "http://localhost:8080/posts?limit=15&offset=0"

# Вторая страница
curl -X GET "http://localhost:8080/posts?limit=15&offset=15"
```

---

## GET /posts/:id

Получение поста по ID.

### Request

```http
GET /posts/:id
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID поста |

### Response

**200 OK**
```json
{
  "id": 1,
  "content": "Just launched my new project!",
  "image": "posts/post-123.jpg",
  "authorId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "userName": "@johndoe",
  "avatar": "avatars/avatar-123.jpg",
  "hashtags": ["launch", "project"],
  "likes": 42,
  "commentsCount": 5,
  "likedByCurrentUser": false,
  "savedByCurrentUser": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### Example

```bash
curl -X GET http://localhost:8080/posts/1
```

---

## DELETE /posts/:id

Удаление поста. Доступно только автору.

### Request

```http
DELETE /posts/:id
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID поста |

### Response

**200 OK**
```json
{
  "message": "Post deleted successfully"
}
```

**403 Forbidden** — Удаление чужого поста
```json
{
  "statusCode": 403,
  "message": "You can only delete your own posts",
  "error": "Forbidden"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### Example

```bash
curl -X DELETE http://localhost:8080/posts/1 \
  -b cookies.txt
```

---

## PATCH /posts/:id/like

Переключение лайка на посте (лайк/анлайк).

### Request

```http
PATCH /posts/:id/like
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID поста |

### Response

**200 OK** — Лайк добавлен
```json
{
  "liked": true,
  "likesCount": 43
}
```

**200 OK** — Лайк убран
```json
{
  "liked": false,
  "likesCount": 42
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/posts/1/like \
  -b cookies.txt
```

---

## PATCH /posts/:id/save

Переключение сохранения поста.

### Request

```http
PATCH /posts/:id/save
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID поста |

### Response

**200 OK** — Пост сохранён
```json
{
  "saved": true,
  "savedCount": 15
}
```

**200 OK** — Пост убран из сохранённых
```json
{
  "saved": false,
  "savedCount": 14
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/posts/1/save \
  -b cookies.txt
```

---

## GET /posts/recommendations

Получение рекомендаций (популярные хэштеги и пользователи для подписки).

### Request

```http
GET /posts/recommendations
```

### Response

**200 OK**
```json
{
  "hashtags": [
    { "name": "technology", "count": 156 },
    { "name": "programming", "count": 98 },
    { "name": "javascript", "count": 87 }
  ],
  "users": [
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "userName": "@janesmith",
      "avatar": "avatars/avatar-456.jpg",
      "followersCount": 1250
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:8080/posts/recommendations
```

---

## POST /posts/report

Отправка жалобы на пост.

### Request

```http
POST /posts/report
Content-Type: application/json
```

**Body:**
```json
{
  "postId": 1,
  "reason": "spam",
  "additionalInfo": "This post contains spam links"
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| postId | number | ✅ | ID поста |
| reason | string | ✅ | Причина жалобы |
| additionalInfo | string | ❌ | Дополнительная информация |

**Допустимые значения reason:**
| Значение | Описание |
|----------|----------|
| spam | Спам или реклама |
| harassment | Оскорбления или травля |
| violence | Насилие или опасный контент |
| misinformation | Ложная информация |
| hatespeech | Разжигание ненависти |
| inappropriate | Неприемлемый контент |
| other | Другое |

### Response

**204 No Content**

### Examples

```bash
# Жалоба на спам
curl -X POST http://localhost:8080/posts/report \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "reason": "spam"
  }'

# Жалоба с дополнительной информацией
curl -X POST http://localhost:8080/posts/report \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "reason": "harassment",
    "additionalInfo": "User is posting offensive content"
  }'
```
