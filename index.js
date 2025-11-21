/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {configureReanimatedLogger, ReanimatedLogLevel} from 'react-native-reanimated';
import App from './App';
import {name as appName} from './app.json';

// Reanimated strict 모드 비활성화 (경고 메시지 숨기기)
if (__DEV__) {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
}

AppRegistry.registerComponent(appName, () => App);
