const path = require('path');
const { PresentationBuilder } = require(path.join(__dirname, '../../.claude/skills/pptx/lib'));

async function main() {
  const builder = new PresentationBuilder('nxtcloud-v1');

  builder.setMetadata({ title: 'AI 활용 필요성', author: 'NXT Cloud' });
  builder.setFooter('AI 활용 필요성 2026');

  // 타이틀 슬라이드
  builder.addTitleSlide({
    title: 'AI 활용 필요성',
    subtitle: '소프트웨어 개발의 대전환',
    badge: '2026 EDITION',
    company: 'NXT Cloud',
    team: 'Technical Training Team'
  });

  // 섹션 1: AI 발전 속도
  builder.addSectionSlide({
    number: '01',
    title: 'AI 발전 속도',
    subtitle: '우리의 오해',
    bgColor: 'primary'
  });

  // AI 둔화 착각
  builder.addContentSlide({
    title: '"AI 발전이 둔화되었다"는 착각',
    subtitle: '실제로는 벤치마크(점수표)의 포화 상태',
    components: [
      {
        type: 'bullets',
        items: [
          'GPT, Gemini 등 모델 업데이트 체감이 줄어들어 발전이 멈춘 것처럼 보임',
          '실제 원인: 벤치마크(점수표)의 포화 상태',
          'AI가 이미 기존 시험지에서 만점을 받아 120점, 200점으로 올라도 그래프는 평평해 보임'
        ]
      }
    ]
  });

  // 실제 성장 속도
  builder.addContentSlide({
    title: '실제 성장 속도 (폭발적)',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '🧠', title: '지능 지구력', desc: '7개월마다 2배\n무어의 법칙보다 3.5~5배 빠름' },
          { icon: '💻', title: '코딩 능력', desc: '70일마다 2배\n인간이 수년 걸릴 숙련도를 2달마다 갱신' }
        ]
      },
      {
        type: 'box',
        text: '2026년 예측: 인간이 1시간 걸려 짜는 복잡한 코드를 AI가 순식간에 처리',
        bgColor: 'accent'
      }
    ]
  });

  // 섹션 2: 왜 지금 AI인가?
  builder.addSectionSlide({
    number: '02',
    title: '왜 지금 AI인가?',
    subtitle: "역사상 유례없는 '골드러시'",
    bgColor: 'navy'
  });

  // 두 가지 무기
  builder.addContentSlide({
    title: '두 가지 무기',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '🧠', title: '더 강력해진 지능', desc: 'LLM의 추론 능력 향상' },
          { icon: '⚡', title: '더 빨라진 속도', desc: '실시간 코드 생성과 수정' }
        ]
      },
      {
        type: 'box',
        text: 'LLM + RAG + 에이전틱 워크플로 = 레고 블록처럼 조립\n→ 과거 수백 명의 박사급 엔지니어가 필요했던 일을 혼자서 수행',
        bgColor: 'slate100'
      }
    ]
  });

  // 생존 경고
  builder.addSummarySlide({
    label: '⚠️ 생존 경고',
    title: '도구의 유효기간 단축',
    bgColor: 'navy',
    points: [
      { icon: '❌', text: '"지금 최고의 도구가 무엇인가?" → 이 질문의 답은 3개월마다 바뀜' },
      { icon: '⚠️', text: '단 3개월만 뒤처져도 생산성이 회복 불가능할 정도로 하락' },
      { icon: '✅', text: '익숙함에 속아 녹슨 칼을 고집하지 말고 무조건 최신 도구로 갈아타야 함' }
    ]
  });

  // 섹션 3: 병목 지점의 이동
  builder.addSectionSlide({
    number: '03',
    title: '병목 지점의 이동',
    subtitle: '과거 vs 현재',
    bgColor: 'primary'
  });

  // 병목 비교
  builder.addContentSlide({
    title: '병목 지점의 변화',
    components: [
      {
        type: 'comparison',
        left: {
          title: '과거',
          items: ['기획 (쉬움)', '구현 (어렵고 비쌈) ← 병목'],
          bgColor: 'slate100'
        },
        right: {
          title: '현재',
          items: ['결정 (어려움) ← 병목', '구현 (쉽고 저렴)'],
          color: 'primary'
        }
      }
    ]
  });

  // 새로운 병목
  builder.addContentSlide({
    title: '새로운 병목: "무엇을 만들 것인가?"',
    components: [
      {
        type: 'bullets',
        items: [
          'AI 덕분에 구현은 쉽고 저렴해짐',
          '이제 병목은 결정과 명확한 의도 번역 단계로 이동',
          '새로운 개발 루프: 코드 작성 → 사용자 피드백 → 수정의 빠른 반복'
        ]
      }
    ]
  });

  // 섹션 4: 인력 구조의 파괴
  builder.addSectionSlide({
    number: '04',
    title: '인력 구조의 파괴',
    subtitle: 'PM vs 엔지니어 비율의 변화',
    bgColor: 'navy'
  });

  // PM:엔지니어 비율
  builder.addContentSlide({
    title: 'PM vs 엔지니어 비율의 변화',
    components: [
      {
        type: 'comparison',
        left: {
          title: '전통적 비율',
          items: ['PM 1명 : 엔지니어 8명', '기획서 하나로 엔지니어들이 며칠간 작업'],
          bgColor: 'slate100'
        },
        right: {
          title: '현재의 변화',
          items: ['PM 1명 : 엔지니어 2명', '심지어 1:1 비율로 변화 중'],
          bgColor: 'accent'
        }
      },
      {
        type: 'box',
        text: '→ 구글, 메타의 황금 비율이 무너지고 있음',
        bgColor: 'slate100'
      }
    ]
  });

  // 개발자 시간 분배
  builder.addContentSlide({
    title: '개발자의 시간 분배 변화',
    components: [
      {
        type: 'comparison',
        left: {
          title: '전통적인 개발',
          items: ['코드 작성 (30%)', '디버깅 (25%)', '문서/회의 (45%)'],
          bgColor: 'slate100'
        },
        right: {
          title: 'AI 활용 개발',
          items: ['설계/검토 (40%)', 'AI 협업 (35%)', '문서/회의 (25%)'],
          color: 'primary'
        }
      },
      {
        type: 'box',
        text: '핵심 변화: 코드 "작성"에서 코드 "검토"로 역할 전환',
        bgColor: 'accent'
      }
    ]
  });

  // 섹션 5: 프로덕트 엔지니어
  builder.addSectionSlide({
    number: '05',
    title: 'AI 시대의 인재상',
    subtitle: '프로덕트 엔지니어',
    bgColor: 'primary'
  });

  // 코더를 넘어선 엔지니어
  builder.addContentSlide({
    title: '코더(Coder)를 넘어선 엔지니어',
    subtitle: '살아남는 엔지니어',
    components: [
      {
        type: 'bullets',
        items: [
          '❌ 단순히 코딩만 잘하는 것',
          '✅ 사용자와 대화하고 피드백을 흡수',
          '✅ 무엇을 만들지 스스로 결정'
        ]
      }
    ]
  });

  // 프로덕트 엔지니어 정의
  builder.addContentSlide({
    title: '프로덕트 엔지니어의 정의',
    components: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '🔧', title: '구현 능력', desc: 'Engineer' },
          { icon: '➕', title: ' ', desc: ' ' },
          { icon: '📋', title: '기획 능력', desc: 'PM' }
        ]
      },
      {
        type: 'box',
        text: '= 프로덕트 엔지니어 (Product Engineer)',
        bgColor: 'primary'
      },
      {
        type: 'box',
        text: '조언: 누군가 기획서를 주길 기다리지 말고, 자신의 직관을 믿고 결과물을 다듬어 나가는 사람이 압도적인 속도로 앞서 나감',
        bgColor: 'slate100',
        h: 0.8
      }
    ]
  });

  // 섹션 6: AI 도구의 생산성 향상
  builder.addSectionSlide({
    number: '06',
    title: 'AI 도구의 생산성 향상',
    subtitle: 'GitHub Copilot 연구 결과',
    bgColor: 'navy'
  });

  // Copilot 연구 결과
  builder.addContentSlide({
    title: 'GitHub Copilot 연구 결과 (2023)',
    components: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '⚡', title: '55%', desc: '더 빠른 작업 완료' },
          { icon: '✅', title: '품질', desc: '동일하거나 더 나음' },
          { icon: '😊', title: '88%', desc: '생산성 향상 체감' }
        ]
      }
    ]
  });

  // 실제 사용 사례
  builder.addContentSlide({
    title: '실제 사용 사례',
    components: [
      {
        type: 'comparison',
        left: {
          title: '전통적 방식',
          items: ['보일러플레이트: 수동 작성', '테스트: 시간 부족으로 생략', '문서화: "나중에 하자" → 안 함', '버그: 로그 추적'],
          bgColor: 'slate100'
        },
        right: {
          title: 'AI 활용',
          items: ['보일러플레이트: 자동 생성', '테스트: 빠르게 생성', '문서화: 코드와 함께 생성', '버그: AI가 원인 분석'],
          color: 'primary'
        }
      }
    ]
  });

  // 섹션 7: AI 도구의 종류
  builder.addSectionSlide({
    number: '07',
    title: 'AI 도구의 종류',
    subtitle: 'IDE, Vibe 코딩, 채팅',
    bgColor: 'primary'
  });

  // AI IDE
  builder.addContentSlide({
    title: 'AI IDE (통합 개발 환경)',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '☁️', title: 'AWS Kiro', desc: 'Spec 기반 개발\n에이전트 지원' },
          { icon: '🌐', title: 'Google Antigravity', desc: '자연어 기반\n풀스택 앱 생성' }
        ]
      }
    ]
  });

  // Vibe 코딩 툴 & 코드 자동 완성
  builder.addContentSlide({
    title: 'Vibe 코딩 & 코드 자동 완성',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '🔄', title: 'Replit Agent', desc: '브라우저 기반\n즉시 실행 및 배포' },
          { icon: '💜', title: 'Lovable', desc: '노코드/로우코드\n풀스택 앱 빌더' }
        ]
      },
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '🤖', title: 'GitHub Copilot', desc: 'VS Code, JetBrains 통합' },
          { icon: '📝', title: 'Cursor', desc: 'AI 네이티브 에디터' },
          { icon: '🆓', title: 'Codeium', desc: '무료 대안' }
        ]
      }
    ]
  });

  // AI 채팅 기반 코딩
  builder.addContentSlide({
    title: 'AI 채팅 기반 코딩',
    components: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '🟣', title: 'Claude Code', desc: '터미널 기반\nAI 코딩 에이전트' },
          { icon: '🟢', title: 'ChatGPT', desc: '범용 AI 어시스턴트' },
          { icon: '🔵', title: 'Gemini', desc: 'Google의\nAI 어시스턴트' }
        ]
      }
    ]
  });

  // 섹션 8: AI의 한계와 주의점
  builder.addSectionSlide({
    number: '08',
    title: 'AI의 한계와 주의점',
    subtitle: '맹신하지 말 것',
    bgColor: 'navy'
  });

  // AI가 잘하는 것 / 못하는 것
  builder.addContentSlide({
    title: 'AI가 잘하는 것 vs 못하는 것',
    components: [
      {
        type: 'comparison',
        left: {
          title: 'AI가 잘하는 것',
          items: ['반복적인 코드 패턴 생성', '문서화 및 주석 작성', '간단한 버그 수정', '코드 설명 및 리팩토링 제안'],
          color: 'primary'
        },
        right: {
          title: 'AI가 (아직) 못하는 것',
          items: ['복잡한 시스템 설계', '비즈니스 로직 이해', '보안 취약점 완벽 탐지', '최신 라이브러리/프레임워크'],
          bgColor: 'slate100'
        }
      }
    ]
  });

  // 주의사항
  builder.addSummarySlide({
    label: '⚠️ 주의사항',
    title: 'AI 사용 시 반드시 기억하세요',
    bgColor: 'navy',
    points: [
      { icon: '⚠️', text: 'AI가 생성한 코드를 맹신하지 마세요' },
      { icon: '🔒', text: '민감한 정보를 AI에 전송하지 마세요' },
      { icon: '©️', text: '저작권/라이선스 이슈를 고려하세요' },
      { icon: '👀', text: 'AI 결과물은 반드시 검토하세요' }
    ]
  });

  // 섹션 9: 효과적인 AI 활용 전략
  builder.addSectionSlide({
    number: '09',
    title: '효과적인 AI 활용 전략',
    subtitle: '프롬프트 작성법',
    bgColor: 'primary'
  });

  // 3단계 전략 - 수정된 아이콘
  builder.addContentSlide({
    title: '효과적인 AI 활용 3단계',
    components: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '①', title: '문제 정의', desc: '❌ "이거 고쳐줘"\n✅ 구체적으로 요청' },
          { icon: '②', title: '맥락 제공', desc: '❌ "로그인 만들어줘"\n✅ 기술 스택, 조건 명시' },
          { icon: '③', title: '점진적 개선', desc: '기본 구현 → 엣지 케이스\n→ 테스트 → 리팩토링' }
        ]
      }
    ]
  });

  // 좋은 프롬프트 예시
  builder.addContentSlide({
    title: '좋은 프롬프트 예시',
    components: [
      {
        type: 'comparison',
        left: {
          title: '❌ 나쁜 예시',
          items: ['"이거 고쳐줘"', '"로그인 만들어줘"'],
          bgColor: 'slate100'
        },
        right: {
          title: '✅ 좋은 예시',
          items: ['"Python에서 리스트 중복 제거하면서 순서 유지하는 함수 작성해줘"', '"FastAPI로 JWT 인증 기반 로그인 API 만들어줘. 사용자 정보는 PostgreSQL에..."'],
          color: 'primary'
        }
      }
    ]
  });

  // 섹션 10: 커리어 전략
  builder.addSectionSlide({
    number: '10',
    title: '커리어 전략',
    subtitle: '앤드류 응의 조언',
    bgColor: 'navy'
  });

  // 환경과 동료
  builder.addContentSlide({
    title: '환경과 동료의 중요성',
    components: [
      {
        type: 'box',
        text: '성공의 가장 큰 예측 변수는 지능이나 노력이 아니라\n"지금 곁에 어떤 사람을 두고 있는가"',
        bgColor: 'accent',
        h: 1.2
      },
      {
        type: 'bullets',
        items: [
          '논문이 나오기 전, 전화 한 통으로 조언을 들을 수 있는 동료 집단',
          "인터넷에 없는 '원시 데이터'와 '진짜 정보'는 인적 네트워크를 통해 공유됨"
        ]
      }
    ]
  });

  // 피해야 할 회사
  builder.addContentSlide({
    title: '채용 시 피해야 할 회사',
    components: [
      {
        type: 'bullets',
        items: [
          '브랜드의 함정: 유명 빅테크 기업의 이름표가 실력을 키워주지 않음',
          '통합 채용의 위험: 입사 후 팀을 정해준다며 정확히 어떤 팀/매니저와 일할지 숨기는 회사는 피할 것'
        ]
      },
      {
        type: 'box',
        text: "결론: 브랜드가 아닌 '진짜 배기 팀'을 찾아야 함",
        bgColor: 'primary'
      }
    ]
  });

  // 섹션 11: 마지막 조언
  builder.addSectionSlide({
    number: '11',
    title: '마지막 조언',
    subtitle: '태도와 행동',
    bgColor: 'primary'
  });

  // 허락받지 않는 혁신
  builder.addContentSlide({
    title: '허락받지 않는 혁신 (Permissionless Innovation)',
    components: [
      {
        type: 'box',
        text: '지금은 실패 비용이 역사상 가장 저렴한 시대\n(실패해도 주말 이틀 날리는 것뿐)',
        bgColor: 'slate100',
        h: 1.0
      },
      {
        type: 'box',
        text: '팀장, 교수, 투자자의 승인을 기다리지 말고\n그냥 만들 것 (Just Build)',
        bgColor: 'accent',
        h: 1.0
      }
    ]
  });

  // 지독한 노력
  builder.addContentSlide({
    title: '지독한 노력 (Hard Work)',
    components: [
      {
        type: 'bullets',
        items: [
          '성공한 사람 중 지독하게 일하지 않은 사람은 단 한 명도 없음',
          '소파에서 넷플릭스 대신, AI 에이전트를 설계하는 주말을 선택하라'
        ]
      },
      {
        type: 'box',
        text: '"여러분이 안 만들면 아무도 안 만듭니다. 책임감을 갖고 멈추지 말고 시도하십시오." - 앤드류 응',
        bgColor: 'primary',
        h: 1.2
      }
    ]
  });

  // 오늘 배울 내용 미리보기
  builder.addSectionSlide({
    number: '📚',
    title: '오늘 배울 내용 미리보기',
    subtitle: '',
    bgColor: 'navy'
  });

  // 프롬프팅 기초
  builder.addContentSlide({
    title: '프롬프팅 기초',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '🎯', title: 'K-shot 프롬프팅', desc: '예시를 보여주고 패턴 학습 유도' },
          { icon: '🔗', title: 'Chain of Thought', desc: '단계별 추론 유도' }
        ]
      }
    ]
  });

  // 프롬프팅 심화
  builder.addContentSlide({
    title: '프롬프팅 심화',
    components: [
      {
        type: 'cards',
        columns: 2,
        items: [
          { icon: '📚', title: 'RAG', desc: '외부 문서를 참조하여 정확한 답변' },
          { icon: '🔧', title: 'Tool Calling', desc: 'AI가 외부 도구를 호출' }
        ]
      }
    ]
  });

  // AI 코딩 도구
  builder.addContentSlide({
    title: 'AI 코딩 도구',
    components: [
      {
        type: 'cards',
        columns: 3,
        items: [
          { icon: '🏗️', title: 'AI IDE', desc: 'AWS Kiro\nGoogle Antigravity' },
          { icon: '🎨', title: 'Vibe 코딩', desc: 'Replit Agent\nLovable' },
          { icon: '🤖', title: 'Claude Code', desc: '스킬, 에이전트, MCP' }
        ]
      }
    ]
  });

  // 질문과 토론
  builder.addSummarySlide({
    label: '💬 토론',
    title: '질문과 토론',
    bgColor: 'primary',
    points: [
      { icon: '❓', text: 'AI 도구를 사용해 본 경험이 있나요?' },
      { icon: '💭', text: '"프로덕트 엔지니어"라는 개념에 대해 어떻게 생각하나요?' },
      { icon: '🔄', text: '3개월마다 도구를 갈아타야 한다는 조언에 동의하나요?' }
    ]
  });

  // 다음 세션
  builder.addTitleSlide({
    title: '다음 세션',
    subtitle: '프롬프팅 기초로 넘어갑니다\nK-shot 프롬프팅과 Chain of Thought를 직접 실습해봅니다',
    badge: 'NEXT'
  });

  await builder.save('/Users/glen/Desktop/work/modern-software-dev-assignments/day1/01-introduction/AI-활용-필요성-v1.pptx');
  console.log('✅ 생성 완료: AI-활용-필요성-v1.pptx');
}

main().catch(console.error);
