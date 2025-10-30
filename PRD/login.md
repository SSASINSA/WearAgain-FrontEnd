# Login PRD

※ 프로젝트 문서화 원칙에 따라 본 문서는 한글로 작성합니다.

## 1. 배경
- WearAgain 로그인 경험을 [Figma 플로우](https://www.figma.com/design/zp3I0LWtnTyYbUliFNnr2m/%ED%94%BC%EC%9A%B0%EB%8B%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=438-4&t=f6n6YrHZOXXn0Ip6-4)에 맞춰 마찰 없이 제공한다.

## 2. 목표 및 성공 지표
- **목표:** 카카오, 애플, 구글 소셜 로그인 제공자로 인증하고, 앱 실행 후 두 번 이내의 탭으로 홈 화면에 진입할 수 있게 한다.
- **안정성:** 지원 제공자 전체에서 로그인 플로우 오류율을 2% 미만으로 유지한다.
- **보안:** 토큰을 평문으로 저장하지 않고, 저장 방식이 내부 보안 점검을 통과한다.

## 3. 범위
### 포함 범위
- Figma 기준의 로그인 화면 UI와 상태(대기, 로딩, 성공, 오류).
- 필요 시 PKCE를 포함한 OAuth 2.0 인가 코드 플로우.
- 백엔드 콜백 `POST localhost:8080/api/v1/auth/{provider}/callback`을 통한 토큰 교환.
- 토큰 저장: `accessToken`은 전역 상태 스토어, `refreshToken`은 OS 암호화 저장소(EncryptedStorage).
- 노출, 제공자 버튼 클릭, 성공, 실패 이벤트에 대한 기본 분석 로깅.
- 상태 및 저장소 초기화, 내비게이션 리셋을 포함한 우아한 로그아웃 처리.

### 제외 범위
- 이메일/비밀번호 기반 가입 양식.
- 비밀번호 재설정, 다중 인증.
- OAuth 콜백 외의 딥링크 처리.
- 백엔드 구현 상세(API 명세는 추후 백엔드에서 제공).

## 4. 사용자 시나리오
- **재방문 사용자로서** 선호 제공자로 로그인해 저장된 옷장을 바로 이어서 보고 싶다.
- **신규 사용자로서** 어떤 제공자를 지원하는지 명확히 이해하고 onboarding을 혼란 없이 끝내고 싶다.
- **로그인 실패 사용자로서** 도움이 되는 메시지와 재시도 방법을 받아 로그인에서 막히지 않기를 원한다.
- **보안에 민감한 사용자로서** 토큰이 내 기기에서 안전하게 보관되기를 기대한다.

## 5. 경험 요건
### 진입 조건
- 메모리에 유효한 `accessToken`이 없으면 앱은 로그인 화면을 첫 화면으로 띄운다.
- 앱 시작 시 저장된 `refreshToken`으로 세션 복원이 성공하면 로그인 화면을 건너뛰고 루트 내비게이터로 진입한다.

### 화면 레이아웃
- Figma의 CTA 계층, 타이포그래피, 버튼 스타일, 간격을 그대로 반영한다.
- WearAgain 브랜드 요소, 태그라인, 제공자 버튼(Google, Apple, Kakao—최종 제공자 목록 확인 필요)을 노출한다.
- 디자인에 법적 고지(이용약관, 개인정보 처리방침) 링크가 있을 경우, 탭 시 인앱 브라우저로 연다.

### 상호작용 플로우
1. **초기 진입**
   - 제공자 버튼이 활성화된 대기 상태를 보여준다.
   - 레이아웃이 흔들리지 않도록 필요한 폰트/에셋을 선로드한다.
2. **제공자 선택**
   - 버튼 탭 시 다른 버튼은 비활성화하고 디자인에 맞춰 로딩 스피너를 표시한다.
   - 제공자별로 맞는 OAuth 플로우(커스텀 탭/SFSafariViewController 또는 네이티브 SDK)를 호출한다.
3. **인가**
   - 제공자 리다이렉트로부터 인가 코드를 수신한다.
   - 코드와 제공자 식별자를 포함해 백엔드 콜백 엔드포인트를 호출한다. 네트워크 타임아웃 발생 시 2회, 지수 백오프로 재시도한다.
4. **토큰 처리**
   - 성공 시 `accessToken`을 전역 인증 스토어(`src/store` 하위 Zustand 모듈)에 저장한다.
   - `refreshToken`은 EncryptedStorage 등 OS 보안 저장소에 저장한다.
   - 인증된 루트 스택으로 내비게이션한다.
5. **실패 처리**
   - 백엔드 오류 코드를 사용자 친화 메시지로 변환(`OAUTH_DENIED`, `NETWORK_ERROR` 등).
   - 인라인 토스트/배너로 오류를 노출하고 버튼을 재활성화한다.
   - 재시도 CTA를 제공하고, 제공자와 실패 사유를 포함해 이벤트를 로깅한다.

### 예외 상황
- 사용자가 OAuth를 취소하면 이를 감지하고 UI를 대기 상태로 되돌린다.
- 리프레시 토큰이 무효화되면 백엔드 리프레시 호출에서 401 응답 시 저장소를 비우고 메시지와 함께 로그인 화면으로 돌아간다.
- 오프라인 상태에서는 전용 배너를 표시하고, 연결이 복구될 때까지 버튼을 비활성화한다.
- 기기 시간이 5분 이상 틀어진 경우, 제공자에서 인증을 거부하면 사용자에게 안내한다(제공 시나리오 한정).

## 6. 데이터 및 상태 관리
- **Access Token:** 전용 인증 슬라이스(Zustand)에 저장하고 getter/setter 및 재하이드레이션 로직을 제공한다.
- **Refresh Token:** `react-native-encrypted-storage` 또는 플랫폼 보안 저장소를 활용해 저장한다. `react-native-keychain`의 AES 기반 저장 가이드를 참고해 OS 수준 암호화 및 잠금 화면 보호를 보장한다.
- **사용자 프로필 스텁:** 세션 수립 후 최소한의 프로필 데이터를 요청하고, 추후 스토리에서 확장한다.
- **로그아웃:** 인증 슬라이스 초기화, 보안 저장소 삭제, 내비게이션 스택 리셋을 포함한다.

## 7. 기술 고려사항
- 다중 제공자를 지원하는 공통 OAuth 핸들러를 구축하고, 제공자 설정은 `.env`를 통해 주입한다.
- 필요 시 `Linking` 또는 `AuthSession` 스타일의 콜백을 사용하며, 백엔드에서 딥링크 스킴을 노출하는지 확인한다.
- iOS 13+에서 쿠키를 유지하기 위해 `ASWebAuthenticationSession` 요구사항을 충족한다.
- `localhost` 엔드포인트는 환경(dev/stage/prod)에 따라 `src/utils`의 설정 모듈로 교체 가능하게 한다.
- 인증 관련 네트워킹은 `src/api/auth.ts`에 집약하고, 응답 타입과 오류 구분 로직을 정의한다.
- 앱 생명주기 복귀 시 무음 토큰 갱신을 구현하되, 중복 호출을 방지하기 위해 스로틀링한다.
- QA를 위한 성공/실패 시뮬레이션 토글을 제공한다.

## 8. 비기능 요건
- **보안:** 모든 토큰 저장 및 전송은 HTTPS/TLS 1.2 이상을 사용한다. `refreshToken` 저장 실패 시 로깅과 함께 내비게이션을 차단해 실패를 숨기지 않는다.
- **성능:** 중간급 안드로이드 기기 기준 콜드 스타트에서 로그인 화면 렌더링을 750 ms 이하로 유지한다. OAuth 전환은 버튼 탭 후 200 ms 이내에 상태 변화를 보여준다.
- **접근성:** 스크린 리더로 버튼을 탐색 가능하게 하고 “Google로 계속하기”와 같은 명확한 접근성 라벨을 제공한다.
- **현지화:** 한/영 전환을 고려해 문구는 중앙 집중형 i18n 모듈에서 관리한다.

## 9. 분석 및 로깅
- 이벤트: `login_impression`, `login_provider_tap`, `login_success`, `login_failure`, `login_cancel`.
- 제공자, 오류 유형, 지연 시간, 앱 버전을 이벤트 페이로드에 포함한다.
- 기존 `src/utils` 분석 래퍼를 재사용하거나 미존재 시 신규 모듈을 정의한다.

## 12. 개발 서버 API 명세
### 1. Google 로그인/회원가입
- **POST** `/api/v1/auth/google/callback`
- 요청
  ```json
  {
    "authorizationCode": "AUTHORIZATION_CODE"
  }
  ```
- 성공 응답
  ```json
  {
    "userId": "00000000-0000-0000-0000-000000000000",
    "email": "user@example.com",
    "displayName": "사용자",
    "profileImageUrl": "https://lh3.googleusercontent.com/...",
    "accessToken": "JWT_ACCESS_TOKEN",
    "refreshToken": "JWT_REFRESH_TOKEN",
    "accessTokenExpiresIn": 900,
    "refreshTokenExpiresIn": 1209600
  }
  ```
- 실패 시 `A1001` 또는 `A1004` 에러 코드 사용

### 2. Kakao 로그인/회원가입
- **POST** `/api/v1/auth/kakao/id-token`
- 요청
  ```json
  {
    "idToken": "KAKAO_ID_TOKEN"
  }
  ```
- 처리
  - 전달된 `idToken`으로 카카오 사용자 정보를 검증 및 조회한다.
  - 사용자 정보가 존재하지 않으면 자동 회원가입을 수행하고 JWT를 발급한다.
  - RTR 정책에 따라 Refresh Token을 회전시킨다.
- 성공 응답: Google과 동일 구조 (`userId`는 UUID 문자열)
- 실패 시 `A1002`(카카오 idToken 검증 실패/사용자 정보 조회 실패) 또는 `A1004`(입력 파라미터 누락) 에러 코드 사용

### 3. Apple 로그인/회원가입
- **POST** `/api/v1/auth/apple/callback`
- 요청
  ```json
  {
    "code": "AUTHORIZATION_CODE",
    "id_token": "APPLE_ID_TOKEN"
  }
  ```
- 성공 응답: Google과 동일 구조 (`userId`는 UUID 문자열)
- 실패 시 `A1003` 또는 `A1004` 에러 코드 사용

### 4. Refresh Token Rotation 재발급
- **POST** `/api/v1/auth/refresh`
- 요청
  ```json
  {
    "refreshToken": "JWT_REFRESH_TOKEN"
  }
  ```
- 성공 응답
  ```json
  {
    "accessToken": "NEW_JWT_ACCESS_TOKEN",
    "refreshToken": "NEW_JWT_REFRESH_TOKEN"
  }
  ```
- 실패 시 `A1005`(만료/불일치) 또는 `A1007`(재사용) 에러 코드 사용

### 표준 에러 응답 구조

모든 인증 관련 API는 다음 표준 구조를 따른다.

```json
{
  "timestamp": "2025-10-04T12:34:56",
  "statusCode": 401,
  "errorCode": "A1001",
  "message": "에러 설명 메시지",
  "path": "/api/v1/auth/..."
}
```

### 에러 코드 목록

| ErrorCode | HTTP Status | 설명 |
|-----------|-------------|------|
| A1001 | 401 Unauthorized | Google OAuth 인증 실패 |
| A1002 | 401 Unauthorized | Kakao OAuth 인증 실패 또는 이메일 미제공 |
| A1003 | 401 Unauthorized | Apple OAuth 인증 실패 |
| A1004 | 400 Bad Request | Authorization Code 누락/유효하지 않음 |
| A1005 | 401 Unauthorized | Refresh Token 만료 또는 불일치 |
| A1006 | 401 Unauthorized | Access Token 만료 |
| A1007 | 401 Unauthorized | RTR 검증 실패 (재사용된 Refresh Token) |


## 11. QA 및 테스트
- 인증 스토어(토큰 저장/초기화)와 API 클라이언트 성공/실패 경로에 대한 단위 테스트를 작성한다.
- 로그인 화면 컴포넌트 테스트로 버튼 렌더링, 로딩, 오류 상태를 검증한다.
- 모의 백엔드와 함께 전체 OAuth 루프를 검증하는 E2E 시나리오(Detox/Appium)를 준비한다.
- 기기 일시중지/재개, 저전력 모드, 화면 회전 등 수동 회귀 체크리스트를 정의한다.

## 12. 의존성과 오픈 이슈
- 백엔드 API 계약, 제공자 목록, 오류 스키마(백엔드 팀에서 전달 예정).
- 제공자별 인앱 브라우저 vs 네이티브 SDK 사용 여부 확정.
- 법적 고지 문구와 현지화 리소스 최종 확정.
- 베타 기간에 사용할 분석 도구(Mixpanel vs Segment) 확정.

## 13. 롤아웃 계획
- **개발 통합:** 전체 플로우 검증 전까지 기능 플래그로 가려서 배포한다.
- **내부 QA:** TestFlight/내부 테스트 채널에서 모의 제공자로 검증한다.
- **베타 릴리스:** 제한된 사용자군에 배포하고 오류율과 전환율을 모니터링한다.
- **정식 배포:** 1주일간 성공 지표를 충족하면 기능 플래그를 해제한다.
