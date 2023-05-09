import com.pusher.pushnotifications.auth.TokenProvider;

class LocalTokenProvider(private val token: String): TokenProvider {
    override fun fetchToken(userId: String): String {
        return token;
    }
}