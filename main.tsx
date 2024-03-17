/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from "hono";
import { Fragment, jsx } from "hono/middleware";
import { upgradeWebSocket } from "hono/helper";
import { sleep } from "https://deno.land/x/sleep@v1.3.0/mod.ts";
import { cpuInfo, memInfo } from "./lib/info.ts";
import "dotenv/autoload";

const app = new Hono();
const clientScript = await Deno.readTextFile("./client.js")
const host_address = Deno.env.get("HOST_ADDRESS")

console.log(`HOST_ADDRESS: ${host_address}`)

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.3.2"></script>
        <script src="https://cdn.jsdelivr.net/npm/luxon@1.27.0"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.0.0">
        </script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-streaming@2.0.0">
        </script>
      </head>
      <body>
        <canvas id="chartcanvas"></canvas>
      </body>
      <script
        dangerouslySetInnerHTML={{
          __html: clientScript.replace("HOST_ADDRESSS", host_address),
        }}
      />
    </html>
  );
};

app.get("/", (c) => c.html(<Layout />));
app.get(
  "/ws",
  upgradeWebSocket(
    (c) => {
      return {
        async onOpen(event, ws) {
          try {
            while (true) {
              await sleep(1);

              const mem_info = await memInfo();
              const cpu_temp = await cpuInfo();

	      const json = JSON.stringify({
                "total": mem_info.total,
                "free": mem_info.free,
                "available": mem_info.available,
                "ratio": mem_info.ratio,
                "cpu_temp": cpu_temp,
              })

	      console.log(json)

              ws.send(json);
            }
          } catch {
            console.log("disconnected");
          }
        },
        onClose: () => {
          console.log("disconnected");
        },
      };
    },
  ),
);

Deno.serve(app.fetch);
