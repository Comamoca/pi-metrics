export async function memInfo() {
  const mem_text = await Deno.readTextFile("/proc/meminfo");

  const total = Number(
    mem_text.split("\n")[0].split(" ").filter((s) => s.length > 0)[1],
  );
  const free = Number(
    mem_text.split("\n")[1].split(" ").filter((s) => s.length > 0)[1],
  );

  const available = Number(
    mem_text.split("\n")[2].split(" ").filter((s) => s.length > 0)[1],
  );

  const ratio = Math.floor(((total - available) / total) * 100);

  return {
    "total": total,
    "free": free,
    "available": available,
    "ratio": ratio,
  };
}

export async function cpuInfo() {
  // get cpu temp.
  const cpu_temp_text = await Deno.readTextFile(
    "/sys/class/thermal/thermal_zone0/temp",
  );

  const cpu_temp = Number(cpu_temp_text.replace("\n", "")) / 1000;

  return cpu_temp;
}
