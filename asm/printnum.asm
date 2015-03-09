		section .data
			nl db 10
		section .bss

		section .text
			global _start:	;define starting point

		_start:				;method name
			mov eax, 234	;
			mov ebx, 10		;
			mov esi, 0

;push number onto the stack
loop1:		xor edx, edx	;reset edx
			div ebx			;
			add edx, 30h	;modulus goes to edx
			push edx		;push value onto stack
			inc esi
			cmp eax, 0
			je print1
			jmp loop1

;print the stack
print1:		mov eax, 4 		;system call
			mov ebx, 1 		;stdout
			mov ecx, esp	;print stack values
			mov edx, 1 		;length
			int 80h			;
			dec esi			;
			pop eax			;
			cmp esi, 0
			je done
			jmp print1

done:		mov eax, 4 		;system call
			mov ebx, 1 		;stdout
			mov ecx, nl		;
			mov edx, 1 		;length
			int 80h			;
			mov ax, 1 		;
			mov bx, 0		;
			int 80h			;