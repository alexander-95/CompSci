#include <stdio.h>
struct node
{
	int data;
	struct node* next;
};

int main()
{
	struct node head;
	struct node second;
	head.data = 10;
	head.next = &second;
	second.data = 12;
	if(head.next!=NULL)printf("%d\n",head.next->data);
	return 0;
}

