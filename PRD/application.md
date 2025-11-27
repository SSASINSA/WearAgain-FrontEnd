# 신청 내역 & 신청 내역 상세 화면 구현 메모

## 1. 개요
- 공용 헤더의 신청(application) 버튼에서 진입하는 **신청 내역(리스트) 화면**과 해당 항목을 터치했을 때 진입하는 **신청 내역 상세 화면**을 구현한다.
- 최종 목표는 Figma 시안과 동일한 UI를 구현하고, 실서비스 API와 연동하여 실제 신청 데이터를 보여주는 것이다.
- 상세 화면의 QR 코드는 `react-native-qrcode-svg` + `react-native-svg` 조합으로 생성한다.

## 2. 산출물 & 범위
- `ApplicationListScreen` (신청 내역) UI 및 API 연동
  - 커서 기반 페이지네이션, 상태 필터링, 새로고침
  - 카드형 리스트 아이템 (상태 배지, 일정, 위치, 설명 노출)
- `ApplicationDetailScreen` (신청 내역 상세) UI 및 API 연동
  - 상단 그라데이션 카드, 행사 정보, QR 섹션(타이머 포함), 이용 방법/주의사항 블록
  - QR 발급/재발급, 체크인 상태 갱신
  - QR 코드 클릭 시 흰 배경에 확대된 QR코드를 띄움.
  - 하단 CTA에서 신청 취소 플로우(확인 다이얼로그 + API 연동) 처리
- 상태 관리 및 훅
  - 신청 내역 목록/상세 데이터를 불러오는 커스텀 훅 or Zustand 스토어
  - QR 갱신, 남은 시간 카운트다운 로직
- 공용 컴포넌트
  - `DetailHeader` 재사용 (타이틀/안전 영역 지원)
  - 카드/뱃지/섹션 헤더 등 재사용 가능한 UI 조각

## 3. 디자인 레퍼런스 (figma-mcp 확인)
1. **신청 내역 화면**  
   - [Figma Node 57:834](https://www.figma.com/design/zp3I0LWtnTyYbUliFNnr2m/%ED%94%BC%EC%9A%B0%EB%8B%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=57-834&t=NsJdbsOGq3wZs52V-4)  
   - 카드 높이 154px, 좌측 64px 썸네일, 우측 텍스트 영역.  
   - 상태 배지: `진행중`(red), `종료`(gray), `예정`(blue)  
   - 아이콘: 달력, 위치, (선택적) 사람/참석 정보  
   - 배경: `#F2F2F2`, 카드 그림자(blur 4, opacity 10%)  
2. **신청 내역 상세 화면**  
   - [Figma Node 1349:29](https://www.figma.com/design/zp3I0LWtnTyYbUliFNnr2m/%ED%94%BC%EC%9A%B0%EB%8B%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=164-142&t=uMyUsUnnD3O3IPPZ-4)  
   - 상단 카드: 그라데이션 `#D946EF → #6A34D8`, 행사 정보, 설명.  
   - 중앙 QR 영역: 라운드 사각형 박스, QR 이미지, 남은 시간 텍스트(30:00).  
   - 하단 텍스트 블록: “이용 방법”, “주의사항” bullet list.  
   - 헤더는 좌측 뒤로가기, 가운데 “신청” 타이틀(시안 상 ‘티켓’ 표기 → 실제 적용 시 ‘Application’로 교체).

## 4. UX & 상태 고려사항
- **로딩/에러 상태**: 
  - 목록: 첫 로딩 스피너, 에러 메시지 + 재시도, 빈 목록 안내.
  - 상세: Skeleton 또는 인디케이터, QR 발급 실패 시 토스트/다이얼로그.  
- **상태 배지**: API의 `eventStatus` 혹은 별도 `applicationStatus`를 뱃지 컬러와 텍스트로 매핑.
- **QR 타이머**: `expiresIn` 값을 받아 분:초로 노출, 만료 시 자동 재발급 버튼 제공.
- **접근성**: 아이콘에 대체 텍스트 추가, 버튼에 `accessibilityLabel` 설정.
- **오프라인/네트워크 에러**: `retry` 유틸 혹은 `react-query` 재시도 사용 검토.
- **신청 취소 플로우**:
  - `applicationStatus`가 `APPLIED` 또는 `CONFIRMED` 등 취소 가능 상태일 때만 CTA를 노출한다.
  - CTA 탭 시 바텀시트/다이얼로그로 최종 확인을 받고, 진행 중에는 스피너와 함께 버튼을 잠근다.
  - 성공 시 상세/목록 쿼리를 모두 무효화하고 상태 배지를 `취소됨` 테마로 즉시 갱신한다.
  - 실패 시 오류 코드를 사용자 친화 문구로 매핑해 토스트/다이얼로그로 안내한다.

## 5. 기술 구현 계획
### 5.1 패키지 & 설정
- `npm install react-native-qrcode-svg react-native-svg`
- QR 코드는 `react-native-qrcode-svg` 컴포넌트를 그대로 사용 (`import QRCode from 'react-native-qrcode-svg'`).
- `react-native-svg` 링크 후 iOS는 `pod install`, Android는 `gradlew clean` 후 재빌드 필요.
- 토큰 변경 시 `ref`를 활용해 `toDataURL` 등 추가 기능 사용 가능 (공유 기능 대비).

### 5.2 폴더 구조 & 주요 파일
- `src/screens/applications/ApplicationListScreen.tsx` (목록)
- `src/screens/applications/ApplicationDetailScreen.tsx` (상세)
- `src/screens/applications/components/*` (카드, 섹션 등)
- `src/api/events/applications.ts` (API 클라이언트)
- `src/hooks/useEventApplications.ts` (목록 훅)
- `src/hooks/useEventApplicationDetail.ts` (상세/QR 훅)

### 5.3 네비게이션
- `MainNavigation`에 `ApplicationsStack` 등록.  
- `ApplicationsStack` 내부에 `ApplicationListScreen`, `ApplicationDetailScreen` 두 화면 구성.  
- 공용 헤더 신청 버튼 → `navigate('ApplicationsStack')`.

### 5.4 API 연동 시나리오
1. **목록 진입**
   - `GET /api/v1/events/applications` 호출, `useInfiniteQuery` 또는 커스텀 페이지네이션.
   - 각 아이템을 카드로 렌더링, `onPress` → 상세 화면으로 `applicationId` 전달.
2. **상세 진입**
   - `GET /api/v1/events/applications/{applicationId}` 호출.
   - 응답 데이터 매핑: 행사명, 기간, 위치, 설명, 안내 문구, 옵션 trail 등.
3. **QR 발급/재발급**
   - 화면 진입 시 `POST /api/v1/events/applications/{applicationId}/qr` 호출.
   - 응답의 `qrToken`을 `QRCode` 컴포넌트에 전달, `expiresIn` 으로 타이머 시작.
   - 만료 또는 사용자가 재발급 누르면 다시 API 호출.
4. **신청 취소**
   - 상세 화면 하단 CTA에서 취소 확인을 받은 뒤 `POST /api/v1/events/applications/{applicationId}/cancel` 호출.
   - 요청 성공 시 상세 쿼리를 즉시 갱신하고 목록 InfiniteQuery 캐시를 무효화한다.
   - 응답 상태에 따라 토스트/Alert로 성공 메시지를 노출하고, 필요 시 이전 화면으로 이동한다.
5. **체크인 연계 (스태프)**
   - 해당 앱에서는 조회만 진행. 관리 앱에서 `POST /api/v1/staff/events/check-in` 사용.  
   - 필요 시 개발자 문서 링크 제공.  

## 6. 데이터 매핑
| UI 요소 | API 필드 | 비고 |
| --- | --- | --- |
| 카드 썸네일 | `thumbnailUrl` | 없으면 프레임 색상 처리 |
| 행사명 | `eventTitle` | 제목 길면 1줄 truncate |
| 설명 | `description` | 2줄 표시 |
| 일정 | `eventPeriod.startDate ~ endDate` | 포맷터 필요 (`YYYY년 MM월 DD일`) |
| 장소 | `location` | 상세 주소 전체 노출 |
| 상태 배지 | `eventStatus` or `applicationStatus` | `OPEN/FINISHED/CANCELLED` 등 맵핑 |
| 옵션 선택 | `optionTrail` | 상세 페이지에서 bullet 리스트 |
| QR 토큰 | `qrToken` | `QRCode` value |
| 남은 시간 | `expiresIn` | 카운트다운 |

## 7. 작업 순서 제안
1. 화면 스켈레톤 + 네비게이션 라우트 연결
2. 디자인 토큰/스타일링 구현 (공통 컬러, spacing)
3. 카드/섹션 컴포넌트 분리
4. API 클라이언트 & 훅 작성, Mock → 실서버 연동
5. 상세 화면 + QR 로직 (`react-query` or state machine)
6. 로딩/에러/빈 상태 처리
7. E2E 플로우 점검 (목록 → 상세 → QR 재발급)
8. Jest + RTL 컴포넌트 테스트 (렌더링, 상태)
9. QA 체크리스트 작성 (디자인 픽셀갭, 다국어, 접근성 등)

## 8. QA & 테스트
- **단위 테스트**: 날짜 포맷, 상태 배지, 타이머 훅.
- **컴포넌트 테스트**: 목록/상세 렌더링, API 모킹.
- **통합 테스트**: `msw`로 API 응답 시뮬레이션.
- **수동 테스트 시나리오**
  1. 신청 내역이 없을 때 빈 상태 안내 확인.
  2. 다양한 상태(진행중/종료/예정) 카드 렌더링.
  3. 상세 화면에서 QR 발급 성공/실패, 만료 후 재발급.
  4. 네트워크 오류 시 재시도 버튼 동작.

## 9. 참고 API 명세

### GET /api/v1/events/applications
- **설명**: 로그인한 사용자의 신청 내역을 커서 기반으로 조회합니다.
- **쿼리 파라미터**
  - `status` (선택, `EventApplicationStatus`): 필터링할 신청 상태
  - `from`, `to` (선택, ISO-8601 `yyyy-MM-dd`): 신청일 범위 필터
  - `cursor` (선택): 마지막 항목에서 전달받은 커서
  - `limit` (선택, 기본 20, 최대 50)
- **성공 응답** (`200 OK`)
  ```json
  {
    "items": [
      {
        "applicationId": 123,
        "eventId": 45,
        "eventTitle": "업사이클링 원데이 클래스",
        "thumbnailUrl": "https://cdn.wearagain.kr/events/45/main.jpg",
        "description": "'교환'과 '수선’으로 끝까지 입는 경험...",
        "location": "서울시 마포구 연남동 223-14 2F",
        "eventPeriod": {
          "startDate": "2025-02-10",
          "endDate": "2025-02-11"
        },
        "eventStatus": "OPEN"
      }
    ],
    "nextCursor": "MjAyNS0wMS0yOFQxMjozMDowMC4wMDBaOjEyMw==",
    "hasNext": true
  }
  ```
- **주요 오류**: `C1002`(미인증), `E1017`(잘못된 파라미터)

### GET /api/v1/events/applications/{applicationId}
- **설명**: 본인 신청 건의 상세 정보를 조회합니다.
- **성공 응답** (`200 OK`)
  ```json
  {
    "applicationId": 123,
    "eventId": 45,
    "eventTitle": "업사이클링 원데이 클래스",
    "eventStatus": "OPEN",
    "eventPeriod": {
      "startDate": "2025-02-10",
      "endDate": "2025-02-11"
    },
    "location": "서울시 마포구 연남동 223-14 2F",
    "description": "행사 소개 문구",
    "usageGuide": "준비물은 개인 텀블러를 지참해주세요.",
    "precautions": "화재 예방을 위해 지정된 구역에서만 작업해주세요.",
    "optionTrail": [
      { "eventOptionId": 2001, "name": "11월 15일", "type": "DATE" },
      { "eventOptionId": 2002, "name": "오전 세션", "type": "TIME" }
    ]
  }
  ```
- **주요 오류**: `C1002`(미인증), `C1003`(타인 신청 접근), `E1015`(신청 없음)

### POST /api/v1/events/applications/{applicationId}/qr
- **설명**: 신청 상태가 `APPLIED`인 경우 체크인용 QR 토큰을 발급/재발급합니다.
- **요청 본문**: 없음
- **성공 응답** (`200 OK`)
  ```json
  {
    "qrToken": "3b3f6e3456d34a84b41ce8a3f7fb16b1",
    "expiresIn": 600
  }
  ```
- **주요 오류**
  - `C1002` (미인증)
  - `E1015` (신청 없음)
  - `E1019` (이미 처리된 신청 → 체크인 완료 상태 안내)
  - `E1031` (이미 종료된 행사 → QR 발급 불가 안내)
  - `E1032`, `E1033` (취소된 신청 → QR 발급 불가 안내)

#### QR 오류 시 UI 규칙
- `E1019`: “이미 체크인이 완료된 신청이에요. 현장 직원에게 문의해 주세요.” → 완료(녹색) 카드 노출, 재시도 버튼 숨김.
- `E1031`: “행사가 종료되어 QR을 발급할 수 없어요.” → 종료(노랑) 카드 노출, 재시도 버튼 숨김.
- `E1032`/`E1033`: “신청이 취소되어 QR을 발급할 수 없어요.” → 취소(빨강) 카드 노출, 재시도 버튼 숨김.
- 그 외 오류: “QR을 발급하지 못했습니다. 잠시 후 다시 시도해주세요.” → 경고(빨강) 카드 + 재시도 버튼.

### POST /api/v1/events/applications/{applicationId}/cancel
- **설명**: 사용자가 본인 신청을 취소합니다. 취소 가능 상태(`APPLIED`, `CONFIRMED`)가 아니면 실패합니다.
- **요청 본문**
  ```json
  {
    "reason": "예기치 못한 일정으로 참석이 어려워요."
  }
  ```
  - `reason`은 선택값이며 입력 시 고객센터 로그에 남습니다.
- **성공 응답** (`200 OK`)
  ```json
  {
    "applicationId": 5001,
    "status": "CANCELED"
  }
  ```
- **주요 오류**: `E1016`(취소 불가), `E1015`(신청 없음), `E1019`(이미 처리된 신청/취소 불가 상태)

### POST /api/v1/staff/events/check-in
- **설명**: 스태프 코드와 QR 토큰으로 참가자를 체크인합니다.
- **요청 본문**
  ```json
  {
    "qrToken": "3b3f6e3456d34a84b41ce8a3f7fb16b1",
    "code": "023941"
  }
  ```
- **성공 응답** (`200 OK`)
  ```json
  {
    "applicationId": 123,
    "status": "CHECKED_IN",
    "checkedInAt": "2025-02-10T09:05:12Z",
    "userDisplayName": "홍길동",
    "eventTitle": "업사이클링 원데이 클래스"
  }
  ```
- **주요 오류**: `E1025`(스태프 코드 미발급), `E1026`(스태프 코드 불일치), `E1027`(토큰 만료/미존재), `E1028`(토큰 위변조), `E1019`(이미 체크인됨)
