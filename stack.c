#include <stdio.h>
struct stack
{
    int sp; //stack pointer
    int data[10]; //array
};

void initialiseStack(struct stack* S)
{
	S->sp = 0;
	int i = 0;
    for(i=0;i<10;i++)S->data[i]=0;
}

void printStack(struct stack* S)
{
	int i = 0;
	for(i=0;i<S->sp;i++)printf("%d\n",S->data[i]);
	printf("sp = %d\n",S->sp);
}

void push(struct stack* S, int n)
{
	if(S->sp<10)S->data[S->sp++] = n;
	else printf("Shaq Ogreflow\n");
}

void pop(struct stack* S)
{
	if(S->sp<10)S->data[S->sp--] = 0;
}

int main()
{
	int i = 0;
	struct stack s;
	initialiseStack(&s);
	for(i=0;i<5;i++)push(&s, i*5);
    printStack(&s);
	return 0;
}
