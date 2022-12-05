package com.rnfrontend;
import android.annotation.SuppressLint;
import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.AppOpsManager;
import android.app.DownloadManager;
import android.app.PendingIntent;
import android.app.RecoverableSecurityException;
import android.app.usage.StorageStats;
import android.app.usage.StorageStatsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.ApplicationInfo;
import android.content.pm.IPackageStatsObserver;
import android.content.pm.IPackageDataObserver;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import android.content.Context;
import android.content.pm.PackageStats;
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.nfc.tech.IsoDep;
import android.os.Build;
import android.os.Environment;
import android.os.RemoteException;
import android.os.UserHandle;
import android.os.storage.StorageManager;
import android.os.storage.StorageVolume;
import android.provider.MediaStore;
import android.provider.Settings;
import android.webkit.MimeTypeMap;


import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultCaller;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.activity.result.ActivityResultRegistryOwner;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONException;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

public class ManageApps extends ReactContextBaseJavaModule {

    static Promise promise;
    ManageApps(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ManageApps";
    }

    // get media files and downloads
    @ReactMethod
    public void getImages(Promise promise) {
        Uri uri;
        Cursor cursor;
        int column_index_data, column_index_title, column_index_size;
        WritableArray listOfAllImages = new WritableNativeArray();
        uri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

        String[] projection = {
                        MediaStore.MediaColumns.DATA
                        ,MediaStore.Images.Media.TITLE
                        ,MediaStore.Images.Media.SIZE,

        };

        cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                null, null);

        column_index_data = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
        column_index_title = cursor.getColumnIndex(MediaStore.MediaColumns.TITLE);
        column_index_size = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);

        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();
            map.putString("path", cursor.getString(column_index_data));
            map.putString("name", cursor.getString(column_index_title));
            map.putInt("size", cursor.getInt(column_index_size));
            listOfAllImages.pushMap(map);
        }
        promise.resolve(listOfAllImages);
    }

    @ReactMethod
    public void getVideos(Promise promise) {
        Uri uri;
        Cursor cursor;
        int column_index_data, column_index_title, column_index_size;
        WritableArray listOfAllVideos = new WritableNativeArray();
        uri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;

        String[] projection = { MediaStore.MediaColumns.DATA
                ,MediaStore.Video.Media.TITLE
                ,MediaStore.Video.Media.SIZE};

        cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                null, null);

        column_index_data = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
        column_index_title = cursor.getColumnIndex(MediaStore.MediaColumns.TITLE);
        column_index_size = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);
        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();
            map.putString("path", cursor.getString(column_index_data));
            map.putString("name", cursor.getString(column_index_title));
            map.putInt("size", cursor.getInt(column_index_size));

            listOfAllVideos.pushMap(map);
        }
        promise.resolve(listOfAllVideos);
    }

    @ReactMethod
    public void getAudios(Promise promise) {
        Uri uri;
        Cursor cursor;
        int column_index_data, column_index_title, column_index_size;
        WritableArray listOfAudios = new WritableNativeArray();
        uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

        String[] projection = { MediaStore.MediaColumns.DATA
                ,MediaStore.Audio.Media.TITLE
                ,MediaStore.Audio.Media.SIZE};

        cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                null, null);

        column_index_data = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
        column_index_title = cursor.getColumnIndex(MediaStore.MediaColumns.TITLE);
        column_index_size = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);
        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();
            map.putString("path", cursor.getString(column_index_data));
            map.putString("name", cursor.getString(column_index_title));
            map.putInt("size", cursor.getInt(column_index_size));

            listOfAudios.pushMap(map);
        }
        promise.resolve(listOfAudios);
    }

    @ReactMethod
    public void getAllDownloads(Promise promise) {

        WritableArray listOfDownloads;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            listOfDownloads = getDownloadsMod(MediaStore.Downloads.EXTERNAL_CONTENT_URI);
        }else {
            listOfDownloads = getDownloadsLegacy();
        }
        promise.resolve(listOfDownloads);
    }

    public WritableArray getDownloadsMod(Uri uri) {
        Cursor cursor;
        int column_index_data, column_index_title, column_index_size;
        WritableArray arr = new WritableNativeArray();
        String[] projection = { MediaStore.MediaColumns.DATA,
                MediaStore.Downloads.TITLE,
                MediaStore.Downloads.SIZE,
        };

        cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                null, null);


        column_index_data = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
        column_index_title = cursor.getColumnIndex(MediaStore.MediaColumns.TITLE);
        column_index_size = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);

        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();
            map.putString("path", cursor.getString(column_index_data));
            map.putString("name", cursor.getString(column_index_title));
            map.putInt("size", cursor.getInt(column_index_size));

            arr.pushMap(map);
        }

        return arr;
    }
    public WritableArray getDownloadsLegacy() {
        File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        WritableArray arr = new WritableNativeArray();

        if (downloadDir.listFiles() != null && downloadDir.listFiles().length != 0) {
            for(File f : downloadDir.listFiles()){
                WritableMap map = new WritableNativeMap();
                map.putString("name", f.getName());
                map.putString("path", f.getAbsolutePath());
                map.putDouble("size", f.length());

                arr.pushMap(map);
            }
        }

        return arr;
    }

    // delete media files
    @ReactMethod
    public void deleteImages(ReadableArray paths, Promise promise) throws IntentSender.SendIntentException {
        ArrayList<Uri> filesUris = new ArrayList<>();

        for (int i = 0; i < paths.size(); i++) {
            String path = paths.getString(i);
            File file = new File(path);
            Uri uri = getImageContentUri(getReactApplicationContext(), file);
            if(uri != null) {
                filesUris.add(uri);
            }
        }


        try {
            for(Uri uri: filesUris){
                getReactApplicationContext().getContentResolver().delete(
                        uri, null, null
                );
            }

            promise.resolve(true);
        }catch(SecurityException e) {
            PendingIntent pendingIntent = null;
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                pendingIntent = MediaStore.createDeleteRequest(
                        getReactApplicationContext().getContentResolver(),
                        filesUris
                );
            }else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    if(e instanceof RecoverableSecurityException) {
                        RecoverableSecurityException exception = (RecoverableSecurityException) e;
                        pendingIntent = exception.getUserAction().getActionIntent();
                    }
                }
            }

            if(pendingIntent != null) {
                IntentSender intentSender = pendingIntent.getIntentSender();
                getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                        intentSender, 100, null, 0, 0, 0
                );
                MainActivity.setPromise(promise);
            }else {
                promise.resolve(false);
            }
        }
    }
    public static Uri getImageContentUri(Context context, File imageFile) {
        String filePath = imageFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                new String[] { MediaStore.Images.Media._ID },
                MediaStore.Images.Media.DATA + "=? ",
                new String[] { filePath }, null);
        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "" + id);
        } else {
            if (imageFile.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DATA, filePath);
                return context.getContentResolver().insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            } else {
                return null;
            }
        }
    }

    @ReactMethod
    public void deleteVideos(ReadableArray paths, Promise promise) throws IntentSender.SendIntentException {
        ArrayList<Uri> filesUris = new ArrayList<>();

        for (int i = 0; i < paths.size(); i++) {
            String path = paths.getString(i);
            File file = new File(path);
            Uri uri = getVideoContentUri(getReactApplicationContext(), file);
            if(uri != null) {
                filesUris.add(uri);
            }
        }

        try {
            for(Uri uri: filesUris){
                getReactApplicationContext().getContentResolver().delete(
                        uri, null, null
                );
            }

            promise.resolve(true);
        }catch(SecurityException e) {
            PendingIntent pendingIntent = null;
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                pendingIntent = MediaStore.createDeleteRequest(
                        getReactApplicationContext().getContentResolver(),
                        filesUris
                );
            }else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    if(e instanceof RecoverableSecurityException) {
                        RecoverableSecurityException exception = (RecoverableSecurityException) e;
                        pendingIntent = exception.getUserAction().getActionIntent();
                    }
                }
            }

            if(pendingIntent != null) {
                IntentSender intentSender = pendingIntent.getIntentSender();
                getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                        intentSender, 100, null, 0, 0, 0
                );
                MainActivity.setPromise(promise);
            }else {
                promise.resolve(false);
            }
        }
    }
    public static Uri getVideoContentUri(Context context, File videoFile) {
        String filePath = videoFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                new String[] { MediaStore.Video.Media._ID },
                MediaStore.Video.Media.DATA + "=? ",
                new String[] { filePath }, null);
        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, "" + id);
        } else {
            if (videoFile.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Video.Media.DATA, filePath);
                return context.getContentResolver().insert(
                        MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values);
            } else {
                return null;
            }
        }
    }

    @ReactMethod
    public void deleteAudios(ReadableArray paths, Promise promise) throws IntentSender.SendIntentException {
        ArrayList<Uri> filesUris = new ArrayList<>();

        for (int i = 0; i < paths.size(); i++) {
            String path = paths.getString(i);
            File file = new File(path);
            Uri uri = getAudioContentUri(getReactApplicationContext(), file);
            if(uri != null) {
                filesUris.add(uri);
            }
        }

        try {
            for(Uri uri: filesUris){
                getReactApplicationContext().getContentResolver().delete(
                        uri, null, null
                );
            }

            promise.resolve(true);
        }catch(SecurityException e) {
            PendingIntent pendingIntent = null;
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                pendingIntent = MediaStore.createDeleteRequest(
                        getReactApplicationContext().getContentResolver(),
                        filesUris
                );
            }else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    if(e instanceof RecoverableSecurityException) {
                        RecoverableSecurityException exception = (RecoverableSecurityException) e;
                        pendingIntent = exception.getUserAction().getActionIntent();
                    }
                }
            }

            if(pendingIntent != null) {
                IntentSender intentSender = pendingIntent.getIntentSender();
                getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                        intentSender, 100, null, 0, 0, 0
                );
                MainActivity.setPromise(promise);
            }else {
                promise.resolve(false);
            }
        }
    }
    public static Uri getAudioContentUri(Context context, File audioFile) {
        String filePath = audioFile.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                new String[] { MediaStore.Audio.Media._ID },
                MediaStore.Audio.Media.DATA + "=? ",
                new String[] { filePath }, null);
        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, "" + id);
        } else {
            if (audioFile.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Audio.Media.DATA, filePath);
                return context.getContentResolver().insert(
                        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values);
            } else {
                return null;
            }
        }
    }

    // delete cache files
    @ReactMethod
    public void deleteAppCache(String packageName, Promise promise) throws PackageManager.NameNotFoundException {
        Context packageContext = getReactApplicationContext().createPackageContext(packageName, 0);
        List<File> directories = new ArrayList<>();
        // collect all cache files
        directories.add(packageContext.getCacheDir());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            Collections.addAll(directories, packageContext.getExternalCacheDirs());
        } else {
            directories.add(packageContext.getExternalCacheDir());
        }

        ArrayList<Uri> arr = new ArrayList<>();
        for(int i = 0; i < directories.size(); i++) {
//            arr.add(getFileContentUri(packageContext, directories.get(i)));
        }


        try {
            for(int i = 0; i < arr.size(); i++) {
                getReactApplicationContext().getContentResolver().delete(
                        arr.get(i), null, null
                );
            }

            promise.resolve(true);
        }catch(SecurityException e) {
            PendingIntent pendingIntent = null;
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                pendingIntent = MediaStore.createDeleteRequest(
                        getReactApplicationContext().getContentResolver(),
                        arr
                );
            }else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    if(e instanceof RecoverableSecurityException) {
                        RecoverableSecurityException exception = (RecoverableSecurityException) e;
                        pendingIntent = exception.getUserAction().getActionIntent();
                    }
                }
            }

            if(pendingIntent != null) {
                try {
                    IntentSender intentSender = pendingIntent.getIntentSender();
                    getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                            intentSender, 100, null, 0, 0, 0
                    );
                    promise.resolve(true);
                }catch(IntentSender.SendIntentException err){
                    promise.resolve("send intent expection");
                }
            }else {
                promise.resolve(false);
            }
        }
    }

    @ReactMethod
    public void getTempFiles(Promise promise) {
        WritableArray tempFiles = new WritableNativeArray();

        Uri uri;
        Cursor cursor;
        int column_index_data, column_index_title, column_index_size;
        uri = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL);

        String[] projection = { MediaStore.Files.FileColumns.DATA
                ,MediaStore.Files.FileColumns.TITLE
                ,MediaStore.Files.FileColumns.SIZE};

        String selection = MediaStore.Files.FileColumns.MIME_TYPE + " = ?";

        cursor = getCurrentActivity().getContentResolver().query(uri,
                projection,
                selection,
                null,
                null);

        column_index_data = cursor.getColumnIndex(MediaStore.Files.FileColumns.DATA);
        column_index_title = cursor.getColumnIndex(MediaStore.Files.FileColumns.TITLE);
        column_index_size = cursor.getColumnIndex(MediaStore.Files.FileColumns.SIZE);

        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();
            map.putString("path", cursor.getString(column_index_data));
            map.putString("name", cursor.getString(column_index_title));
            map.putInt("size", cursor.getInt(column_index_size));

            tempFiles.pushMap(map);
        }

        promise.resolve(tempFiles);
    }

    @ReactMethod
    public void getTemp(Promise promise) {
        WritableArray tempFiles = new WritableNativeArray();

        Uri uri = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL);
        int column_index_data, column_index_MimeType, column_index_name;

        String[] projection = {
                MediaStore.Files.FileColumns.DATA,
                MediaStore.Files.FileColumns.MIME_TYPE,
                MediaStore.Files.FileColumns.DISPLAY_NAME
        };


        String[] filterMimeType = {MimeTypeMap.getSingleton().getMimeTypeFromExtension("pdf")};

        String selection = MediaStore.Files.FileColumns.MIME_TYPE + " = ?";

        Cursor cursor = getReactApplicationContext().getContentResolver().query(
                uri,
                projection,
                selection,
                filterMimeType,
                MediaStore.Files.FileColumns.DATE_ADDED
        );

        column_index_data = cursor.getColumnIndex(MediaStore.Files.FileColumns.DATA);
        column_index_MimeType = cursor.getColumnIndex(MediaStore.Files.FileColumns.MIME_TYPE);
        column_index_name = cursor.getColumnIndex(MediaStore.Files.FileColumns.DISPLAY_NAME);

        while (cursor.moveToNext()) {
            WritableMap map = new WritableNativeMap();

            map.putString("path", cursor.getString(column_index_data));
            map.putString("mimetype", cursor.getString(column_index_MimeType));
            map.putString("name", cursor.getString(column_index_name));

            tempFiles.pushMap(map);
        }

        promise.resolve(tempFiles);
    }

    @ReactMethod
    public void clearAppVisibleCache(String packageName, Promise promise) throws PackageManager.NameNotFoundException {
        Context packageContext = getReactApplicationContext().createPackageContext(packageName, 0);
            List<File> directories = new ArrayList<>();
            // collect all cache files
            if(packageName == getReactApplicationContext().getPackageName()) {
                directories.add(packageContext.getCacheDir());
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                Collections.addAll(directories, packageContext.getExternalCacheDirs());
            } else {
                directories.add(packageContext.getExternalCacheDir());
            }

            WritableArray arr = new WritableNativeArray();
            // remove cache files
            int num = 0;
            for(File f :directories) {
                if(f != null && f.exists()) {
                    boolean isDeleted = deleteDirectory(f);
                    arr.pushBoolean(isDeleted);
                    arr.pushString(f.getAbsolutePath());
                    if(isDeleted) {
                        num++;
                    }
                }
            }
            promise.resolve(arr);
    }

    public WritableMap getFileContentUri(Context context, File file) {
        WritableMap map = new WritableNativeMap();
        String filePath = file.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL),
                new String[] { MediaStore.Files.FileColumns._ID,
                        MediaStore.Files.FileColumns.SIZE
                },
                MediaStore.Files.FileColumns.DATA + "=? ",
                new String[] { filePath }, null);
        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.Files.FileColumns._ID));
            @SuppressLint("Range") long size = cursor.getLong(cursor.getColumnIndex(MediaStore.Files.FileColumns.SIZE));
            cursor.close();
            map.putString("contentUri",
                    Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL), "" + id).toString());
            map.putDouble("size", size);
            return map;
        } else {
                Cursor cursor1 = context.getContentResolver().query(
                        MediaStore.Files.getContentUri(MediaStore.VOLUME_INTERNAL),
                        new String[] { MediaStore.Files.FileColumns._ID,
                                MediaStore.Files.FileColumns.SIZE},
                        MediaStore.Files.FileColumns.DATA + "=? ",
                        new String[] { filePath }, null);
                if (cursor1 != null && cursor1.moveToFirst()) {
                    @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.Files.FileColumns._ID));
                    @SuppressLint("Range") long size = cursor.getLong(cursor.getColumnIndex(MediaStore.Files.FileColumns.SIZE));
                    cursor.close();
                    map.putString("contentUri",
                            Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL), "" + id).toString());
                    map.putDouble("size", size);
                    return map;
                } else {
                    Cursor cursor2 = context.getContentResolver().query(
                            MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY),
                            new String[] { MediaStore.Files.FileColumns._ID,
                                    MediaStore.Files.FileColumns.SIZE},
                            MediaStore.Files.FileColumns.DATA + "=? ",
                            new String[] { filePath }, null);
                    if (cursor2 != null && cursor2.moveToFirst()) {
                        @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.Files.FileColumns._ID));
                        @SuppressLint("Range") long size = cursor.getLong(cursor.getColumnIndex(MediaStore.Files.FileColumns.SIZE));
                        cursor.close();
                        map.putString("contentUri",
                                Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL), "" + id).toString());
                        map.putDouble("size", size);
                        return map;
                    } else {
                        return null;
                    }
                }
        }
    }

    public long getFolderSize(File file) {
        File directory = readlink(file); // resolve symlinks to internal storage
        String path = directory.getAbsolutePath();
        Cursor cursor = null;

        long size = 0;
        try {
            cursor = getReactApplicationContext().getContentResolver().query(MediaStore.Files.getContentUri("external"),
                    new String[]{MediaStore.MediaColumns.SIZE},
                    MediaStore.MediaColumns.DATA + " LIKE ?",
                    new String[]{path + "/%"},
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                do {
                    size += cursor.getLong(0);
                } while (cursor.moveToNext());
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
        return size;
    }
    public static File readlink(File file) {
        File f;
        try {
            f = file.getCanonicalFile();
        } catch (IOException e) {
            return file;
        }
        if (f.getAbsolutePath().equals(file.getAbsolutePath())) {
            return f;
        }
        return readlink(f);
    }
    public int isSystemApp(String packageName) {
        try {
            PackageManager pm = getReactApplicationContextIfActiveOrWarn().getPackageManager();
            ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);
            if ((ai.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
                return 1;
            }
            return 0;
        }catch(PackageManager.NameNotFoundException e){
           return -1;
        }
    }

//    @ReactMethod
//    public void getAllInstalledApps(Promise promise) {
//        PackageManager pm = getReactApplicationContext().getPackageManager();
//        List<ApplicationInfo> installedApplications = pm.getInstalledApplications(0);
//        WritableArray arr = new WritableNativeArray();
//        for(ApplicationInfo appInfo : installedApplications) {
//            if(isSystemApp(appInfo.packageName) == 0) {
//                WritableMap map = new WritableNativeMap();
//                map.putString("name", appInfo.name);
//                map.putString("packageName", appInfo.packageName);
//                arr.pushMap(map);
//            }
//        }
//        promise.resolve(arr);
//    }

    @ReactMethod
    public void isAppInstalled(String packageName, Promise promise) {
        PackageManager pm = getReactApplicationContext().getPackageManager();
        try {
            pm.getPackageInfo(packageName, 0);
            promise.resolve(true);
        } catch (PackageManager.NameNotFoundException e) {
            promise.reject("isAppInstalled error", "isAppInstalled error", e);
        }
    }

    @ReactMethod
    public void removeFile(String path, Promise promise) {
            File f = new File(path);
            WritableMap map = new WritableNativeMap();
            map.putString("path", f.getAbsolutePath());
            map.putBoolean("exist", f.exists());
            map.putBoolean("canRead", f.canRead());
            map.putBoolean("canWrite", f.canWrite());
            map.putString("name", f.getName());
            map.putBoolean("isFile", f.isFile());
            map.putBoolean("isDir", f.isDirectory());
            map.putString("URI", f.toURI().toString());


            promise.resolve(map);
    }


    @ReactMethod
    public void checkAllFilesAccessPermission(Promise promise) {
        MainActivity.setPromise(promise);

        // If you have access to the external storage, do whatever you need
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (Environment.isExternalStorageManager()){
                promise.resolve(true);
            }else{
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                Uri uri = Uri.fromParts("package", getCurrentActivity().getPackageName(), null);
                intent.setData(uri);

                getCurrentActivity().startActivityForResult(intent, 22);
            }
        }
    }

   @ReactMethod
   public void getAllInstalledApps(Promise promise) {
        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> pkgAppsList = getReactApplicationContext().getPackageManager()
                .queryIntentActivities( mainIntent, 0);

        WritableArray listOfAllApps = new WritableNativeArray();
        if(pkgAppsList != null && pkgAppsList.size() != 0) {
            for(ResolveInfo ri: pkgAppsList){
                WritableMap map  = new WritableNativeMap();
                CharSequence name = ri.activityInfo.loadLabel( getReactApplicationContext().getPackageManager());
                map.putString("name", name.toString());
                String packageName = ri.activityInfo.packageName;
                map.putString("packageName", packageName);
                try {
                    PackageInfo pi = getReactApplicationContext().getPackageManager().getPackageInfo(
                            packageName, 0
                    );
                    Context packageContext = getReactApplicationContext().createPackageContext(packageName, 0);

                    StorageStatsManager storageStatsManager = null;
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        storageStatsManager = (StorageStatsManager)
                                getReactApplicationContext().getSystemService(Context.STORAGE_STATS_SERVICE);
                    }
                    StorageManager storageManager = (StorageManager)  getReactApplicationContext()
                             .getSystemService(Context.STORAGE_SERVICE);
                    try {
                        ApplicationInfo ai = getReactApplicationContext().
                                getPackageManager().getApplicationInfo(packageName, 0);
                        StorageStats storageStats = null;
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            storageStats = storageStatsManager.queryStatsForPackage(ai.storageUuid, packageName,null );
                        }
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            long cacheSize =storageStats.getCacheBytes();
                            map.putString("ca", packageName);
                        }
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            long dataSize =storageStats.getDataBytes();
                        }

                    } catch (Exception e) {}


                    // hidden cache
                    long hiddenCacheSize = packageContext.getCacheDir().length();

                    map.putDouble("hiddenCacheSize", hiddenCacheSize);

                    // visible cache
                    List<File> directories = new ArrayList<>();
                    // collect all cache files
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                        Collections.addAll(directories, packageContext.getExternalCacheDirs());
                    } else {
                        directories.add(packageContext.getExternalCacheDir());
                    }


                    long visibleCacheSize = 0;

                    if(directories != null && directories.size() > 0) {
                        for(File dir : directories) {
                            if(dir != null && dir.exists()) {
                                visibleCacheSize += dirSize(dir);
                            }
                        }
                    }

                    map.putDouble("visibleCacheSize", visibleCacheSize);

                } catch (PackageManager.NameNotFoundException e) {
                    e.printStackTrace();
                }
                listOfAllApps.pushMap(map);
            }
        }
        promise.resolve(listOfAllApps);
   }

    public  long dirSize(File dir) {
        if (dir.exists()) {
            long result = 0;
            File[] fileList = dir.listFiles();
            if (fileList != null) {
                for(int i = 0; i < fileList.length; i++) {
                    // Recursive call if it's a directory
                    if(fileList[i].isDirectory()) {
                        result += dirSize(fileList[i]);
                    } else {
                        // Sum the file size in bytes
                        result += fileList[i].length();
                    }
                }
            }
            return result; // return the file size
        }
        return 0;
    }


   // acces to dwnlaods
    //volume.createAccessIntent(Environment.DIRECTORY_DOWNLOADS);
   //get docs
//   Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
//        intent.addCategory(Intent.CATEGORY_OPENABLE);
//        intent.setType("*/*");
//        intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[] {
//        "application/pdf", // .pdf
//                "application/vnd.oasis.opendocument.text", // .odt
//                "text/plain" // .txt
//    });
//    startActivityForResult(intent, REQUEST_CODE);


    @ReactMethod
    public void clearAllVisibleCache(Promise promise) {
        MainActivity.setPromise(promise);
        Intent intent = new Intent(StorageManager.ACTION_CLEAR_APP_CACHE);
        getCurrentActivity().startActivityForResult(intent, 200);
    }


//
//    @ReactMethod
//    public void manageUnusedApps(Promise promise) {
//        Intent mainIntent =  new Intent(Intent.ACTION_MANAGE_UNUSED_APPS);
//        getCurrentActivity().startActivity(mainIntent);
//        promise.resolve(null);
//    }

//    @ReactMethod
//    public void uninstallApp(String packageName) {
//        Intent intent = new Intent(getCurrentActivity(), getCurrentActivity().getClass());
//        PendingIntent sender = PendingIntent.getActivity(getCurrentActivity(), 0, intent, PendingIntent.FLAG_IMMUTABLE);
//        PackageInstaller mPackageInstaller = getCurrentActivity().getPackageManager().getPackageInstaller();
//        mPackageInstaller.uninstall(packageName, sender.getIntentSender());
//    }
boolean deleteDirectory(File directoryToBeDeleted) {
    File[] allContents = directoryToBeDeleted.listFiles();
    if (allContents != null) {
        for (File file : allContents) {
            deleteDirectory(file);
        }
    }
    return directoryToBeDeleted.delete();
}

    @ReactMethod
    public void pickVideos(Promise promise) {
        MainActivity.setPromise(promise);
        int PICK_VIDEO_FILE = 2;
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("video/*");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, PICK_VIDEO_FILE);
    }

    @ReactMethod
    public void pickAudios(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("audio/*");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void pickApks(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("application/vnd.android.package-archive");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }
//    ublic void findReviewsToLoad() {
//        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
//        intent.addCategory(Intent.CATEGORY_OPENABLE);
//        String [] mimeTypes = {"text/csv", "text/comma-separated-values"};
//        intent.setType("*/*");
//        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
//        startActivityForResult(intent, FIND_FILE_REQUEST_CODE);
//    }

    @ReactMethod
    public void freeSpace(Promise promise) {
        MainActivity.setPromise(promise);
        Intent intent = new Intent(StorageManager.ACTION_MANAGE_STORAGE);
        getCurrentActivity().startActivityForResult(intent, 100);
    }

    @ReactMethod
    public void openTree(Promise promise) {
        MainActivity.setPromise(promise);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        getCurrentActivity().startActivityForResult(intent, 100);
    }


}