#!/bin/bash

nasm -f elf $1.asm
ld -melf_i386 -s -o $1 $1.o
./$1