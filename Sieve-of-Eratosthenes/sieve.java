import java.util.Scanner;
public class sieve
{
	public static void main(String[] args)
	{
		findPrime(Integer.parseInt(args[0]));
	}
	public static int findPrime(int num)
	{
		int count=1;
		boolean prime[] = new boolean[num*num];//this array tells us if the index number is prime
		for(int i=2;i<prime.length;i++)prime[i]=true;//all numbers start off as prime
		for(int i=0;i<2;i++)prime[i]=false;//0 and 1 are not prime
		for(int i=3;i<prime.length;i+=2)//loop through the rest of the numbers
		{
			if(prime[i])//if a prime is found
			{
				count++;//increment the number of primes found
				if(count==num)
				{
					//System.out.println(i);//print the prime we want
					return i;	
				}
				for(int j=i*2;j<prime.length;j+=i)
				{
					if(prime[j])prime[j]=false;//set all multiples to false
				}
			}
		}
		return 0;
	}
}
