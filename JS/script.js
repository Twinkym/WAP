const searchButton = document.querySelector(".search_btn");
const cityInput = document.querySelector(".city_input");
const locationButton = document.querySelector(".current_location_btn");
const currentWeatherDiv = document.querySelector(".current_weather");
const weatherCardsDiv = document.querySelector(".day_forecast_card");

const API_KEY = 'b17391f2124da0d51502ad5f14e519f7';
const uniqueForecastDays = [];

//HTML for current weather card
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return ` 
            < div class = "current_weather">
                <div class = "current_weather_details" >
                    <h2> ${cityName} (${weatherItem.dt_txt.split(" ")[0]}) </h2> 
                    <h3> Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC </h3 >
                    <h3> Wind: ${(weatherItem.wind.speed)}m/s < /h3 >
                    <h3> Humidity: ${(weatherItem.main.humidity)}% </h3 >             
                </div> 
                <div class = "icon" >
                    <img id = "weather_icon" src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt = "weather_icon" >
                    <h4> ${weatherItem.weather[0].description} </h4>  
                </div>
            </div>`;
    } else {
        return `<div class="day_forecast_card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <div class="forecast_details">
                        <img id="weather_icon" src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt = "weather_Icon" >
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
                        <h4>Wind: ${(weatherItem.wind.speed)} m/s</h4>
                        <h4>Humidity: ${(weatherItem.main.humidity)}%</h4>
                        </div>
                    </div>`;
    }

}
const getWeather = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?&lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        //Clearing previous data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        console.log(fiveDaysForecast);

        //Creating weather cards in the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("afterend", createWeatherCard(cityName, weatherItem));
            } else {
                weatherCardsDiv.insertAdjacentHTML("afterend", createWeatherCard(cityName, weatherItem));
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching weather forecast!");
    });
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const {
            name,
            lat,
            lon
        } = data[0];
        getWeather(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {
                name,
                latitude,
                longitude
            } = position.coords;
            // Get coordinates from user location
            console.log(position);
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            // Get city name from coordinates using reverse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {
                    name,
                    latitude,
                    longitude
                } = data[0];
                getWeatherDetails(name, latitude, longitude);
                console.log(data);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
                console.log(error);
            }
        }
    );
}
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "enter" && getCityCoordinates());