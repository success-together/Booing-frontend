package com.rr.booingapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;


public class MainActivity extends ReactActivity {
  public static Promise promise;
  public static int pickerRequestCode;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RNFrontEnd";
  }
  public static void setPromise(Promise newPromise) {
    promise = newPromise;
  }
  public static void setPickerRequestCode(int newRequestCode) {
    pickerRequestCode = newRequestCode;
  }
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if(requestCode == pickerRequestCode) {
      WritableArray arr = new WritableNativeArray();
      if(resultCode == Activity.RESULT_OK) {
        if(null != data) { // checking empty selection
          if(null != data.getClipData()) { // checking multiple selection or not
            for(int i = 0; i < data.getClipData().getItemCount(); i++) {
              arr.pushString(data.getClipData().getItemAt(i).getUri().toString());
            }
          } else {
            arr.pushString(data.getData().toString());
          }
        }
      }
      promise.resolve(arr);
      promise = null;
      pickerRequestCode = 0;
    }else if(requestCode == 100 && resultCode == Activity.RESULT_OK) {
      promise.resolve(true);
      promise = null;
    }else if(requestCode == 22) {
      if(resultCode == Activity.RESULT_OK){
        promise.resolve(true);
        promise = null;
      }else {
        promise.resolve(false);
        promise = null;
      }
    }else if(requestCode == 200) {
      if(resultCode == Activity.RESULT_OK) {
        promise.resolve("cache cleared");
      }else {
        promise.resolve("cache not cleared");
      }

    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode,
                                         String permissions[], int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
      case 10: {
        // If request is cancelled, the result arrays are empty.
        if (grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          promise.resolve("granted");
        } else {
          promise.resolve("not granted");
        }
        return;
      }
      case 20:
        if (grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          ManageApps.setCanSendNotification(true);
          promise.resolve(true);
        }else {
          ManageApps.setCanSendNotification(false);
          promise.resolve(false);
        }
        setPromise(null);
      case 101:
        if (grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          promise.resolve(true);
        }else {
          promise.resolve(false);
        }
        setPromise(null);
    }
  }
  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }

}
