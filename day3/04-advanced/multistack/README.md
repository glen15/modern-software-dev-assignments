# 멀티 스택 가이드: 다양한 기술 스택으로 프로젝트 확장

## 개요

Day 3 팀 프로젝트를 다양한 기술 스택으로 구현하는 방법을 안내합니다.
기본 Python/FastAPI 외에 Node.js, Go, 그리고 모던 프론트엔드 프레임워크를 활용합니다.

---

## 학습 목표

- 여러 기술 스택의 특징과 적합한 사용처를 이해한다
- AI 도구를 활용하여 새로운 기술 스택을 빠르게 학습한다
- 백엔드/프론트엔드를 다양한 조합으로 구성할 수 있다

---

## 1. 기술 스택 선택 가이드

### 백엔드 옵션

| 스택 | 특징 | 적합한 경우 |
|------|------|------------|
| **Python/FastAPI** | 빠른 개발, AI 통합 용이 | ML/AI 기능, 프로토타입 |
| **Node.js/Express** | JavaScript 풀스택, 넓은 생태계 | 실시간 기능, JS 익숙할 때 |
| **Go/Gin** | 고성능, 컴파일 언어 | 고성능 API, 마이크로서비스 |
| **Rust/Axum** | 최고 성능, 메모리 안전 | 시스템 수준 성능 필요 시 |

### 프론트엔드 옵션

| 스택 | 특징 | 적합한 경우 |
|------|------|------------|
| **React** | 넓은 생태계, 유연함 | 복잡한 SPA, 커스터마이징 |
| **Next.js** | SSR, 풀스택 | SEO 중요, 빠른 개발 |
| **Vue.js** | 쉬운 학습, 점진적 도입 | 빠른 프로토타입 |
| **Svelte** | 작은 번들, 직관적 | 성능 중요, 새 프로젝트 |

---

## 2. Node.js/Express 백엔드

### 프로젝트 구조

```
backend-node/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── users.ts
│   │   └── health.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── services/
│   │   └── userService.ts
│   ├── models/
│   │   └── user.ts
│   └── middleware/
│       ├── auth.ts
│       └── errorHandler.ts
├── package.json
└── tsconfig.json
```

### 기본 설정

```bash
mkdir backend-node && cd backend-node
npm init -y
npm install express cors helmet
npm install -D typescript @types/node @types/express ts-node nodemon
npx tsc --init
```

### 기본 서버 (src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(helmet());
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/users', userRouter);

// 에러 핸들링
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### AI로 빠르게 구현하기

```bash
# Claude Code에서
claude
> Express + TypeScript로 사용자 CRUD API 만들어줘.
  - GET/POST/PUT/DELETE /api/users
  - Zod로 입력 검증
  - 에러 핸들링 미들웨어
  - 메모리 스토리지 사용
```

---

## 3. Go/Gin 백엔드

### 프로젝트 구조

```
backend-go/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handlers/
│   │   └── user.go
│   ├── models/
│   │   └── user.go
│   ├── services/
│   │   └── user.go
│   └── middleware/
│       └── auth.go
├── go.mod
└── go.sum
```

### 기본 설정

```bash
mkdir backend-go && cd backend-go
go mod init myproject
go get github.com/gin-gonic/gin
```

### 기본 서버 (cmd/server/main.go)

```go
package main

import (
    "github.com/gin-gonic/gin"
    "myproject/internal/handlers"
)

func main() {
    r := gin.Default()

    // 미들웨어
    r.Use(gin.Recovery())

    // 라우트
    api := r.Group("/api")
    {
        users := api.Group("/users")
        {
            users.GET("", handlers.GetUsers)
            users.GET("/:id", handlers.GetUser)
            users.POST("", handlers.CreateUser)
            users.PUT("/:id", handlers.UpdateUser)
            users.DELETE("/:id", handlers.DeleteUser)
        }
    }

    r.Run(":8080")
}
```

### 핸들러 예시 (internal/handlers/user.go)

```go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "myproject/internal/models"
)

var users = make(map[string]models.User)

func GetUsers(c *gin.Context) {
    result := make([]models.User, 0, len(users))
    for _, user := range users {
        result = append(result, user)
    }
    c.JSON(http.StatusOK, result)
}

func CreateUser(c *gin.Context) {
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    users[user.ID] = user
    c.JSON(http.StatusCreated, user)
}
```

### AI로 빠르게 구현하기

```bash
claude
> Go + Gin으로 사용자 CRUD API 만들어줘.
  - RESTful 엔드포인트
  - 구조체 검증
  - 에러 핸들링
  - 간단한 메모리 저장소
```

---

## 4. Next.js 프론트엔드

### 프로젝트 구조

```
frontend-next/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       └── users/
│           └── route.ts
├── components/
│   ├── UserList.tsx
│   └── UserForm.tsx
├── lib/
│   └── api.ts
└── package.json
```

### 기본 설정

```bash
npx create-next-app@latest frontend-next --typescript --tailwind --eslint --app
cd frontend-next
npm install @tanstack/react-query axios
```

### 기본 페이지 (app/users/page.tsx)

```tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from '@/lib/api';
import UserForm from '@/components/UserForm';

export default function UsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 관리</h1>

      <UserForm onSubmit={(data) => createMutation.mutate(data)} />

      <ul className="mt-4 space-y-2">
        {users?.map((user) => (
          <li key={user.id} className="p-2 border rounded">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### AI로 빠르게 구현하기

```bash
claude
> Next.js 14 (App Router)로 사용자 관리 페이지 만들어줘.
  - 사용자 목록 표시
  - 추가/수정/삭제 폼
  - TanStack Query로 상태 관리
  - Tailwind CSS 스타일링
```

---

## 5. React + Vite 프론트엔드

### 프로젝트 구조

```
frontend-react/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── UserList.tsx
│   │   └── UserForm.tsx
│   ├── hooks/
│   │   └── useUsers.ts
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── user.ts
├── package.json
└── vite.config.ts
```

### 기본 설정

```bash
npm create vite@latest frontend-react -- --template react-ts
cd frontend-react
npm install @tanstack/react-query axios react-router-dom
npm install -D @types/react-router-dom
```

### 커스텀 훅 (src/hooks/useUsers.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { User, CreateUserDto } from '../types/user';

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  const createUser = useMutation({
    mutationFn: (data: CreateUserDto) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    createUser: createUser.mutate,
    deleteUser: deleteUser.mutate,
  };
}
```

---

## 6. 스택 조합 예시

### 조합 1: 빠른 프로토타입

```
프론트: Next.js (SSR + API Routes)
백엔드: 없음 (Next.js API Routes 활용)
DB: SQLite / Prisma

장점: 단일 배포, 빠른 개발
```

### 조합 2: 확장 가능한 서비스

```
프론트: React + Vite
백엔드: Go/Gin
DB: PostgreSQL

장점: 고성능, 명확한 분리
```

### 조합 3: AI 중심 서비스

```
프론트: Next.js
백엔드: Python/FastAPI
DB: PostgreSQL + pgvector

장점: AI/ML 통합 용이
```

### 조합 4: 실시간 서비스

```
프론트: React + Socket.io-client
백엔드: Node.js/Express + Socket.io
DB: Redis + MongoDB

장점: 실시간 양방향 통신
```

---

## 7. AI 활용 팁

### 새로운 스택 빠르게 배우기

```bash
claude
> Go 언어를 처음 배우는데, FastAPI 개발자 관점에서 설명해줘.
  - Python과의 차이점
  - 같은 기능을 구현하는 방법 비교
  - Go만의 관용적 패턴
```

### 기존 코드 다른 언어로 변환

```bash
# Python 코드를 Go로 변환
cat app.py | claude -p "이 Python FastAPI 코드를 Go/Gin으로 변환해줘"

# React를 Vue로 변환
cat UserList.tsx | claude -p "이 React 컴포넌트를 Vue 3 Composition API로 변환해줘"
```

### 프로젝트 스캐폴딩

```bash
claude
> Node.js/Express + TypeScript 프로젝트 구조 만들어줘.
  - 컨트롤러/서비스/라우터 분리
  - 에러 핸들링 미들웨어
  - 환경변수 설정
  - Docker 설정
```

---

## 8. 실습 과제

### 과제 1: 백엔드 포팅

기본 스타터 앱(FastAPI)을 Node.js 또는 Go로 포팅:
- 동일한 API 스펙 유지
- 테스트로 동작 검증

### 과제 2: 프론트엔드 선택

Next.js 또는 React+Vite 중 하나로 프론트엔드 구현:
- 사용자 CRUD UI
- API 연동
- 에러 처리

### 과제 3: 새로운 조합 실험

기본 조합(Python + React)이 아닌 다른 조합으로 동일 기능 구현:
- 구현 경험 비교
- 장단점 분석

---

## 자가 점검

- [ ] 각 백엔드 프레임워크의 특징을 설명할 수 있다
- [ ] AI 도구로 새로운 언어/프레임워크를 빠르게 학습할 수 있다
- [ ] 프로젝트 요구사항에 맞는 기술 스택을 선택할 수 있다
- [ ] 최소 2개의 백엔드 스택으로 동일 API를 구현할 수 있다

---

## 참고 자료

- [Express.js 문서](https://expressjs.com/)
- [Gin 프레임워크](https://gin-gonic.com/)
- [Next.js 문서](https://nextjs.org/docs)
- [Vite 문서](https://vitejs.dev/)
