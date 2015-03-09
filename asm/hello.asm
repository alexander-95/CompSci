		section .data
			msg:	db "Hello,World!$"

		section .bss

		section .text
			global _start:
			[BITS 16]
		_start:
			mov bx, msg	;load first character
back:		mov dx, [bx]	;
			
			cmp dl, '$'		;compare to end
			jz done
			mov ah, 4		;system write
			int 80h

			inc bx			;move to next character
			jmp back

done:		nop
			
			mov ax, 1
			mov bx, 0
			int 80h
