#include<iostream>
using namespace std;

int toInt(char a[])//method found on the internet.Why reinvent the wheel?
{
	int c, sign, offset, n;
	if (a[0] == '-')sign = -1;// Handle negative integers
	if (sign == -1)offset = 1;// Set starting position to convert 
	else offset = 0;
	n = 0;
	for (c = offset; a[c] != '\0'; c++)n = n * 10 + a[c] - '0';
	if (sign == -1)n = -n;
	return n;
}int main(int argc, char *argv[])
{
	register unsigned int num=toInt(argv[1]),length=num*num,count=1,i,j;
	bool *prime=new bool[length];//this array tells us if the index number is prime
	for(i=2;i<length;i++)prime[i]=true;//all numbers start off as prime
	prime[0]=false;//0 and 1 are not prime
	prime[1]=false;
	for(i=3;i<length;i+=2)//loop through the rest of the numbers
	{
		if(prime[i])//if a prime is found
		{
			count++;//increment the number of primes found
			if(count==num)
			{
				//printf("%d \n",i);//print the prime we want
				delete[] prime;//free(prime);
				return i;
			}
			for(j=i*2;j<length;j+=i)//for every multiple of the prime found
			{
				if(prime[j])prime[j]=false;//set all multiples to false
			}
		}
	}
	delete[] prime;//free(prime);
	return 0;
	
}
