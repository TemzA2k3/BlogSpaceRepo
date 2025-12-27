# Articles API Reference

API для управления статьями (длинными публикациями с секциями).

## Base URL

```
/articles
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | / | Создание статьи | ✅ |
| GET | / | Получение всех статей | ❌ |
| GET | /:id | Получение статьи по ID | ⚪ |
| PATCH | /:id/like | Лайк/анлайк статьи | ✅ |
| PATCH | /:id/save | Сохранить/убрать статью | ✅ |

> ⚪ — Опциональная аутентификация (дополнительные данные для авторизованных)

---

## POST /articles

Создание новой статьи.

### Request

```http
POST /articles
Content-Type: multipart/form-data
Cookie: access_token=...
```

**Body (form-data):**
| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| title | string | ✅ | Заголовок статьи |
| description | string | ❌ | Краткое описание |
| sections | string (JSON) | ✅ | Массив секций |
| hashtags | string (JSON) | ❌ | Массив хэштегов |
| coverImage | file | ❌ | Обложка (max 5MB) |

**Формат sections:**
```json
[
  {
    "title": "Introduction",
    "content": "This is the introduction..."
  },
  {
    "title": "Main Content",
    "content": "This is the main content with <b>HTML</b> support..."
  }
]
```

### Response

**201 Created**
```json
{
  "id": 1,
  "title": "Getting Started with NestJS",
  "description": "A comprehensive guide to NestJS",
  "coverImage": "articles/article-1234567890.jpg",
  "sections": [
    { "title": "Introduction", "content": "..." },
    { "title": "Installation", "content": "..." }
  ],
  "authorId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**400 Bad Request** — Отсутствует заголовок
```json
{
  "statusCode": 400,
  "message": "Title is required",
  "error": "Bad Request"
}
```

### Example

```bash
curl -X POST http://localhost:8080/articles \
  -b cookies.txt \
  -F "title=Getting Started with NestJS" \
  -F "description=A comprehensive guide" \
  -F 'sections=[{"title":"Introduction","content":"NestJS is a framework..."},{"title":"Installation","content":"npm install @nestjs/cli"}]' \
  -F 'hashtags=["nestjs","nodejs","typescript"]' \
  -F "coverImage=@/path/to/cover.jpg"
```

---

## GET /articles

Получение списка статей с пагинацией.

### Request

```http
GET /articles?limit=21&offset=0
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| limit | number | 21 | Количество статей |
| offset | number | 0 | Смещение |

### Response

**200 OK**
```json
[
  {
    "id": 1,
    "title": "Getting Started with NestJS",
    "description": "A comprehensive guide to NestJS",
    "coverImage": "articles/article-123.jpg",
    "author": {
      "id": 1,
      "fullName": "John Doe",
      "avatar": "avatars/avatar-123.jpg"
    },
    "likes": 156,
    "commentsCount": 23,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Example

```bash
# Первая страница
curl -X GET "http://localhost:8080/articles?limit=21&offset=0"

# Вторая страница
curl -X GET "http://localhost:8080/articles?limit=21&offset=21"
```

---

## GET /articles/:id

Получение статьи по ID с полным содержимым.

### Request

```http
GET /articles/:id
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID статьи |

### Response

**200 OK**
```json
{
  "id": 1,
  "title": "Getting Started with NestJS",
  "description": "A comprehensive guide to building scalable applications",
  "coverImage": "articles/article-123.jpg",
  "sections": [
    {
      "title": "Introduction",
      "content": "NestJS is a progressive Node.js framework for building efficient and scalable server-side applications..."
    },
    {
      "title": "Installation",
      "content": "To get started, install NestJS CLI globally:\n\n<code>npm install -g @nestjs/cli</code>"
    },
    {
      "title": "Creating a Project",
      "content": "Create a new project using:\n\n<code>nest new project-name</code>"
    }
  ],
  "hashtags": ["nestjs", "nodejs", "typescript"],
  "author": {
    "id": 1,
    "fullName": "John Doe",
    "avatar": "avatars/avatar-123.jpg"
  },
  "likes": 156,
  "saved": 45,
  "commentsCount": 23,
  "likedByCurrentUser": false,
  "savedByCurrentUser": true,
  "comments": [
    {
      "id": 1,
      "content": "Great article!",
      "author": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "avatars/avatar-456.jpg"
      },
      "repliesCount": 2,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

> Поля `likedByCurrentUser` и `savedByCurrentUser` доступны только для авторизованных пользователей.

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found"
}
```

### Example

```bash
curl -X GET http://localhost:8080/articles/1
```

---

## PATCH /articles/:id/like

Переключение лайка на статье (лайк/анлайк).

### Request

```http
PATCH /articles/:id/like
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID статьи |

### Response

**200 OK** — Лайк добавлен
```json
{
  "liked": true,
  "likesCount": 157
}
```

**200 OK** — Лайк убран
```json
{
  "liked": false,
  "likesCount": 156
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/articles/1/like \
  -b cookies.txt
```

---

## PATCH /articles/:id/save

Переключение сохранения статьи.

### Request

```http
PATCH /articles/:id/save
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID статьи |

### Response

**200 OK** — Статья сохранена
```json
{
  "saved": true,
  "savedCount": 46
}
```

**200 OK** — Статья убрана из сохранённых
```json
{
  "saved": false,
  "savedCount": 45
}
```

### Example

```bash
curl -X PATCH http://localhost:8080/articles/1/save \
  -b cookies.txt
```

---

## Article Sections

Секции статьи поддерживают HTML-форматирование для создания структурированного контента.

### Поддерживаемые HTML теги

| Тег | Описание |
|-----|----------|
| `<b>`, `<strong>` | Жирный текст |
| `<i>`, `<em>` | Курсив |
| `<u>` | Подчёркивание |
| `<code>` | Код (inline) |
| `<pre>` | Блок кода |
| `<a href="...">` | Ссылки |
| `<ul>`, `<ol>`, `<li>` | Списки |
| `<h1>` - `<h6>` | Заголовки |
| `<p>` | Параграфы |
| `<br>` | Перенос строки |
| `<blockquote>` | Цитата |

### Пример секции с форматированием

```json
{
  "title": "Code Examples",
  "content": "<p>Here's how to create a controller:</p><pre><code>@Controller('users')\nexport class UsersController {\n  @Get()\n  findAll() {\n    return 'All users';\n  }\n}</code></pre><p>The <code>@Controller</code> decorator marks this class as a controller.</p>"
}
```
