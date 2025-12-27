# Error Codes

Описание всех кодов ошибок и их обработка в BlogSpace API.

## Формат ошибки

Все ошибки возвращаются в стандартном формате:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| statusCode | number | HTTP код ошибки |
| message | string \| string[] | Описание ошибки или массив ошибок валидации |
| error | string | Название типа ошибки |

## HTTP Status Codes

### 2xx — Success

| Код | Название | Описание |
|-----|----------|----------|
| 200 | OK | Запрос выполнен успешно |
| 201 | Created | Ресурс успешно создан |
| 204 | No Content | Запрос выполнен, тело ответа отсутствует |

### 4xx — Client Errors

| Код | Название | Описание |
|-----|----------|----------|
| 400 | Bad Request | Невалидные данные запроса |
| 401 | Unauthorized | Требуется аутентификация |
| 403 | Forbidden | Доступ запрещён |
| 404 | Not Found | Ресурс не найден |
| 409 | Conflict | Конфликт данных |
| 413 | Payload Too Large | Файл слишком большой |

### 5xx — Server Errors

| Код | Название | Описание |
|-----|----------|----------|
| 500 | Internal Server Error | Внутренняя ошибка сервера |

---

## Ошибки по модулям

### Auth Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | User with this email already exists | Email уже зарегистрирован | Использовать другой email |
| 400 | Invalid email or password | Неверные учётные данные | Проверить email и пароль |
| 400 | User is blocked | Аккаунт заблокирован | Обратиться в поддержку |
| 400 | Invalid or expired token | Невалидный reset token | Запросить новую ссылку сброса |
| 401 | Unauthorized | Не авторизован | Выполнить вход |

**Примеры:**

```json
// Ошибка регистрации
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "error": "Bad Request"
}

// Ошибка входа
{
  "statusCode": 400,
  "message": "Invalid email or password",
  "error": "Bad Request"
}

// Заблокированный пользователь
{
  "statusCode": 400,
  "message": "User is blocked",
  "error": "Bad Request"
}
```

### Users Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | You cannot follow yourself | Попытка подписаться на себя | Нельзя подписаться на себя |
| 403 | You can only access your own settings | Доступ к чужим настройкам | Запросить свои настройки |
| 403 | You can only update your own settings | Изменение чужих настроек | Изменять только свои |
| 403 | You can only change your own password | Изменение чужого пароля | Изменять только свой |
| 403 | You can only delete your own account | Удаление чужого аккаунта | Удалять только свой |
| 404 | User not found | Пользователь не найден | Проверить ID пользователя |

**Примеры:**

```json
// Подписка на себя
{
  "statusCode": 400,
  "message": "You cannot follow yourself!",
  "error": "Bad Request"
}

// Доступ к чужим настройкам
{
  "statusCode": 403,
  "message": "You can only access your own settings",
  "error": "Forbidden"
}
```

### Posts Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | Post must have content, image or hashtag | Пустой пост | Добавить контент |
| 403 | You can only delete your own posts | Удаление чужого поста | Можно удалять только свои |
| 404 | Post not found | Пост не найден | Проверить ID поста |

**Примеры:**

```json
// Пустой пост
{
  "statusCode": 400,
  "message": "Post must have content, image or hashtag",
  "error": "Bad Request"
}

// Пост не найден
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### Articles Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | Title is required | Отсутствует заголовок | Добавить заголовок |
| 400 | Cover image is required | Отсутствует обложка | Загрузить обложку |
| 400 | At least one section must have content | Пустые секции | Заполнить секции |
| 404 | Article not found | Статья не найдена | Проверить ID статьи |

### Comments Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | Content is required | Пустой комментарий | Добавить текст |
| 404 | Comment not found | Комментарий не найден | Проверить ID |
| 404 | Post/Article not found | Пост/статья не найдены | Проверить ID |

### Chat Module

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | targetUserId is required | Не указан получатель | Указать ID пользователя |
| 404 | Chat not found | Чат не найден | Проверить ID чата |

---

## Ошибки валидации

При невалидных данных возвращается массив ошибок:

```json
{
  "statusCode": 400,
  "message": [
    "firstName must be longer than or equal to 2 characters",
    "lastName must be longer than or equal to 2 characters",
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Распространённые ошибки валидации

| Поле | Ошибка | Требование |
|------|--------|------------|
| firstName | must be longer than or equal to 2 characters | Мин. 2 символа |
| lastName | must be longer than or equal to 2 characters | Мин. 2 символа |
| email | must be an email | Валидный email |
| password | must be longer than or equal to 6 characters | Мин. 6 символов |
| remember | must be a boolean value | true или false |

---

## Ошибки загрузки файлов

| Код | Сообщение | Причина | Решение |
|-----|-----------|---------|---------|
| 400 | File is required | Файл не загружен | Прикрепить файл |
| 400 | Invalid file type | Неподдерживаемый формат | Использовать jpg, png, gif |
| 413 | File too large | Файл превышает лимит | Уменьшить размер файла |

**Лимиты файлов:**
| Тип | Максимальный размер | Форматы |
|-----|---------------------|---------|
| Avatar | 2 MB | jpg, jpeg, png, gif |
| Post image | 5 MB | jpg, jpeg, png, gif |
| Article cover | 5 MB | jpg, jpeg, png, gif |

---

## Обработка ошибок на клиенте

### JavaScript / TypeScript

```typescript
interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

const handleApiError = (error: ApiError) => {
  switch (error.statusCode) {
    case 400:
      // Validation or business logic error
      if (Array.isArray(error.message)) {
        // Validation errors
        error.message.forEach(msg => showToast(msg, 'error'));
      } else {
        showToast(error.message, 'error');
      }
      break;
    
    case 401:
      // Unauthorized - redirect to login
      window.location.href = '/login';
      break;
    
    case 403:
      // Forbidden
      showToast('У вас нет прав для этого действия', 'error');
      break;
    
    case 404:
      // Not found
      showToast('Ресурс не найден', 'error');
      break;
    
    case 413:
      // File too large
      showToast('Файл слишком большой', 'error');
      break;
    
    case 500:
      // Server error
      showToast('Произошла ошибка сервера', 'error');
      break;
    
    default:
      showToast('Произошла неизвестная ошибка', 'error');
  }
};
```

### Fetch API с обработкой ошибок

```typescript
const apiRequest = async <T>(
  url: string, 
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    handleApiError(error);
    throw error;
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Использование
try {
  const user = await apiRequest<User>('/auth/me');
  console.log(user);
} catch (error) {
  // Ошибка уже обработана в handleApiError
}
```

### Axios interceptor

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    const apiError: ApiError = error.response?.data;
    
    if (apiError) {
      handleApiError(apiError);
    } else {
      // Network error
      showToast('Ошибка сети. Проверьте подключение.', 'error');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## WebSocket ошибки

При работе с WebSocket могут возникать следующие ситуации:

| Событие | Причина | Решение |
|---------|---------|---------|
| disconnect | Разрыв соединения | Переподключение |
| connect_error | Ошибка подключения | Проверить токен |
| error | Ошибка сокета | Обработать ошибку |

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Возможно, токен истёк - перенаправить на логин
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    // Сервер отключил - возможно, невалидный токен
    socket.connect();
  }
});
```
