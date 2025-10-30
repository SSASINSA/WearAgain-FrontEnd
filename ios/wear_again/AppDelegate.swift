import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import KakaoSDKAuth
import KakaoSDKCommon

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  private let moduleName = "wear_again"
  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    window = UIWindow(frame: UIScreen.main.bounds)
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()
    let factory = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    reactNativeFactory = factory

    setupKakaoSDK()
    factory.startReactNative(withModuleName: moduleName, in: window, launchOptions: launchOptions)

    return true
  }

  func application(
    _ application: UIApplication,
    open url: URL,
    sourceApplication: String?,
    annotation: Any
  ) -> Bool {
    if AuthApi.isKakaoTalkLoginUrl(url) {
      return AuthController.handleOpenUrl(url: url)
    }

    return RCTLinkingManager.application(
      application,
      open: url,
      sourceApplication: sourceApplication,
      annotation: annotation
    )
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if AuthApi.isKakaoTalkLoginUrl(url) {
      return AuthController.handleOpenUrl(url: url)
    }

    return RCTLinkingManager.application(app, open: url, options: options)
  }

  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }

  private func setupKakaoSDK() {
    guard let appKey = Bundle.main.object(forInfoDictionaryKey: "KAKAO_APP_KEY") as? String, !appKey.isEmpty else {
      NSLog("Kakao SDK: missing KAKAO_APP_KEY in Info.plist")
      return
    }
    NSLog("Kakao SDK: initializing with appKey=%@", appKey)
    KakaoSDK.initSDK(
      appKey: appKey
    )
  }
}

final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
