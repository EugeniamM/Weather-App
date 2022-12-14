//
const apiKey = "50c2acd53349fabd54f52b93c8650d37";
const apiKey2 = "6782253072f7d90462731a624097fc54";

let currentMetric = "C";

//current date and time
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// current date and time from Data();
function getDateTime(dataInfo) {
  let currHours = dataInfo.getHours();
  let currMins = dataInfo.getMinutes();

  if (currHours < 10) {
    currHours = `0${currHours}`;
  }
  if (currMins < 10) {
    currMins = `0${currMins}`;
  }

  return `${dataInfo.getDate()} ${months[dataInfo.getMonth()]} (${
    days[dataInfo.getDay()]
  }), ${currHours}:${currMins}`;
}

function showForecastInfo(response) {
  let currDate = new Date(response.data.current.dt * 1000);

  for (i = 0; i < 5; i++) {
    currDate = new Date(response.data.daily[i].dt * 1000);
    document.querySelector(`#nextDate-${i}`).innerHTML = `${currDate.getDate()} ${
      shortMonths[currDate.getMonth()]
    }`;

    document
      .querySelector(`#day-${i}-icon`)
      .setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.daily[i].weather[0].icon}@2x.png`
      );

    document.querySelector(`#nextTempMax-${i}`).innerHTML = Math.round(
      response.data.daily[i].temp.max
    );
    document.querySelector(`#nextTempMin-${i}`).innerHTML = Math.round(
      response.data.daily[i].temp.min
    );
  }
}
function showForecastError() {
  alert("Forecast is not found, sorry. Something went wrong...");
}

/// Show info from weather api response
function showCityInfo(response) {
  const localDateTime = new Date();
  const selDateTime = new Date(response.data.dt * 1000);

  document.querySelector("#current-data-time").innerHTML = getDateTime(localDateTime);
  document.querySelector("#sel-date-time").innerHTML =
    "<b>Update data:</b> " + getDateTime(selDateTime);
  let date1 = new Date(response.data.dt * 1000);

  document.querySelector("#sel-temp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#sel-city").innerHTML = response.data.name;
  document
    .querySelector("#main-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document.querySelector("#main-icon").setAttribute("alt", `response.data.weather[0].description`);
  document.querySelector(
    "#sel-humidity"
  ).innerHTML = `<b>Humidity:</b> ${response.data.main.humidity} %`;
  document.querySelector("#sel-wind").innerHTML = `<b>Wind:</b> ${response.data.wind.speed} m/s`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1);
  document.querySelector("#feels-like").innerHTML = Math.round(response.data.main.feels_like);
  document.querySelector("#min-temp").innerHTML = Math.round(response.data.main.temp_min);
  document.querySelector("#max-temp").innerHTML = Math.round(response.data.main.temp_max);

  let unitName = "metric";
  if (currentMetric === "F") {
    unitName = "imperial";
  }

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${unitName}`;
  axios.get(apiUrl).then(showForecastInfo).catch(showForecastError);
}

function showCityError() {
  alert("This city is not found, try to enter another city");
}

/// Call weather api for selected city name
function getInfoByName(city) {
  let unitName = "metric";

  if (currentMetric === "F") {
    unitName = "imperial";
  }
  //
  if (city === "") {
    alert("Please enter a city name.");
  } else {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitName}`
      )
      .then(showCityInfo)
      .catch(showCityError);
  }
}

///get info for the entered city
function searchCityInfoHandler(event) {
  event.preventDefault();
  let currentCity = document.querySelector("#inputCity");
  getInfoByName(currentCity.value.trim());

  document.querySelector("#inputCity").value = "";
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCityInfoHandler);

///Info for current city
function getInfoByPosition(position) {
  let unitName = "metric";
  if (currentMetric === "F") {
    unitName = "imperial";
  }

  let apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${unitName}`;
  axios.get(apiUrl1).then(showCityInfo).catch(showCityError);
}

function currentCityHandler() {
  navigator.geolocation.getCurrentPosition(getInfoByPosition);
}

let currCity = document.querySelector("#current-city-link");
currCity.addEventListener("click", currentCityHandler);

/*
let londonCity = document.querySelector("#london-city-link");
const londonFunc = getCityInfo.bind(this, "London");
londonCity.addEventListener("click", londonFunc);

let odesaCity = document.querySelector("#odesa-city-link");
//odesaCity.addEventListener("click", getCityInfo(odesaCity.innerHTML));
const odesaFunc = getCityInfo.bind(this, "Odesa");
odesaCity.addEventListener("click", odesaFunc);*/

//Change unit

function setCurrentF(event) {
  event.preventDefault();

  if (currentMetric !== "F") {
    //document.querySelector("#sel-tempUnit").innerHTML = "F";
    document.querySelector("#feels-like-unit").innerHTML = "F";
    document.querySelector("#min-temp-unit").innerHTML = "F";
    document.querySelector("#max-temp-unit").innerHTML = "F";
    currentMetric = "F";

    let currentTemp = document.querySelector("#sel-temp");
    currentTemp.innerHTML = Math.round((currentTemp.innerHTML * 9) / 5 + 32);

    let feelsLikeTemp = document.querySelector("#feels-like");
    feelsLikeTemp.innerHTML = Math.round((feelsLikeTemp.innerHTML * 9) / 5 + 32);

    let minTemp = document.querySelector("#min-temp");
    minTemp.innerHTML = Math.round((minTemp.innerHTML * 9) / 5 + 32);

    let maxTemp = document.querySelector("#max-temp");
    maxTemp.innerHTML = Math.round((maxTemp.innerHTML * 9) / 5 + 32);

    document.querySelector("#celsius").className = "tempUnit";
    document.querySelector("#fahrenheit").className = "currTempUnit";

    let temp;
    for (i = 0; i < 5; i++) {
      temp = document.querySelector(`#nextTempMax-${i}`);
      temp.innerHTML = Math.round((temp.innerHTML * 9) / 5 + 32);

      temp = document.querySelector(`#nextTempMin-${i}`);
      temp.innerHTML = Math.round((temp.innerHTML * 9) / 5 + 32);
    }
  }
}

function setCurrentC(event) {
  event.preventDefault();

  if (currentMetric !== "C") {
    //document.querySelector("#sel-tempUnit").innerHTML = "C";
    document.querySelector("#feels-like-unit").innerHTML = "C";
    document.querySelector("#min-temp-unit").innerHTML = "C";
    document.querySelector("#max-temp-unit").innerHTML = "C";

    currentMetric = "C";

    let currentTemp = document.querySelector("#sel-temp");
    currentTemp.innerHTML = Math.round(((currentTemp.innerHTML - 32) * 5) / 9);

    let feelsLikeTemp = document.querySelector("#feels-like");
    feelsLikeTemp.innerHTML = Math.round(((feelsLikeTemp.innerHTML - 32) * 5) / 9);

    let minTemp = document.querySelector("#min-temp");
    minTemp.innerHTML = Math.round(((minTemp.innerHTML - 32) * 5) / 9);

    let maxTemp = document.querySelector("#max-temp");
    maxTemp.innerHTML = Math.round(((maxTemp.innerHTML - 32) * 5) / 9);

    document.querySelector("#celsius").className = "currTempUnit";
    document.querySelector("#fahrenheit").className = "tempUnit";

    let temp;
    for (i = 0; i < 5; i++) {
      temp = document.querySelector(`#nextTempMax-${i}`);
      temp.innerHTML = Math.round(((temp.innerHTML - 32) * 5) / 9);

      temp = document.querySelector(`#nextTempMin-${i}`);
      temp.innerHTML = Math.round(((temp.innerHTML - 32) * 5) / 9);
    }
  }
}
document.querySelector("#fahrenheit").addEventListener("click", setCurrentF);
document.querySelector("#celsius").addEventListener("click", setCurrentC);
///end

getInfoByName("Odesa");
/*
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["", "temp"],
    ["1", 1000 ],
    ["2", 1170],
    ["3", 660],
    ["4", 1030,],
  ]);

  var options = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
  };

  var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

  chart.draw(data, options);
}*/
