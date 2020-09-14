package com.example.ssarvis;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class AlarmReceiver extends BroadcastReceiver {
    private final int REQUEST_BLUETOOTH_ENABLE = 100;
    static BluetoothAdapter mBluetoothAdapter;
    static boolean disableFlag = false;
    Context context;
//    int[][] timeTable = {{8, 25, 0}, {9, 10, 0}, {17, 50, 0}, {18, 10, 0}};

    int[][] timeTable = {{16, 55, 0}, {16, 56, 0}, {16, 57, 0}, {16, 58, 0}};

    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO: This method is called when the BroadcastReceiver is receiving

        this.context = context;

        Toast myToast = Toast.makeText(this.context,"arrive", Toast.LENGTH_SHORT);
        myToast.show();

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            Toast.makeText(this.context,"this device is not implement bluetooth", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!mBluetoothAdapter.isEnabled()) {
            mBluetoothAdapter.enable();
            disableFlag = true;
        }

        int cate = intent.getExtras().getInt("cate");
        try {
            Method bluetoothDeviceVisibility;
            bluetoothDeviceVisibility = mBluetoothAdapter.getClass().getMethod("setScanMode", int.class, int.class);
            if(cate == 10)
                bluetoothDeviceVisibility.invoke(mBluetoothAdapter, BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE, 0);
            else if(cate == 20) {
                bluetoothDeviceVisibility.invoke(mBluetoothAdapter, BluetoothAdapter.SCAN_MODE_NONE, 0);
                if(disableFlag) {
                    mBluetoothAdapter.disable();
                    disableFlag = false;
                }
            }
//            Toast.makeText(this.context,"discoverOn", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            e.printStackTrace();
        }

        AlarmManager alarmManager = (AlarmManager) this.context.getSystemService(Context.ALARM_SERVICE);
        ArrayList<PendingIntent> intentArray = new ArrayList<PendingIntent>();

        for(int i = 0; i<4; i++) {
            Calendar calendar = Calendar.getInstance();

            calendar.setTimeInMillis(System.currentTimeMillis());
            calendar.set(Calendar.HOUR_OF_DAY, timeTable[i][0]);
            calendar.set(Calendar.MINUTE, timeTable[i][1]);
            calendar.set(Calendar.SECOND, timeTable[i][2]);

            if (calendar.before(Calendar.getInstance()))
                calendar.add(Calendar.DATE, 1);
//        Toast.makeText(context, "설정시간 : "+calendar.getTime() , Toast.LENGTH_SHORT).show();

            Intent newIntent = new Intent(this.context, AlarmReceiver.class);
            intent.putExtra("cate", (i&1)==0 ? 10 : 20);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(this.context, i, intent, PendingIntent.FLAG_NO_CREATE);
            if (pendingIntent != null) {
//                Toast.makeText(this.context, "Receive: 이미 존재-"+i, Toast.LENGTH_SHORT).show();
                pendingIntent = PendingIntent.getBroadcast(this.context, i, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
            }
//            else
//                Toast.makeText(this.context, "Receive: 이전에 없었음-"+i, Toast.LENGTH_SHORT).show();
            pendingIntent = PendingIntent.getBroadcast(this.context, i, intent, 0);
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


//        String actionName = intent.getAction();
//        Toast.makeText(context, "받은 액션 : "+actionName , Toast.LENGTH_SHORT).show();
//        Toast.makeText(context, "카테고리 : "+cate , Toast.LENGTH_SHORT).show();

        // an Intent broadcast.
        //throw new UnsupportedOperationException("Not yet implemented");
    }
}
