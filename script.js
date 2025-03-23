const apiKey = "9db993e53443483c600e804ec8d625bd";
const defaultCity = ["New York", "Lisbon", "Tokyo"];

const cityInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherCards = document.getElementById("weather-cards");
const loadingIndicator = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '⛅',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Smoke': '🌫️',
    'default': '🌡️'
};

function getWeatherIcons(weatherParams) {
    return weatherIcons[weatherParams] || weatherIcons['default'];
}

async function fetchWeatherForCity(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        if (!response.ok) {
            throw new Error(`City not found: ${city}`);
        }
        return await response.json();
    } catch (error) {
        console.error(" Error fetching data not found" + error);

        throw new Error(error);
    }
}

function createWeatherCard(data) {
    const weatherMain = data.weather[0].main;
    const icon = getWeatherIcons(weatherMain);
    const temperature = Math.round(data.main.temp);
    const humidity = data.wind.speed;
    const windSpeed = Math.round(data.wind.speed);
    const description = data.weather[0].description;

    const card = document.createElement("div");
    card:className = "card";

    card.innerHTML = `
    <div class="card">
        <h3>${data_name}, ${data.sys.country}</h3>
        <div class="weather-icon">${icon}</div>
        <div class="temp">${temperature}</div>
        <p class="weather-description">${description}</p>
        <div class=details>
        <div class="detail">
            <span></span>
            <span>Humidity</span>
        </div>
    <div class="details">
        <span>Wind</span>
        <span>${windSpeed} km/h</span>
        <span>Wind</span>
    </div>	
    </div>
    </div>
    `

    return card;
}

function showLoading(active) {
    if (active) {
        loadingIndicator.style.display = "flex";
    } else {
        loadingIndicator.style.display = "none";
    }
}

function hideError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

async function loadWeatherForCities(cities) {
    showLoading(true);
    hideError();

    weatherCards.innerHTML = "";

    for (const city of cities) {
        try {
                const data = await fetchWeatherForCity(city);
                const card = createWeatherCard(data);

                weatherCards.appendChild(card);

        } catch (error) {
            console.error("Error feching weather data", error);
        }
    }

    if (weatherCards.children.length === 0) {
        showError("No weather data available.");
    }
}

async function searchCity() {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city.");
        return;
    }

    showLoading(true);
    hideError();

    try {
        const data = await fetchWeatherForCity(city);
        weatherCards.innerHTML = "";
        const card = createWeatherCard(data);
        weatherCards.appendChild(card);
    } catch (error) {
        showError(`"Could not find weather data for ${city}. Please try again."`);

    } finally {
        showLoading(false);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadWeatherForCities(defaultCity);
})

showLoading(true);