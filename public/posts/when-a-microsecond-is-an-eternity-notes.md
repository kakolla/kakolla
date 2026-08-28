---
title: when a microsecond is an eternity
---
8/10/2026

These are my notes on Carl Cook's talk - [click here](https://www.youtube.com/watch?v=NH1Tta7purM&list=PLHTh1InhhwT6bwIpRk0ZbCA0N2p1taxd6&index=21&t=0s) 

In software designs, we prioritize **low latency**
or throughput
- in large scale systems we would want to optimize for a balance in this, in hft, aerospace this is low latency. gaming might require throughput (most fps possible).


hot path - critical section of a codebase that makes the financial decision/important decision (see value in exchange, run risk checks, make a preidction, put in a purchase)
- must be very performant


os and hardware optimizes throughput and fairness


probably want to these layers:
- hardware level, cpu, branch prediction, architecture etc
- higher level, interaction between systtems
- data strucs, architecture system design

why hyperhtreading is not optimal for hft
- logical cores are on a physical core, which share a cache, which likely cause evictions since it's shared and require more fetches from memory
- i did come across this when optimizing performance for doom under tdp-constrained systems
	- more cores share the cache, which leads to more evictions, and lower perf


Instruction vs data cache
L1 = split between separate instruction and data caches
- why? the CPU needs to fetch the instruction and write/read data, so it is needed at the same time 
L2/L3 = unified cache that caches instructinos and data

- Instruction cache (I-cache) - the cache that caches instructions that the CPU runs. Stays mostly read only.
- Data cache (D-cache) - stores data


how to measure latency in a low latency system:
*the problem:* measuring latency with microbenchmarks (isolation of a smaller part of code) is not reprensetative of the code path behavior in production, sampling profilers miss key events if it's too short, callgrind is great to measure memory footprint and etc but is too intrusive; requires cpu time to run on the same host and is kind of a virtual machine, and also can't capture IO.
- so we need an observer system that can measure the latency between packets (we'll need a switch there) before the target system processes and after; timestamp it.

some ways i can think of improving latency:
- turn off interrupts
- increase cpu affinity (priority - can set it to realtime)
- increase ram frequency - reduces memory wait time, less cpu stall cycles




