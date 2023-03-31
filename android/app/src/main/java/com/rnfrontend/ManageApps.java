package com.rr.booingapp;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.AppOpsManager;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
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
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.RuntimeExecutionException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.OAuthProvider;

import android.content.Context;
import android.content.pm.PackageStats;
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.ThumbnailUtils;
import android.media.VolumeProvider;
import android.net.Uri;
import android.nfc.tech.IsoDep;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.os.RemoteException;
import android.os.StatFs;
import android.os.UserHandle;
import android.os.storage.StorageManager;
import android.os.storage.StorageVolume;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.util.Size;
import android.webkit.MimeTypeMap;


import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.core.os.HandlerCompat;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class ManageApps extends ReactContextBaseJavaModule {

    static Promise promise;
    private FirebaseAuth firebaseAuth;
    ExecutorService executorService = Executors.newFixedThreadPool(1);
    Handler mainThreadHandler = HandlerCompat.createAsync(Looper.getMainLooper());
    static int MAX_ITEMS = 25;
    private static boolean canSendNotifications = false;
    public static boolean getCanSendNotification() {
        return canSendNotifications;
    }
    public static void setCanSendNotification(boolean newCanSendNotification) {
        canSendNotifications = newCanSendNotification;
    }

    ManageApps(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ManageApps";
    }


    public String getThumbnailBase64(Uri uri, int mediaType)  {
        int size = 80;
        ContentResolver cr = getReactApplicationContext().getContentResolver();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                Bitmap bitmap = cr.loadThumbnail(uri, new Size(size, size), null);
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream .toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                return "data:image/jpeg;base64," + encoded;

            } catch (IOException e) {
                return null;
            }
        } else {
            Long origId = Long.valueOf(uri.getLastPathSegment());
            Bitmap bitmap = null;
            if(mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE) {
                bitmap = MediaStore.Images.Thumbnails
                        .getThumbnail(cr, origId, MediaStore.Images.Thumbnails.MINI_KIND, null);
            }else if(mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO) {
                bitmap = MediaStore.Video.Thumbnails
                        .getThumbnail(cr, origId, MediaStore.Images.Thumbnails.MINI_KIND, null);
            }

            if (bitmap != null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream .toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                return "data:image/jpeg;base64," + encoded;
            }
        }
        return null;
    }

    public String getAudioThumbnailBase64(String path) {
        int size = 80;
        Bitmap bitmap = ThumbnailUtils.extractThumbnail(BitmapFactory.decodeFile(path),
                size, size);

        if(bitmap == null) {
            return null;
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream .toByteArray();
        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
        return "data:image/jpeg;base64," + encoded;
    }
    // get media files and downloads
    interface ScanStorage {
        void onComplete(WritableArray result);
    }

    interface JunkData {
        void onComplete(WritableMap result);
    }


    @ReactMethod
    public void getImages(Promise promise)  {
                Uri uri;
                Cursor cursor;
                int i = 0, total = 0, column_index_data, column_index_title, column_index_size, column_index_id;
                WritableArray listOfAllImages = new WritableNativeArray();
                uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

                String[] projection = {
                        MediaStore.MediaColumns.DATA,
                        MediaStore.Images.Media.TITLE,
                        MediaStore.Images.Media.SIZE,
                        MediaStore.Images.Media._ID
                };

                cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                        null, null);

                if(cursor != null) {
                    total = cursor.getCount();
                }


                if(total == 0) {
                    promise.resolve(listOfAllImages);
                    return;
                }


                column_index_data = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
                column_index_title = cursor.getColumnIndex(MediaStore.MediaColumns.TITLE);
                column_index_size = cursor.getColumnIndex(MediaStore.MediaColumns.SIZE);
                column_index_id = cursor.getColumnIndex(MediaStore.MediaColumns._ID);

                while (cursor.moveToNext()) {
                    i++;
                    if(i == MAX_ITEMS) {
                        break;
                    }
                    WritableMap map = new WritableNativeMap();
                    map.putString("path", cursor.getString(column_index_data));
                    map.putString("name", cursor.getString(column_index_title));
                    map.putInt("size", cursor.getInt(column_index_size));
                    Uri imageUri = ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                            cursor.getInt(column_index_id));
                    String base64Thumbnail = getThumbnailBase64(imageUri, MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE);
                    map.putString("thumbnail", base64Thumbnail);

                    listOfAllImages.pushMap(map);
                }

                if(total > MAX_ITEMS) {
                    WritableMap map = new WritableNativeMap();
                    map.putString("path", null);
                    map.putString("name", "+ " + String.valueOf(total - MAX_ITEMS) + " others");
                    map.putInt("size", 0);

                    listOfAllImages.pushMap(map);
                }
                cursor.close();

                promise.resolve(listOfAllImages);

    }

    @ReactMethod
    public void getVideos(Promise promise) {
                Uri uri;
                Cursor cursor;
                int i = 0, total = 0, column_index_data, column_index_title, column_index_size, column_index_id;
                WritableArray listOfAllVideos = new WritableNativeArray();
                uri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;

                String[] projection = { MediaStore.Video.Media.DATA
                        ,MediaStore.Video.Media.TITLE
                        ,MediaStore.Video.Media.SIZE
                        ,MediaStore.Video.Media._ID
                };

                cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                        null, null);

                if(cursor != null) {
                    total = cursor.getCount();
                }


                if(total == 0) {
                    promise.resolve(listOfAllVideos);
                    return;
                }

                column_index_data = cursor.getColumnIndex(MediaStore.Video.Media.DATA);
                column_index_title = cursor.getColumnIndex(MediaStore.Video.Media.TITLE);
                column_index_size = cursor.getColumnIndex(MediaStore.Video.Media.SIZE);
                column_index_id = cursor.getColumnIndex(MediaStore.Video.Media._ID);

                while (cursor.moveToNext()) {
                    i++;
                    if(i == MAX_ITEMS) {
                        break;
                    }
                    WritableMap map = new WritableNativeMap();
                    map.putString("path", cursor.getString(column_index_data));
                    map.putString("name", cursor.getString(column_index_title));
                    map.putInt("size", cursor.getInt(column_index_size));
                    Uri videoUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                            cursor.getInt(column_index_id));
                    map.putString("uri", videoUri.toString());
                    String base64Thumbnail = getThumbnailBase64(videoUri, MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO);
                    map.putString("thumbnail", base64Thumbnail);

                    listOfAllVideos.pushMap(map);
                }

                if(total > MAX_ITEMS) {
                    WritableMap map = new WritableNativeMap();
                    map.putString("path", null);
                    map.putString("name", "+ " + String.valueOf(total - MAX_ITEMS) + " others");
                    map.putInt("size", 0);

                    listOfAllVideos.pushMap(map);
                }

                cursor.close();
                promise.resolve(listOfAllVideos);
    }

    @ReactMethod
    public void getAudios(Promise promise) {
                Uri uri;
                Cursor cursor;
                int i = 0, total = 0,column_index_data, column_index_title, column_index_size, column_index_albumId;
                WritableArray listOfAudios = new WritableNativeArray();
                uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

                String[] projection = { MediaStore.Audio.Media.DATA
                        ,MediaStore.Audio.Media.TITLE
                        ,MediaStore.Audio.Media.SIZE
                        ,MediaStore.Audio.Media.ALBUM_ID
                };

                cursor = getCurrentActivity().getContentResolver().query(uri, projection, null,
                        null, null);

                if(cursor != null) {
                    total = cursor.getCount();
                }


                if(total == 0) {
                    promise.resolve(listOfAudios);
                    return;
                }

                column_index_data = cursor.getColumnIndex(MediaStore.Audio.Media.DATA);
                column_index_title = cursor.getColumnIndex(MediaStore.Audio.Media.TITLE);
                column_index_size = cursor.getColumnIndex(MediaStore.Audio.Media.SIZE);

                while (cursor.moveToNext()) {
                    i++;
                    if(i == MAX_ITEMS) {
                        break;
                    }
                    WritableMap map = new WritableNativeMap();
                    String path = cursor.getString(column_index_data);
                    map.putString("path", path);
                    map.putString("name", cursor.getString(column_index_title));
                    map.putInt("size", cursor.getInt(column_index_size));
                    map.putString("thumbnail",  getAudioThumbnailBase64(path));
                    listOfAudios.pushMap(map);
                }

                if(total > MAX_ITEMS) {
                    WritableMap map = new WritableNativeMap();
                    map.putString("path", null);
                    map.putString("name", "+ " + String.valueOf(total - MAX_ITEMS) + " others");
                    map.putInt("size", 0);

                    listOfAudios.pushMap(map);
                }

                cursor.close();
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
    public void deleteImages(ReadableArray paths, Promise promise) {
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
                try {
                    IntentSender intentSender = pendingIntent.getIntentSender();
                    getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                            intentSender, 100, null, 0, 0, 0
                    );
                    MainActivity.setPromise(promise);
                } catch (Exception er) {
                    promise.resolve(false);
                }

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
                try {
                    IntentSender intentSender = pendingIntent.getIntentSender();
                    getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                            intentSender, 100, null, 0, 0, 0
                    );
                    MainActivity.setPromise(promise);
                } catch (Exception er) {
                    promise.resolve(false);
                }
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
                try {
                    IntentSender intentSender = pendingIntent.getIntentSender();
                    getReactApplicationContext().getCurrentActivity().startIntentSenderForResult(
                            intentSender, 100, null, 0, 0, 0
                    );
                    MainActivity.setPromise(promise);
                } catch (Exception er) {
                    promise.resolve(false);
                }
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


    boolean isApkFileInstalled(String apkFilePath) {
        if(apkFilePath == null) {
            return false;
        }
        PackageManager packageManager = getReactApplicationContext().getPackageManager();
        PackageInfo info = packageManager.getPackageArchiveInfo(apkFilePath,
                PackageManager.GET_ACTIVITIES);
        if(info == null) {
            return false;
        }

        ApplicationInfo appInfo = info.applicationInfo;
        String packageName = appInfo.packageName;

        try {
            PackageInfo packageInfo =packageManager.getPackageInfo(packageName,PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
        return true;


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
    public void checkNotificationPermission(Promise p) {
        MainActivity.setPromise(p);
        if (ContextCompat.checkSelfPermission(
                getReactApplicationContext(), "android.permission.POST_NOTIFICATIONS") ==
                PackageManager.PERMISSION_GRANTED) {
            // You can use the API that requires the permission.
            setCanSendNotification(true);
            p.resolve(true);
        }
//        else if (ActivityCompat.shouldShowRequestPermissionRationale(getCurrentActivity(), Manifest.permission.POST_NOTIFICATIONS)) {
//            // In an educational UI, explain to the user why your app requires this
//            // permission for a specific feature to behave as expected, and what
//            // features are disabled if it's declined. In this UI, include a
//            // "cancel" or "no thanks" button that lets the user continue
//            // using your app without granting the permission.
//            new AlertDialog.Builder(getReactApplicationContext())
//                    .setTitle("Notification Permission")
//                    .setMessage("Notification permission is used to inform you about the status of the scan operation")
//                    .setPositiveButton("OK", (dialog, which) -> {
//                        if (Build.VERSION.SDK_INT >= 33) {
//
//                        }
//                    })
//                    .setNegativeButton("No Thanks", null)
//                    .show();
//        }
        else {
            // You can directly ask for the permission.
            ActivityCompat.requestPermissions(getCurrentActivity(),
                    new String[] {  "android.permission.POST_NOTIFICATIONS" },
                    20);
        }
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getCurrentActivity().getString(R.string.common_google_play_services_notification_channel_name);
            String description = getCurrentActivity().getString(R.string.common_google_play_services_notification_channel_name);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("123", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getReactApplicationContext().getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @ReactMethod
    public void showNotification(String textTitle, String textContent, Boolean isSilent) {
        if(!ManageApps.getCanSendNotification()) {
            return;
        }
        createNotificationChannel();
      
        Intent intent = new Intent(getCurrentActivity(), getCurrentActivity().getClass());
        PendingIntent sender = PendingIntent.getActivity(getCurrentActivity(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(), "123")
                .setSmallIcon(R.drawable.src_images_small_logo)
                .setContentTitle(textTitle)
                .setContentText(textContent)
                .setSilent(isSilent?true:false)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(sender);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());
        notificationManager.notify(1, builder.build());
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


                    // TODO : get length() of files inside dirs not dirs size

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

    public long dirSize(File dir) {
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


    @ReactMethod
    public void clearAllVisibleCache(Promise promise) {
        MainActivity.setPromise(promise);
        Intent intent = new Intent(StorageManager.ACTION_CLEAR_APP_CACHE);
        getCurrentActivity().startActivityForResult(intent, 200);
    }

    @ReactMethod
    public void manageUnusedApps(Promise promise) {
        Intent mainIntent =  new Intent(Intent.ACTION_MANAGE_UNUSED_APPS);
        getCurrentActivity().startActivity(mainIntent);
        promise.resolve(null);
    }

    @ReactMethod
    public void uninstallApp(String packageName) {
        Intent intent = new Intent(getCurrentActivity(), getCurrentActivity().getClass());
        PendingIntent sender = PendingIntent.getActivity(getCurrentActivity(), 0, intent, PendingIntent.FLAG_IMMUTABLE);
        PackageInstaller mPackageInstaller = getCurrentActivity().getPackageManager().getPackageInstaller();
        mPackageInstaller.uninstall(packageName, sender.getIntentSender());
    }

    @ReactMethod
    public void pickImages(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_PICTURES);
        intent.setType("image/*");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void pickAnyFile(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_DOWNLOADS);
        intent.setType("*/*");
        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void pickVideos(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_MOVIES);
        intent.setType("video/*");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void pickAudios(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI,  Environment.DIRECTORY_MUSIC);
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

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_DOWNLOADS);


        intent.setType("application/vnd.android.package-archive");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void pickDocument(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("*/*");
        String [] mimeTypes = {"text/*",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.openxmlformats-officedocument.presentationml.slide",
                "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                "application/vnd.openxmlformats-officedocument.presentationml.template",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        };
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_DOCUMENTS);
        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }


    @ReactMethod
    public void pickDownloads(Promise promise) {
        MainActivity.setPromise(promise);
        MainActivity.setPickerRequestCode(4);

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_DOWNLOADS);

        intent.setType("*/*");

        // Optionally, specify a URI for the file that should appear in the
        // system file picker when it loads.
//        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
        getCurrentActivity().startActivityForResult(intent, 4);
    }

    @ReactMethod
    public void getFileDescription(String uriString, Promise p) throws URISyntaxException {
        Uri uri = Uri.parse(uriString);
        String[] projection = {
                MediaStore.Files.FileColumns.DISPLAY_NAME,
                MediaStore.Files.FileColumns.MIME_TYPE,
                MediaStore.Files.FileColumns.SIZE
        };
        Cursor cursor = getReactApplicationContext()
                .getContentResolver()
                .query(uri,
                        projection,
                        null,
                        null,
                        null);

        if (cursor == null) {
            p.resolve(null);
        }

        WritableMap map = new WritableNativeMap();


        int nameIndex = cursor.getColumnIndex(MediaStore.Files.FileColumns.DISPLAY_NAME);
        int mimetypeIndex = cursor.getColumnIndex(MediaStore.Files.FileColumns.MIME_TYPE);
        int sizeIndex = cursor.getColumnIndex(MediaStore.Files.FileColumns.SIZE);



        if(cursor.moveToFirst()) {
            String name = cursor.getString(nameIndex);
            String mimeType = cursor.getString(mimetypeIndex);
            long size = cursor.getLong(sizeIndex);


            map.putString("name", name);
            map.putString("type", mimeType);
            map.putDouble("size", size);

            p.resolve(map);
            cursor.close();
        }
    }

    public String getFileDataBase64(String path) {
        String base64 = "";

        try {
            File file = new File(path);
            byte[] buffer = new byte[(int) file.length() + 100];
            int length = new FileInputStream(file).read(buffer);
            base64 = Base64.encodeToString(buffer, 0, length,
                    Base64.DEFAULT);
        } catch (NullPointerException | IOException e) {
            return e.getMessage();
        }
        return base64;
    }

    @ReactMethod
    public void saveFile(String name, String data, Promise p) {
        try {
            FileOutputStream fos = getReactApplicationContext().openFileOutput(
                    name,
                    Context.MODE_PRIVATE
            );
            fos.write(data.getBytes());
            fos.close();
            p.resolve(true);
        } catch (IOException e) {
            p.resolve(false);
        }
    }

    @ReactMethod
    public void getFileContent(String name, Promise p) throws FileNotFoundException {
        FileInputStream fis = getReactApplicationContext().openFileInput(name);
        InputStreamReader inputStreamReader =
                new InputStreamReader(fis, StandardCharsets.UTF_8);
        StringBuilder stringBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(inputStreamReader)) {
            String line = reader.readLine();
            while (line != null) {
                stringBuilder.append(line).append('\n');
                line = reader.readLine();
            }
        } catch (IOException e) {
            p.resolve(null);
        } finally {
            String contents = stringBuilder.toString();
            p.resolve(contents);
        }
    }

    @ReactMethod
    public void isFileExist(String name, Promise p) {
        File file = new File(getReactApplicationContext().getFilesDir(),name);
        p.resolve(file.exists());
    }


    @ReactMethod
    public void getFreeSpace(Promise p){
        Context ctx = getReactApplicationContext();
        StorageManager storageManager = null;
        long availableBytes = 0;

        try {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            storageManager = ctx.getSystemService(StorageManager.class);
        }
            UUID appSpecificInternalDirUuid = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                appSpecificInternalDirUuid = storageManager.getUuidForPath(ctx.getFilesDir());
                availableBytes =
                        storageManager.getAllocatableBytes(appSpecificInternalDirUuid);

                storageManager.allocateBytes(
                        appSpecificInternalDirUuid, availableBytes);
                p.resolve("allocated");
            }

        }catch(IOException e) {
            p.resolve("error");
        }
        p.resolve(String.valueOf(availableBytes));
    }

    @ReactMethod
    public void getJunkData(Promise p) {
        JunkData scanner = new JunkData() {
            @Override
            public void onComplete(WritableMap result) {
                p.resolve(result);
            }
        };

        executorService.execute(
                () -> {
                    try {
                            File rootDir = new File(
                                    Environment
                                            .getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
                                            .getAbsolutePath()
                                            .replace(Environment.DIRECTORY_PICTURES, "")
                            );

                            WritableArray allFilesAndDirs = new WritableNativeArray();
                            walk(rootDir, allFilesAndDirs);


                            WritableArray thumbnails = new WritableNativeArray();
                            WritableArray emptyFolders = new WritableNativeArray();
                            WritableArray notInstalledApps = new WritableNativeArray();


                           for(int i = 0; i < allFilesAndDirs.size(); i++) {
                               ReadableMap item = allFilesAndDirs.getMap(i);
                               String name = item.getString("name");

                               // thumbnails
                               if(name.equals(".thumbnails")) {
                                   thumbnails.pushMap(item);
                                   continue;
                               }

                               // empty folders
                               if(item.getBoolean("dir") &&
                                       item.getBoolean("canDelete") &&
                                       item.hasKey("empty") &&
                                       item.getBoolean("empty")) {
                                   emptyFolders.pushMap(item);
                                   continue;
                               }

                               // not installed apks
                               if(item.hasKey("apk")
                                       && item.getBoolean("apk")
                                       && item.hasKey("isInstalled")
                                       && !item.getBoolean("isInstalled")) {
                                   notInstalledApps.pushMap(item);
                                   continue;
                               }
                           }

                           WritableMap output = new WritableNativeMap();

                           output.putArray("thumbnails", thumbnails);
                           output.putArray("emptyFolders", emptyFolders);
                           output.putArray("notInstalledApps", notInstalledApps);

                        mainThreadHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                scanner.onComplete(output);
                            }
                        });
                    }catch (Exception e) {
                        mainThreadHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                WritableArray thumbnails = new WritableNativeArray();
                                WritableArray emptyFolders = new WritableNativeArray();
                                WritableArray notInstalledApps = new WritableNativeArray();

                                WritableMap output = new WritableNativeMap();

                                output.putArray("thumbnails", thumbnails);
                                output.putArray("emptyFolders", emptyFolders);
                                output.putArray("notInstalledApps", notInstalledApps);
                                output.putString("error", e.getMessage());
                                scanner.onComplete(output);
                            }
                        });
                    }
                }
        );
    }

    public void walk(File dir, WritableArray arr) {
        if(!dir.exists() || !dir.canRead()) {
         return;
        }
        showNotification( "Hey, I'm optimizing your device's space.", "fetching " + dir.getAbsolutePath(), true);
        if(isDirectory(dir)) {
            if(isEmpty(dir)) {
                WritableMap item = new WritableNativeMap();

                item.putString("name", dir.getName());
                item.putString("path", dir.getAbsolutePath());
                item.putBoolean("dir", true);
                item.putBoolean("empty", true);
                item.putDouble("size", dir.length());

                boolean canDelete = dir.canWrite();

                String[] publicDirs = new String[] {
                           "media",
                           "Android",
                           "0",
                           "Download"
                   };

                for(String s : publicDirs) {
                    if(dir.getName().equals(s)) {
                        canDelete = false;
                    }
                }

                item.putBoolean("canDelete", canDelete);


                arr.pushMap(item);
            }else {
                WritableMap item = new WritableNativeMap();

                item.putString("name", dir.getName());
                item.putString("path", dir.getAbsolutePath());
                item.putBoolean("dir", true);
                item.putBoolean("empty", false);
                item.putDouble("size", dirSize(dir));

                boolean canDelete = dir.canWrite();

                String[] publicDirs = new String[] {
                        "media",
                        "Android",
                        "0",
                        "Download"
                };

                for(String s : publicDirs) {
                    if(dir.getName().equals(s)) {
                        canDelete = false;
                    }
                }

                item.putBoolean("canDelete", canDelete);


                arr.pushMap(item);

                for(File f : dir.listFiles()) {
                    walk(f, arr);
                }

            }
        }else {
            WritableMap item = new WritableNativeMap();
            String name = dir.getName();
            String path = dir.getAbsolutePath();
            boolean isApk = name.endsWith("apk");

            item.putString("name", name);
            item.putString("path", path);
            item.putBoolean("dir", false);
            item.putBoolean("canDelete", dir.canWrite());
            item.putDouble("size", dir.length());
            item.putBoolean("apk", isApk);
            if(isApk) {
                item.putBoolean("isInstalled", isApkFileInstalled(path));
            }


            arr.pushMap(item);
        }
    }

    public boolean isDirectory(File dir) {
        return dir.exists() && dir.isDirectory() && dir.listFiles() != null;
    }

    public boolean isEmpty(File dir) {
        return isDirectory(dir) && dir.listFiles().length == 0;
    }


    boolean deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                if(file != null) {
                    if(file.isDirectory()) {
                        if(!deleteDirectory(file)) {
                            return false;
                        }
                    }else {
                         if(!file.delete()) {
                             return false;
                         };
                    }

                }

            }
        }

        return  directoryToBeDeleted.delete();
    }


    @ReactMethod
    public void deleteDirs(ReadableArray paths,Promise p) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if(!Environment.isExternalStorageManager()) {
              checkAllFilesAccessPermission(p);
            }
        }

        for(int i = 0; i < paths.size(); i++) {
            File dir = new File(paths.getString(i));
            if(!dir.exists() || !deleteDirectory(dir)) {
                p.resolve(false);
                return;
            }
        }

        p.resolve(true);
    }

    @ReactMethod
    public void deleteApks(ReadableArray paths, Promise promise) {
        int size = paths.size();
        if(size == 0) {
            promise.resolve(true);
            return;
        }

        String[] pathsArr = new String[size];
        for(int i = 0; i < size; i++){
            pathsArr[i] = paths.getString(i);
        }

        ContentResolver cr = getReactApplicationContext().getContentResolver();
        try {
            cr.delete(
                    MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL),
                    MediaStore.Files.FileColumns.DATA + " = ?",
                    pathsArr);
        } catch (Exception e) {
            promise.resolve(false);
        }

        promise.resolve(true);
    }


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

    @ReactMethod
    public void getSDcardStorageStats(Promise p) {
        Boolean isSDPresent = android.os.Environment.getExternalStorageState().equals(android.os.Environment.MEDIA_MOUNTED);
        Boolean isSDSupportedDevice = Environment.isExternalStorageRemovable();

        if(isSDSupportedDevice && isSDPresent) {
            StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());

            long sizeOfSDcard = (long)stat.getBlockCountLong() * (long)stat.getBlockSizeLong();
            long availableStorageOfSDcard =  (long)stat.getAvailableBlocksLong() * (long)stat.getBlockSizeLong();

            WritableMap map = new WritableNativeMap();

            map.putDouble("fullSize", sizeOfSDcard);
            map.putDouble("availableSize", availableStorageOfSDcard);

            p.resolve(map);
            return;
        }

        p.resolve(null);
    }

    @ReactMethod
    public void loginWithTwitter(Promise p) {
        firebaseAuth = FirebaseAuth.getInstance();
        OAuthProvider.Builder provider = OAuthProvider.newBuilder("twitter.com");
        Task<AuthResult> pendingResultTask = firebaseAuth.getPendingAuthResult();

        if (pendingResultTask != null) {
            pendingResultTask
            // There's something already here! Finish the sign-in for your user.
                    .addOnSuccessListener(
                            authResult -> {
                                FirebaseUser user =  authResult.getUser();
                               ;
                                WritableMap userData = new WritableNativeMap();

                                userData.putString("name", user.getDisplayName());
                                userData.putString("id", user.getUid());

                                p.resolve(userData);
                            })
                    .addOnFailureListener(
                            e -> {
                                p.resolve(e.getMessage());
                            });
        } else {
            firebaseAuth
                    .startActivityForSignInWithProvider(getCurrentActivity(), provider.build())
                    .addOnSuccessListener(
                            authResult -> {
                                FirebaseUser user =  authResult.getUser();
                                WritableMap userData = new WritableNativeMap();

                                userData.putString("name", user.getDisplayName());
                                userData.putString("id", user.getUid());

                                p.resolve(userData);
                            })
                    .addOnFailureListener(
                            e -> {
                                p.resolve(e.getMessage());
                            });
        }

    }

   @ReactMethod
    public void getExtensionFromMimeType(String mimeType, Promise p) {
        p.resolve(MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType));
   }

}