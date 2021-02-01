// build up the html structure
// set up click event to trigger api fetch
// display dynamic api data in correct locations
// store search history in localstorage for later use
// style application

// global variables
var currentDate = moment().format('l');
var weatherForm = document.querySelector('#weather-form');
var cityInput = document.querySelector('#city-input');
var historyContainer = document.querySelector('#history-container');
var searchedCity = document.querySelector('#searched-city');
var searchedIcon = document.querySelector('#searched-icon');
var searchedTemp = document.querySelector('#searched-temp');
var searchedHumidity = document.querySelector('#searched-humidity');
var searchedWind = document.querySelector('#searched-wind ');
var searchedUvText = document.querySelector('#searched-uv-text');
var searchedUv = document.querySelector('#searched-uv');
var searchHistory = [];
var searchLat;
var searchLon;

// function that calls for the current day's forecast and grabs various data from the api
function weatherSearchCurrent() {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      cityInput.value +
      '&units=imperial&appid=1786fea6053f5882af7a8308255b7294'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        // two variables below are grabbed at this time so the uv api can be call
        searchLat = response.coord.lat;
        searchLon = response.coord.lon;
        currentIcon = response.weather[0].icon;
        currentIconUrl = 'http://openweathermap.org/img/w/' + currentIcon + '.png';
        console.log(response);
        weatherSearchUv();
      });
  }

  // function that calls for the uv index and grabs various data from the api
  function weatherSearchUv() {
    fetch(
      'https://api.openweathermap.org/data/2.5/uvi?lat=' +
       searchLat +
       '&lon=' +
       searchLon +
       '&appid=1786fea6053f5882af7a8308255b7294'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        uvIndex = response.value
        console.log(response);
        weatherSearchFuture();
      });
  }

  // function that calls for the 5 day forecast and grabs various data from the api
  function weatherSearchFuture() {
    fetch(
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
      cityInput.value +
      '&units=imperial&appid=1786fea6053f5882af7a8308255b7294'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        var n = -1;
        for (i=0; i<5; i++) {
          n += 8;
          // grabs the unix date information and converts it into a nice format
          var loopDay = document.querySelector('#future-date-' + i);
          var dateComp = response.list[n].dt;
          var date = new Date(dateComp* 1000);
          var month = date.getMonth();
          var day = date.getDate()
          var year = date.getFullYear();
          var displayDate = month + '/' + day + '/' + year;
        }
        console.log(response);
      });
      cityInput.value = '';
  }

  // Submit Form Event Listener for city submission
  weatherForm.addEventListener('submit', function(event) {
    // next few statements weed out a few potential errors
    event.preventDefault();
    if (cityInput.value.length < 1 || cityInput.value.length > 20) {
      return;
    }
      weatherSearchCurrent();
  });