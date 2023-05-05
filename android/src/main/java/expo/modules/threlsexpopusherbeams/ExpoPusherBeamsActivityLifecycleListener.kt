
package expo.modules.threlsexpopusherbeams

import android.content.Context
import android.util.Log
import com.google.firebase.messaging.RemoteMessage
import com.pusher.pushnotifications.PushNotificationReceivedListener
import com.pusher.pushnotifications.PushNotifications
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import android.app.Activity;
import kotlinx.coroutines.runBlocking
import org.json.JSONObject

class ExpoPusherBeamsActivityLifecycleListener(val activityContext: Context) : ReactActivityLifecycleListener {
    override fun onResume(activity: Activity) {
        super.onResume(activity);
        PushNotifications.setOnMessageReceivedListenerForVisibleActivity(
            activity,
            object : PushNotificationReceivedListener {
                override fun onMessageReceived(remoteMessage: RemoteMessage) {
                    val map = mutableMapOf<String, Any?>()

                    val notification = remoteMessage.notification
                    val data = remoteMessage.data

                    if( notification != null) {
                        map["title"] = notification.title
                        map["body"] = notification.body
                        map["icon"] = notification.icon
                        map["image_url"] = notification.imageUrl
                        map["tag"] = notification.tag
                        map["color"] = notification.color
                        map["click_action"] = notification.clickAction
                        map["link"] = notification.link
                        map["data"] = data

                        Log.i("ThrelsPusher", "Received notification - publishing to bus")

                        postNotification(map);
                    }
                }
            })
    }

   fun postNotification(notification: Map<String, Any?>) {
       runBlocking {
           EventBus.publish(notification)
       }
   }
}