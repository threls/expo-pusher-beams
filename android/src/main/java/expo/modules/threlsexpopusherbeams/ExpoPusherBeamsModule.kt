package expo.modules.threlsexpopusherbeams

import LocalTokenProvider
import android.content.Context
import android.util.Log
import androidx.core.os.bundleOf
import com.google.firebase.messaging.RemoteMessage
import com.google.gson.Gson
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.pusher.pushnotifications.PushNotifications
import com.pusher.pushnotifications.BeamsCallback
import com.pusher.pushnotifications.PushNotificationReceivedListener
import com.pusher.pushnotifications.PusherCallbackError
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import kotlinx.coroutines.coroutineScope

class ExpoPusherBeamsModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
    private val currentActivity
        get() = appContext.currentActivity ?: throw Exceptions.MissingActivity()

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoPusherBeams')` in JavaScript.
        Name("ExpoPusherBeams")

        // Defines event names that the module can send to JavaScript.
        Events("onNotification")
        
        OnActivityEntersForeground {
            PushNotifications.setOnMessageReceivedListenerForVisibleActivity(
                currentActivity,
                object : PushNotificationReceivedListener {
                    override fun onMessageReceived(remoteMessage: RemoteMessage) {
                        val map = mutableMapOf<String, Any?>()

                        val notification = remoteMessage.notification
                        val data = remoteMessage.data.toMap()

                        if (notification != null) {
                            map["title"] = notification.title
                            map["body"] = notification.body
                            map["icon"] = notification.icon
                            map["image_url"] = notification.imageUrl
                            map["tag"] = notification.tag
                            map["color"] = notification.color
                            map["click_action"] = notification.clickAction
                            map["link"] = notification.link

                            Log.i(
                                "ExpoPusherBeams",
                                "Received notification - publishing to event bus"
                            )
                            sendEvent(
                                "onNotification", bundleOf(
                                    "userInfo" to Gson().toJson(
                                        mapOf(
                                            "notification" to map,
                                            "data" to data
                                        )
                                    ),
                                    "appState" to "active"
                                )
                            )
                        }
                    }
                })
        }

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        AsyncFunction("setInstanceId") Coroutine { instanceId: String ->
            setInstanceId(instanceId)
        }

        AsyncFunction("clearAllState") { promise: Promise ->
            clearAllState()
            promise.resolve(null)
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("subscribe") { interest: String, promise: Promise ->
            subscribe(interest)
            promise.resolve(null)
        }

        AsyncFunction("unsubscribe") { interest: String, promise: Promise ->
            // Send an event to JavaScript.
            unsubscribe(interest)
            promise.resolve(null)
        }

        AsyncFunction("setUserId") { userId: String, token: String, promise: Promise ->
            PushNotifications.setUserId(
                userId,
                LocalTokenProvider(token),
                object : BeamsCallback<Void, PusherCallbackError> {
                    override fun onFailure(error: PusherCallbackError) {
                        promise.resolve("Could not login to Beams: \${error.message}")
                    }

                    override fun onSuccess(vararg values: Void) {
                        promise.resolve(null)
                    }
                }
            )
        }
    }

    private suspend fun setInstanceId(instanceId: String) = coroutineScope {
        PushNotifications.start(context, instanceId)
    }

    private fun subscribe(interest: String) {
        PushNotifications.addDeviceInterest(interest)
    }

    private fun unsubscribe(interest: String) {
        PushNotifications.removeDeviceInterest(interest)
    }

    private fun clearAllState() {
        PushNotifications.clearAllState()
    }
}
