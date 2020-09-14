from bluetooth import *
import pymysql
import datetime

devices = discover_devices(duration=3)

# database access
db = pymysql.connect(
        user = 'ssafy9_extern',
        port = 3306,
        passwd = 'ssafy9',
        host = 'i3a109.p.ssafy.io',
        db = 'ssarvis',
        charset = 'utf8'
        )

curs = db.cursor()


# serach MAC address
while(True):
    devices = discover_devices(duration=3)
    for device in devices:

        curs.execute("select * from tb_user where user_mac = '%s'" % device)
        user_data = curs.fetchall()
        if user_data:
            user_no = user_data[0][0]
            date = datetime.datetime.today()
            da = date.strftime('%Y-%m-%d %H:%M:%S')
            
            curs.execute("select * from tb_attendance where now_year = %d and now_month = %d and now_day = %d and user_no = %d" %(date.year, date.month, date.day, user_no))
            attendance_data = curs.fetchall()

            if attendance_data:
                if date.hour >= 18:
                    curs.execute("update tb_attendance set user_out = '%s', user_out_time = '%s'" %('퇴실', da))
                    db.commit()
            else:
                print(device+" 출석했습니다. ")
                if date.hour < 9 :

                    curs.execute("insert into tb_attendance(user_no, user_in, user_in_time,now_year, now_month, now_day, generation) values (%d, '%s', '%s', %d, %d, %d, %d)" %(user_no, '입실', da, date.year, date.month, date.day, user_data[0][7]))
                    db.commit()

                elif data.hour < 18:

                    curs.execute("insert into tb_attendance(user_no, user_in, user_in_time,now_year, now_month, now_day, generation) values (%d, '%s', '%s', %d, %d, %d, %d)" %(user_no, '임의지각', da, date.year, date.month, date.day, user_data[0][7]))
                    db.commit()
                
