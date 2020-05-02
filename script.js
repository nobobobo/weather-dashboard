// load cityList from localstorage 
let cityList = JSON.parse(localStorage.getItem("cityList"));

// initilize cityList if there's no data stored at localstorage
if (cityList === null) {
    cityList = [];
}

// initialize city to display weather
let city = "";


// renderCity function renders out names of the cities from cityList to sidebar. Also adds click event lister to each. 
function renderCity() {
    $("#cityList").empty();
    for (city of cityList) {
        let liElm = $("<li>").addClass("btn btn-outline-primary list-group-item").text(city).attr("id", city);
        liElm.click(function () {
            city = $(this).attr("id");
            renderForecast();
            renderFiveDay();
        })
        $("#cityList").append(liElm);
    }
}

renderCity();

// renderForecast displays the current weather of the city. 
function renderForecast() {
    $("#forecast").empty();

    // use current weather data api query url.
    let forecastUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8"
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (forecastData) {
        // format the date
        let date = new Date(forecastData.dt * 1000);
        let dateFormatted = " (" + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + ", " + date.getFullYear() + ")";

        // get a weather icon
        let iconUrl = "http://openweathermap.org/img/wn/" + forecastData.weather[0].icon + "@2x.png";

        // appending the contents (city name, icon, temp, humidity, windspeed) to #forecast
        $("#forecast").append($("<h1>").text(forecastData.name + dateFormatted).append($("<img>").attr("src", iconUrl)));
        $("#forecast").append($("<p>").text("Temperature: " + forecastData.main.temp + " °F"));
        $("#forecast").append($("<p>").text("Humidity: " + forecastData.main.humidity + " %"));
        $("#forecast").append($("<p>").text("Wind Speed: " + forecastData.wind.speed + " MPH"));

        // get UV index by UV Index api
        let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + forecastData.coord.lat + "&lon=" + forecastData.coord.lon + "&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8";
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (uvData) {

            // append UV index to #forecast
            $("#forecast").append($("<p>").text("UV Index: ").append($("<span>").attr("id", "uv").text(uvData.value)));
        })
    })

    // displays #forecastContainer that holds #forecast, which was hidden at the initial visit of the page.
    $("#forecastContainer").attr("style", "display:block;")
}

// render five day forecast function 
function renderFiveDay() {
    $("#fiveDayForecast").empty();

    // use 5 day / 3 hour Forecast
    let fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8"
    $("#fiveDayForecast").append($("<h2>").text("5-Day Forecast").addClass("m-3"));
    $.ajax({
        url: fiveDayUrl,
        method: "GET"
    }).then(function (forecastData) {

        /* 
        5 day / 3 hour Forecast provides 5 day forecast with the granularity of 3 hours.
        And once forecastData is returned, it contains 40 weather elements list ordered by the time. 
        
        e.g: 
        
        API is called at 04:00 UTC on 5/1, 
        forecastData.list[0].dt is 5/1 06:00
        forecastData.list[1].dt is 5/1 09:00
           ...
        forecastData.list[7].dt is 5/2 03:00
           ...
        forecastData.list[15].dt is 5/3 03:00
           ...

        The loop will iterate the list with indices 7,15,23,31,39

        */

        for (let i = 0; i < 5; i++) {

            // create card elements to display the forecast for each day
            let cardElm = $("<div>").addClass("weather-card flex-fill");
            let cardData = $("<div>").addClass("border text-white rounded m-3 bg-primary");

            // format and display the date
            let date = new Date(forecastData.list[8 * i + 7].dt * 1000);

            let dateFormatted = (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + ", " + date.getFullYear();

            cardData.append($("<h2>").text(dateFormatted).addClass("m-1  text-center"));

            // get a icon picture and display
            let iconUrl = "http://openweathermap.org/img/wn/" + forecastData.list[8 * i + 7].weather[0].icon + "@2x.png";
            cardData.append($("<img>").attr("src", iconUrl).attr("style", "width:25%;")).addClass(" text-center");

            // display temp and humidity
            cardData.append($("<p>").addClass("m-1 text-center").text("Temp: " + forecastData.list[8 * i + 7].main.temp + " °F"));
            cardData.append($("<p>").addClass("m-1 text-center").text("Humidity: " + forecastData.list[8 * i + 7].main.humidity + " %"));

            // append card element to #fiveDayForecast
            cardElm.append(cardData);
            $("#fiveDayForecast").append(cardElm);
        }

    })

    // displays #fiveDayForecast, which was hidden at the initial visit of the page.
    $("#fiveDayForecast").attr("style", "display:flex;")
}


// add click event lister to store new city to the city list and store the list to local storage 
// also triggers renderCity(), renderForecast() and renderFiveDay() 

$("#search").click(function () {

    if ($("#input").val() === "") {
        return;
    }
    city = $("#input").val();
    cityList.push(city);
    localStorage.setItem("cityList", JSON.stringify(cityList));
    renderCity();
    renderForecast();
    renderFiveDay();


})

// add keypress event lister. Once the user hit enter, the listener will store new city to the city list and store the list to local storage 
// also triggers renderCity(), renderForecast() and renderFiveDay() 
$("#input").keypress(function (event) {
    if (event.which == 13) {
        if ($("#input").val() === "") {
            return;
        }
        event.preventDefault();
        city = $(this).val();
        cityList.push(city);
        localStorage.setItem("cityList", JSON.stringify(cityList));
        renderCity();
        renderForecast();
        renderFiveDay();
    }
})
