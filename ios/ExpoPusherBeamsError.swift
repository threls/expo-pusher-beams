enum ExpoPusherBeamsError: Error {
    case subscription(interest: String)
    case unsubscribe(interest: String)
    case userId(message: String)
}
