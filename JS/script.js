const searchButton = document.querySelector(".search_btn");
const resetButton = document.querySelector(".reset_btn");
const cityInput = document.querySelector(".city_input");
const locationButton = document.querySelector(".current_location_btn");
const currentWeatherDiv = document.querySelector(".current_weather");
const weatherCardsDiv = document.querySelector(".days_forecast");

const API_KEY = 'b17391f2124da0d51502ad5f14e519f7';
const uniqueForecastDays = [];

// HTML for weather card
const createWeatherCard = (cityName, weatherItem, index) => {
    return `<div class="day_forecast_card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <div class="forecast_details">
                    <h4>City: ${cityName}</h4>
                    <img id="weather_icon" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather_Icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
                    <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
            </div>`;
};

const getWeather = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?&lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
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

            // Creating weather cards in the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentWeatherDiv.innerHTML = createWeatherCard(cityName, weatherItem, index);
                } else {
                    weatherCardsDiv.innerHTML += createWeatherCard(cityName, weatherItem, index);
                }
            });

            // Mostrar el nombre de la ciudad en el weather card actual
            document.querySelector(".current_weather h2.cityName").textContent = cityName;

        })
        .catch(() => {
            alert("An error occurred while fetching weather forecast!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);

            const {
                name,
                lat,
                lon
            } = data[0];
            getWeather(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the city coordinates!");
        });
};


resetButton.addEventListener("click", () => {
    cityInput.value = "";
    weatherCardsDiv.innerHTML = "";
    currentWeatherDiv.innerHTML = "";
    document.querySelector(".current_weather h2.cityName").textContent = ""; // Limpiar el nombre de la ciudad
});

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {
                name,
                latitude,
                longitude
            } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    const {
                        name,
                        coord: {
                            lat,
                            lon
                        }
                    } = data;
                    getWeather(name, lat, lon);
                })
                .catch(() => {
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
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
resetButton.addEventListener("click", resetFields);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());