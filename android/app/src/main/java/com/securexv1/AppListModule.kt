package com.securexv1
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class AppListModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppListModule"

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS)
            val appList = Arguments.createArray()
            for (pkg in packages) {
                val appInfo = pkg.applicationInfo
                if (appInfo == null) continue // <--- SAFE GUARD

                if ((appInfo.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM) != 0) continue

                val appMap = Arguments.createMap()
                appMap.putString("packageName", pkg.packageName)
                appMap.putString("name", pm.getApplicationLabel(appInfo).toString())

                val icon: Drawable? = try { pm.getApplicationIcon(appInfo) } catch (e: Exception) { null }
                var iconBase64 = ""
                if (icon != null) {
                    val width = if (icon.intrinsicWidth > 0) icon.intrinsicWidth else 96
                    val height = if (icon.intrinsicHeight > 0) icon.intrinsicHeight else 96
                    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                    val canvas = Canvas(bitmap)
                    icon.setBounds(0, 0, canvas.width, canvas.height)
                    icon.draw(canvas)
                    val stream = ByteArrayOutputStream()
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
                    iconBase64 = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
                }
                appMap.putString("icon", "data:image/png;base64,$iconBase64")

                val permissions = Arguments.createArray()
                pkg.requestedPermissions?.forEach { perm ->
                    permissions.pushString(perm)
                }
                appMap.putArray("permissions", permissions)

                appList.pushMap(appMap)
            }
            promise.resolve(appList)
        } catch (e: Exception) {
            promise.reject("ERR", e.message)
        }
    }
}
