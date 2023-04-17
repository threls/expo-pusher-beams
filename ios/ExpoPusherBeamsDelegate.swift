import ExpoModulesCore
import PushNotifications

public class ExpoPusherBeamsDelegate: ExpoAppDelegateSubscriber {
    let expoPusherBeamsModule = ExpoPusherBeamsModule(appContext: AppContext.init());
    
    public func applicationDidBecomeActive(_ application: UIApplication) {
        // The app has become active.
        NSLog("WE ARE ACTIVE- applicationDidBecomeActive");
        expoPusherBeamsModule.testEvent("applicationDidBecomeActive");
    }

    public func applicationWillResignActive(_ application: UIApplication) {
        // The app is about to become inactive.
        expoPusherBeamsModule.testEvent("applicationDidBecomeActive");
        NSLog("WE ARE ACTIVE");
    }

    public func applicationDidEnterBackground(_ application: UIApplication) {
        // The app is now in the background.
        expoPusherBeamsModule.testEvent("applicationDidBecomeActive");
        NSLog("WE ARE ACTIVE - applicationDidEnterBackground");
    }

    public func applicationWillEnterForeground(_ application: UIApplication) {
        // The app is about to enter the foreground.
        expoPusherBeamsModule.testEvent("applicationDidBecomeActive");
        NSLog("WE ARE ACTIVE - applicationWillEnterForeground");
    }

    public func applicationWillTerminate(_ application: UIApplication) {
        // The app is about to terminate.
//        expoPusherBeamsModule.testEvent("applicationDidBecomeActive");
    }

    public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
//        expoPusherBeamsModule.setDeviceToken(deviceToken)
    }

    public func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        
        NSLog("WE ARE ACTIVE - didReceiveRemoteNotification");
//        expoPusherBeamsModule.handleNotification(userInfo);
    }

    public func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NSLog("Remote notification support is unavailable due to error: %@", error.localizedDescription);
    }
}

