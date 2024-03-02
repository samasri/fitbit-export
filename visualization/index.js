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

const setChart = async (date, time, hours) => {
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

const config = {
  date: "2024-01-01",
  time: "09:00:00",
  hours: 1,
};
document.getElementById("date-input").value = config.date;
document.getElementById("time-input").value = config.time;
document.getElementById("container").style.width = `${config.hours * 100}%`;
document.getElementById("hours-input").value = config.hours;
document.getElementById("width-input").value = "100";

const refresh = () => {
  console.log("Refreshing...", config.hours);
  setChart(config.date, config.time, config.hours);
};

const changeDate = (receivedDate) => {
  config.date = receivedDate;
  refresh();
};

const changeTime = (receivedTime) => {
  config.time = receivedTime;
  refresh();
};

const changeWidth = (receivedWidth) => {
  const currentWidth = document.getElementById("width-input").value;
  if (receivedWidth !== currentWidth)
    document.getElementById("width-input").value = receivedWidth;
  document.getElementById("container").style.width = `${receivedWidth}%`;
};

const changeHours = (receivedHours) => {
  config.hours = receivedHours;
  changeWidth(config.hours * 100);
  refresh();
};

refresh();
