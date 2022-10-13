//
const apiKey = "50c2acd53349fabd54f52b93c8650d37";

//current date and time
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
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
function setLocalDate() {
  let currDate = new Date();
  let currHours = currDate.getHours();
  let currMins = currDate.getMinutes();

  if (currHours < 10) {
    currHours = `0${currHours}`;
  }
  if (currMins < 10) {
    currMins = `0${currMins}`;
  }

  document.querySelector(
    "#current-data-time"
  ).innerHTML = `${currDate.getDate()} ${months[currDate.getMonth()]} (${
    days[currDate.getDay()]
  }), ${currHours}:${currMins}`;
}

/// Show info from weather api response
function showCityInfo(response) {
  setLocalDate();
  // document.querySelector("#current-data-time").innerHTML = new Date(
  //   response.data.dt * 1000
  // ).toString();

  let date1 = new Date(response.data.dt * 1000);

  document.querySelector("#sel-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#sel-city").innerHTML = response.data.name;
  document
    .querySelector("#main-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#main-icon")
    .setAttribute("alt", `response.data.weather[0].description`);
  document.querySelector(
    "#sel-humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity} %`;
  document.querySelector(
    "#sel-wind"
  ).innerHTML = `Wind: ${response.data.wind.speed} m/s`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1);
  //string.charAt(0).toUpperCase() + string.slice(1)
  console.log(response.data);
}
function showCityError() {
  alert("This city is not found, try to enter another city");
}

/// Call weather api for selected city name
function getCityInfo(city) {
  //console.log(city);
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  let unitName = "metric";
  ///Celsius or Fahrenheit?
  let currTempUnit = document.querySelector("#sel-tempUnit");
  if (currTempUnit.innerHTML === "F") {
    unitName = "imperial";
  }
  //
  if (city === "") {
    alert("Please enter a city name.");
  } else {
    axios
      .get(`${apiUrl}${city}&appid=${apiKey}&units=${unitName}`)
      .then(showCityInfo)
      .catch(showCityError);
  }
}

///get info for the entered city
function getSelectedCity(event) {
  event.preventDefault();
  let currentCity = document.querySelector("#inputCity");
  getCityInfo(currentCity.value.trim());
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getSelectedCity);

///Info for current city
function getCurrentCityInfo(position) {
  let positionLat = position.coords.latitude;
  let positionLong = position.coords.longitude;
  let unitName = "metric";
  let currTempUnit = document.querySelector("#sel-tempUnit");
  if (currTempUnit.innerHTML === "F") {
    unitName = "imperial";
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${positionLat}&lon=${positionLong}&appid=${apiKey}&units=${unitName}`;
  axios.get(apiUrl).then(showCityInfo);
}

function setCurrenCityData() {
  navigator.geolocation.getCurrentPosition(getCurrentCityInfo);
}

let currCity = document.querySelector("#current-city-link");
currCity.addEventListener("click", setCurrenCityData);

/*
let londonCity = document.querySelector("#london-city-link");
const londonFunc = getCityInfo.bind(this, "London");
londonCity.addEventListener("click", londonFunc);

let odesaCity = document.querySelector("#odesa-city-link");
//odesaCity.addEventListener("click", getCityInfo(odesaCity.innerHTML));
const odesaFunc = getCityInfo.bind(this, "Odesa");
odesaCity.addEventListener("click", odesaFunc);*/

//Change unit
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");

function setCurrentF(event) {
  event.preventDefault();
  let celsius = document.querySelector("#celsius");
  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.className = "currTempUnit";
  celsius.className = "tempUnit";

  let currTempUnit = document.querySelector("#sel-tempUnit");
  let currentTemp = document.querySelector("#sel-temp");

  if (currTempUnit.innerHTML !== "F") {
    currTempUnit.innerHTML = "F";
    currentTemp.innerHTML = Math.round((currentTemp.innerHTML * 9) / 5 + 32);
  }
}
fahrenheit.addEventListener("click", setCurrentF);

function setCurrentC(event) {
  event.preventDefault();
  let celsius = document.querySelector("#celsius");
  let fahrenheit = document.querySelector("#fahrenheit");
  fahrenheit.className = "tempUnit";
  celsius.className = "currTempUnit";

  let currTempUnit = document.querySelector("#sel-tempUnit");
  let currentTemp = document.querySelector("#sel-temp");

  if (currTempUnit.innerHTML !== "C") {
    currTempUnit.innerHTML = "C";
    currentTemp.innerHTML = Math.round(((currentTemp.innerHTML - 32) * 5) / 9);
  }
}

celsius.addEventListener("click", setCurrentC);
///end

//setCurrenCityData();

getCityInfo("Odesa");
