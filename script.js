// api key: 5cea1d9c8d9729e3deba8cb0ccf8f1d8

let cityList = ["Seattle", "New York"];
let city = cityList[0];

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

function renderForecast() {
    $("#forecast").empty();

    let forecastUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8"
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (forecastData) {
        let date = new Date(forecastData.dt * 1000);
        let dateFormatted = " (" + (parseInt(date.getMonth())+1) + "/" + date.getDate() + ", " + date.getFullYear() + ")";
        let iconUrl = "http://openweathermap.org/img/wn/" + forecastData.weather[0].icon + "@2x.png";

        $("#forecast").append($("<h1>").text(forecastData.name + dateFormatted).append($("<img>").attr("src", iconUrl)));
        $("#forecast").append($("<p>").text("Temperature: " + forecastData.main.temp + " °F"));
        $("#forecast").append($("<p>").text("Humidity: " + forecastData.main.humidity + " %"));
        $("#forecast").append($("<p>").text("Wind Speed: " + forecastData.wind.speed + " MPH"));

        let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + forecastData.coord.lat + "&lon=" + forecastData.coord.lon + "&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8";
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (uvData) {
            $("#forecast").append($("<p>").text("UV Index: ").append($("<span>").attr("id", "uv").text(uvData.value)));
        })
    })
    $("#forecastContainer").attr("style", "display:block;")
}

function renderFiveDay(){
    $("#fiveDayForecast").empty();

    let fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8"
    $("#fiveDayForecast").append($("<h2>").text("5-Day Forecast").addClass("m-3"));
    $.ajax({
        url:fiveDayUrl,
        method: "GET"
    }).then(function (forecastData){
        console.log(forecastData);
    
        for (let i=0; i<5; i++){
            let cardElm = $("<div>").addClass("weather-card flex-fill");
            let cardData = $("<div>").addClass("border text-white rounded m-3 bg-primary");

            let date = new Date(forecastData.list[8*i+7].dt * 1000);
            console.log(date);
            let dateFormatted = (parseInt(date.getMonth())+1) + "/" + date.getDate() + ", " + date.getFullYear();

            
            cardData.append($("<h2>").text(dateFormatted).addClass("m-1  text-center"));

            let iconUrl = "http://openweathermap.org/img/wn/" + forecastData.list[8*i+7].weather[0].icon + "@2x.png";

            cardData.append($("<img>").attr("src", iconUrl).attr("style","width:25%;")).addClass(" text-center");

            cardData.append($("<p>").addClass("m-1 text-center").text("Temp: " + forecastData.list[8*i+7].main.temp + " °F"));
            cardData.append($("<p>").addClass("m-1 text-center").text("Humidity: " + forecastData.list[8*i+7].main.humidity + " %"));



            cardElm.append(cardData);
            $("#fiveDayForecast").append(cardElm);
        }
        
    })

    $("#fiveDayForecast").attr("style", "display:flex;")
}


$("#search").click(function () {
    city = $("#input").val();
    cityList.push(city);
    renderCity();
    renderForecast();
    renderFiveDay();
})

$("#input").keypress(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        city = $(this).val();
        cityList.push(city);
        renderCity();
        renderForecast();
        renderFiveDay();
    }
})
