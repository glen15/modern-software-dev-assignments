const path = require('path');
const { PresentationBuilder } = require(path.join(__dirname, '../../.claude/skills/pptx/lib'));

async function main() {
  const builder = new PresentationBuilder('nxtcloud-v2');

  builder.setMetadata({ title: 'AI 활용 필요성', author: 'NXT Cloud' });
  builder.setFooter('AI 활용 필요성 2026');

  // 타이틀 슬라이드
  let slide = builder.addTitleSlide({
    title: 'AI 활용 필요성',
    subtitle: '소프트웨어 개발의 대전환',
    badge: '2026 EDITION',
    company: 'NXT Cloud',
    team: 'Technical Training Team'
  });
  slide.addNotes(`안녕하세요, AI 활용 필요성에 대한 세션을 시작하겠습니다.

앤드류 응 교수님의 말씀처럼 "여러분이 안 만들면 아무도 안 만듭니다."
오늘은 왜 지금 AI를 활용해야 하는지, 그리고 어떻게 활용해야 하는지 알아보겠습니다.`);

  // 섹션 1: AI 발전 속도
  slide = builder.addSectionSlide({
    number: '01',
    title: 'AI 발전 속도',
    subtitle: '우리의 오해',
    bgColor: 'primary'
  });
  slide.addNotes(`첫 번째 주제는 AI 발전 속도에 대한 우리의 오해입니다.
많은 분들이 "AI 발전이 둔화되었다"고 생각하시는데, 과연 그럴까요?`);

  // AI 둔화 착각
  slide = builder.addContentSlide({
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
  slide.addNotes(`GPT-4에서 GPT-5로, Gemini 1에서 2로 업데이트되어도 체감이 줄어든다고 느끼시는 분들이 많습니다.
하지만 이것은 AI 발전이 멈춘 게 아닙니다.

실제 원인은 벤치마크의 포화 상태입니다.
시험 문제가 100점 만점인데 AI가 이미 100점을 받고 있으면, 실제로 120점, 200점의 실력이 되어도 그래프는 평평하게 보입니다.
측정 도구의 한계이지, 발전의 한계가 아닙니다.`);

  // 실제 성장 속도
  slide = builder.addContentSlide({
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
  slide.addNotes(`실제 AI의 성장 속도를 보면 정말 놀랍습니다.

지능 지구력, 즉 AI가 유효하게 작업할 수 있는 시간은 7개월마다 2배로 증가하고 있습니다.
이는 반도체 성능의 무어의 법칙(18-24개월에 2배)보다 3.5~5배 빠른 속도입니다.

코딩 능력은 더 무섭습니다. 70일, 약 2달 반마다 2배로 성장합니다.
인간이 수년에 걸쳐 쌓는 숙련도를 AI는 2달마다 갱신하고 있습니다.`);

  // 섹션 2: 왜 지금 AI인가?
  slide = builder.addSectionSlide({
    number: '02',
    title: '왜 지금 AI인가?',
    subtitle: "역사상 유례없는 '골드러시'",
    bgColor: 'navy'
  });
  slide.addNotes(`그렇다면 왜 "지금" AI를 활용해야 할까요?
지금이야말로 역사상 유례없는 골드러시 시대입니다.`);

  // 두 가지 무기
  slide = builder.addContentSlide({
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
  slide.addNotes(`우리에게는 두 가지 강력한 무기가 생겼습니다.

첫째, 더 강력해진 지능. LLM의 추론 능력이 비약적으로 향상되었습니다.
둘째, 더 빨라진 속도. 실시간으로 코드를 생성하고 수정할 수 있습니다.

이 두 가지를 LLM, RAG, 에이전틱 워크플로와 조합하면 레고 블록처럼 조립할 수 있습니다.
과거에는 수백 명의 박사급 엔지니어가 필요했던 일을 이제는 혼자서 수행할 수 있습니다.`);

  // 생존 경고
  slide = builder.addSummarySlide({
    label: '⚠️ 생존 경고',
    title: '도구의 유효기간 단축',
    bgColor: 'navy',
    points: [
      { icon: '❌', text: '"지금 최고의 도구가 무엇인가?" → 이 질문의 답은 3개월마다 바뀜' },
      { icon: '⚠️', text: '단 3개월만 뒤처져도 생산성이 회복 불가능할 정도로 하락' },
      { icon: '✅', text: '익숙함에 속아 녹슨 칼을 고집하지 말고 무조건 최신 도구로 갈아타야 함' }
    ]
  });
  slide.addNotes(`여기서 중요한 생존 경고를 드리겠습니다.

"지금 최고의 도구가 무엇인가?"라는 질문의 답은 3개월마다 바뀝니다.
단 3개월만 뒤처져도 생산성이 회복 불가능할 정도로 하락합니다.

익숙하다는 이유로 녹슨 칼을 고집하지 마세요.
무조건 최신 도구로 갈아타야 합니다.
불편해도, 학습 곡선이 있어도 최신 도구를 사용해야 합니다.`);

  // 섹션 3: 병목 지점의 이동
  slide = builder.addSectionSlide({
    number: '03',
    title: '병목 지점의 이동',
    subtitle: '과거 vs 현재',
    bgColor: 'primary'
  });
  slide.addNotes(`세 번째 주제는 병목 지점의 이동입니다.
소프트웨어 개발에서 어디가 어렵고 비싼지가 완전히 바뀌었습니다.`);

  // 병목 비교
  slide = builder.addContentSlide({
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
  slide.addNotes(`과거에는 기획은 쉬웠지만 구현이 어렵고 비쌌습니다.
개발자를 고용하고, 시간을 들여 코드를 작성하는 것이 병목이었습니다.

현재는 완전히 뒤집혔습니다.
AI 덕분에 구현은 쉽고 저렴해졌습니다.
이제 병목은 "무엇을 만들 것인가"를 결정하는 단계로 이동했습니다.`);

  // 새로운 병목
  slide = builder.addContentSlide({
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
  slide.addNotes(`새로운 병목은 "무엇을 만들 것인가"입니다.

AI에게 의도를 명확하게 번역해서 전달하는 것이 중요해졌습니다.
프롬프트를 잘 작성하는 것, 요구사항을 명확하게 정의하는 것이 핵심 역량이 됩니다.

개발 루프도 바뀌었습니다.
코드 작성 → 사용자 피드백 → 수정의 빠른 반복이 가능해졌습니다.
한 달 걸리던 개발 사이클이 하루로 줄어들 수 있습니다.`);

  // 섹션 4: 인력 구조의 파괴
  slide = builder.addSectionSlide({
    number: '04',
    title: '인력 구조의 파괴',
    subtitle: 'PM vs 엔지니어 비율의 변화',
    bgColor: 'navy'
  });
  slide.addNotes(`네 번째 주제는 인력 구조의 파괴입니다.
AI의 등장으로 기존의 PM과 엔지니어 비율이 완전히 바뀌고 있습니다.`);

  // PM:엔지니어 비율
  slide = builder.addContentSlide({
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
  slide.addNotes(`전통적으로 PM 1명당 엔지니어 8명이 붙었습니다.
기획서 하나를 주면 엔지니어들이 며칠간 작업했습니다.

지금은 PM 1명당 엔지니어 2명, 심지어 1:1 비율로 변화하고 있습니다.
구글, 메타 같은 빅테크의 황금 비율이 무너지고 있습니다.

이것은 엔지니어가 덜 필요해진다는 의미가 아닙니다.
엔지니어의 역할이 바뀐다는 의미입니다.`);

  // 개발자 시간 분배
  slide = builder.addContentSlide({
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
  slide.addNotes(`개발자의 시간 분배도 크게 변화했습니다.

전통적으로는 코드 작성 30%, 디버깅 25%, 문서와 회의 45%였습니다.
AI를 활용하면 설계와 검토 40%, AI 협업 35%, 문서와 회의 25%로 바뀝니다.

핵심 변화는 코드 "작성"에서 코드 "검토"로 역할이 전환된다는 것입니다.
AI가 코드를 작성하고, 개발자는 그것을 검토하고 개선합니다.`);

  // 섹션 5: 프로덕트 엔지니어
  slide = builder.addSectionSlide({
    number: '05',
    title: 'AI 시대의 인재상',
    subtitle: '프로덕트 엔지니어',
    bgColor: 'primary'
  });
  slide.addNotes(`다섯 번째 주제는 AI 시대의 인재상입니다.
단순한 코더가 아닌 프로덕트 엔지니어가 필요해졌습니다.`);

  // 코더를 넘어선 엔지니어
  slide = builder.addContentSlide({
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
  slide.addNotes(`살아남는 엔지니어는 단순히 코딩만 잘하는 사람이 아닙니다.

AI 시대에는 코딩 자체는 AI가 더 잘하게 됩니다.
그래서 필요한 것은 사용자와 대화하고 피드백을 흡수하는 능력,
그리고 무엇을 만들지 스스로 결정하는 능력입니다.

기획서를 받아서 구현만 하는 역할은 점점 줄어들 것입니다.`);

  // 프로덕트 엔지니어 정의
  slide = builder.addContentSlide({
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
  slide.addNotes(`프로덕트 엔지니어는 구현 능력과 기획 능력을 모두 갖춘 사람입니다.

엔지니어로서의 구현 능력에 PM으로서의 기획 능력을 더한 것입니다.
이런 사람이 AI 시대에 가장 가치있는 인재가 됩니다.

중요한 조언: 누군가 기획서를 주길 기다리지 마세요.
자신의 직관을 믿고 결과물을 만들어 나가는 사람이 압도적인 속도로 앞서 나갑니다.`);

  // 섹션 6: AI 도구의 생산성 향상
  slide = builder.addSectionSlide({
    number: '06',
    title: 'AI 도구의 생산성 향상',
    subtitle: 'GitHub Copilot 연구 결과',
    bgColor: 'navy'
  });
  slide.addNotes(`여섯 번째 주제는 AI 도구의 생산성 향상입니다.
실제 연구 결과를 통해 AI 도구가 얼마나 효과적인지 살펴보겠습니다.`);

  // Copilot 연구 결과
  slide = builder.addContentSlide({
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
  slide.addNotes(`2023년 GitHub Copilot 연구 결과를 보면:

작업 완료 속도가 55% 더 빨라졌습니다.
코드 품질은 동일하거나 오히려 더 나아졌습니다.
88%의 개발자가 생산성 향상을 체감했습니다.

이미 AI 코딩 도구의 효과가 검증되었습니다.
사용하지 않는 것은 선택이 아니라 뒤처지는 것입니다.`);

  // 실제 사용 사례
  slide = builder.addContentSlide({
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
  slide.addNotes(`실제 사용 사례를 비교해보면:

보일러플레이트 코드: 과거에는 수동 작성, 이제는 자동 생성
테스트 코드: 시간 부족으로 생략하던 것을 이제는 빠르게 생성
문서화: "나중에 하자"가 결국 안 했던 것이, 이제는 코드와 함께 생성
버그 디버깅: 로그 추적 대신 AI가 원인 분석

특히 테스트와 문서화처럼 중요하지만 미루기 쉬운 작업을 AI가 도와줍니다.`);

  // 섹션 7: AI 도구의 종류
  slide = builder.addSectionSlide({
    number: '07',
    title: 'AI 도구의 종류',
    subtitle: 'IDE, Vibe 코딩, 채팅',
    bgColor: 'primary'
  });
  slide.addNotes(`일곱 번째 주제는 AI 도구의 종류입니다.
AI IDE, Vibe 코딩 툴, 채팅 기반 코딩 등 다양한 카테고리가 있습니다.`);

  // AI IDE
  slide = builder.addContentSlide({
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
  slide.addNotes(`AI IDE는 통합 개발 환경 자체에 AI가 내장된 도구입니다.

AWS Kiro는 스펙 기반 개발과 에이전트를 지원합니다.
Google Antigravity는 자연어로 풀스택 앱을 생성합니다.

이런 도구들은 코드 작성을 넘어 전체 개발 프로세스를 AI가 지원합니다.`);

  // Vibe 코딩 툴 & 코드 자동 완성
  slide = builder.addContentSlide({
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
  slide.addNotes(`Vibe 코딩 툴은 자연어로 앱을 만드는 도구입니다.
Replit Agent는 브라우저에서 즉시 실행하고 배포할 수 있습니다.
Lovable은 노코드/로우코드로 풀스택 앱을 빌드합니다.

코드 자동 완성 도구도 다양합니다.
GitHub Copilot은 VS Code, JetBrains에 통합됩니다.
Cursor는 AI 네이티브 에디터로 설계되었습니다.
Codeium은 무료 대안으로 사용할 수 있습니다.`);

  // AI 채팅 기반 코딩
  slide = builder.addContentSlide({
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
  slide.addNotes(`AI 채팅 기반 코딩 도구도 강력합니다.

Claude Code는 터미널 기반의 AI 코딩 에이전트입니다.
파일 시스템에 직접 접근하여 코드를 작성하고 수정할 수 있습니다.

ChatGPT는 범용 AI 어시스턴트로 코딩에도 활용됩니다.
Gemini는 Google의 AI 어시스턴트입니다.

오늘 실습에서는 이런 도구들을 직접 사용해볼 예정입니다.`);

  // 섹션 8: AI의 한계와 주의점
  slide = builder.addSectionSlide({
    number: '08',
    title: 'AI의 한계와 주의점',
    subtitle: '맹신하지 말 것',
    bgColor: 'navy'
  });
  slide.addNotes(`여덟 번째 주제는 AI의 한계와 주의점입니다.
AI를 잘 활용하려면 AI가 잘하는 것과 못하는 것을 알아야 합니다.`);

  // AI가 잘하는 것 / 못하는 것
  slide = builder.addContentSlide({
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
  slide.addNotes(`AI가 잘하는 것:
반복적인 코드 패턴 생성, 문서화 및 주석 작성, 간단한 버그 수정, 코드 설명 및 리팩토링 제안

AI가 아직 못하는 것:
복잡한 시스템 설계 - 전체 아키텍처는 인간의 판단이 필요합니다
비즈니스 로직 이해 - 도메인 지식은 여전히 인간의 영역입니다
보안 취약점 완벽 탐지 - 보안 검토는 반드시 사람이 해야 합니다
최신 라이브러리 - 학습 데이터의 한계가 있습니다`);

  // 주의사항
  slide = builder.addSummarySlide({
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
  slide.addNotes(`AI 사용 시 반드시 기억해야 할 주의사항입니다.

첫째, AI가 생성한 코드를 맹신하지 마세요. AI도 틀릴 수 있습니다.
둘째, 민감한 정보를 AI에 전송하지 마세요. API 키, 비밀번호 등은 절대 공유하면 안 됩니다.
셋째, 저작권과 라이선스 이슈를 고려하세요. AI가 생성한 코드의 출처가 불분명할 수 있습니다.
넷째, AI 결과물은 반드시 검토하세요. 리뷰 없이 프로덕션에 배포하면 안 됩니다.`);

  // 섹션 9: 효과적인 AI 활용 전략
  slide = builder.addSectionSlide({
    number: '09',
    title: '효과적인 AI 활용 전략',
    subtitle: '프롬프트 작성법',
    bgColor: 'primary'
  });
  slide.addNotes(`아홉 번째 주제는 효과적인 AI 활용 전략입니다.
AI를 잘 쓰려면 프롬프트를 잘 작성해야 합니다.`);

  // 3단계 전략 - 수정된 아이콘
  slide = builder.addContentSlide({
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
  slide.addNotes(`효과적인 AI 활용 3단계입니다.

1단계: 문제 정의 - "이거 고쳐줘" 대신 구체적으로 요청하세요.
2단계: 맥락 제공 - "로그인 만들어줘" 대신 기술 스택과 조건을 명시하세요.
3단계: 점진적 개선 - 한 번에 완벽한 결과를 기대하지 말고, 기본 구현 → 엣지 케이스 → 테스트 → 리팩토링 순으로 개선하세요.`);

  // 좋은 프롬프트 예시
  slide = builder.addContentSlide({
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
  slide.addNotes(`좋은 프롬프트와 나쁜 프롬프트를 비교해보면:

나쁜 예시: "이거 고쳐줘", "로그인 만들어줘"
AI가 무엇을 해야 하는지 모호합니다.

좋은 예시:
"Python에서 리스트 중복 제거하면서 순서 유지하는 함수 작성해줘"
"FastAPI로 JWT 인증 기반 로그인 API 만들어줘. 사용자 정보는 PostgreSQL에 저장되어 있고..."

구체적이고 맥락이 있으면 AI가 더 정확한 결과를 제공합니다.`);

  // 섹션 10: 커리어 전략
  slide = builder.addSectionSlide({
    number: '10',
    title: '커리어 전략',
    subtitle: '앤드류 응의 조언',
    bgColor: 'navy'
  });
  slide.addNotes(`열 번째 주제는 커리어 전략입니다.
앤드류 응 교수님의 조언을 바탕으로 AI 시대의 커리어 전략을 살펴보겠습니다.`);

  // 환경과 동료
  slide = builder.addContentSlide({
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
  slide.addNotes(`앤드류 응 교수님의 중요한 조언입니다.

"성공의 가장 큰 예측 변수는 지능이나 노력이 아니라, 지금 곁에 어떤 사람을 두고 있는가"

논문이 공개되기 전에 전화 한 통으로 조언을 들을 수 있는 동료가 있나요?
인터넷에 없는 원시 데이터와 진짜 정보는 인적 네트워크를 통해서만 공유됩니다.

좋은 환경과 좋은 동료를 찾는 것이 커리어 성장의 핵심입니다.`);

  // 피해야 할 회사
  slide = builder.addContentSlide({
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
  slide.addNotes(`채용 시 피해야 할 회사에 대한 조언입니다.

브랜드의 함정: 유명 빅테크 기업의 이름표가 실력을 키워주지 않습니다.
구글, 메타, 아마존 다녔다고 해서 자동으로 성장하는 것이 아닙니다.

통합 채용의 위험: "입사 후 팀을 정해준다"며 정확히 어떤 팀, 어떤 매니저와 일할지 숨기는 회사는 피하세요.

결론: 브랜드가 아닌 '진짜 배기 팀'을 찾아야 합니다.
어떤 사람들과 함께 일할지가 가장 중요합니다.`);

  // 섹션 11: 마지막 조언
  slide = builder.addSectionSlide({
    number: '11',
    title: '마지막 조언',
    subtitle: '태도와 행동',
    bgColor: 'primary'
  });
  slide.addNotes(`마지막 주제는 태도와 행동에 대한 조언입니다.
AI 시대를 살아가는 데 필요한 마인드셋입니다.`);

  // 허락받지 않는 혁신
  slide = builder.addContentSlide({
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
  slide.addNotes(`허락받지 않는 혁신, Permissionless Innovation입니다.

지금은 실패 비용이 역사상 가장 저렴한 시대입니다.
실패해도 주말 이틀 날리는 것뿐입니다.
AI 덕분에 프로토타입 만드는 데 며칠이 아니라 몇 시간이면 됩니다.

팀장, 교수, 투자자의 승인을 기다리지 마세요.
그냥 만드세요. Just Build.
허락을 구하기보다 용서를 구하는 것이 낫습니다.`);

  // 지독한 노력
  slide = builder.addContentSlide({
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
  slide.addNotes(`마지막으로 지독한 노력, Hard Work입니다.

성공한 사람 중 지독하게 일하지 않은 사람은 단 한 명도 없습니다.
재능만으로는 충분하지 않습니다.

소파에서 넷플릭스를 보는 대신, AI 에이전트를 설계하는 주말을 선택하세요.
그 선택의 누적이 여러분의 미래를 결정합니다.

앤드류 응 교수님의 말씀을 다시 한번 되새기겠습니다:
"여러분이 안 만들면 아무도 안 만듭니다. 책임감을 갖고 멈추지 말고 시도하십시오."`);

  // 오늘 배울 내용 미리보기
  slide = builder.addSectionSlide({
    number: '📚',
    title: '오늘 배울 내용 미리보기',
    subtitle: '',
    bgColor: 'navy'
  });
  slide.addNotes(`이제 오늘 배울 내용을 미리보기로 살펴보겠습니다.`);

  // 프롬프팅 기초
  slide = builder.addContentSlide({
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
  slide.addNotes(`프롬프팅 기초에서는 두 가지 핵심 기법을 배웁니다.

K-shot 프롬프팅: 예시를 보여주고 AI가 패턴을 학습하도록 유도합니다.
Zero-shot, One-shot, Few-shot 등의 개념을 실습합니다.

Chain of Thought: 단계별로 추론하도록 유도하는 기법입니다.
복잡한 문제를 작은 단계로 나눠서 해결합니다.`);

  // 프롬프팅 심화
  slide = builder.addContentSlide({
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
  slide.addNotes(`프롬프팅 심화에서는 더 고급 기법을 배웁니다.

RAG (Retrieval Augmented Generation): 외부 문서를 검색해서 AI에게 제공하고, 그것을 바탕으로 정확한 답변을 생성하는 기법입니다.

Tool Calling: AI가 외부 도구나 API를 호출할 수 있게 하는 기법입니다.
계산기, 검색 엔진, 데이터베이스 등을 AI가 직접 사용할 수 있습니다.`);

  // AI 코딩 도구
  slide = builder.addContentSlide({
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
  slide.addNotes(`AI 코딩 도구 세션에서는 실제 도구들을 직접 사용해봅니다.

AI IDE: AWS Kiro, Google Antigravity 등 AI가 내장된 개발 환경
Vibe 코딩: Replit Agent, Lovable 등 자연어로 앱을 만드는 도구
Claude Code: 터미널 기반 AI 에이전트, 스킬, MCP 등 고급 기능

실습을 통해 직접 경험해보시기 바랍니다.`);

  // 질문과 토론
  slide = builder.addSummarySlide({
    label: '💬 토론',
    title: '질문과 토론',
    bgColor: 'primary',
    points: [
      { icon: '❓', text: 'AI 도구를 사용해 본 경험이 있나요?' },
      { icon: '💭', text: '"프로덕트 엔지니어"라는 개념에 대해 어떻게 생각하나요?' },
      { icon: '🔄', text: '3개월마다 도구를 갈아타야 한다는 조언에 동의하나요?' }
    ]
  });
  slide.addNotes(`토론 시간입니다.

다음 질문들에 대해 생각해보시고 의견을 나눠봅시다:
- AI 도구를 사용해 본 경험이 있나요? 어떤 도구를 사용하셨나요?
- "프로덕트 엔지니어"라는 개념에 대해 어떻게 생각하나요? 기획과 개발을 모두 할 수 있어야 할까요?
- 3개월마다 도구를 갈아타야 한다는 조언에 동의하나요? 익숙한 도구를 포기하는 것이 어렵지 않나요?`);

  // 다음 세션
  slide = builder.addTitleSlide({
    title: '다음 세션',
    subtitle: '프롬프팅 기초로 넘어갑니다\nK-shot 프롬프팅과 Chain of Thought를 직접 실습해봅니다',
    badge: 'NEXT'
  });
  slide.addNotes(`다음 세션에서는 프롬프팅 기초로 넘어갑니다.

K-shot 프롬프팅과 Chain of Thought를 직접 실습해봅니다.
Web UI를 사용해서 시스템 프롬프트를 적용하고 결과를 비교해볼 예정입니다.

잠시 휴식 후 다음 세션으로 이어가겠습니다.`);

  await builder.save('/Users/glen/Desktop/work/modern-software-dev-assignments/day1/01-introduction/AI-활용-필요성-v2.pptx');
  console.log('✅ 생성 완료: AI-활용-필요성-v2.pptx');
}

main().catch(console.error);
