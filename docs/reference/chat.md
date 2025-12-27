# Chat API Reference

API для обмена сообщениями между пользователями. Включает REST API и WebSocket для real-time коммуникации.

## Base URL

```
REST: /chat
WebSocket: ws://localhost:8080
```

---

## REST API

### Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | / | Создание чата | ✅ |
| GET | / | Получение всех чатов | ✅ |
| DELETE | /:id | Удаление чата | ✅ |
| GET | /:chat_id/messages | Получение сообщений | ✅ |

---

### POST /chat

Создание нового чата с пользователем или получение существующего.

#### Request

```http
POST /chat
Content-Type: application/json
Cookie: access_token=...
```

**Body:**
```json
{
  "targetUserId": 2
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| targetUserId | number | ✅ | ID пользователя для чата |

#### Response

**201 Created** — Новый чат создан
```json
{
  "id": 1,
  "user1Id": 1,
  "user2Id": 2,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**200 OK** — Чат уже существует
```json
{
  "id": 1,
  "user1Id": 1,
  "user2Id": 2,
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "targetUserId is required!",
  "error": "Bad Request"
}
```

#### Example

```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"targetUserId": 2}'
```

---

### GET /chat

Получение списка всех чатов текущего пользователя.

#### Request

```http
GET /chat
Cookie: access_token=...
```

#### Response

**200 OK**
```json
[
  {
    "id": 1,
    "chatId": 1,
    "recipientId": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "avatar": "avatars/avatar-456.jpg",
    "lastMessage": "Hey, how are you?",
    "time": "2024-01-15T14:30:00.000Z",
    "online": true,
    "unread": 2
  },
  {
    "id": 3,
    "chatId": 5,
    "recipientId": 3,
    "firstName": "Bob",
    "lastName": "Wilson",
    "avatar": null,
    "lastMessage": "See you tomorrow!",
    "time": "2024-01-15T10:00:00.000Z",
    "online": false,
    "unread": 0
  }
]
```

| Поле | Тип | Описание |
|------|-----|----------|
| id | number | ID собеседника |
| chatId | number | ID чата |
| recipientId | number | ID собеседника |
| firstName | string | Имя собеседника |
| lastName | string | Фамилия собеседника |
| avatar | string \| null | Аватар собеседника |
| lastMessage | string | Последнее сообщение |
| time | datetime | Время последнего сообщения |
| online | boolean | Онлайн ли собеседник |
| unread | number | Количество непрочитанных |

#### Example

```bash
curl -X GET http://localhost:8080/chat \
  -b cookies.txt
```

---

### DELETE /chat/:id

Удаление чата.

#### Request

```http
DELETE /chat/:id
Cookie: access_token=...
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID чата |

#### Response

**204 No Content**

#### Example

```bash
curl -X DELETE http://localhost:8080/chat/1 \
  -b cookies.txt
```

---

### GET /chat/:chat_id/messages

Получение сообщений чата с пагинацией.

#### Request

```http
GET /chat/:chat_id/messages?offset=0&limit=30
Cookie: access_token=...
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| chat_id | number | — | ID чата |
| offset | number | 0 | Смещение |
| limit | number | 30 | Количество сообщений |

#### Response

**200 OK**
```json
{
  "items": [
    {
      "id": 100,
      "chatId": 1,
      "senderId": 2,
      "text": "Hey, how are you?",
      "isRead": true,
      "createdAt": "2024-01-15T14:30:00.000Z"
    },
    {
      "id": 99,
      "chatId": 1,
      "senderId": 1,
      "text": "I'm good, thanks! Working on a new project.",
      "isRead": true,
      "createdAt": "2024-01-15T14:25:00.000Z"
    }
  ],
  "total": 156,
  "hasMore": true
}
```

#### Example

```bash
# Последние 30 сообщений
curl -X GET "http://localhost:8080/chat/1/messages?offset=0&limit=30" \
  -b cookies.txt

# Загрузить предыдущие
curl -X GET "http://localhost:8080/chat/1/messages?offset=30&limit=30" \
  -b cookies.txt
```

---

## WebSocket API

Real-time коммуникация через Socket.IO.

### Подключение

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  withCredentials: true, // Для отправки cookies
});
```

> **Аутентификация:** JWT токен извлекается из cookie `access_token` при подключении.

---

### События от сервера (Server → Client)

#### userStatusChanged

Пользователь вышел в онлайн или оффлайн.

```javascript
socket.on('userStatusChanged', (data) => {
  console.log(data);
  // { userId: 2, online: true }
});
```

#### initialOnlineUsers

Список онлайн пользователей при подключении.

```javascript
socket.on('initialOnlineUsers', (userIds) => {
  console.log(userIds);
  // [1, 2, 5, 10]
});
```

#### newMessage

Новое сообщение в чате.

```javascript
socket.on('newMessage', (message) => {
  console.log(message);
  // {
  //   id: 101,
  //   chatId: 1,
  //   senderId: 2,
  //   text: "Hello!",
  //   isRead: false,
  //   createdAt: "2024-01-15T14:35:00.000Z"
  // }
});
```

#### newChat

Уведомление о новом сообщении (для неактивного чата).

```javascript
socket.on('newChat', (chat) => {
  console.log(chat);
  // {
  //   id: 2,
  //   chatId: 1,
  //   firstName: "Jane",
  //   lastName: "Smith",
  //   avatar: "avatars/avatar-456.jpg",
  //   lastMessage: "Hello!",
  //   time: "2024-01-15T14:35:00.000Z",
  //   online: true,
  //   unread: 1
  // }
});
```

#### chatUnread

Обновление unread для активного чата.

```javascript
socket.on('chatUnread', (chat) => {
  console.log(chat);
  // { ...chatData, unread: 0 }
});
```

#### messageRead

Сообщения прочитаны.

```javascript
socket.on('messageRead', (data) => {
  console.log(data);
  // { chatId: 1, messageIds: [99, 100, 101] }
});
```

#### userTyping

Пользователь печатает.

```javascript
socket.on('userTyping', (data) => {
  console.log(data);
  // { userId: 2, typing: true }
});
```

---

### События от клиента (Client → Server)

#### joinChat

Присоединиться к комнате чата.

```javascript
socket.emit('joinChat', chatId);
// chatId: number
```

#### leaveChat

Покинуть комнату чата.

```javascript
socket.emit('leaveChat', chatId);
// chatId: number
```

#### sendMessage

Отправить сообщение.

```javascript
socket.emit('sendMessage', {
  chatId: 1,
  senderId: 1,
  recipientId: 2,
  text: 'Hello!'
});
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| chatId | number | ID чата |
| senderId | number | ID отправителя |
| recipientId | number | ID получателя |
| text | string | Текст сообщения |

#### markAsRead

Пометить сообщения как прочитанные.

```javascript
socket.emit('markAsRead', {
  chatId: 1,
  userId: 1
});
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| chatId | number | ID чата |
| userId | number | ID текущего пользователя |

#### typing

Уведомить о начале набора.

```javascript
socket.emit('typing', { userId: 1 });
```

#### stopTyping

Уведомить об окончании набора.

```javascript
socket.emit('stopTyping', { userId: 1 });
```

---

## Полный пример клиента

```javascript
import { io } from 'socket.io-client';

class ChatClient {
  constructor() {
    this.socket = io('http://localhost:8080', {
      withCredentials: true,
    });
    
    this.setupListeners();
  }
  
  setupListeners() {
    // Подключение
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });
    
    // Онлайн пользователи при подключении
    this.socket.on('initialOnlineUsers', (userIds) => {
      this.onlineUsers = new Set(userIds);
    });
    
    // Статус пользователей
    this.socket.on('userStatusChanged', ({ userId, online }) => {
      if (online) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }
      this.updateUserStatus(userId, online);
    });
    
    // Новые сообщения
    this.socket.on('newMessage', (message) => {
      this.addMessageToChat(message);
    });
    
    // Обновление списка чатов
    this.socket.on('newChat', (chat) => {
      this.updateChatList(chat);
      this.showNotification(chat);
    });
    
    // Сообщения прочитаны
    this.socket.on('messageRead', ({ chatId, messageIds }) => {
      this.markMessagesAsRead(chatId, messageIds);
    });
    
    // Индикатор печати
    this.socket.on('userTyping', ({ userId, typing }) => {
      this.showTypingIndicator(userId, typing);
    });
    
    // Отключение
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });
  }
  
  // Открыть чат
  openChat(chatId) {
    this.currentChatId = chatId;
    this.socket.emit('joinChat', chatId);
  }
  
  // Закрыть чат
  closeChat(chatId) {
    this.socket.emit('leaveChat', chatId);
    this.currentChatId = null;
  }
  
  // Отправить сообщение
  sendMessage(recipientId, text) {
    this.socket.emit('sendMessage', {
      chatId: this.currentChatId,
      senderId: this.userId,
      recipientId,
      text
    });
  }
  
  // Пометить как прочитанное
  markAsRead() {
    if (this.currentChatId) {
      this.socket.emit('markAsRead', {
        chatId: this.currentChatId,
        userId: this.userId
      });
    }
  }
  
  // Печатает...
  startTyping() {
    this.socket.emit('typing', { userId: this.userId });
  }
  
  stopTyping() {
    this.socket.emit('stopTyping', { userId: this.userId });
  }
}

// Использование
const chat = new ChatClient();
chat.userId = currentUserId;

// Открыть чат
chat.openChat(1);

// Отправить сообщение
chat.sendMessage(2, 'Hello!');

// При вводе текста
inputElement.addEventListener('input', () => {
  chat.startTyping();
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => chat.stopTyping(), 1000);
});
```
