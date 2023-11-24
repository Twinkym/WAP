const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector("#city-input");
const weatherCardsDiv = document.querySelector(".day-forecast");

const API_KEY = 'b17391f2124da0d51502ad5f14e519f7'; // API key for openWeatherMap API
const uniqueForecastDays = [];

const createWeatherCard = (weatherItem) => {
    return `<div class="day-forecast">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <div class="forecast-details">
                    <img src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt = "weather-Icon" >
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
                    <h4>Wind: ${(weatherItem.wind.speed)} m/s</h4>
                    <h4>Humidity: ${(weatherItem.main.humidity)}%</h4>
                    </div>
                </div>`;
}
const getWeather = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            weatherCardsDiv.insertAdjacentHTML("afterend", createWeatherCard(weatherItem));
        })
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
        if (!data.length) return alert('No coordinates found for ${cityName}');
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
searchButton.addEventListener("click", getCityCoordinates);