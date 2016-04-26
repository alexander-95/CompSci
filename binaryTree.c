#include <stdio.h>

struct node
{
    int value;
    struct node* left;
    struct node* right;
};

int main()
{
    struct node* head = 0;

    printf("Hello World!\n");
    return 0;
}

void destroyTree(struct node* leaf)
{
    if(leaf!=0)
    {
        destroyTree(leaf->left);
        destroyTree(leaf->right);
        free(leaf);
    }
}

void insert(int key, struct node** leaf)
{
    if(*leaf==0)//insert into uninitialised leaf
    {
        *leaf = (struct node*) malloc(sizeof(struct node));
        (*leaf)->value = key;
        (*leaf)->left = 0;
        (*leaf)->right = 0;
    }
    else if(key<(*leaf)->value) insert(key, &(*leaf)->left);
    else if(key>(*leaf)->value) insert(key, &(*leaf)->right);
}

struct node* search(int key, struct node* leaf)
{
    if(leaf!=0)
    {
        if(key==leaf->value) return leaf;
        else if(key<leaf->value) return search(key, leaf->left);
        else return search(key, leaf->left);
    }
    else return 0;
}
