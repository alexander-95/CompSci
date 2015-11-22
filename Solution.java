import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;


public class Solution {

	//The class Graph is used to represent and handle a Graph (ie a Network)
	public static class Graph {

		//A graph consists of nodes and links
		private static class Node implements Comparable<Node> {

			//Each node is identified by a label
			private String label_;
			//Each node stores a map of adjacent links with their costs
			private Map<Node, Integer> links_;

			//Each node keeps track of the current cost from a source node to itself
			private int tmp_cost_;
			//Each node keeps track of the source of the incoming link that lead to the current cost
			private Node ingoing_;

			//Constructor from label
			public Node(String label){
				this.label_ = label;
				this.links_ = new HashMap<Node, Integer>();
				this.resetCost();
			}

			//Setters, getters
			public void setIngoing(Node n){
				this.ingoing_ = n;
			}
			public Node getIngoing(){
				return this.ingoing_;
			}
			public String getLabel(){
				return this.label_;
			}
			public int getCurrentCost(){
				return this.tmp_cost_;
			}
			public void setCurrentCost(int cost){
				this.tmp_cost_ = cost;
			}

			//Add an adjacent link
			public void addLink(Node node, int cost){
				this.links_.put(node, new Integer(cost));
			}

			//Reset the current cost to +Inf
			public void resetCost(){
				this.tmp_cost_ = Integer.MAX_VALUE;
			}

			//Returns true is this node has the given label, returns false otherwise
			public boolean hasLabel(String label){
				return label.equals(this.label_);
			}

			//Returns true if this node has a link to the given node
			public boolean hasLink(Node to){
				return this.links_.containsKey(to);
			}

			//Returns the cost of the link from this node to the given node
			public int getLinkCost(Node to){
				if(this.hasLink(to)){
					return this.links_.get(to).intValue();
				} else {
					return Integer.MAX_VALUE;
				}
			}

			//Override compareTo to made node comparable (by cost)
			@Override
			public int compareTo(Node arg0) {
				if(this.tmp_cost_ > arg0.tmp_cost_) {
					return 1;
				} else {
					if(this.tmp_cost_ < arg0.tmp_cost_) {
						return -1;
					} else {
						return (this.tmp_cost_ == arg0.tmp_cost_ ? 0 : 1);
					}
				}
			}

		} //end class Node

		//A Graph consists of a list of nodes
		private List<Node> nodes_;

		//The algorithm must keep track of the visited nodes
		//Here we keep track of the non-visited nodes
		private Set<Node> unvisited_;

		//Constructor
		//After construction the Graph is empty !!!!!!
		public Graph(){
			this.nodes_ = new LinkedList<Node>();
			this.unvisited_ = new HashSet<Node>();
		}

		//Init and add a node to this graph
		public void addNode(String label){
			this.nodes_.add(new Node(label));
		}

		//Add a link between two nodes
		public void addLink(String from_label, String to_label, int cost){
			/* ... */
		}

		//Add all the current nodes to the set of unvisited nodes
		public void initUnvisited(){
			this.unvisited_.clear();
			Iterator<Node> it = this.nodes_.iterator();
			while(it.hasNext()){
				Node n = it.next();
				this.unvisited_.add(n);
			}
		}

		//Removes the node that corresponds to the given label from the
		//set of unvisited nodes
		public void removeVisited(String label){
			Node n = this.getNodeWithLabel(label);
			this.unvisited_.remove(n);
		}

		//Returns the node with the given label
		public Node getNodeWithLabel(String label){
			Iterator<Node> it = this.nodes_.iterator();
			while(it.hasNext()){
				Node n = it.next();
				if(n.hasLabel(label)){
					return n;
				}
			}
			return null;
		}

		//Resets all the node costs of this graph
		public void resetCosts(){
			Iterator<Node> it = this.nodes_.iterator();
			while(it.hasNext()){
				Node n = it.next();
				n.resetCost();
			}
		}

		//Setter
		public void setNodeCurrentCost(String label, int cost){
			Node n = this.getNodeWithLabel(label);
			n.setCurrentCost(cost);
		}


		//Print the current costs for each node of the graph
		public String toString(){
			String s="";
			Iterator<Node> it = this.nodes_.iterator();
			while(it.hasNext()){
				Node n = it.next();
				int cost = n.getCurrentCost();
				String cost_string;
				if(cost==Integer.MAX_VALUE){
					cost_string="+Inf";
				} else {
					cost_string=""+cost;
				}
				s+=n.getLabel()+":"+cost_string+" ";
			}
			return s;
		}

		//Returns true if the node that corresponds to the given label has not been visited
		public boolean isUnvisited(String label){
			Node n = this.getNodeWithLabel(label);
			return this.unvisited_.contains(n);
		}

		//Sorts the unvisited nodes by cost and returns the one with the smallest cost
		public String getUnivisitedNodewithSmallestCurrentCost(){
			TreeSet<Node> sortedSet = new TreeSet<Node>(this.unvisited_);
			return sortedSet.first().getLabel();
		}


		//Update of the costs from the node that corresponds to the given label
		public void updateCosts(String from_label){
                             /* ... */
		}


	}//end class Graph

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {

	    /* Enter your code here. Read input from STDIN. Print output to STDOUT*/

		//Read stdin
		Graph g = new Graph();
		Scanner s = new Scanner(System.in);
		int cpt=0;
		boolean go = true;
		while(go){
			String line = s.nextLine();
			Scanner s2 = new Scanner(line);
			if (cpt==0){
				//First line = list of nodes
				while(s2.hasNext()){
					String label = s2.next();
					/* ... */
					String[] labels = label.split(" ");
					Graph dijkstra = new Graph();
					for(int i = 0; i<labels.length; i++)
					{
						//System.out.println(labels[i]);
						dijkstra.addNode(labels[i]);
					}
				}
			} else {
				//Each other line is a link
				String from_label = s2.next();
				if(from_label.equals(".")){
					go=false;
				} else {
					String to_label = s2.next();
					int cost = s2.nextInt();
					dijkstra.getNodeWithLabel(from_label).addLink(dijkstra.getNodeWithLabel(to_label), cost);
					/* ... */
				}

			}
			cpt++;
		}
		s.close();

		//Init
		//Reset all costs
		String source = "A";
		String dest = "Z";
                /* ... */


		//Loop
                /* ... */

		//Retrieve the least-cost path from destination to source
		/* ... */

	}//end main

}//end class Solution
