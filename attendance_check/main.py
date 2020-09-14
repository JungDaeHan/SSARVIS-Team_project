# QT lib
from PyQt5.QtWidgets import *
from PyQt5.uic import *
from PyQt5.QtGui import *
from PyQt5.QtTest import *
from PyQt5.QtCore import *

# SQL lib
import pymysql

# RFID lib
from mfrc522 import SimpleMFRC522

# Passive buzzer lib
from buzzer_module import buzzer

# Bluetooth lib
from bluetooth import *

# sys
import RPi.GPIO as GPIO
import time
import cv2
import datetime


# parameter for multithread
class MyParam():
    def __init__(self, st, temp=0.0, who="unknown"):
        self.sigState = st
        self.temp = temp
        self.who = who

# rfid and bluetooth thread
class MyThread(QThread):
    mySignal = pyqtSignal(MyParam)
    def __init__(self):
        super().__init__()

        
    def run(self):
        # define thread parameter 
        cuState = MyParam(st=1, temp=2.1, who='unknown')

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

        # rfid obj
        rfid_reader = SimpleMFRC522()

        # buzzer obj
        buz = buzzer.BUZZER()

        # connect bluetooth
        sock = BluetoothSocket(RFCOMM)
        sock.connect(("98:D3:51:F9:59:AC",1))
        print("bluetooth connected!")

        while True:
            # Read rfid
            rfid, text = rfid_reader.read()
            print(rfid)
            curs.execute("select * from tb_user where user_rfid = %d" % rfid )
            
            # Check user existence
            user_data = curs.fetchall()
            name = None 
            if user_data:
                name = user_data[0][1]
                cuState.sigState = 2
                cuState.who = name
                self.mySignal.emit(cuState)
                buz.success()

            else:
                buz.fail()
                cuState.sigState = 3
                cuState.who = name
                self.mySignal.emit(cuState)
                time.sleep(2)
                cuState.sigState = 1
                self.mySignal.emit(cuState)
                continue

            # Measure body tempreture
            sock.send("a")
            while True:
                msg = sock.recv(1024)
                if msg.decode('utf-8') == '0':
                    break
            temperature = sock.recv(1024)
            temperature = temperature.decode('utf-8')
            cuState.sigState = 4
            cuState.temp = temperature
            self.mySignal.emit(cuState)
            buz.success()
            time.sleep(3)
            cuState.sigState = 1

            # update database/temperature
            date = datetime.datetime.today()
            da = date.strftime('%Y-%m-%d %H:%M:%S')
            
            curs.execute("select * from tb_attendance  where now_year = %d and now_month = %d and now_day = %d and user_no = %d" % (date.year, date.month, date.day, user_data[0][0]) )
            at_no = curs.fetchall()[0][0]
            
            if date.hour < 12:
                curs.execute("update tb_attendance set user_c1 = %s, user_c1_time = '%s'  where at_no = %d" %(temperature,da, at_no))
                db.commit()
            else:
                curs.execute("update tb_attendance set user_c2 = %s, user_c2_time = '%s'  where at_no = %d" %(temperature,ds, at_no))
                db.commit()
            
            # send thread signal
            self.mySignal.emit(cuState)

class MyApp(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("ga.ui", self)
        self.main = cv2.cvtColor(cv2.imread("Slide.jpg"), cv2.COLOR_BGR2RGB)
        self.auth = cv2.cvtColor(cv2.imread("auth.jpg"), cv2.COLOR_BGR2RGB)
        self.auth_fail = cv2.cvtColor(cv2.imread("auth_fail.jpg"), cv2.COLOR_BGR2RGB)
        self.temperature = cv2.cvtColor(cv2.imread("temperature.jpg"), cv2.COLOR_BGR2RGB)
        
        self.showMain()
        self.th = MyThread()
        self.th.mySignal.connect(self.control)
        self.th.start()

    def control(self, state):
        if(state.sigState == 1):
            self.showMain()
        elif(state.sigState == 2):
            self.showAuth(state.who)
        elif(state.sigState ==3):
            self.showAuthFail()
        elif(state.sigState == 4):
            self.showTemp(state.who, state.temp)

    def showMain(self):
        self.username.setText("")
        self.username2.setText("")
        self.usertemp.setText("")
 
        h, w, byte = self.main.shape
        image = QImage(self.main, w, h, byte*w, QImage.Format_RGB888)
        self.label.setPixmap(QPixmap(image))
        self.label.adjustSize()

    def showAuth(self,name):
        h, w, byte = self.auth.shape
        image = QImage(self.auth, w, h, byte*w, QImage.Format_RGB888)
        self.label.setPixmap(QPixmap(image))
        self.label.adjustSize()
        self.username.setText(name)

    def showAuthFail(self):
        self.username.setText("")
        h, w, byte = self.auth_fail.shape
        image = QImage(self.auth_fail, w, h, byte*w, QImage.Format_RGB888)
        self.label.setPixmap(QPixmap(image))
        self.label.adjustSize()

    def showTemp(self,name, tempVal):
        self.username.setText("")
        self.username2.setText(name)
        self.usertemp.setText(tempVal)
        h, w, byte = self.temperature.shape
        image = QImage(self.temperature, w, h, byte*w, QImage.Format_RGB888)
        self.label.setPixmap(QPixmap(image))
        self.label.adjustSize()       

app = QApplication([])
win = MyApp()
win.show()
app.exec_()

