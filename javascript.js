document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const latInput = form.querySelector('input[placeholder="Enter latitude"]');
    const lonInput = form.querySelector('input[placeholder="Enter Longitude"]');

    const cityEl = document.getElementById('city');
    const tempEl = document.getElementById('temp');
    const humiEl = document.getElementById('humi');
    const descEl = document.getElementById('desc');

    const apiKey = "b90d35513d46905915614bdbd8f7449e"; // Your API key

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const lat = latInput.value.trim();
        const lon = lonInput.value.trim();

        cityEl.textContent = "Loading...";
        tempEl.textContent = "";
        humiEl.textContent = "";
        descEl.textContent = "";

        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            alert("Please enter valid numeric values for latitude and longitude.");
            cityEl.textContent = "Invalid input.";
            return;
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

        // First get weather
        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Weather error: ${response.status}`);
                return response.json();
            })
            .then(weatherData => {
                tempEl.textContent = `🌡️ Temperature: ${weatherData.main.temp} °C`;
                humiEl.textContent = `💧 Humidity: ${weatherData.main.humidity}%`;
                descEl.textContent = `🌤️ Weather: ${weatherData.weather[0].description}`;

                // Then get city name
                return fetch(geoUrl);
            })
            .then(response => {
                if (!response.ok) throw new Error(`Geocoding error: ${response.status}`);
                return response.json();
            })
            .then(geoData => {
                const cityName = geoData[0]?.name || "Unknown";
                cityEl.textContent = `📍 City: ${cityName}`;
            })
            .catch(error => {
                console.error("Fetch error:", error);
                cityEl.textContent = "Error loading weather or city";
                alert("Unable to fetch data. Please try again.");
            });
    });
});
