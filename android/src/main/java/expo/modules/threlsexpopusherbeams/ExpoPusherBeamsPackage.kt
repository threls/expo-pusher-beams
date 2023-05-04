package expo.modules.threlsexpopusherbeams

import android.content.Context
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class ExpoPusherBeamsPackage : Package {
  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(ExpoPusherBeamsActivityLifecycleListener(activityContext))
  }
}