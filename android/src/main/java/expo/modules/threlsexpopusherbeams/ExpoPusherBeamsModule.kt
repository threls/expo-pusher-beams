package expo.modules.threlsexpopusherbeams

import LocalTokenProvider
import android.util.JsonWriter
import android.util.Log
import androidx.core.os.bundleOf
import com.google.firebase.FirebaseApp
import com.google.gson.Gson
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.pusher.pushnotifications.PushNotifications
import com.pusher.pushnotifications.BeamsCallback
import com.pusher.pushnotifications.PusherCallbackError
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Coroutine
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import org.json.JSONStringer

class ExpoPusherBeamsModule() : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoPusherBeams')` in JavaScript.
    Name("ExpoPusherBeams")

    // Defines event names that the module can send to JavaScript.
    Events("onNotification", "registered", "debug")

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
            promise.resolve("Could not login to Beams: \${error.message}");
          }

          override fun onSuccess(vararg values: Void) {
            promise.resolve(null);
          }
        }
    )
    }
  }

  private fun CoroutineScope.handleEvents () = launch {
    EventBus.subscribe<Map<String, Any?>> {notification ->
      sendEvent("onNotification", bundleOf(
        "userInfo" to Gson().toJson(notification),
        "appState" to "active"
      ))
    }
  }

  private suspend fun setInstanceId(instanceId: String) = coroutineScope {
    appContext.reactContext?.let {
      PushNotifications.start(it, instanceId);
      handleEvents();
    };
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
