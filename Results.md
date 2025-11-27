# 작업 결과 요약

## 신청 상세 취소/QR 오류 대응
- 신청내역 상세 화면에 취소 CTA와 사유 입력 모달(`EventCancelModal`)을 연결하고 `useCancelApplication` 훅을 통해 `/events/applications/{id}/cancel` 패치 API를 연동했습니다. 취소 시 상세/목록/관련 이벤트 캐시를 무효화하도록 구성했습니다.
- QR 발급 실패를 감지하는 상태(`hasError`, `errorMessage`)를 `useApplicationQr`에 추가해 토큰이 없고 오류일 때는 별도 경고 카드(재시도 버튼 포함)를 보여주도록 UI를 분기했습니다.
- QR 재발급 시 오류 상태를 초기화해 재시도 흐름이 막히지 않도록 했습니다.
- QR 발급 오류를 코드별로 화면에 분기했습니다: `E1019`(체크인 완료/녹색 카드), `E1031`(행사 종료/노랑 카드), `E1032·E1033`(취소된 신청/빨강 카드), 기타 오류(재시도 버튼 포함).
- 신청 취소 CTA를 눈에 띄지 않는 링크 텍스트로 QR 섹션 하단에 배치해 기본 화면 혼잡도를 줄였습니다.
- 행사 상태가 `OPEN`이고 신청 상태가 `APPLIED`인 경우에만 취소 CTA를 노출하도록 조건을 추가해, 취소 불가 상태에서는 링크가 아예 보이지 않습니다.
- 상세 화면 재진입 시 쿼리 refetch 동안 상단에 “새로고침 중” 인라인 인디케이터를 보여주도록 했습니다.
- 행사 종료 카드 색상은 기존 노랑 톤(배경 `#FFFBEB`, 보더 `#FDE68A`, 뱃지 `#FEF3C7`)으로 유지합니다.
- 테스트 미실행: 로컬 Jest/시뮬레이터 실행 없이 코드 레벨 점검만 진행했습니다.

## 브랜치
- `feature/10`
- `feature/11`

## 더보기 화면 PRD/구현
- Figma 더보기(내정보) 탭(`node-id=70:669`)을 기반으로 `PRD/more.md`에 배경, 목표, IA, UX 플로우, 데이터/네비 요구사항, 로깅, QA 체크리스트를 정의했습니다.
- 상단 인사/로그아웃, 프로모션 슬롯(“21% 파티란 ?”), 계정/기타 섹션 메뉴, 하단 탭 활성 상태 등 시안 요소를 명시했습니다.
- 로그인 선행 전제를 반영해 비로그인 예외를 세션 만료 시 안내/전환으로만 처리하도록 수정했습니다.
- `src/screens/mypage/MyPageScreen.tsx`를 신설해 더보기 UI를 구현했고, `MyPageNavigation`에 연결했습니다. (상단 인사/로그아웃, 프로모션 카드, 계정·기타 메뉴, 화살표 내비게이션)
- 메뉴별 아이콘을 `react-native-svg`로 인라인 정의했고, 신청 내역은 `ApplicationsStack`으로 이동합니다. 미구현 메뉴는 Alert로 안내하도록 임시 처리했습니다.
- 프로모션 이미지를 `src/assets/images/more-promo.png`로 추가했습니다.
- CommonHeader에서 더보기 타이틀을 제거해 Figma처럼 아이콘만 노출하도록 맞췄습니다.

## 신청 취소 API 연동 명세 추가
- `PRD/application.md`에 신청 취소 CTA/플로우 요구사항을 추가하고 UX 고려사항, API 연동 시나리오에 취소 단계를 명시했습니다.
- 신규 `POST /api/v1/events/applications/{applicationId}/cancel` 엔드포인트 명세(요청/응답/에러)를 정의해 구현 범위를 확정했습니다.
- 취소 성공 시 목록/상세 캐시 무효화, 실패 시 오류 매핑 등 후속 처리 가이드를 문서화했습니다.

## 신청 상세 API 즉시 호출
- `ApplicationDetailScreen`에서 전달한 요약 데이터를 `initialData`로 넣어두자 React Query 기본 `staleTime`(5분) 설정 때문에 쿼리가 새 데이터를 요청하지 않아 `applicationsApi.getApplicationDetail`이 전혀 호출되지 않는 문제를 확인했습니다.
- `useApplicationDetail` 훅이 요약 데이터를 `placeholderData`로만 사용하도록 수정해 화면은 즉시 그리면서도 실제 상세 API를 즉시 호출하도록 변경했습니다. (`src/hooks/useApplications.ts`)
- QR 토큰 발급 요청(`useApplicationQr`)과 달리 상세 정보 호출이 발생하지 않는 현상을 개발자 도구에서 다시 확인해 네트워크 트래픽이 정상적으로 생성되는 것을 검증했습니다.

## 신청 내역 화면 구축
- Figma 시안을 참고해 `src/screens/applications/ApplicationListScreen.tsx`와 `ApplicationHistoryCard` 컴포넌트를 작성, 신청 내역 리스트·헤더·상태 배지·아이콘 정보를 동일한 레이아웃으로 구현했습니다.
- `src/app/navigation/ApplicationsNavigation.tsx`를 구성하고 `ApplicationsStack`을 모든 상위 네비게이션에서 접근 가능하도록 연결하여 공용 헤더의 신청 버튼이 어느 탭에서도 상세 화면으로 진입하도록 했습니다.
- `ApplicationDetailScreen`에서 상단 그라데이션 카드, QR 박스, 이용 방법/주의사항 섹션을 구현하고 `react-native-qrcode-svg`로 샘플 토큰을 렌더링했습니다.
- QR 렌더링을 위해 `react-native-qrcode-svg`를 의존성에 추가했습니다. (iOS는 `pod install` 필요)
- 샘플 데이터를 카드에 바인딩해 이미지, 날짜 범위, 위치, 주소를 표시하고 상태별 색상 테마를 Figma 시안과 맞췄습니다.
- 기존 `DetailHeader`를 재사용할 수 있도록 SafeArea 적용 옵션과 타이틀·우측 슬롯을 지원하는 형태로 확장하고 (`src/components/common/DetailHeader.tsx`), 신청 내역 화면에서 해당 컴포넌트를 활용해 iOS 상단 영역을 자연스럽게 정리했습니다.
- 테스트 미실행: 아직 jest/eslint 셋업 이슈가 남아 있어 수동 검증 단계만 진행했습니다.
## #11 로그인 상태 관리 및 저장
- `react-native-encrypted-storage`를 도입해 새 `src/utils/storage/secureTokens.ts`에서 리프레시 토큰을 안전하게 저장/삭제하도록 유틸을 구성했습니다.
- `src/store/auth.store.ts`로 인증 Zustand 슬라이스를 재구축해 토큰, 사용자, 상태 플래그, 에러 메시지를 일원화하고, 세션 하이드레이션/리프레시/로그아웃 비동기 루틴을 추가했습니다.
- `src/api/auth/session.ts`에서 `/auth/refresh` 연동을 캡슐화하고, API 클라이언트 인터셉터가 401/403 응답 시 단일 리프레시 파이프라인을 재사용하도록 구성했습니다.
- `src/app/navigation/RootNavigation.tsx`에는 앱 시작 시 세션을 하이드레이션하는 가드와 로딩 스피너를 넣고, 로그인 성공 시 `MainNavigation`으로 전환하게 연결했습니다.
- `LoginScreen`이 상위에서 내려준 초기 에러 메시지를 재표시하도록 `initialErrorMessage` 반영 로직을 추가하고, 로그인을 마치면 저장소 갱신 콜백을 호출합니다.

## 안드로이드 환경 변수 모듈 노출 복구
- `react-native.config.js`에서 안드로이드 오토링크를 끈 상태라 `RNCConfigModule`이 등록되지 않아 TS 계층에서 환경 변수가 비어 있던 것을 확인했습니다.
- `android/app/src/main/java/com/wear_again/MainApplication.kt`에서 `ReactNativeConfigPackage()`를 수동으로 추가하여 `NativeModules.RNCConfigModule`이 항상 로드되도록 했습니다.
- 수정 후에는 Hermes 런타임에서도 `API_BASE_URL` 등을 `getEnvOrThrow`가 정상적으로 읽어옵니다.
- `src/utils/env.ts`를 갱신해 `NativeModules.RNCConfigModule`에서 직접 값을 읽고, 열거되지 않는 키도 정상 처리하도록 캐시/정규화 로직을 조정했습니다.

## #10 소셜 로그인 연동 (Kakao)
- `src/types/auth.ts`, `src/api/auth/*`에 OAuth 전용 타입, 오류 객체, 공급자 구성, Linking 기반 인가 코드 흐름을 추가했습니다.
  - `startWebAuthFlow`로 state 생성, 딥링크 수신, 타임아웃/취소 처리까지 캡슐화했습니다.
  - 백엔드 교환은 `authApiClient` + `retry` 유틸로 2회 지수 백오프 재시도를 수행합니다.
- Kakao 제공자 구성과 환경 변수(`KAKAO_CLIENT_ID`, `KAKAO_REDIRECT_URI`, `KAKAO_AUTH_SCOPES`)를 읽어와 URL을 빌드합니다.
  - Apple/Google은 정의만 두고 호출 시 `NOT_IMPLEMENTED` 오류를 던져 UI에서 안내하도록 했습니다.
- OAuth 응답/에러를 `AuthError`로 통일하고, `mapAuthErrorToMessage`로 사용자 메시지를 한국어로 매핑했습니다.
- `LoginScreen`이 내부적으로 `performSocialLogin`을 사용하도록 수정하고 성공 콜백(`onLoginSuccess`) 훅을 추가했습니다.
  - Kakao 로그인 성공 시 토큰 페이로드를 콜백으로 전달하고, 실패 시 공급자별 안내 문구를 보여줍니다.
- `todolist.md`에 작업 진척도를 업데이트하여 Kakao 플로우 완료와 Apple/Google 후속 과제를 명시했습니다.

## 환경/테스트 메모
- `.env` 혹은 런타임 환경에서 아래 값을 제공해야 Kakao 로그인이 동작합니다.
  - `AUTH_API_BASE_URL` (기본값 `http://localhost:8080/api/v1`)
  - `KAKAO_CLIENT_ID`, `KAKAO_REDIRECT_URI`, 필요 시 `KAKAO_AUTH_SCOPES`
- `npm run lint`를 실행했으나 기존 `HomeNavigation`, 공용 헤더 등에서 남아 있던 미사용 변수 경고로 통과하지 못했습니다. 범위 밖 파일이 정리되면 다시 확인이 필요합니다.
- 실제 단말 테스트 시 딥링크 스킴과 백엔드 콜백 경로가 일치하는지 확인이 필요합니다.
- `npm test -- App` 실행 시 `@react-navigation/native`가 ESM으로 배포되어 Jest가 `export` 구문을 파싱하지 못하는 오류가 발생했습니다. `transformIgnorePatterns` 확장 혹은 Jest 29 ESM 대응 설정이 필요합니다.
- iOS에서 `react-native-encrypted-storage` 연동 후에는 `cd ios && pod install`을 수행해 네이티브 의존성을 적용해야 합니다.

## 이전 작업 (#9)
- Figma 로그인 UI 반영, `SocialLoginButton` 상태 추가, 법적 고지 링크 연결 등 화면 마크업을 구축했습니다.

## 스크립트/환경 정리 (2025-02-14)
- Xcode `Clean Build Folder` 시 `.env`를 읽지 못하고 `no implicit conversion of nil into String` 오류가 발생하는지 재현했습니다. 런 스크립트에서 `BuildXCConfig.rb` 실행 시 루트/출력 경로 인자가 빠져 `envs_root`가 빈 문자열로 전달되는 것이 원인이었습니다.
- `ios/wear_again.xcodeproj/xcshareddata/xcschemes/wear_again.xcscheme:13`에 `&quot;${SRCROOT}/..&quot; &quot;${SRCROOT}/tmp.xcconfig&quot;` 인자를 추가하여 스크립트가 `.env`를 올바르게 읽어 `tmp.xcconfig`를 생성하도록 수정했습니다.
- 생성 파일이 레포에 포함되지 않도록 `.gitignore`에 `ios/tmp.xcconfig`를 추가했습니다.
- 수동 검증: `ruby node_modules/react-native-config/.../BuildXCConfig.rb ios/.. ios/tmp.xcconfig` 실행으로 `.env` 값이 정상 출력되는지 확인 후 임시 파일을 삭제했습니다.

## iOS 빌드 정비 (GeneratedKakaoInfo.h 오류)
- `Info.plist`에서 Kakao 스킴/키를 `$(KAKAO_APP_KEY)` 형식으로 참조하도록 수정해 Xcode의 빌드 설정 치환을 사용했습니다.
- `wear_again.xcodeproj`에서 `INFOPLIST_PREFIX_HEADER`와 `INFOPLIST_PREPROCESS` 설정을 제거하여 더 이상 `DerivedSources/GeneratedKakaoInfo.h` 파일을 요구하지 않도록 정리했습니다.
- ✅ 확인: `tmp.xcconfig`가 생성된 상태에서 Xcode 빌드 시 누락 파일 오류가 발생하지 않는지 재검증 예정.

## 안드로이드 빌드 변수 연동
- `android/app/build.gradle`에서 `react-native-config`가 제공하는 `project.env` 값을 읽어 `kakao_app_key`, `kakao_scheme` 문자열 리소스를 동적으로 주입합니다.
- `AndroidManifest.xml`의 Kakao 인증 인탠트 필터가 `@string/kakao_scheme`을 사용하도록 변경해 `.env`의 `KAKAO_APP_KEY`를 기반으로 스킴을 구성합니다.
- `strings.xml`의 정적 `kakao_app_key` 항목을 제거하고, 빌드 단계에서 env 값으로 덮어쓴다는 주석을 추가했습니다.
