package expo.modules.threlsexpopusherbeams

import android.util.Log
import com.google.firebase.FirebaseApp
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.pusher.pushnotifications.PushNotifications
import expo.modules.kotlin.Promise

class ExpoPusherBeamsModule : Module() {
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
    Function("setInstanceId") { instanceId: String ->
      setInstanceId(instanceId)
      sendEvent("registered")
    }

    Function("clearAllState") {
      clearAllState()
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
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "userId" to userId,
        "token" to token
      ))
      promise.resolve(null)
    }
  }

  private fun setInstanceId(instanceId: String) {
    appContext.reactContext?.let {
      PushNotifications.start(it, instanceId);
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
