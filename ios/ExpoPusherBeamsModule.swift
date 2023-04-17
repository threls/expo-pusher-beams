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

        // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
        // Constants([
        //   "PI": Double.pi
        // ])

        // Defines event names that the module can send to JavaScript.
        Events(["onNotification", "registered", "debug"])

//        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("hello") {
            return printer();
        }
        
        Function("setInstanceId"){ (instanceId: String ) in
            setInstanceId(instanceId: instanceId)
        }
        
        AsyncFunction("subscribe"){ (interest: String, promise: Promise) in
            DispatchQueue.main.async {
                do {
                    try self.subscribe(interest: interest)
                    promise.resolve()
                } catch {
                    promise.resolve();
                }
            }
        }
//
//        // Defines a JavaScript function that always returns a Promise and whose native code
//        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("setValueAsync") { (value: String) in
            // Send an event to JavaScript.
            self.sendEvent("debug", [
                "message": value
            ])
        }
    }
    
    func printer() -> String {
        NSLog("Printing");
        return "Hello Gary!";
    }
    
    func setInstanceId(instanceId: String) {
        PushNotifications.shared.start(instanceId: instanceId);
        PushNotifications.shared.registerForRemoteNotifications();
    }
    
    func subscribe(interest: String) throws {
        try PushNotifications.shared.addDeviceInterest(interest: interest)
    }
    
    func clearAllState() {
        PushNotifications.shared.clearAllState(completion: {
            NSLog("clear all state END");
        })
    }
    
    func unsubscribe(interest: String) {
        try? PushNotifications.shared.removeDeviceInterest(interest: interest);
    }
    
    public func handleNotification(_ userInfo: [AnyHashable : Any]) {
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
        UIApplication.shared.applicationIconBadgeNumber += 1;
        
        self.sendEvent("onNotification", [
            "appState": appState
        ])
        
    }
    
    public func setDeviceToken(_ deviceToken: Data)
    {
        PushNotifications.shared.registerDeviceToken(deviceToken);
        self.sendEvent("registered")
    }
    
    public func testEvent(_ message: String) {
        self.sendEvent("debug", [
            "message": message
        ])
    }
}
