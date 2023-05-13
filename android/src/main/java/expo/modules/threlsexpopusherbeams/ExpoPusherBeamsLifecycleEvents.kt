package expo.modules.threlsexpopusherbeams

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.core.os.bundleOf
import com.google.firebase.messaging.RemoteMessage
import com.pusher.pushnotifications.PushNotificationReceivedListener
import com.pusher.pushnotifications.PushNotifications
import expo.modules.core.ModuleRegistry
import expo.modules.core.interfaces.LifecycleEventListener
import expo.modules.core.interfaces.services.EventEmitter

class ExpoPusherBeamsLifecycleEvents(val context: Context, val activity: Activity, val moduleRegistry: ModuleRegistry): LifecycleEventListener {
    private var eventEmitter: EventEmitter = moduleRegistry.getModule(EventEmitter::class.java)

    override fun onHostResume() {
        eventEmitter.emit("debug", bundleOf(
            "message" to "On host resume"
        ))

        PushNotifications.setOnMessageReceivedListenerForVisibleActivity(
            activity,
            object : PushNotificationReceivedListener {
                override fun onMessageReceived(remoteMessage: RemoteMessage) {
                    val map = mutableMapOf<String, Any?>()

                    val notification = remoteMessage.notification
                    val data = remoteMessage.data.toMap();

                    if( notification != null) {
                        map["title"] = notification.title
                        map["body"] = notification.body
                        map["icon"] = notification.icon
                        map["image_url"] = notification.imageUrl
                        map["tag"] = notification.tag
                        map["color"] = notification.color
                        map["click_action"] = notification.clickAction
                        map["link"] = notification.link

                        Log.i("ThrelsPusher", "Received notification - publishing to event bus")
                        eventEmitter.emit("onNotification", bundleOf(
                            "userInfo" to mapOf(
                                "notification" to map,
                                "data" to data
                            ),
                            "appState" to "active"
                        ))
                    }
                }
            })
    }

    override fun onHostPause() {
        eventEmitter.emit("debug", bundleOf(
            "message" to "On host pause"
        ))
    }

    override fun onHostDestroy() {
    }

}