const searchButton = document.querySelector(".search-btn")
const cityInput = document.querySelector("#city-input")

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    console.log(cityName)
}
searchButton.addEventListener("click", getCityCoordinates);