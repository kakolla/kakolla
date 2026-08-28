---
title: Tail Latency Optimization Notes
---
8/5/2026

Some context: I became fascinated with performance engineering because i was always met with hardware limits. I used to be hyperobsessed in high school with getting the most performance on my rx 560x on my laptop. What i surfaced was that it was my cpu that was hard limiting me. the system was an an515-42 with a max tdp of 25 W on the processor and 50 W on the rx 560x. It used to consistently hit the tdp limit and thermal throttle at 75C (which leaves basically no headroom from the idle 60C) - down to 1.98 ghz on all cores. If I recall correctly, it had 4 cores 8 threads with hypthreading enabled. interestingly enough, i would get better, stable performance and lower latency with hyperthreading turned off (4 cores only).


I remember doing some optimizations like modifiying and flashing new firmware to unlock the tdp limit and turn off BD PROCHOT which helped immensely. However after a couple of months of consistently hitting 96C over I think the thermal paste and heat pipes degraded pretty badly so it started hitting THERM TRIP which kinda bricked the system.

Anyways, what I've learned is that the main idea is: unpredictability is devastating in low latency systems. consistency matters more.


## Memory hierarchy
### order of latency in the hardware

| access                          | latency    | notes      |
| ------------------------------- | ---------- | ---------- |
| register                        | 0.3 ns     | free       |
| l1 cache hit                    | 1 ns       | 4 cycles   |
| l2 cache                        | 3-4 ns     | 12 cycles  |
| l3 cache                        | 10-30 ns   |            |
| dram                            | 60-100ns   | 100x L1    |
| nvme ssd                        | 20-100 us  | 1000x dram |
|                                 |            |            |
| RTT same data center            | 100-500 us |            |
| kernel context switch           | 1-10 us    |            |
| mutex lock/unlock (uncontended) | 15-25 ns   |            |
| mutex (contended)               | 1-10 us    | slow       |
assuming 4 ghz, 1 ns = 4 cpu clock cycles 

##### things to keep in mind always
- temporal and spatial locality
- a cache line is 64 bytes on x86



##### False sharing:
If you have 2 or more threads that are on different physical cores, and they update a counter or variable that are layed out closely on the same cache line, then that's a problem. 
The MESI cache coherence protocol is involved - intel and amd now use modified extensions of it however.
M - modified, E - exclusive, S - shared, I - invalid.


One thing to note is that cores have their own cache (L1, L2) but share the L3 cache. Thread 1 brings in the cache line to it's own L1 cache, makes a change, and the protocol marks the line as Modified. Snooping makes sure this same line is invalidated in Core 2's L1 cache (that has thread 2 running). But now thread 2 wants to make a change, so it requests the cache line, so C1 has to do a write back to memory, invalidate its own, and send it to C2. This ping pongs. 


It's called false sharing because the threads aren't actually sharing a variable, it just happens to be a quirk due to cache locality that they do this.

Solution: add alignment like with alignas(64).



#### Branch prediction
- hardware unit called the branch predictor
- predicts a path, cpu fetches and runs those instructions, if it's the wrong path, it stalls and deletes the computed results, and restores the registers and state back to before the branch.
- static or dynamic prediction methods (i.e specific rules or with runtime history)


## Memory allocation 
- assuming OS has reserved space in heap, call to malloc isn't very expensive (10 ns possibly), if you run out of memory, you will need to bring in the kernel to request memory (10 us). this is unpredictable and leads to high variance for low latency systems. would like to minimize / eliminate allocation.
- keep tail latency (p99) as low as possible. if it's on the microsecond order, it's a fail.

problems to be worried about with memory:
- unpredictable tail latency
- memory fragmentation
- lock contention in a multi-threaded allocator (diff threads share a cache)
- cache pollution

#### low-latency design options 
- object pools: pre-allocate everything (term: steady state allocation free)
	preallocate a contiguous array with heap allocated objs. if you want 'allocate', pop it off the array, takes a few ms, no actual malloc() call.
- ring buffers for queues
- bound the size of every data struc (queues, maps, lists)


## Concurrency
- busy spin
- memory ordering for atomicity (relaxed, acquire/release, SeqCst) - good for publish/consume pattern
- spsc - single producer, single consumer ring buffer (FIFO)
	- fixed-sized array (capacity=power of 2)
	- head is owned by consumer
	- tail owned by producer
	benefits:
	- no kernel, no locks, cache friendly, 


cas = compare and swap
- lock free design for multithreaded variable sharing
- analogy: like google docs editing; u edit and ur friend edits, if u try to save but they saved before, u get ur change rejected (no race).

#### LMAX Disruptor 
paper: https://lmax-exchange.github.io/disruptor/disruptor.html 
- pre-allocated circular data structure
- lock free
- multi p multi c
- cache friendly
	- prevents false sharing - forces threads to not modify vars on the same cache line (padding)
- consumer dependency graph


## CPP optimizations
- use templates, don't rely on virtual functions / dynamic binding at runtime
- avoid branching when possible
- move semantics
- RAII - no GC needed, perfect for resource management
- inline functions (try to emit assembly code immediately at the call site, don't emit a label for a jump) 


