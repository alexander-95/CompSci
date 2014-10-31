#!/bin/bash
#Script for running the Sieve of Eratosthenes in multiple languages on different data sets

#compile programs
cc sieve.c -o sievec
javac sieve.java
gmcs sieve.cs # C# is compiled and run using mono 
g++ -o sieve sieve.cpp
echo compiled

count=1000
echo C,Java,C#,C++
while [ $count -lt 20000 ]; do #find the nth prime number, where n=count

	time=`date +%s%3N`
	./sievec $count
	total=$((`date +%s%3N`-time))
	echo -n $total,
	#echo it took C $total ms to compute
	
	time=`date +%s%3N`
	java sieve $count
	total=$((`date +%s%3N`-time))
	echo -n $total,
	#echo it took java $total ms to compute
	
	time=`date +%s%3N`
	mono sieve.exe $count
	total=$((`date +%s%3N`-time))
	echo -n $total,
	#echo it took C# $total ms to compute
	
	time=`date +%s%3N`
	./sieve $count
	total=$((`date +%s%3N`-time))
	echo $total
	#echo it took C++ $total ms to compute
	
	count=$[$count+1000]
done
