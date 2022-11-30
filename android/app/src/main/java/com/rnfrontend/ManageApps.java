package com.rnfrontend;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.PendingIntent;
import android.app.RecoverableSecurityException;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.ApplicationInfo;
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
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.storage.StorageManager;
import android.provider.MediaStore;
import android.webkit.MimeTypeMap;


import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultCaller;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.activity.result.ActivityResultRegistryOwner;
import androidx.activity.result.contract.ActivityResultContracts;

import org.json.JSONException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ManageApps extends ReactContextBaseJavaModule {
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
                promise.resolve(true);
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
                promise.resolve(true);
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
                promise.resolve(true);
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
            arr.add(getFileContentUri(packageContext, directories.get(i)));
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
    public void clearMyCache(Promise promise) {
            Context packageContext = getReactApplicationContext();
            List<File> directories = new ArrayList<>();
            // collect all cache files
            directories.add(packageContext.getCacheDir());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                Collections.addAll(directories, packageContext.getExternalCacheDirs());
            } else {
                directories.add(packageContext.getExternalCacheDir());
            }

            // remove cache files
            int num = 0;
            for(File f :directories) {
                boolean isDeleted = deleteDir(f);
                if(isDeleted) {
                    num++;
                }
            }
            promise.resolve(num == directories.size());
    }

    public static Uri getFileContentUri(Context context, File file) {
        String filePath = file.getAbsolutePath();
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL),
                new String[] { MediaStore.Files.FileColumns._ID },
                MediaStore.Files.FileColumns.DATA + "=? ",
                new String[] { filePath }, null);
        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndex(MediaStore.Files.FileColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL), "" + id);
        } else {
            if (file.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Files.FileColumns.DATA, filePath);
                return context.getContentResolver().insert(
                        MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL), values);
            } else {
                Cursor cursor1 = context.getContentResolver().query(
                        MediaStore.Files.getContentUri(MediaStore.VOLUME_INTERNAL),
                        new String[] { MediaStore.Files.FileColumns._ID },
                        MediaStore.Files.FileColumns.DATA + "=? ",
                        new String[] { filePath }, null);
                if (cursor1 != null && cursor1.moveToFirst()) {
                    @SuppressLint("Range") int id = cursor1.getInt(cursor1.getColumnIndex(MediaStore.Files.FileColumns._ID));
                    cursor1.close();
                    return Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_INTERNAL), "" + id);
                } else {
                    if (file.exists()) {
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Files.FileColumns.DATA, filePath);
                        return context.getContentResolver().insert(
                                MediaStore.Files.getContentUri(MediaStore.VOLUME_INTERNAL), values);
                    } else {
                        Cursor cursor2 = context.getContentResolver().query(
                                MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY),
                                new String[] { MediaStore.Files.FileColumns._ID },
                                MediaStore.Files.FileColumns.DATA + "=? ",
                                new String[] { filePath }, null);
                        if (cursor2 != null && cursor2.moveToFirst()) {
                            @SuppressLint("Range") int id = cursor2.getInt(cursor2.getColumnIndex(MediaStore.Files.FileColumns._ID));
                            cursor2.close();
                            return Uri.withAppendedPath(MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY), "" + id);
                        } else {
                            if (file.exists()) {
                                ContentValues values = new ContentValues();
                                values.put(MediaStore.Files.FileColumns.DATA, filePath);
                                return context.getContentResolver().insert(
                                        MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY), values);
                            } else {
                                return null;
                            }
                        }
                    }
                }

            }
        }
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

    @ReactMethod
    public void getAllInstalledApps(Promise promise) {
        PackageManager pm = getReactApplicationContext().getPackageManager();
        List<ApplicationInfo> installedApplications = pm.getInstalledApplications(0);
        WritableArray arr = new WritableNativeArray();
        for(ApplicationInfo appInfo : installedApplications) {
            if(isSystemApp(appInfo.packageName) == 0) {
                WritableMap map = new WritableNativeMap();
                map.putString("name", appInfo.name);
                map.putString("packageName", appInfo.packageName);
                arr.pushMap(map);
            }
        }
        promise.resolve(arr);
    }

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
//            map.putBoolean("Deleted", delete(f));


            promise.resolve(map);
//            if(!f.canRead()) {
//                promise.resolve("cannot read this file");
//            }
//            if(!f.canWrite()) {
//                promise.resolve("cannot read this file");
//            }
//            if(f.exists()) {
//                if(f.delete()) {
//                    promise.resolve("deleted");
//                }else {
//                    promise.resolve("cannot delete");
//                }
//            }else {
//                promise.resolve("not exist");
//            }
    }

    @ReactMethod
    public void removeAppCache(String packageName, Promise promise) {
        try {
            Context packageContext = getReactApplicationContext().createPackageContext(packageName, 0);
            List<File> directories = new ArrayList<>();
            // collect all cache files
            directories.add(packageContext.getCacheDir());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                Collections.addAll(directories, packageContext.getExternalCacheDirs());
            } else {
                directories.add(packageContext.getExternalCacheDir());
            }

            // remove cache files
            int num = 0;
            for(File f :directories) {
                boolean isDeleted = deleteDir(f);
                if(isDeleted) {
                    num++;
                }
            }
            promise.resolve(num == directories.size());
        }catch (PackageManager.NameNotFoundException e) {
            promise.reject("remove app cache error", "app cache cannot be deleted", e);
        }
    }



    public static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
            return dir.delete();
        } else if(dir!= null && dir.isFile()) {
            return dir.delete();
        } else {
            return false;
        }
    }

//    @ReactMethod
//    public void getAllApps(Promise promise) {
//        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
//        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
//        List<ResolveInfo> pkgAppsList = getReactApplicationContext().getPackageManager()
//                .queryIntentActivities( mainIntent, 0);
//
//        WritableArray listOfAllApps = new WritableNativeArray();
//        if(pkgAppsList != null && pkgAppsList.size() != 0) {
//            for(ResolveInfo ri: pkgAppsList){
//                WritableMap map  = new WritableNativeMap();
//                String name = ri.activityInfo.name;
//                map.putString("name", name);
//                String packageName = ri.activityInfo.packageName;
//                map.putString("packageName", packageName);
//                if(isSystemApp(packageName)) {
//                    continue;
//                }
//                try {
//                    PackageInfo pi = getReactApplicationContext().getPackageManager().getPackageInfo(
//                            packageName, 0
//                    );
//                    long size = new File(pi.applicationInfo.publicSourceDir).length();
//                    map.putDouble("size", size);
//                } catch (PackageManager.NameNotFoundException e) {
//                    e.printStackTrace();
//                }
//                listOfAllApps.pushMap(map);
//            }
//        }
//        promise.resolve(listOfAllApps);
//    }
//
//    @ReactMethod
//    public void manageUnusedApps(Promise promise) {
//        Intent mainIntent =  new Intent(Intent.ACTION_MANAGE_UNUSED_APPS);
//        getCurrentActivity().startActivity(mainIntent);
//        promise.resolve(null);
//    }

    @ReactMethod
    public void uninstallApp(String packageName) {
        Intent intent = new Intent(getCurrentActivity(), getCurrentActivity().getClass());
        PendingIntent sender = PendingIntent.getActivity(getCurrentActivity(), 0, intent, PendingIntent.FLAG_IMMUTABLE);
        PackageInstaller mPackageInstaller = getCurrentActivity().getPackageManager().getPackageInstaller();
        mPackageInstaller.uninstall(packageName, sender.getIntentSender());
    }
}