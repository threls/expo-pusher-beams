import PushNotifications

public class ExpoPusherBeamsLocalTokenProvider: TokenProvider {
    var token: String;
    
    init(withToken token: String) {
        self.token = token
    }
    
    public func fetchToken(userId: String, completionHandler completion: @escaping (String, Error?) -> Void) throws {
        completion(token, nil)
    }
}
