var DateTime = luxon.DateTime;

const luxonify = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  return DateTime.fromObject({ hours, minutes, seconds });
};

const parseData = async (date, time, hours) => {
  const day = await fetch(`../data/${date}`);
  let data = (await day.json()).dataset;
  data = data.filter(
    (e) =>
      luxonify(e.time) > luxonify(time) &&
      luxonify(e.time) <= luxonify(time).plus({ hours })
  );
  return [data.map((e) => e.time), data.map((e) => e.value)];
};

const highCharts = async (date, time, hours) => {
  const [timeLabels, values] = await parseData(date, time, hours);
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
document.getElementById("date-input").value = date;
let time = "09:00:00";
document.getElementById("time-input").value = time;
let hours = 1;
document.getElementById("container").style.width = `${hours * 100}%`;
document.getElementById("hours-input").value = hours;

const refresh = () => {
  highCharts(date, time, hours);
};

const changeDate = (receivedDate) => {
  date = receivedDate;
  refresh();
};

const changeTime = (receivedTime) => {
  time = receivedTime;
  refresh();
};

const changeHours = (receivedHours) => {
  hours = receivedHours;
  document.getElementById("container").style.width = `${hours * 100}%`;
  refresh();
};

refresh();
