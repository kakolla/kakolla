#### building a compiler pt 1

Here are some notes I've made on learning how to build a compiler following this paper: http://scheme2006.cs.uchicago.edu/11-ghuloum.pdf.

CPUs are designed to run instructions in machine code.
Machine code has simple instructions.
This code is retrieved in the 'fetch' stage of the fetch, decode, execute cycle. 

A compiler bridges the gap between high-level programming languages and the instructions needed
for the CPU to run. We need a source language as well as a compiler to compile that source language to machine code. This time I'll try to build a compiler that compiles C code into Assembly (which is human readable) that will be assembled into true machine code. The compiler will be implemented in C++. 

First let's look at what the gcc compiler outputs when compiling C code. 

If we have a file test.c
```cpp
#include <stdio.h>

int main() {
    return 3; 
}
```

and add the -S flag when compiling 
```
$ gcc -S test.c
```

We get the following (a lot of stuff is ARM64 specific)
```
	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 15, 0	sdk_version 15, 4
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:
	sub	sp, sp, #16
	.cfi_def_cfa_offset 16
	str	wzr, [sp, #12]
	mov	w0, #3                          ; =0x3
	add	sp, sp, #16
	ret
	.cfi_endproc
                                        ; -- End function
.subsections_via_symbols
```

The only important stuff is the "mov w0, #3" part. This is saying to load the value 3 into `w0`, which is the return value of the main function. And then we return from the function with 'ret'.

What we can first try to do is make our compiler take an integer as an input, and output this really straight-forward Assembly code for the CPU.
```cpp
// imports
std::string c_entry(int x) {
    std::string res = "mov w0, #" + std::to_string(x) + "\nret\n";
    std::cout << res << std::endl;
    return res;
}
```

And then we can call it within the same file in a main method
```cpp
int main() {
    std::string asm_code = c_entry(31415); // generate assembly code 
    std::ofstream output_stream("c_entry.s");
    output_stream << ".globl _c_entry\n" // tells assembler that c_entry is global and visible to the linker
        << "_c_entry:\n" // the function name
        << asm_code; // the Assembly code
}
```

So if we compile and run it with
```
$ g++ c_entry.cpp -o c_entry
$ ./c_entry
```

We will get a file c_entry.s with Assembly code for our function c_entry (from the main method).

Then we use the assembler to take this Assembly code and create an object (.o file). Object files like this are processed by the linker to create the final executable. Let's run
```
as c_entry.s -o c_entry.o
```

Now to test/run this compiled function (in the .o compiled file) let's create a file test_driver.cpp to reference and run it.
```cpp
// imports
extern "C" int c_entry(); // tells compiler to use C-linkage for function in the .o file

using namespace std;
int main(int argc, char** argv) {
    std::cout << c_entry() << std::endl; // use function
    return 0;   
}
```

Compile the test_driver using c_entry.o with
```
g++ test_driver.cpp c_entry.o -o test_driver
```

And run test_driver
```
./test_driver
```

To get
$$\text{31415}$$

So the flow has been:
- Compile the c_entry function to Assembly by simply writing to a .s file in C++
- Use the as assembler to assemble the .s file into a .o file
- Use the .o file in the test file to run the function (and get 31415)


