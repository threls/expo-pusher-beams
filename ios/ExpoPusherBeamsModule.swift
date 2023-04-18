import ExpoModulesCore
import PushNotifications

public class ExpoPusherBeamsModule: Module {
    
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behaviour.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoPusherBeams')` in JavaScript.
        Name("ExpoPusherBeams")

        // Defines event names that the module can send to JavaScript.
        Events(["onNotification", "registered", "debug"])
        
        Function("setInstanceId"){ (instanceId: String ) in
            setInstanceId(instanceId: instanceId)
        }
        
        Function("clearAllState"){
            clearAllState()
        }
        
        AsyncFunction("subscribe"){ (interest: String, promise: Promise) in
            DispatchQueue.main.async {
                do {
                    try self.subscribe(interest: interest)
                    promise.resolve()
                } catch {
                    promise.reject(ExpoPusherBeamsError.subscription(interest: interest));
                }
            }
        }
        
        AsyncFunction("unsubscribe"){ (interest: String, promise: Promise) in
            DispatchQueue.main.async {
                do {
                    try self.unsubscribe(interest: interest)
                    promise.resolve()
                } catch {
                    promise.reject(ExpoPusherBeamsError.unsubscribe(interest: interest));
                }
            }
        }
        
        AsyncFunction("setUserId"){ (userId: String, token: String, promise: Promise) in
            setUserId(userId: userId, token: token, promise: promise)
        }
    }
    
    
    //need to call this function somewheere
    func observeNotifications(){
        
        NotificationCenter.default
                          .addObserver(self,
                                       selector:#selector(onAppActive(notification:)),
                           name: .appActive,
                           object: nil)
        
        NotificationCenter.default
                          .addObserver(self,
                                       selector:#selector(handleNotification(notification:)),
                           name: .handleNotification,
                           object: nil)

        NotificationCenter.default
                          .addObserver(self,
                                       selector:#selector(setDeviceToken(notification:)),
                           name: .deviceToken,
                           object: nil)
        
        NotificationCenter.default
                          .addObserver(self,
                                       selector:#selector(handleError(notification:)),
                           name: .error,
                           object: nil)
    }
    
    @objc func onAppActive(notification:Notification) {
        let data = notification.object
        let receivedValue = data! as! String
        NSLog(receivedValue);
        self.sendEvent("debug", [
            "message": receivedValue
        ])
    }
    
    @objc func handleError(notification:Notification) {
        let data = notification.object
        let error = data! as! Error
        NSLog("Received an error: %@", error.localizedDescription)
    }
    
    @objc func handleNotification(notification:Notification) {
        let userInfo = notification.userInfo!;
        let userInfoAps = notification.userInfo?["aps"] as? Dictionary<String, AnyObject>;
        let state = UIApplication.shared.applicationState;
        
        var appState = "active";
        switch(state) {
        case UIApplication.State.background:
            appState = "background";
            break;
        case UIApplication.State.inactive:
            appState = "inactive";
            break;
        default:
            break;
        }
        
        // TODO: check if we should increment the badge count - (bool)[userInfo valueForKeyPath:@"aps.data.incrementBadge"]
        if(userInfoAps?["data"]?["incrementBadge"] as? Bool == true) {
            UIApplication.shared.applicationIconBadgeNumber += 1;
        }
        
        self.sendEvent("onNotification", [
            "appState": appState,
            "userInfo": notification.userInfo
        ])
        
        PushNotifications.shared.handleNotification(userInfo: userInfo)
    }
    
    @objc func setDeviceToken(notification: Notification)
    {
        let data = notification.object
        let deviceToken = data! as! Data;
        PushNotifications.shared.registerDeviceToken(deviceToken);
        self.sendEvent("registered")
    }
    
    func setInstanceId(instanceId: String) {
        PushNotifications.shared.start(instanceId: instanceId);
        PushNotifications.shared.registerForRemoteNotifications();
    }
    
    func subscribe(interest: String) throws {
        try PushNotifications.shared.addDeviceInterest(interest: interest)
    }
    
    func unsubscribe(interest: String) throws {
        try PushNotifications.shared.removeDeviceInterest(interest: interest);
    }
    
    func clearAllState() {
        PushNotifications.shared.clearAllState(completion: {
            NSLog("clear all state END");
        })
    }
    
    func setUserId(userId: String, token: String, promise: Promise) {
        let localTokenProvider = ExpoPusherBeamsLocalTokenProvider(withToken: token);
        
        PushNotifications.shared.setUserId(userId, tokenProvider: localTokenProvider, completion: { error in
            guard error == nil else {
                promise.reject(error!)
                return
            }
            
            promise.resolve()
        })
    }
    
    public required init(appContext: ExpoModulesCore.AppContext) {
        // when importing EXGL, then this line gives:
        // Value of type 'AppContext' has no member 'legacyModuleRegistry'
        super.init(appContext: appContext);
        observeNotifications();
    }
}
