
package expo.modules.threlsexpopusherbeams

import android.content.Context
import android.util.Log
import com.google.firebase.messaging.RemoteMessage
import com.pusher.pushnotifications.PushNotificationReceivedListener
import com.pusher.pushnotifications.PushNotifications
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import android.app.Activity;
import org.json.JSONObject

class ExpoPusherBeamsActivityLifecycleListener(val activityContext: Context) : ReactActivityLifecycleListener {
    override fun onResume(activity: Activity) {
        super.onResume(activity);
        PushNotifications.setOnMessageReceivedListenerForVisibleActivity(
            activity,
            object : PushNotificationReceivedListener {
                override fun onMessageReceived(remoteMessage: RemoteMessage) {
                    val map = mutableMapOf<String, String?>()

                    val notification = remoteMessage.notification
                    val data = remoteMessage.data

                    if( notification != null) {
                        map["body"] = notification.body
                        map["title"] = notification.title
                        map["tag"] = notification.tag
                        map["click_action"] = notification.clickAction
                        map["icon"] = notification.icon
                        map["color"] = notification.color
                        map["data"] = (data as Map<*, *>?)?.let { JSONObject(it).toString() }
                    }


                    val messagePayload = remoteMessage.data["inAppNotificationMessage"]
                    if (messagePayload == null) {
                        // Message payload was not set for this notification
                        Log.i("MyActivity", "Payload was missing")
                    } else {
                        Log.i("MyActivity", messagePayload)
                        // Now update the UI based on your message payload!
                    }
                }
            })
    }
}