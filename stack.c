#include <stdio.h>
struct stack
{
    int sp; //stack pointer
    int data[10]; //array
};

int main()
{
    struct stack s;
    s.sp=10;
    int i=0;
    for(i=0;i<10;i++)s.data[i]=i*2;
    printf("hello\n");
    printf("%d\n",s.sp);
    for(i=0;i<10;i++)printf("%d\n",s.data[i]);
    return 0;
}
