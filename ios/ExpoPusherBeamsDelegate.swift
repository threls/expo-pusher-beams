import ExpoModulesCore
import PushNotifications

public class ExpoPusherBeamsDelegate: ExpoAppDelegateSubscriber {
    
    public func applicationDidBecomeActive(_ application: UIApplication) {
        NotificationCenter.default.post(name: .appActive, object: "applicationDidBecomeActive")
    }

    public func applicationWillResignActive(_ application: UIApplication) {
        NotificationCenter.default.post(name: .appActive, object: "applicationWillResignActive")
    }

    public func applicationDidEnterBackground(_ application: UIApplication) {
        NotificationCenter.default.post(name: .appActive, object: "applicationDidEnterBackground")
    }

    public func applicationWillEnterForeground(_ application: UIApplication) {
        NotificationCenter.default.post(name: .appActive, object: "applicationWillEnterForeground")
    }

    public func applicationWillTerminate(_ application: UIApplication) {
        NotificationCenter.default.post(name: .appActive, object: "applicationWillTerminate")
    }

    public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        NotificationCenter.default.post(name: .deviceToken, object: deviceToken)
    }

    public func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        NotificationCenter.default.post(name: .handleNotification, object: nil, userInfo: userInfo)
    }

    public func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .error, object: error)
        NSLog("Remote notification support is unavailable due to error: %@", error.localizedDescription);
    }
}


// can declare notification names
extension Notification.Name {
    static var appActive: Notification.Name {
          return .init(rawValue: "App.Active") }
    static var handleNotification: Notification.Name {
          return .init(rawValue: "Beams.Notification") }
    static var deviceToken: Notification.Name {
          return .init(rawValue: "Beams.DeviceToken") }
    static var error: Notification.Name {
          return .init(rawValue: "Beams.Error") }
}

