/**
*@author Alexander Mitchell
*
*The following program takes 1 string argument which represents a range
*This algorithm will print how many palindromes are generated when all the
*numbers are converted to their binary equivalent.
* 
* Run the program with an argument of the form "a,b" where a and b are integers and a<b.
* eg: java Palindromes 0,4000000000
*
*O(Log(n)) algorithm.
*
*/
public class Palindromes
{
	public static void main(String[] args)
	{
		String s1 = new String(args[0]);//input range
		long time = System.currentTimeMillis();
		long lower=Long.parseLong(s1.substring(0,s1.indexOf(',')));//lower bound
		long upper=Long.parseLong(s1.substring(s1.indexOf(',')+1,s1.length()));//upper bound
		int count=0;//number of palindromes found
		boolean bruteforced=false;//allows message to be printed once
		for(long i=lower;i<=upper;i++)//loop through the range of numbers
		{
			int length = powOfTwo(i)+1;//looking at the number gives the length of binary string
			int switches = (length-(length/2))-1;//number of free bits
			if((i*2)<upper&&(powOfTwo(i)>=0))//if the number is a power of two and is less than half the upper bound
			{
				bruteforced=false;
				count+=Math.pow(2,switches);//formula to count palindromes
				i*=2;//move past the chunk
				i--;//cancels out when the loop increments
				System.out.println("chunk searched");
			}
			else if(powOfTwo(i)>=0)//if the search does not cover an entire chunk
			{
				bruteforced=false;
				double num = 1/Math.pow(2,1);//break down the search space
				for(int j=2;j<switches;j++)
				{
					if((i+(i*num))<upper)//if were looking at the second half
					{
						num+=(1/Math.pow(2,j));//approach the limit
					}
					else//if were looking at the first half
					{
						num-=(1/Math.pow(2,j));//approach the limit
					}
				}
				while(i+(i*num)>upper)num-=(1/Math.pow(2,switches));//come back if we went over the edge
				System.out.println("searching "+(num)*100+"% of final chunk");
				count+=(Math.pow(2,switches)*num);//formula to count palindromes in chunk segment
				i*=(1+num);//move past the chunk segment
				i--;
			}
			else//brute force check for a pallindrome
			{
				if(!bruteforced)
				{
					System.out.println("brute forcing");
					bruteforced=true;
				}
				if(i%(1/Math.pow(2,switches))==0&&switches>1)
				{
					double num = 1/Math.pow(2,switches);//break down the search space
					while(i+(i*num)<Math.pow(2,length))num+=(1/Math.pow(2,switches));//slowly approach the limit
					num-=(1/Math.pow(2,switches));//come back when we go over the edge
					System.out.println("searching "+(num)*100+"% of final chunk");
					count+=(Math.pow(2,switches)*num);//formula to count palindromes in chunk segment
					i*=(1+num);//move past the chunk segment
					i--;
				}
				if(i%2!=0)//only odd numbers can generate pallindromes
				{
					String binary=Integer.toBinaryString((int)i);//convert number to binary string
					int match=0;
					for(long j=0;j<binary.length()/2;j++)//loop through the first half of the string
					{
						if(binary.charAt((int)j)==binary.charAt(binary.length()-1-(int)j))match+=2;//check
					}
					if(match>=(binary.length())-1)count++;
				}
			}
		}
		System.out.println(count);
		System.out.println(System.currentTimeMillis()-time+"ms");
	}
	public static int powOfTwo(long num)//check if a number is a positive power of two
	{
		long i=1;
		int power=0;
		while(i<num)
		{
			i*=2;
			power++;
			if(num==i)return power;
		}
		return -1;//return -1 if not a positive power of two
	}
}
