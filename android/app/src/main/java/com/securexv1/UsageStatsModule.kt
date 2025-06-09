package com.securexv1
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.*
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "UsageStatsModule"

    // Check if Usage Access is granted
    @ReactMethod
    fun isUsageAccessGranted(promise: Promise) {
        val appOps = currentActivity?.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(), currentActivity?.packageName ?: ""
            )
        } else {
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(), currentActivity?.packageName ?: ""
            )
        }
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }

    // Open Usage Access settings (call from JS if not granted)
    @ReactMethod
    fun openUsageAccessSettings() {
        val intent = android.content.Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
        currentActivity?.startActivity(intent)
    }

    // Fetch today's app usage stats (foreground time per app in ms)
    @ReactMethod
    fun getTodayUsageStats(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val calendar = Calendar.getInstance()
            calendar.timeInMillis = System.currentTimeMillis()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()

            val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val pm = reactApplicationContext.packageManager
            val result = WritableNativeArray()
            for (stat in stats) {
                if (stat.totalTimeInForeground > 0) {
                    val appMap = Arguments.createMap()
                    appMap.putString("packageName", stat.packageName)
                    // Get app name (label)
                    val appName = try {
                        val appInfo = pm.getApplicationInfo(stat.packageName, 0)
                        pm.getApplicationLabel(appInfo).toString()
                    } catch (e: Exception) {
                        stat.packageName // fallback
                    }
                    appMap.putString("appName", appName)
                    appMap.putDouble("totalTimeInForeground", stat.totalTimeInForeground.toDouble()) // ms
                    result.pushMap(appMap)
                }
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERR_USAGE_STATS", "Failed to get usage stats: ${e.message}")
        }
    }


    // Get total screen-on time today (by counting USER_PRESENT events)
    @ReactMethod
    fun getTodayScreenOnTime(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val calendar = Calendar.getInstance()
            calendar.timeInMillis = System.currentTimeMillis()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()

            val usageEvents: UsageEvents = usageStatsManager.queryEvents(startTime, endTime)
            var lastScreenOnTime = 0L
            var totalScreenOnTime = 0L
            var screenOn = false

            val event = UsageEvents.Event()
            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                if (event.eventType == UsageEvents.Event.SCREEN_INTERACTIVE) {
                    lastScreenOnTime = event.timeStamp
                    screenOn = true
                } else if (event.eventType == UsageEvents.Event.SCREEN_NON_INTERACTIVE) {
                    if (screenOn) {
                        totalScreenOnTime += (event.timeStamp - lastScreenOnTime)
                        screenOn = false
                    }
                }
            }
            // If screen is still on
            if (screenOn) {
                totalScreenOnTime += (endTime - lastScreenOnTime)
            }
            promise.resolve((totalScreenOnTime / 1000).toDouble()) // seconds
        } catch (e: Exception) {
            promise.reject("ERR_SCREEN_ON", "Failed to get screen on time: ${e.message}")
        }
    }
}
