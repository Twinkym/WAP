const cityInput = document.getElementById("city_input");
const searchButton = document.getElementById("search_button");
const currentWeatherDiv = document.getElementById("current_weather");
const weatherCardsDiv = document.getElementById("weather_cards");
const uniqueForecastDays = [];

const createWeatherCard = (cityName, weatherItem) => {
    if (weatherItem.dt_txt.includes("12:00:00")) {
        return `<div class="day_forecast_card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <div class="icon">
            <img id="weather_icon" src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt = "weather_icon" >
            <h4> ${weatherItem.weather[0].description} </h4>  
            </div>  
            <div class="forecast_details">
            <h3>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h3>
            <h3>Wind: ${(weatherItem.wind.speed)}m/s</h3>
            <h3>Humidity: ${(weatherItem.main.humidity)}%</h3>
            </div>
        </div>`;
    } else {
        return `<div class="day_forecast_card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <div class="forecast_details">
                    <img id="weather_icon" src = "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt = "weather_Icon" >
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
                    <h4>Feels Like: ${(weatherItem.main.feels_like - 273.15).toFixed(2)}ºC</h4>
                    <h4> ${weatherItem.weather[0].description} </h4>
                    <h4>Wind: ${(weatherItem.wind.speed)}m/s</h4>
                    <h4>Humidity: ${(weatherItem.main.humidity)}%</h4>
                    </div>
                </div>`;
    }
};

const fetchForecastData = async (lat, lon) => {
    const ONE_CALL_API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}`;

    try {
        const res = await fetch(ONE_CALL_API_URL);
        const data = await res.json();
        const fiveDaysForecast = data.daily.slice(0, 5);

        fiveDaysForecast.forEach(forecast => {
            const forecastDate = new Date(forecast.dt * 1000).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
            }
        });

        return fiveDaysForecast;
    } catch (err) {
        console.log(err);
    }
};

const getWeather = async (cityName, lat, lon) => {
    try {
        const fiveDaysForecast = await fetchForecastData(lat, lon);

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
    } catch (err) {
        console.log(err);
    }
};

const getCityWeather = () => {
    const cityName = cityInput.value;
    if (cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                const {
                    lat,
                    lon
                } = data.coord;
                getWeather(cityName, lat, lon);
            }).catch(err => {
                console.log(err);
            });
    }
};

searchButton.addEventListener("click", getCityWeather);
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getCityWeather();
    }
});