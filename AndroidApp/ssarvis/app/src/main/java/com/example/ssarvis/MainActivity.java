package com.example.ssarvis;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import android.os.Bundle;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Calendar;
import java.lang.reflect.Method;

public class MainActivity extends AppCompatActivity {
    private final int REQUEST_BLUETOOTH_ENABLE = 100;
    static BluetoothAdapter mBluetoothAdapter;
    private static final String TAG = "BluetoothClient";
    Context context;
    int[][] timeTable = {{16, 55, 0}, {16, 56, 0}, {16, 57, 0}, {16, 58, 0}};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.context = this;

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            Toast myToast = Toast.makeText(this.getApplicationContext(),"this device is not implement bluetooth", Toast.LENGTH_SHORT);
            myToast.show();
            return;
        }

        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        ArrayList<PendingIntent> intentArray = new ArrayList<PendingIntent>();

        for(int i = 0; i < 4; i++) {
            Calendar calendar = Calendar.getInstance();


            calendar.setTimeInMillis(System.currentTimeMillis());
            calendar.set(Calendar.HOUR_OF_DAY, timeTable[i][0]);
            calendar.set(Calendar.MINUTE, timeTable[i][1]);
            calendar.set(Calendar.SECOND, timeTable[i][2]);

            if (calendar.before(Calendar.getInstance()))
                calendar.add(Calendar.DATE, 1);
//        Toast.makeText(context, "설정시간 : "+calendar.getTime() , Toast.LENGTH_SHORT).show();

            Intent intent = new Intent(this, AlarmReceiver.class);
            intent.putExtra("cate", (i&1)==0 ? 10 : 20);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(this, i, intent, PendingIntent.FLAG_NO_CREATE);
            if (pendingIntent != null){
//                Toast.makeText(this.getApplicationContext(), "Act: 이미 존재"+i, Toast.LENGTH_SHORT).show();
                pendingIntent = PendingIntent.getBroadcast(this, i, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
            }
//            else
//                Toast.makeText(this.getApplicationContext(), "Act: 이전에 없었음"+i, Toast.LENGTH_SHORT).show();
            pendingIntent = PendingIntent.getBroadcast(this, i, intent, 0);
            if (Build.VERSION.SDK_INT >= 23) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent);
//            Toast myToast = Toast.makeText(this.getApplicationContext(), calendar.getTimeInMillis()+" - 23", Toast.LENGTH_SHORT);
//            myToast.show();
            } else {
                if (Build.VERSION.SDK_INT >= 19)
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                else
                    alarmManager.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            }

            intentArray.add(pendingIntent);
        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
//        try {
//            Method bluetoothDeviceVisibility;
//            bluetoothDeviceVisibility = mBluetoothAdapter.getClass().getMethod("setScanMode", int.class, int.class);
//            bluetoothDeviceVisibility.invoke(mBluetoothAdapter, BluetoothAdapter.SCAN_MODE_NONE, 0);
//        } catch (Exception e) {
//            e.printStackTrace();
//            Toast myToast = Toast.makeText(this.getApplicationContext(),"Unknown Error at Destroy", Toast.LENGTH_SHORT);
//            myToast.show();
//        }
    }

    public void onImageClick(View v) {
        if (!mBluetoothAdapter.isEnabled()) {
            Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(intent, REQUEST_BLUETOOTH_ENABLE);
        }
        else {
            Log.d(TAG, "Initialisation successful.");
        }
        try {
            Method bluetoothDeviceVisibility;
            bluetoothDeviceVisibility = mBluetoothAdapter.getClass().getMethod("setScanMode", int.class, int.class);
            if(mBluetoothAdapter.getScanMode()==BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE) {
                bluetoothDeviceVisibility.invoke(mBluetoothAdapter, BluetoothAdapter.SCAN_MODE_NONE, 0);
                Toast myToast = Toast.makeText(this.getApplicationContext(),"discover off", Toast.LENGTH_SHORT);
                myToast.show();
            }
            else{
                bluetoothDeviceVisibility.invoke(mBluetoothAdapter, BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE, 0);
                Toast myToast = Toast.makeText(this.getApplicationContext(),"discover on", Toast.LENGTH_SHORT);
                myToast.show();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast myToast = Toast.makeText(this.getApplicationContext(),"Unknown Error at Create", Toast.LENGTH_SHORT);
            myToast.show();
        }
    }


}