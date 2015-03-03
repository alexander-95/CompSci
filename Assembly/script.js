//Do not use i as a variable name for loops. It is already used as a variable name for a flag

//NOTE: all blocks of memory are 16 bits in size, including all registers, the stack and memory
//The only 8 bit segments are the high and low bytes of the main registers

//var stackPointer = 9;
var line = "";//the line of code
var label = "";//the label
var opcode = "";//the opcode
var operand = "";//the first operand
var operand2 = "";//the second operand

var currentBase=10;

var memory;//an array to store all values stored in memory
var size=0;//stores the size of the memory array
var stack = new Array(65536);//an array to store all variables stored on the stack

var ah=0,al=0;//accumulator register
var bh=0,bl=0;//base register
var ch=0,cl=0;//counter register
var dh=0,dl=0;//data register

var si=0,//source index
	di=0,//destination index
	bp=0,//base pointer
	sp=65535;//stack pointer

var ip=0;//instruction pointer

var cs=0,//code segment
	es=0,//extra segment
	ds=0,//data segment
	ss=0;//stack segment

var o=0,//overflow flag
	d=0,//direction flag
	i=0,//interupt flag
	t=0,//trap flag
	s=0,//sign flag
	z=0,//zero flag
	a=0,//auxilliary carry flag
	p=0,//parity flag
	c=0;//carry flag




/*
Operands can be of 5 types:
1. a value - use this as the operand
2. an address - 
3. a register - fetch the contents stored in the register as an operand
4. a pointer - 
5. a hex value

TO-DO:
1.  create boolean values to check the type of value
2.  create a variable to store the amount of RAM available [done]
3.  move the RAM table into a scrollable box [done]
4.  prevent the stack pointer from going < 0
5.  design a better layout
6.  bug fix for the stoopid peepo: AND with 65535 to set a 16 bit cap, 255 for 8 bit cap 
	and 65280 to take the first 8 bits
7.  add leading zeros for hex and bin mode
8.  add comments section
9.  add terminal/console window
10. check if memory starts at the correct address
11. remove all instances of ax,bx,cx and dx variables [done]

for each opcode, add comments containing the number of operands and their possible types
*/
var val=false;
var addr=false;
var reg=false;
var ptr=false;
var hex=false;

function refresh()
{
	//refresh the stack
	//This function should be scrapped in favour of the changeBase() function
	for(var j=0;j<65535-sp;j++)Stack.rows[j].cells[0].innerHTML = stack[j];
	for(var j=0;j<size;j++)Memory.rows[j].cells[0].innerHTML = memory[j];
}

function create()
{
	size = parseInt(memsize.value,10);
	memory=new Array(size);
	var table = Memory;//grab memory from html
	for(var j=0;j<size;j++)
	{
		var row = table.insertRow(j);//add a row  
		var cell1 = row.insertCell(0);//add a cell to that row
		var cell2 = row.insertCell(1);//add a second cell to display the address
		cell2.innerHTML=j.toString(16).toUpperCase()+"h";
	}
}

//TO-DO: fix this function
function checkVariable(variable)
{
	if(variable=='[0-9][0-9]*')val=true;//string only containing decimal digits
	//if(variable==)addr=true;//string starting with &
	if(variable=='AX|BX|CX|DX')reg=true;//string of length 2 containing letters
	//if(variable.charAt(variable.length()-1)=='*')ptr=true;//string ending with *
	//if(variable.charAt(0)=='#')hex=true;//string starting with #
}

//Changes the view to binary mode
function changeBase(j)
{
	AH.innerHTML=ah.toString(j);
	BH.innerHTML=bh.toString(j);
	CH.innerHTML=ch.toString(j);
	DH.innerHTML=dh.toString(j);

	AL.innerHTML=al.toString(j);
	BL.innerHTML=bl.toString(j);
	CL.innerHTML=cl.toString(j);
	DL.innerHTML=dl.toString(j);

	SI.innerHTML=si.toString(j);
	DI.innerHTML=di.toString(j);
	BP.innerHTML=bp.toString(j);
	SP.innerHTML=sp.toString(j);

	IP.innerHTML=ip.toString(j);

	CS.innerHTML=ip.toString(j);
	ES.innerHTML=ip.toString(j);
	DS.innerHTML=ip.toString(j);
	SS.innerHTML=ip.toString(j);

	//the following could be implemented in the one loop
	for(var k=0;k<65535-sp;k++)Stack.rows[k].cells[0].innerHTML = parseInt(stack[k]).toString(j);
	for(var k=0;k<size;k++)Memory.rows[k].cells[0].innerHTML = parseInt(memory[k]).toString(j);

	currentBase=j;
}

function execute()
{
	//The refresh function should be called after each execution

	line = document.getElementById("code").value;
	opcode = line;
	for(var i=0;i<line.length;i++)//extract the label
	{
		if(line.charAt(i)==':')
		{
			label=line.substring(0,i);
			opcode=line.substring(i+1,line.length);
			break;
		}
	}
	for(var i=0;i<opcode.length;i++)
	{
		if(opcode.charAt(i)==' ')//extract the opcode
		{
			operand=opcode.substring(i+1,opcode.length);
			opcode=opcode.substring(0,i);//extract the opcode
			break;
		}
		
	}
	for(var i=0;i<operand.length;i++)//extract the operands
	{
		if(operand.charAt(i)==',')
		{
			operand2=operand.substring(i+1,operand.length);
			operand=operand.substring(0,i);
			break;
		}
	}
	
	document.getElementById("separation").rows[1].cells[0].innerHTML = label;
	document.getElementById("separation").rows[1].cells[1].innerHTML = opcode;
	document.getElementById("separation").rows[1].cells[2].innerHTML = operand;
	document.getElementById("separation").rows[1].cells[3].innerHTML = operand2;

	checkVariable(operand);
	if(val)debug.innerHTML="variable is a value";
	else if(reg)debug.innerHTML="variable is a register";
	
/*	
	adc		Add with carry flag
	add		Add two numbers
	and		Bitwise logical AND
	call	Call procedure or function
	cbw		Convert byte to word (signed)
	cli		Clear interrupt flag (disable interrupts)
	cwd		Convert word to doubleword (signed)
	cmp		Compare two operands
	dec		Decrement by 1
	div		Unsigned divide
	idiv	Signed divide
	imul	Signed multiply
	in		Input (read) from port
	inc		Increment by 1
	int		Call to interrupt procedure
	iret	Interrupt return
	j??		Jump if ?? condition met
	jmp		Unconditional jump
	lea		Load effective address offset
	mov		Move data
	mul		Unsigned multiply
	neg		Two's complement negate
	nop		No operation
	not		One's complement negate
	or		Bitwise logical OR
	out		Output (write) to port
	pop		Pop word from stack
	popf	Pop flags from stack
	push	Push word onto stack
	pushf	Push flags onto stack
	ret		Return from procedure or function
	sal		Bitwise arithmetic left shift (same as shl)
	sar		Bitwise arithmetic right shift (signed)
	sbb		Subtract with borrow
	shl		Bitwise left shift (same as sal)
	shr		Bitwise right shift (unsigned)
	sti		Set interrupt flag (enable interrupts)
	sub		Subtract two numbers
	test	Bitwise logical compare
	xor		Bitwise logical XOR
*/

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="ADC")
	{
		switch(operand2)//take data from any of the following registers or the operand itself
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    operand2+=cf;//add on the carry flag
	    switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah+=(operand2>>8);al+=(operand2&255);break;
	    	case "BX":bh+=(operand2>>8);bl+=(operand2&255);break;
	    	case "CX":ch+=(operand2>>8);cl+=(operand2&255);break;
	    	case "DX":dh+=(operand2>>8);dl+=(operand2&255);break;
	    	case "AH":ah+=(operand2&255);break;
	    	case "BH":bh+=(operand2&255);break;
	    	case "CH":ch+=(operand2&255);break;
	    	case "DH":dh+=(operand2&255);break;
	    	case "AL":al+=(operand2&255);break;
	    	case "BL":bl+=(operand2&255);break;
	    	case "CL":cl+=(operand2&255);break;
	    	case "DL":dl+=(operand2&255);break;
	    }

	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="ADD")
	{
		switch(operand2)//take data from any of the following registers or the operand itself
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah+=(operand2>>8);al+=(operand2&255);break;
	    	case "BX":bh+=(operand2>>8);bl+=(operand2&255);break;
	    	case "CX":ch+=(operand2>>8);cl+=(operand2&255);break;
	    	case "DX":dh+=(operand2>>8);dl+=(operand2&255);break;
	    	case "AH":ah+=(operand2&255);break;
	    	case "BH":bh+=(operand2&255);break;
	    	case "CH":ch+=(operand2&255);break;
	    	case "DH":dh+=(operand2&255);break;
	    	case "AL":al+=(operand2&255);break;
	    	case "BL":bl+=(operand2&255);break;
	    	case "CL":cl+=(operand2&255);break;
	    	case "DL":dl+=(operand2&255);break;
	    }
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="AND")
	{
		switch(operand2)//take data from any of the following registers or the operand itself
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah&=(operand2>>8);al&=(operand2&255);break;
	    	case "BX":bh&=(operand2>>8);bl&=(operand2&255);break;
	    	case "CX":ch&=(operand2>>8);cl&=(operand2&255);break;
	    	case "DX":dh&=(operand2>>8);dl&=(operand2&255);break;
	    	case "AH":ah&=(operand2&255);break;
	    	case "BH":bh&=(operand2&255);break;
	    	case "CH":ch&=(operand2&255);break;
	    	case "DH":dh&=(operand2&255);break;
	    	case "AL":al&=(operand2&255);break;
	    	case "BL":bl&=(operand2&255);break;
	    	case "CL":cl&=(operand2&255);break;
	    	case "DL":dl&=(operand2&255);break;
	    }
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="CALL")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="CBW")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="CLI")
	{
	
	}


	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="CMP")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="CWD")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="DEC")
	{
		switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah=(((ah<<8)+al)-1)>>8;al=(((ah<<8)+al)-1)&255;break;//ax=(((ah<<8)+al)+1)
	    	case "BX":bh=(((bh<<8)+bl)-1)>>8;bl=(((bh<<8)+bl)-1)&255;break;
	    	case "CX":ch=(((ch<<8)+cl)-1)>>8;cl=(((ch<<8)+cl)-1)&255;break;
	    	case "DX":dh=(((dh<<8)+dl)-1)>>8;dl=(((dh<<8)+dl)-1)&255;break;
	    	case "AH":ah--;break;
	    	case "BH":bh--;break;
	    	case "CH":ch--;break;
	    	case "DH":dh--;break;
	    	case "AL":al--;break;
	    	case "BL":bl--;break;
	    	case "CL":cl--;break;
	    	case "DL":dl--;break;
	    }
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="DIV")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="IDIV")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="IMUL")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="IN")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="INC")
	{
		switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah=(((ah<<8)+al)+1)>>8;al=(((ah<<8)+al)+1)&255;break;//ax=(((ah<<8)+al)+1)
	    	case "BX":bh=(((bh<<8)+bl)+1)>>8;bl=(((bh<<8)+bl)+1)&255;break;
	    	case "CX":ch=(((ch<<8)+cl)+1)>>8;cl=(((ch<<8)+cl)+1)&255;break;
	    	case "DX":dh=(((dh<<8)+dl)+1)>>8;dl=(((dh<<8)+dl)+1)&255;break;
	    	case "AH":ah++;break;
	    	case "BH":bh++;break;
	    	case "CH":ch++;break;
	    	case "DH":dh++;break;
	    	case "AL":al++;break;
	    	case "BL":bl++;break;
	    	case "CL":cl++;break;
	    	case "DL":dl++;break;
	    }
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="INT")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="IRET")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="JCC")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="JCXZ")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="JMP")
	{
	
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="LEA")
	{
	
	}


	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="MOV")
	{
		switch(operand2)//take data from one of the following registers or the operand itself
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    switch(operand)//move the data into any one of the following registers
	    {
	    	case "AX":ah=(operand2>>8);al=operand2&255;break;
	    	case "BX":bh=(operand2>>8);bl=operand2&255;break;
	    	case "CX":ch=(operand2>>8);cl=operand2&255;break;
	    	case "DX":dh=(operand2>>8);dl=operand2&255;break;
	    	case "AH":ah=operand2&255;break;
	    	case "BH":bh=operand2&255;break;
	    	case "CH":ch=operand2&255;break;
	    	case "DH":dh=operand2&255;break;
	    	case "AL":al=operand2&255;break;
	    	case "BL":bl=operand2&255;break;
	    	case "CL":cl=operand2&255;break;
	    	case "DL":dl=operand2&255;break;
	    }
	}

	/*
		Number of operands:
		Possibilities for operand1: a
									a
		Possibilities for operand2: a
								
	 */
	else if(opcode.toUpperCase()=="MUL")
	{
	
	}
	else if(opcode.toUpperCase()=="NEG")
	{
		switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah=~ah+1;al=~al+1;break;
	    	case "BX":bh=~bh+1;bl=~bl+1;break;
	    	case "CX":ch=~ch+1;cl=~cl+1;break;
	    	case "DX":dh=~dh+1;dl=~dh+1;break;
	    	case "AH":ah=~ah+1;break;
	    	case "BH":bh=~bh+1;break;
	    	case "CH":ch=~ch+1;break;
	    	case "DH":dh=~dh+1;break;
	    	case "AL":al=~al+1;break;
	    	case "BL":bl=~bl+1;break;
	    	case "CL":cl=~cl+1;break;
	    	case "DL":dl=~dl+1;break;
	    }
	}
	else if(opcode.toUpperCase()=="NOP")
	{
		//fully implemented nop
	}
	else if(opcode.toUpperCase()=="NOT")
	{
		switch(operand)//store the result in one of the following registers
	    {
	    	case "AX":ah=~ah;al=~al;break;
	    	case "BX":bh=~bh;bl=~bl;break;
	    	case "CX":ch=~ch;cl=~cl;break;
	    	case "DX":dh=~dh;dl=~dh;break;
	    	case "AH":ah=~ah;break;
	    	case "BH":bh=~bh;break;
	    	case "CH":ch=~ch;break;
	    	case "DH":dh=~dh;break;
	    	case "AL":al=~al;break;
	    	case "BL":bl=~bl;break;
	    	case "CL":cl=~cl;break;
	    	case "DL":dl=~dl;break;
	    }
	}
	else if(opcode.toUpperCase()=="OR")
	{
		switch(operand2)
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    switch(operand)//store the result in any one of the following registers
	    {
	    	case "AX":ah|=(operand2>>8);al|=(operand2&255);break;
	    	case "BX":bh|=(operand2>>8);bl|=(operand2&255);break;
	    	case "CX":ch|=(operand2>>8);cl|=(operand2&255);break;
	    	case "DX":dh|=(operand2>>8);dl|=(operand2&255);break;
	    	case "AH":ah|=(operand2&255);break;
	    	case "BH":bh|=(operand2&255);break;
	    	case "CH":ch|=(operand2&255);break;
	    	case "DH":dh|=(operand2&255);break;
	    	case "AL":al|=(operand2&255);break;
	    	case "BL":bl|=(operand2&255);break;
	    	case "CL":cl|=(operand2&255);break;
	    	case "DL":dl|=(operand2&255);break;
	    }
	}
	else if(opcode.toUpperCase()=="OUT")
	{
	
	}
	else if(opcode.toUpperCase()=="POP")
	{
		switch(operand)
	    {
	    	case "AX":ah=(stack[65535-sp]>>8);al=(stack[65535-sp]&255);break;
	    	case "BX":bh=(stack[65535-sp]>>8);bl=(stack[65535-sp]&255);break;
	    	case "CX":ch=(stack[65535-sp]>>8);cl=(stack[65535-sp]&255);break;
	    	case "DX":dh=(stack[65535-sp]>>8);dl=(stack[65535-sp]&255);break;
	    	case "AH":ah=(stack[65535-sp]&255);break;
	    	case "BH":bh=(stack[65535-sp]&255);break;
	    	case "CH":ch=(stack[65535-sp]&255);break;
	    	case "DH":dh=(stack[65535-sp]&255);break;
	    	case "AL":al=(stack[65535-sp]&255);break;
	    	case "BL":bl=(stack[65535-sp]&255);break;
	    	case "CL":cl=(stack[65535-sp]&255);break;
	    	case "DL":dl=(stack[65535-sp]&255);break;
	    }
	    sp++;//increment stack pointer
	    SP.innerHTML=sp;//refresh the stack pointer
	}
	else if(opcode.toUpperCase()=="POPF")
	{
	
	}

	/*
		Any 16 bit value can be pushed onto the stack
	*/
	else if(opcode.toUpperCase()=="PUSH")
	{
		var table = Stack;//grab the stack from html
	    var row = table.insertRow(65535-sp);//add a row
	    var cell1 = row.insertCell(0);//add a cell to that row
	    switch(operand)
	    {
	    	case "AX":operand=(ah<<8)+al;break;
	    	case "BX":operand=(bh<<8)+bl;break;
	    	case "CX":operand=(ch<<8)+cl;break;
	    	case "DX":operand=(dh<<8)+dl;break;
	    	case "SI":operand=si;break;
	    	case "DI":operand=di;break;
	    	case "BP":operand=bp;break;
	    	case "SP":operand=sp;break;
	    }


	    stack[65535-sp]=operand;//push value onto the stack
	    sp--;//decrement stack pointer
	    SP.innerHTML=sp;//refresh the stack pointer
	}
	else if(opcode.toUpperCase()=="PUSHF")
	{
	
	}
	
	else if(opcode.toUpperCase()=="RET")
	{
	
	}
	else if(opcode.toUpperCase()=="SAL")
	{
	
	}
	else if(opcode.toUpperCase()=="SAR")
	{
	
	}
	else if(opcode.toUpperCase()=="SBB")
	{
	
	}
	else if(opcode.toUpperCase()=="SHL")
	{
	
	}
	else if(opcode.toUpperCase()=="SHR")
	{
	
	}
	else if(opcode.toUpperCase()=="STI")
	{
	
	}
	else if(opcode.toUpperCase()=="SUB")
	{
	
	}
	else if(opcode.toUpperCase()=="TEST")
	{
	
	}
	else if(opcode.toUpperCase()=="XOR")
	{
		switch(operand2)
	    {
	    	case "AX":operand2=(ah<<8)+al;break;
	    	case "BX":operand2=(bh<<8)+bl;break;
	    	case "CX":operand2=(ch<<8)+cl;break;
	    	case "DX":operand2=(dh<<8)+dl;break;
	    	case "AH":operand2=ah;break;
	    	case "BH":operand2=bh;break;
	    	case "CH":operand2=ch;break;
	    	case "DH":operand2=dh;break;
	    	case "AL":operand2=al;break;
	    	case "BL":operand2=bl;break;
	    	case "CL":operand2=cl;break;
	    	case "DL":operand2=dl;break;
	    	case "SI":operand2=si;break;
	    	case "DI":operand2=di;break;
	    	case "BP":operand2=bp;break;
	    	case "SP":operand2=sp;break;
	    }
	    switch(operand)
	    {
	    	case "AX":ah^=(operand2>>8);al^=(operand2&255);break;
	    	case "BX":bh^=(operand2>>8);bl^=(operand2&255);break;
	    	case "CX":ch^=(operand2>>8);cl^=(operand2&255);break;
	    	case "DX":dh^=(operand2>>8);dl^=(operand2&255);break;
	    	case "AH":ah^=(operand2&255);break;
	    	case "BH":bh^=(operand2&255);break;
	    	case "CH":ch^=(operand2&255);break;
	    	case "DH":dh^=(operand2&255);break;
	    	case "AL":al^=(operand2&255);break;
	    	case "BL":bl^=(operand2&255);break;
	    	case "CL":cl^=(operand2&255);break;
	    	case "DL":dl^=(operand2&255);break;
	    }
	}
	changeBase(currentBase);//update the view after each execution
}
document.getElementById("execute").onclick = execute;
document.getElementById("refresh").onclick = refresh;
document.getElementById("create").onclick = create;
bin.onclick = changeBase(2);
dec.onclick = changeBase(10);
hex.onclick = changeBase(16);