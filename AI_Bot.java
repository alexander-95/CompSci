/**
*@author Alexander Mitchell
*
*Algorithm:
*1.  Scan clockwise while there is no target in sight.
*2.  Set the floodlight to blue to show nothing is detected.
*3.  When a target is found, keep rotating until the target goes out of range.
*4.  Increment the count variable to calculate the aperture of the ultrasonic sensor.
*5.  When the target goes out of range start scanning back until the target comes back into range.
*6.  Increment the count variable for getting a second calculation of the aperture.
*7.  Keep rotating until the target goes out of range.
*8.  Increment the count variable.
*9.  Now the robot has made to scans across the target.
*10. Rotate back half way to get line up directly with the target.
*11. Shoot.
*12. Rotate clockwise until the target goes out of range. This will prevent getting stuck and
*    constantly going for the same target.
*13. Continue scanning for the next target.
*/
import lejos.nxt.Motor;
import lejos.nxt.SensorPort;
import lejos.nxt.UltrasonicSensor;
import lejos.nxt.ColorSensor;
import lejos.nxt.Button;
import lejos.nxt.LCD;
public class AI_Bot
{
	public static UltrasonicSensor sonic = new UltrasonicSensor(SensorPort.S1);
	public static ColorSensor color = new ColorSensor(SensorPort.S2);
	public static int viewDistance = 0;//the range of the ultrasonic sensor to detect
	public static void main(String[] args)throws Exception
	{
		Motor.A.setSpeed(360);//Base-used to rotate the left and right
		Motor.B.setSpeed(180);//Cannon-used to change the pitch of the cannon
		Motor.C.setSpeed(720);//Fire-used to fire the cannon
		color.setFloodlight(2);//Set the lamp to blue-indicates no target in sight
		boolean ready=false;
		LCD.drawString("Distance:"+viewDistance+"cm",0,0);
		while(!ready)//allow the user to set the view distance of the ultrasonic sensor
		{
			if(Button.LEFT.isPressed())//Use the left button for decreasing range
			{
				viewDistance-=5;
				LCD.clear();
				LCD.drawString("Distance:"+viewDistance+"cm",0,0);
				wait(200);
			}
			if(Button.RIGHT.isPressed())//Use the right button for increasing range
			{
				viewDistance+=5;
				LCD.clear();
				LCD.drawString("Distance:"+viewDistance+"cm",0,0);
				wait(200);
			}
			if(Button.ENTER.isPressed())ready=true;//dont go back into the loop if the enter button is pressed
		}
		while(true)
		{
			scanLeft(5);//scan anticlockwise, looking for targets
		}
	}
	public static void rotate(int angle)
	{
		Motor.A.rotate(angle*(-1));//rotate clockwise about the base
	}
	public static void scanLeft(int inc)
	{
		Motor.A.setSpeed(360);
		int count=0;//count to store the field of view
		while(sonic.getDistance()>=viewDistance)//while the target is out of range
		{
			color.setFloodlight(2);
			rotate(inc);//Start rotating
		}
		while(sonic.getDistance()<=viewDistance)//while a target is within range
		{
			color.setFloodlight(0);
			rotate(inc);//keep turning until target goes out of range
		}
		while(sonic.getDistance()>=viewDistance)//while the target is out of range
		{
			color.setFloodlight(2);
			rotate(inc*(-1));//Start rotating back the way
			count+=inc;
		}
		while(sonic.getDistance()<=viewDistance)//While the target is within range
		{
			color.setFloodlight(0);
			rotate(inc*(-1));//when the object is found again, rotate until he disappears
			count+=inc;
		}
		Motor.A.setSpeed(180);//slow down the motor for accuracy
		rotate(count/2);
		shoot();
		Motor.A.setSpeed(360);//Get back up to speed, accuracy isn't so important now
		while(sonic.getDistance()<=viewDistance)//when the object is found again,
		{
			rotate(inc);// rotate until he disappears to avoid locking on again
		}
	}
	public static void raiseCannon(int inc)
	{
		Motor.B.rotate(inc*(-1));//rotate the cannon in the upwards direction
		Motor.C.rotate(inc*(-1));//rotate the fire motor to keep the pin back
	}
	public static void shoot()
	{
		Motor.B.lock(100);//Stop the cannon from moving with backfire
		Motor.C.rotate(-360);//fire the cannon
		Motor.B.flt();//allow the cannon to go loose again
	}
	public static void wait(int time)//a simple method wait for a time set in milliseconds
	{
		try 
		{
			Thread.sleep(time);
		}
		catch(InterruptedException ex) 
		{
			Thread.currentThread().interrupt();
		}
	}
}
