using System;

namespace sieve
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			findPrime(Convert.ToInt32(args[0]));
		}
		public static int findPrime(int num)
		{
			int count = 1;
			//int num = 10000;
			int length=num*num;
			bool[] prime = new bool[length];//this array tells us if the index number is prime
			for (int i=2; i<length; i++)prime[i]=true;//all numbers start off as prime
			for(int i=0;i<2;i++)prime[i]=false;//0 and 1 are not prime
			for(int i=3;i<length;i+=2)//loop through the rest of the numbers
			{
				if(prime[i])// if a prime number is found
				{
					count++;//increment the number of primes found
					if(count==num)
					{
						//Console.WriteLine(i);//print the prime we want
						return i;
					}
					for(int j=i*2;j<length;j+=i)
					{
						if(prime[j])prime[j]=false;//set all multiples to false
					}
				}
			}
			return 0;
		}
	}
}
