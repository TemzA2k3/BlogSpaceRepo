# Architecture Overview

## Обзор системы

BlogSpace — это социальная блог-платформа, построенная на современном технологическом стеке с использованием NestJS на бэкенде и React на фронтенде.

## Технологический стек

| Компонент | Технология | Версия |
|-----------|------------|--------|
| Backend Framework | NestJS | 10.x |
| Runtime | Node.js | 18.x+ |
| Database | PostgreSQL | 15.x |
| ORM | TypeORM | 0.3.x |
| Real-time | Socket.IO | 4.x |
| Authentication | JWT | - |
| File Storage | Local Filesystem | - |
| Frontend | React + TypeScript | 18.x |

## Архитектура системы

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                   │
│         (Web Browser / Mobile App / Third-party Services)           │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────┐               ┌───────────────────┐
        │    REST API       │               │    WebSocket      │
        │   (HTTP/HTTPS)    │               │   (Socket.IO)     │
        │   Port: 8080      │               │   Port: 8080      │
        └─────────┬─────────┘               └─────────┬─────────┘
                  │                                   │
                  └─────────────┬─────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         NESTJS SERVER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                        MIDDLEWARE                             │   │
│  │            (CORS, Cookie Parser, Validation)                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                         GUARDS                                │   │
│  │              (JWT Auth, Optional JWT Auth)                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                       CONTROLLERS                             │   │
│  │   Auth │ Users │ Posts │ Articles │ Comments │ Chat │ Contact │  │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                        SERVICES                               │   │
│  │        (Business Logic, Data Processing, Validation)         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     COMMON SERVICES                           │   │
│  │          Password │ Cookie │ Email │ JWT Token               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                │                                     │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │      TypeORM        │              │    File System      │       │
│  │   (Repositories)    │              │     (uploads/)      │       │
│  └──────────┬──────────┘              └──────────┬──────────┘       │
│             │                                    │                   │
│             ▼                                    ▼                   │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │    PostgreSQL       │              │   /uploads/avatars  │       │
│  │     Database        │              │   /uploads/posts    │       │
│  │                     │              │   /uploads/articles │       │
│  └─────────────────────┘              └─────────────────────┘       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Модули системы

### Core Modules

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP MODULE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Auth     │  │    Users    │  │    Posts    │              │
│  │   Module    │  │   Module    │  │   Module    │              │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤              │
│  │ • Register  │  │ • Profile   │  │ • CRUD      │              │
│  │ • Login     │  │ • Settings  │  │ • Like/Save │              │
│  │ • Logout    │  │ • Follow    │  │ • Feed      │              │
│  │ • Reset PWD │  │ • Avatar    │  │ • Report    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Articles   │  │  Comments   │  │    Chat     │              │
│  │   Module    │  │   Module    │  │   Module    │              │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤              │
│  │ • CRUD      │  │ • Post cmts │  │ • REST API  │              │
│  │ • Sections  │  │ • Article   │  │ • WebSocket │              │
│  │ • Like/Save │  │ • Replies   │  │ • Messages  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │   Contact   │  │   Email     │                               │
│  │   Module    │  │   Module    │                               │
│  ├─────────────┤  ├─────────────┤                               │
│  │ • Form      │  │ • Send mail │                               │
│  │ • Messages  │  │ • Templates │                               │
│  └─────────────┘  └─────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Common Module

```
┌─────────────────────────────────────────────────────────────────┐
│                       COMMON MODULE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      GUARDS                              │    │
│  │  • JwtAuthGuard - проверка JWT токена                   │    │
│  │  • OptionalJwtAuthGuard - опциональная проверка         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    DECORATORS                            │    │
│  │  • @UserReq() - получение данных пользователя           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   INTERCEPTORS                           │    │
│  │  • ImageUploadInterceptor - загрузка изображений        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      PIPES                               │    │
│  │  • ParseJsonArrayPipe - парсинг JSON массивов           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SERVICES                              │    │
│  │  • PasswordService - хеширование паролей                │    │
│  │  • CookieService - управление cookies                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      USER        │       │  USER_RELATION   │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │◄──────│ followerId (FK)  │
│ firstName        │◄──────│ followingId (FK) │
│ lastName         │       │ createdAt        │
│ email (unique)   │       └──────────────────┘
│ password         │
│ userName         │       ┌──────────────────┐
│ avatar           │       │      POST        │
│ bio              │       ├──────────────────┤
│ location         │       │ id (PK)          │
│ website          │◄──────│ authorId (FK)    │
│ isPublicProfile  │       │ content          │
│ isBlocked        │       │ image            │
│ role             │       │ createdAt        │
│ createdAt        │       └────────┬─────────┘
│ updatedAt        │                │
└────────┬─────────┘                │
         │                          │
         │       ┌──────────────────┼──────────────────┐
         │       │                  │                  │
         │       ▼                  ▼                  ▼
         │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
         │  │  POST_LIKE  │   │  POST_SAVE  │   │   HASHTAG   │
         │  ├─────────────┤   ├─────────────┤   ├─────────────┤
         │  │ userId (FK) │   │ userId (FK) │   │ id (PK)     │
         │  │ postId (FK) │   │ postId (FK) │   │ name        │
         │  │ createdAt   │   │ createdAt   │   │ postId (FK) │
         │  └─────────────┘   └─────────────┘   └─────────────┘
         │
         │       ┌──────────────────┐
         │       │     ARTICLE      │
         │       ├──────────────────┤
         │       │ id (PK)          │
         └──────►│ authorId (FK)    │
                 │ title            │
                 │ description      │
                 │ coverImage       │
                 │ sections (JSON)  │
                 │ createdAt        │
                 └────────┬─────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │ART_LIKE   │   │ART_SAVE   │   │ COMMENT   │
   ├───────────┤   ├───────────┤   ├───────────┤
   │userId(FK) │   │userId(FK) │   │id (PK)    │
   │articleId  │   │articleId  │   │authorId   │
   │createdAt  │   │createdAt  │   │postId(FK) │
   └───────────┘   └───────────┘   │articleId  │
                                   │parentId   │
                                   │content    │
                                   │createdAt  │
                                   └───────────┘

┌──────────────────┐       ┌──────────────────┐
│      CHAT        │       │     MESSAGE      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │◄──────│ chatId (FK)      │
│ user1Id (FK)     │       │ id (PK)          │
│ user2Id (FK)     │       │ senderId (FK)    │
│ createdAt        │       │ text             │
└──────────────────┘       │ isRead           │
                           │ createdAt        │
                           └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     REPORT       │       │ CONTACT_MESSAGE  │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ postId (FK)      │       │ name             │
│ reporterId (FK)  │       │ email            │
│ reason           │       │ subject          │
│ additionalInfo   │       │ message          │
│ createdAt        │       │ createdAt        │
└──────────────────┘       └──────────────────┘
```

## Request Flow

### REST API Request Flow

```
┌────────┐     HTTP Request      ┌──────────────────────────────────┐
│ Client │ ───────────────────► │           NestJS Server           │
└────────┘                       └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │         Global Middleware         │
                                 │   (CORS, CookieParser, Logger)   │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │         Validation Pipe           │
                                 │      (DTO Validation)             │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │            Guards                 │
                                 │   (JwtAuthGuard if protected)    │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │          Interceptors             │
                                 │  (ImageUpload, Transformations)  │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │          Controller               │
                                 │    (Route Handler Method)         │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │           Service                 │
                                 │      (Business Logic)             │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │          Repository               │
                                 │     (Database Operations)         │
                                 └──────────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌──────────────────────────────────┐
                                 │          PostgreSQL               │
                                 └──────────────────────────────────┘
```

### WebSocket Connection Flow

```
┌────────┐    WS Handshake + Cookie    ┌──────────────────────────┐
│ Client │ ──────────────────────────► │     ChatGateway          │
└────────┘                              │   (Socket.IO Server)     │
    │                                   └──────────────────────────┘
    │                                               │
    │   ┌───────────────────────────────────────────┘
    │   │
    │   ▼
    │   handleConnection()
    │   ├── Extract JWT from cookie
    │   ├── Verify token
    │   ├── Add to onlineUsers Map
    │   ├── Join user room (user_{id})
    │   └── Emit 'userStatusChanged'
    │
    │   Events:
    │   ├── joinChat(chatId)
    │   │   └── Join chat room (chat_{id})
    │   │
    │   ├── sendMessage(payload)
    │   │   ├── Save message to DB
    │   │   ├── Emit 'newMessage' to chat room
    │   │   └── Emit 'newChat' to recipient
    │   │
    │   ├── typing / stopTyping
    │   │   └── Emit 'userTyping' to all
    │   │
    │   └── markAsRead(payload)
    │       ├── Update messages in DB
    │       └── Emit 'messageRead' to chat room
    │
    │   handleDisconnect()
    │   ├── Remove from onlineUsers
    │   └── Emit 'userStatusChanged' (offline)
```

## File Structure

```
server/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   └── user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── optional-jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── image-upload.interceptor.ts
│   │   ├── jwt/
│   │   │   └── jwt.module.ts
│   │   ├── pipes/
│   │   │   └── parse-json-array.pipe.ts
│   │   └── services/
│   │       ├── cookie.service.ts
│   │       └── password.service.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   └── validation.ts
│   │
│   ├── database/
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── post.entity.ts
│   │   │   ├── article.entity.ts
│   │   │   ├── comment.entity.ts
│   │   │   ├── chat.entity.ts
│   │   │   ├── message.entity.ts
│   │   │   └── ...
│   │   └── database.module.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── articles/
│   │   ├── comments/
│   │   ├── chat/
│   │   ├── contact/
│   │   └── email/
│   │
│   ├── shared/
│   │   ├── types/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── uploads/
│   ├── avatars/
│   ├── posts/
│   └── articles/
│
├── .env
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| CLIENT_URL | Frontend URL | http://localhost:5173 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database user | postgres |
| DB_PASSWORD | Database password | password |
| DB_NAME | Database name | blogspace |
| JWT_SECRET | JWT signing secret | your-secret-key |
| SMTP_HOST | SMTP server | smtp.gmail.com |
| SMTP_PORT | SMTP port | 587 |
| SMTP_USER | SMTP username | email@gmail.com |
| SMTP_PASS | SMTP password | app-password |
