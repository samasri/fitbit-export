var DateTime = luxon.DateTime;

const luxonify = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  return DateTime.fromObject({ hours, minutes, seconds });
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
      // tickPositioner: function () {
      //   return [40, 50, 60, 70, 80, 90];
      // },
    },
    series: [
      {
        name: "Heart Rate",
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
