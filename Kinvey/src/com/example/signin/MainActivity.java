package com.example.signin;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.util.Log;

import com.flurry.android.FlurryAgent;

public class MainActivity extends DroidGap {

	@SuppressWarnings("deprecation")
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
//		super.setIntegerProperty("splashscreen", R.drawable.splash);
		Log.i("TEST", "Loading APP");
		super.loadUrl(Config.getStartUrl(), 4000);
		Log.i("TEST", "Finished APP");
		// super.loadUrl(Config.getStartUrl(), 10000);
	}

	@Override
	protected void onStart() {
		super.onStart();
		FlurryAgent.setCaptureUncaughtExceptions(true);
		FlurryAgent.onStartSession(this, "FWYFXC2CY3SWV6RHXS76"); //
	}

	@Override
	protected void onStop() {
		super.onStop();
		FlurryAgent.onEndSession(this);

	}
}
