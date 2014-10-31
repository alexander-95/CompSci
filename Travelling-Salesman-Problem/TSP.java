public class TSP
{
	public static String[] contents;//strings of town data from csv file
	public static String[] number;//town numbers
	public static String[] name;//town names
	public static double[] latitude;//town latitudes
	public static double[] longitude;//town longitudes
	public static double radius = 6371.1;//radius of the earth
	public static double[][] matrix;//adjacency matrix
	public static boolean[] visited;//was a town visited or not

	public static int[] path;//path travelled as an array of ints
	public static double distance =0;//distance travelled

	public static void main(String[] args)
	{
		long time = System.currentTimeMillis();//start the stopwatch
		FileIO reader = new FileIO();//Phils IO
		contents = reader.load(args[0]);//get the CSV file using the name as an argument
		number = new String[contents.length];
		name = new String[contents.length];
		latitude = new double[contents.length];
		longitude = new double[contents.length];
		matrix = new double[contents.length][contents.length];
		visited = new boolean[contents.length];
		path = new int[contents.length+1];

		int[] bestPath = new int[path.length];
		double bestDistance = 5000;

		for(int i=0;i<contents.length;i++)//break down the data
		{
			number[i] = contents[i].substring(0,contents[i].indexOf(','));
			contents[i] = contents[i].substring(contents[i].indexOf(',')+1,contents[i].length());
			name[i] = contents[i].substring(0,contents[i].indexOf(','));
			contents[i] = contents[i].substring(contents[i].indexOf(',')+1,contents[i].length());
			latitude[i] = Double.parseDouble(contents[i].substring(0,contents[i].indexOf(',')));
			latitude[i] = Math.toRadians(latitude[i]);
			contents[i] = contents[i].substring(contents[i].indexOf(','+1),contents[i].length());
			longitude[i] = Double.parseDouble(contents[i]);
			longitude[i] = Math.toRadians(longitude[i]);
		}
		System.out.println("Towns loaded."+(System.currentTimeMillis()-time)+"ms");
		for(int i=0;i<contents.length;i++)//fill out the adjacency matrix
		{
			for(int j=0;j<contents.length;j++)
			{
				if(i==j)matrix[i][j]=-1;//if the towns are the same
				else matrix[i][j]=getDistance(i,j);
			}
		}
		System.out.println("Matrix Loaded."+(System.currentTimeMillis()-time)+"ms");
		double shortestPath=5000;//set a target to get lower than
		int j=0;
		/*for(int i=0;i<contents.length;i++)//for every town on the map do nearest neighbour
		{
			nearestNeighbourAlgorithm(i);//make each town the starting point
			if (distance<shortestPath)
			{
				shortestPath=distance;//keep track of the shortest path found
				j=i;
			}
		}
		nearestNeighbourAlgorithm(j);
		System.out.println(System.currentTimeMillis()-time+"ms");
		j++;//is there any need for this line?*/
		for(int t=0;t<contents.length;t++)
		{
			shortestPath=5000;
			nearestNeighbourAlgorithm(t);
		for(int n=0;n<2;n++)
		{
			for(int i=0;i<contents.length;i++)
			{
				int[]pathBackup=new int[path.length];//make a backup of the path
				for(int p=0;p<path.length;p++)pathBackup[p]=path[p];
				joinToNeighbour(i);//reverse every possible path
				pathDistance();
				if(distance<shortestPath)
				{
					n=0;
					//System.out.println("Joined to Neighbour:");
					//printPath();
					shortestPath=distance;//is the path shorter
				}
				else
				{
					for(int k=0;k<pathBackup.length;k++)path[k]=pathBackup[k];
				}
			}
			for(int i=0;i<contents.length;i++)
			{
				for(int k=i;k<contents.length;k++)
				{
					reverse(i,k);//reverse every possible path
					pathDistance();
					if(distance<shortestPath)
					{
						n=0;
						//System.out.println("2-opt:");
						shortestPath=distance;//is the path shorter
						//printPath();
					}
					else reverse(i,k);//cange back if not
				}
			}
			for(int i=0;i<contents.length;i++)
			{
				for(int k=0;k<contents.length;k++)
				{
					moveTown(i,k);
					pathDistance();
					if(distance<shortestPath)
					{
						n=0;
						//System.out.println("Town moved:");
						//printPath();
						shortestPath=distance;
					}
					else moveTown(k,i);
				}
			}
			if(n==2)
			{
				for(int i=0;i<contents.length;i++)
				{
					for(int k=i;k<contents.length;k++)
					{
						for(int l=0;l<contents.length;l++)
						{
							moveTownArray(i,k,l);
							pathDistance();
							if(distance<shortestPath)
							{
								n=0;
								//System.out.println("Town Array moved");
								//printPath();
								shortestPath=distance;
							}
							else moveTownArray(l,l+(k-i),i);
						}
					}
				}
			}

			//System.out.println(n+"\n"+(System.currentTimeMillis()-time)+"ms");
		}
		if(distance<bestDistance)
		{
			//n=0;
			//System.out.println("Joined to Neighbour:");
			printPath();
			bestDistance=distance;//is the path shorter
			System.out.println((System.currentTimeMillis()-time)+"ms");
		}
		}
	}
	public static double getDistance(int i,int j)//gets the distance using the haversin function
	{
		double lat=latitude[j]-latitude[i];
		double lon=longitude[j]-longitude[i];
		return 2*radius*Math.asin(Math.sqrt(haversin(lat)+(Math.cos(latitude[i])*Math.cos(latitude[j])*haversin(lon))));
	}
	public static double haversin(double theta)
	{
		double i=Math.sin(theta/2)*Math.sin(theta/2);
		return i;
	}
	public static int nearestNeighbour(int town)
	{
		int neighbour = 0;
		for(int i=0;i<visited.length;i++)
		{
			if(visited[i]==false)
			{
				neighbour=i;
				i=visited.length;
			}
		}
		if(town==0)neighbour++;
		for(int i=0;i<matrix.length;i++)
		{
			if(matrix[i][town]<=matrix[neighbour][town]&&matrix[i][town]>-1&&visited[i]==false)neighbour=i;
		}
		return neighbour;
	}
	public static void nearestNeighbourAlgorithm(int start)//nearest neighbour
	{
		for(int i=0;i<visited.length;i++)visited[i]=false;
		int currentTown = start;
		for(int i=0;i<contents.length;i++)
		{
			path[i]=currentTown;
			visited[currentTown]=true;
			currentTown=nearestNeighbour(currentTown);
		}
		path[contents.length]=start;
		pathDistance();
	}
	public static void printPath()//print the path
	{
		for(int i=0;i<path.length;i++)
		{
			System.out.print((path[i]+1)+".");
		}
		System.out.println();
		pathDistance();
		System.out.println("Distance:"+distance);
	}
	public static void pathDistance()//calculate the length of the path travelled
	{
		distance=0;
		for(int i=1;i<path.length;i++)distance+=getDistance(path[i-1],path[i]);
	}
	public static int pathIndex(int town)//finds where a town is in the path
	{
		for(int i=0;i<path.length;i++)
		{
			if(town==path[i])return i;
		}
		return 0;
	}
	public static void reverse(int a,int b)//reverse the path between point a and b
	{
		int[] section = new int[(b+1)-a];//array for the reversed section
		for(int i=0;i<section.length;i++)section[i]=path[(b-i)%(path.length-1)];
		for(int i=0;i<section.length;i++)path[(a+i)%(path.length-1)]=section[i];
		path[path.length-1]=path[0];
	}
	public static void moveTown(int a, int b)//move town in slot a to slot b
	{
		int backup=path[a];
		if(a<b)
		{
			for(int i=a;i<b;i++)path[i]=path[i+1];
			path[b]=backup;
		}
		else
		{
			for(int i=a;i>b;i--)path[i]=path[i-1];
			path[b]=backup;
		}
		path[contents.length]=path[0];
	}
	public static void moveTownArray(int a, int b, int c)//move town array a to b up to c
	{
		int backup[] = new int[b-a];
		for(int i=0;i<backup.length;i++)
		{
			moveTown(a%path.length,c%path.length);
		}
		path[contents.length]=path[0];
	}
	public static void joinToNeighbour(int i)//joins a town to his nearest Neighbour
	{
		int j=nearestNeighbour(i);
		int k=pathIndex(i);
		if(k==0)k=path.length-1;
		double dist2=getDistance(path[k-1],i);//The first town that town i is joined to
		double dist1=getDistance(path[(k+1)%path.length],i);//The second town that town i is joined to
		if(dist1>dist2)//if the first town is nearer
		{
			if(k+1>j)reverse(j,(k+1)%path.length);//break the longer link
			else if(k+1<j)reverse((k+1)%path.length,j);
		}
		else//if the second town is nearer
		{
			if(k-1>j)reverse(j,k-1);//break the longer link
			else if(k-1<j)reverse(k-1,j);
		}
		path[contents.length]=path[0];
	}
}
