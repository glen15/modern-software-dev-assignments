# MCP (Model Context Protocol) 서버 구축

## 개요

MCP는 AI 모델이 외부 도구와 데이터에 접근할 수 있게 해주는 프로토콜입니다.
이 가이드에서는 Claude Code와 함께 사용할 수 있는 MCP 서버를 직접 구축합니다.

---

## 학습 목표

- MCP 프로토콜의 개념과 아키텍처를 이해한다
- TypeScript로 MCP 서버를 구현할 수 있다
- Claude Code에 커스텀 MCP 서버를 연결할 수 있다

---

## 1. MCP란?

### 핵심 개념

MCP(Model Context Protocol)는 AI 모델이 외부 시스템과 상호작용하는 표준화된 방법입니다.

```
┌─────────────┐     MCP Protocol     ┌─────────────┐
│   Claude    │ ◄──────────────────► │ MCP Server  │
│   (Host)    │    JSON-RPC 2.0      │  (Tools)    │
└─────────────┘                      └─────────────┘
```

### MCP가 제공하는 기능

| 기능 | 설명 | 예시 |
|------|------|------|
| **Tools** | AI가 호출할 수 있는 함수 | 파일 검색, API 호출, DB 쿼리 |
| **Resources** | AI가 읽을 수 있는 데이터 | 설정 파일, 문서, 로그 |
| **Prompts** | 미리 정의된 프롬프트 템플릿 | 코드 리뷰 템플릿, 버그 보고서 양식 |

---

## 2. 개발 환경 설정

### 필수 도구

```bash
# Node.js 18 이상
node --version  # v18.0.0+

# TypeScript
npm install -g typescript

# MCP SDK
npm install @modelcontextprotocol/sdk
```

### 프로젝트 초기화

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y

# 의존성 설치
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx

# TypeScript 설정
npx tsc --init
```

### tsconfig.json 설정

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

---

## 3. 첫 번째 MCP 서버 만들기

### 기본 구조

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 서버 생성
const server = new Server(
  {
    name: "my-first-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록 제공
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet",
        description: "사용자에게 인사합니다",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "인사할 대상의 이름",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// 도구 실행
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "greet") {
    const name = request.params.arguments?.name as string;
    return {
      content: [
        {
          type: "text",
          text: `안녕하세요, ${name}님! MCP 서버에서 보내는 인사입니다.`,
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);
```

### 실행 및 테스트

```bash
# 빌드
npx tsc

# 실행 (테스트용)
node dist/index.js
```

---

## 4. 실용적인 MCP 서버 예제

### 예제 1: 파일 검색 도구

```typescript
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// 입력 스키마 정의
const SearchFilesSchema = z.object({
  directory: z.string().describe("검색할 디렉토리 경로"),
  pattern: z.string().describe("파일 이름 패턴 (정규식)"),
});

// 도구 정의
const tools = [
  {
    name: "search_files",
    description: "디렉토리에서 패턴에 맞는 파일을 검색합니다",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "검색할 디렉토리 경로" },
        pattern: { type: "string", description: "파일 이름 패턴 (정규식)" },
      },
      required: ["directory", "pattern"],
    },
  },
];

// 도구 실행 핸들러
async function searchFiles(directory: string, pattern: string): Promise<string[]> {
  const regex = new RegExp(pattern);
  const results: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (regex.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  await walk(directory);
  return results;
}
```

### 예제 2: HTTP API 호출 도구

```typescript
const FetchApiSchema = z.object({
  url: z.string().url().describe("API 엔드포인트 URL"),
  method: z.enum(["GET", "POST"]).default("GET"),
  body: z.string().optional().describe("POST 요청 시 body"),
});

async function fetchApi(url: string, method: string, body?: string) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "POST" ? body : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
```

### 예제 3: 데이터베이스 조회 도구

```typescript
import Database from "better-sqlite3";

const QueryDbSchema = z.object({
  query: z.string().describe("실행할 SQL SELECT 쿼리"),
});

function queryDatabase(dbPath: string, query: string) {
  // 안전성을 위해 SELECT만 허용
  if (!query.trim().toUpperCase().startsWith("SELECT")) {
    throw new Error("SELECT 쿼리만 허용됩니다");
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    return db.prepare(query).all();
  } finally {
    db.close();
  }
}
```

---

## 5. Claude Code에 연결하기

### 설정 파일 생성

`~/.claude/claude_desktop_config.json` (또는 `settings.json`):

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### npx로 직접 실행

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": ["tsx", "/path/to/my-mcp-server/src/index.ts"]
    }
  }
}
```

### 연결 확인

```bash
# Claude Code에서
claude

# MCP 서버 목록 확인
> /mcp

# 도구 사용
> 파일에서 .ts 확장자 검색해줘
```

---

## 6. 고급 기능

### Resources 제공

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// 리소스 목록
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "config://app-settings",
        name: "앱 설정",
        description: "애플리케이션 설정 파일",
        mimeType: "application/json",
      },
    ],
  };
});

// 리소스 읽기
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "config://app-settings") {
    const config = await fs.readFile("./config.json", "utf-8");
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: config,
        },
      ],
    };
  }
  throw new Error(`Unknown resource: ${request.params.uri}`);
});
```

### Prompts 제공

```typescript
import { ListPromptsRequestSchema, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types.js";

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "code-review",
        description: "코드 리뷰 요청 템플릿",
        arguments: [
          {
            name: "file_path",
            description: "리뷰할 파일 경로",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === "code-review") {
    const filePath = request.params.arguments?.file_path;
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `다음 파일을 코드 리뷰해주세요: ${filePath}

체크할 항목:
1. 코드 가독성
2. 에러 처리
3. 보안 취약점
4. 성능 이슈`,
          },
        },
      ],
    };
  }
  throw new Error(`Unknown prompt: ${request.params.name}`);
});
```

---

## 7. 실습 과제

### 과제 1: 기본 MCP 서버

날씨 정보를 제공하는 MCP 서버를 만드세요:
- `get_weather` 도구: 도시 이름으로 날씨 조회 (Mock 데이터 사용)
- Claude Code에 연결하여 테스트

### 과제 2: 프로젝트 도우미 서버

개발 프로젝트를 분석하는 MCP 서버를 만드세요:
- `analyze_dependencies`: package.json 분석
- `find_todos`: 코드에서 TODO 주석 찾기
- `count_lines`: 파일별 라인 수 집계

### 과제 3: API 통합 서버

외부 API와 통합하는 MCP 서버를 만드세요:
- GitHub API 연동 (이슈 조회, PR 목록)
- 인증 처리 (환경변수로 토큰 관리)

---

## 자가 점검

- [ ] MCP의 Tools, Resources, Prompts 개념을 설명할 수 있다
- [ ] TypeScript로 MCP 서버를 구현할 수 있다
- [ ] Claude Code에 MCP 서버를 연결할 수 있다
- [ ] 안전한 도구 설계 원칙을 이해한다 (입력 검증, 권한 제한)

---

## 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io/docs)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [Claude Code MCP 가이드](https://docs.anthropic.com/claude-code/mcp)
