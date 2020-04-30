// api key: 5cea1d9c8d9729e3deba8cb0ccf8f1d8

let cityList = ["Seattle", "New York"]; 

function renderCity(){
    for (city of cityList){
        $("#cityList").append($("<li>").text(city).addClass("list-group-item").attr("id", city));
    }

}

let city = cityList[0];
let date = "04/30, 2020"
function renderForecast(){
    $("#forecast").append($("<h1>").text(city + " (" + date +")"));
    let forecastUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8"
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function(forecastData){
        console.log(forecastData);
        $("#forecast").append($("<p>").text("Temperature: " + forecastData.main.temp));
        $("#forecast").append($("<p>").text("Humidity: " + forecastData.main.humidity));
        $("#forecast").append($("<p>").text("Wind Speed: " + forecastData.wind.speed));

        let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat="+forecastData.coord.lat+"&lon="+forecastData.coord.lon+"&appid=5cea1d9c8d9729e3deba8cb0ccf8f1d8";
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function(uvData){
            console.log(uvData);
            $("#forecast").append($("<p>").text("UV Index: " + uvData.value));
        })
    })

}

renderCity();
renderForecast();