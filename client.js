const ctx = document.getElementById("chartcanvas");

const config = {
  type: "line",
  data: {
    datasets: [
      {
        label: "CPU temp",
        yAxisID: "left-y-axis",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        cubicInterpolationMode: "monotone",
        data: [],
      },
      {
        label: "Memory Usage",
        yAxisID: "right-y-axis",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        cubicInterpolationMode: "monotone",
        data: [],
      },
    ],
  },
  options: {
    scales: {
      "left-y-axis": {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "℃ ",
        },
      },
      "right-y-axis": {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "％",
        },
      },
      x: {
        type: "realtime",
        realtime: {
          delay: 2000,
        },
      },
    },
  },
};

const chart = new Chart(
  ctx,
  config,
);

const socket = new WebSocket("ws://localhost:8000/ws");

socket.addEventListener("open", (event) => {
  socket.send("SERVER CONNECTED");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  console.log(data.cpu_temp);

  console.log(`datasets: ${chart.data.datasets[0]}`);

  // set cpu temp data
  chart.data.datasets[0].data.push({
    x: Date.now(),
    y: data.cpu_temp,
  });

  // set memory usage data
  chart.data.datasets[1].data.push({
    x: Date.now(),
    y: data.ratio,
  });

  // update chart
  chart.update("quiet");
});
