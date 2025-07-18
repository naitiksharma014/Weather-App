// Get references to HTML elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherDisplay = document.getElementById('weatherDisplay');
const message = document.getElementById('message');
const weatherInfo = document.getElementById('weatherInfo');
const weatherIconContainer = document.getElementById('weatherIconContainer');
const cityNameElement = document.getElementById('cityName');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');

// Your API key and base URL
const API_KEY = '444acdc44f9e44be8a1143625251807'; // Replace with your actual API key
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

/**
 * Returns an SVG icon based on weather condition text.
 * This is a simplified example; a real app might map more conditions.
 * @param {string} conditionText - The weather condition text (e.g., "Sunny", "Cloudy").
 * @returns {string} - SVG string for the icon.
 */
function getWeatherIconSvg(conditionText) {
    conditionText = conditionText.toLowerCase();
    if (conditionText.includes('sunny') || conditionText.includes('clear')) {
        return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>`; // Sun icon
    } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
        return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>`; // Cloud icon
    } else if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
        return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 13v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path>
                    <line x1="12" y1="16" x2="12" y2="20"></line>
                    <line x1="8" y1="16" x2="8" y2="20"></line>
                    <line x1="16" y1="16" x2="16" y2="20"></line>
                    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 20h9"></path>
                </svg>`; // Cloud-rain icon
    } else if (conditionText.includes('snow') || conditionText.includes('sleet')) {
        return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 13v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path>
                    <line x1="12" y1="16" x2="12" y2="20"></line>
                    <line x1="8" y1="16" x2="8" y2="20"></line>
                    <line x1="16" y1="16" x2="16" y2="20"></line>
                    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 20h9"></path>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                </svg>`; // Cloud-snow icon (simplified)
    } else if (conditionText.includes('thunder')) {
        return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                    <polyline points="13 16 16 22 21 17 18 11 20 6 15 11 12 18"></polyline>
                </svg>`; // Cloud-lightning icon
    }
    return `<svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`; // Info/default icon
}

/**
 * Fetches weather data for a given city from the WeatherAPI.
 * @param {string} city - The name of the city.
 * @returns {Promise<object|null>} - A promise that resolves to the weather data object or null on error.
 */
async function fetchWeatherData(city) {
    // Show loading state
    buttonText.textContent = 'Loading...';
    loadingSpinner.classList.remove('hidden');
    getWeatherBtn.disabled = true;
    message.textContent = ''; // Clear previous messages
    weatherInfo.classList.add('hidden'); // Hide weather info while loading

    try {
        const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`; // aqi=no to simplify
        const response = await fetch(url);

        if (!response.ok) {
            // Handle HTTP errors (e.g., 400 Bad Request, 404 Not Found)
            const errorData = await response.json();
            if (errorData && errorData.error && errorData.error.message) {
                throw new Error(errorData.error.message);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        message.textContent = `Error: ${error.message}. Please try again.`;
        return null;
    } finally {
        // Hide loading state
        buttonText.textContent = 'Get Weather';
        loadingSpinner.classList.add('hidden');
        getWeatherBtn.disabled = false;
    }
}

/**
 * Displays the weather data on the page.
 * @param {object} data - The weather data object from the API.
 */
function displayWeather(data) {
    if (data && data.location && data.current) {
        cityNameElement.textContent = data.location.name;
        temperatureElement.textContent = `${data.current.temp_c}°C`;
        conditionElement.textContent = data.current.condition.text;

        // Set weather icon
        weatherIconContainer.innerHTML = getWeatherIconSvg(data.current.condition.text);

        message.textContent = ''; // Clear any previous error messages
        weatherInfo.classList.remove('hidden'); // Show weather info
        weatherInfo.classList.add('weather-info-fade-in'); // Apply fade-in animation
    } else {
        message.textContent = 'Could not retrieve weather data. Please try a different city.';
        weatherInfo.classList.add('hidden'); // Hide weather info if no data
    }
}

// Event listener for the button click
getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim(); // Get city name and remove leading/trailing whitespace

    if (city) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            displayWeather(weatherData);
        }
    } else {
        message.textContent = 'Please enter a city name.';
        weatherInfo.classList.add('hidden'); // Hide weather info if no city entered
    }
});

// Optional: Allow pressing Enter key in the input field to trigger search
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherBtn.click(); // Simulate a click on the button
    }
});
