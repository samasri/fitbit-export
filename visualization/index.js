var DateTime = luxon.DateTime;

const luxonify = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  return DateTime.fromObject({ hours, minutes, seconds });
};
const plus1Hour = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  return DateTime.fromObject({
    hours: Number(hours) + 1,
    minutes,
    seconds,
  });
};
const parseData = async (date, time) => {
  const day = await fetch(`../data/${date}`);
  let data = (await day.json()).dataset;
  data = data.filter(
    (e) =>
      luxonify(e.time) > luxonify(time) &&
      luxonify(e.time) <= luxonify(time).plus({ hours: 1 })
  );
  return [data.map((e) => e.time), data.map((e) => e.value)];
};

const chartjs = async (date, time) => {
  const [timeLabels, values] = await parseData(date, time);

  const ctx = document.getElementById("heartRateChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: "Heart Rate",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Heart Rate Data",
        },
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Heart Rate",
          },
        },
      },
    },
  });
};

const highCharts = async (date, time) => {
  const [timeLabels, values] = await parseData(date, time);
  Highcharts.chart("container", {
    chart: {
      type: "spline",
    },
    title: {
      text: "Heart Rate Data",
    },
    xAxis: {
      categories: timeLabels,
    },
    yAxis: {
      title: {
        text: "Heart rate",
      },
    },
    series: [
      {
        name: "Jane",
        data: values,
      },
    ],
  });
};

let date = "2024-01-01";
let time = "00:00:00";

const refresh = () => {
  highCharts(date, time);
};

const changeDate = (receivedDate) => {
  date = receivedDate;
  refresh();
};

const changeTime = (receivedTime) => {
  time = receivedTime;
  refresh();
};

refresh();
