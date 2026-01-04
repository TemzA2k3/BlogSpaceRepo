# BlogSpace

## Project Information

| Field | Value |
|-------|-------|
| **Student** | Artsem Ananich |
| **Group** | JS 2022 |
| **Supervisor** | Yahor Bialiauski |
| **Date** | January 2026 |

## Links

| Resource | URL |
|----------|-----|
| Production | https://creative-perception-production.up.railway.app |
| Repository | https://github.com/TemzA2k3/BlogSpaceRepo |
| API Docs | in application .http files |

## Elevator Pitch

BlogSpace is a modern social media platform that combines the best features of Twitter, Reddit, and StackOverflow. Designed for content creators, developers, and knowledge sharers, it solves the problem of fragmented online communities by providing a unified space for short posts, long-form articles, and real-time discussions. What makes BlogSpace unique is its seamless integration of microblogging, article publishing with a rich text editor, hashtag-based content discovery, and instant messaging — all within a responsive, mobile-first interface with full dark mode support.

## Evaluation Criteria Checklist

| # | Criterion | Status | Documentation |
|---|-----------|--------|---------------|
| 1 | Adaptive UI | ✅ | [/02-technical/criteria/adaptive-ui.md](/02-technical/criteria/adaptive-ui.md) |
| 2 | API Doc | ✅ | [02-technical/criteria/api-doc.md](/02-technical/criteria/api-doc.md) |
| 3 | Backend | ✅ | [02-technical/criteria/backend.md](/02-technical/criteria/backend.md) |
| 4 | Database | ✅ | [02-technical/criteria/database.md](/02-technical/criteria/database.md) |
| 5 | Docker | ✅ | [02-technical/criteria/docker.md](/02-technical/criteria/docker.md) |
| 6 | Frontend | ✅ | [02-technical/criteria/frontend.md](/02-technical/criteria/frontend.md) |
| 7 | Realtime analytics | ✅ | [02-technical/criteria/realtime.md](/02-technical/criteria/realtime.md) |

## Key Features

| Feature | Description |
|---------|-------------|
| **Posts** | Short-form content with images and hashtags |
| **Articles** | Long-form content with rich text editor |
| **Real-time Chat** | WebSocket-based instant messaging |
| **User Profiles** | Customizable profiles with avatars and settings |
| **Follow System** | Follow users and see personalized content |
| **Search & Discovery** | Hashtag-based content discovery |
| **Dark Mode** | Full theme support with system preference detection |
| **Internationalization** | Multi-language support (EN/RU) |
| **Mobile Responsive** | Optimized for all device sizes |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **State Management** | Redux Toolkit |
| **Backend** | NestJS, TypeORM |
| **Database** | PostgreSQL 15 |
| **Real-time** | Socket.IO |
| **Authentication** | JWT with HttpOnly Cookies |
| **File Storage** | Railway Volume |
| **Deployment** | Railway (nginx reverse proxy) |
| **Email** | MailerSend |

## Documentation Navigation

- [Project Overview](01-project-overview/index.md) - Business context, goals, and requirements
- [Technical Implementation](02-technical/index.md) - Architecture, tech stack, and criteria details
- [User Guide](03-user-guide/index.md) - How to use the application
- [Retrospective](04-retrospective/index.md) - Lessons learned and future improvements

## Quick Start

```bash
# Clone repository
git clone https://github.com/TemzA2k3/BlogSpaceRepo.git
cd blogspace

# Start server
cd server
cp .env.example .env
npm install
npm run start:dev

# Start client (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Posts  │  │Articles │  │  Chat   │  │  User Profiles  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       │            │            │                │          │
│       └────────────┴─────┬──────┴────────────────┘          │
│                          │                                   │
│                    Redux Toolkit                             │
└──────────────────────────┼───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │    REST API / WebSocket  │
              └────────────┬────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                      Server (NestJS)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Auth   │  │  Posts  │  │  Chat   │  │     Users       │ │
│  │ Module  │  │ Module  │  │ Gateway │  │     Module      │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       │            │            │                │          │
│       └────────────┴─────┬──────┴────────────────┘          │
│                          │                                   │
│                      TypeORM                                 │
└──────────────────────────┼───────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │ PostgreSQL  │
                    └─────────────┘
```

---

*Document created: January 2026*  
*Last updated: January 2026*