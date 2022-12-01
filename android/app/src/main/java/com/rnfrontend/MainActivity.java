package com.rnfrontend;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

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
    if(requestCode == pickerRequestCode && resultCode == Activity.RESULT_OK) {
      WritableArray arr = new WritableNativeArray();
      if(null != data) { // checking empty selection
        if(null != data.getClipData()) { // checking multiple selection or not
          for(int i = 0; i < data.getClipData().getItemCount(); i++) {
            arr.pushString(data.getClipData().getItemAt(i).getUri().toString());
          }
        } else {
          arr.pushString(data.getData().toString());
        }
      }
      promise.resolve(arr);
      promise = null;
      pickerRequestCode = 0;
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
