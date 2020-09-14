#include <Wire.h>
#include <Adafruit_MLX90614.h>

//mlx90614 라이브러리
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

//button GPIO
const int buttonPin = 2;    
      
int buttonState;             
int lastButtonState = LOW;   

unsigned long lastDebounceTime = 0; 
unsigned long debounceDelay = 50;   

//timer
unsigned long iTime;

//system state
int state = 0;

void setup() {
  //button init
  pinMode(buttonPin, INPUT_PULLUP);

  //Serial commuication
  Serial.begin(9600);

  //set mlx90614
  mlx.begin();
  
}

void loop() {
  int reading = digitalRead(buttonPin);
  double temp=0;

  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;


      if (buttonState == LOW) {
        temp = getTemp();
       
      }
    }
  }


  lastButtonState = reading;
}

double getTemp(){
  double t =0 ;
  for(int i=0; i<1000; i++){
    double tt = mlx.readObjectTempC();
    if (t < tt) t = tt;
  }
  return t;
}
