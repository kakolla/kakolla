8/9/2026

https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf

Here are my notes on Brendan Gregg's article on linux performance analysis.

In 60 seconds, get a scope of the system behavior with these commands:
need the sysstat package with $sudo pacman -S sysstat
```
uptime
htop
vmstat 1 (virtual memory usage, poll every 1 second)
	the 'r' column is for staturation (how many processes waiting for cpu)
free -h (look at free memory)
iostat
pidstat (cpu stats for devices & partitions)
sar (monitor system activity)

```

use the USE methodology


U - utilization


S - saturation (when a resource has more load than it can handle)

E - error rates

use this against CPU, memory, network, disks, etc


**character device** - device that streams data (accessed sequentially), like mice, keyboards

**block device** - device that transmits data in blocks (accessed randomly), like hard drives, usb




In my own experience at Meta, I had to frequently ssh into linux and macOS machines to quickly investigate the behavior of my code. When I would deploy my code and invoke a pipeline, the internal production monitoring systems wouldn't expose what was actually running on the system, so it was always better to ssh into the system and verify what was going on.

So, I would ssh into them, run htop to confirm the CPU usage of my experimental programs running (hdiffz, rsync) and verify the memory and CPU usage were under control. I found the 'time' command that I could wrap my subcommands under to test how long they were taking to be super helpful. 

Once, I came across an uptick in error rates on prod machines that were running code I had deployed 3 days earlier; and about 50-70 hosts were hitting this specific error. I grabbed the ID of one of the machines and ssh'd into it and looked at the logs that were saved. It was hitting a crash loop due to an edge case I didn't account for (and was actually due to a design decision I made on the cache policy), so it was crashing on booting a VM image that was evicted. I got into the logs, found the exact error lines, and had to deduce the possible edge case. Was a super stressful couple of hours, but the damage wasn't that bad (a couple hours of downtime for a few hosts, but for machines not under any form of SLA; internal only).
