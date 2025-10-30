declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

declare module 'react-native-config' {
  interface EnvConfig {
    API_BASE_URL?: string;
    OAUTH_KAKAO_CLIENT_ID?: string;
    OAUTH_KAKAO_REDIRECT_URI?: string;
    OAUTH_KAKAO_NATIVE_CALLBACK_PATH?: string;
    OAUTH_KAKAO_SCOPES?: string;
    KAKAO_APP_KEY?: string;
  }

  const Config: EnvConfig;
  export default Config;
}
