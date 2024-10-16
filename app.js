const apiKey = "8d164cd21a2ea63264e506ad1fad7cb6"; // OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const cityName = document.getElementById("cityName");
const suggestionsList = document.getElementById("suggestions");

// Event listener for the search button
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim(); // Get the trimmed input value
  if (!city) return; // Exit if input is empty

  try {
    const data = await fetchWeatherData(city); // Fetch the weather data
    displayWeatherData(data); // Display the weather data
  } catch (error) {
    console.error(error);
    displayErrorMessage(); // Show the error message if an error occurs
  }
});

// Fetch weather data from the API
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; // API URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found"); // Throw an error if the city is not found
    }
    const data = await response.json(); // Parse the JSON data
    return data; // Return the data for further processing
  } catch (error) {
    throw error; // Propagate the error to the calling function
  }
}

// Display the weather data in the UI
function displayWeatherData(data) {
  cityName.textContent = data.name; // Display city name
  temperature.textContent = `${data.main.temp}°C`; // Display temperature
  description.textContent = data.weather[0].description; // Display weather description
  weatherInfo.classList.remove("hidden"); // Show weather info
  errorMessage.classList.add("hidden"); // Hide error message
  suggestionsList.classList.add("hidden"); // Hide suggestions after search
}

// Display the error message in the UI
function displayErrorMessage() {
  weatherInfo.classList.add("hidden"); // Hide weather info
  errorMessage.classList.remove("hidden"); // Show error message
}

// Fetch city suggestions from the API
async function fetchCitySuggestions(query) {
  const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.list; // Return the list of city suggestions
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

// Show city suggestions as user types
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsList.classList.add("hidden");
    return;
  }
  const suggestions = await fetchCitySuggestions(query);

  if (suggestions && suggestions.length > 0) {
    suggestionsList.innerHTML = ""; // Clear previous suggestions
    suggestions.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = `${city.name}, ${city.sys.country}`;
      li.classList.add("p-2", "hover:bg-gray-600", "cursor-pointer");
      li.addEventListener("click", () => {
        cityInput.value = city.name; // Populate input with selected city
        suggestionsList.classList.add("hidden"); // Hide suggestions
        fetchWeatherData(city.name).then(displayWeatherData); // Fetch and display weather for selected city
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.classList.remove("hidden"); // Show suggestions
  } else {
    suggestionsList.classList.add("hidden"); // Hide if no suggestions
  }
});

// Event listener for the clear button
clearBtn.addEventListener("click", () => {
  clearInputField(); // Clear the input field
});

// Clear the input field and hide the clear button
function clearInputField() {
  cityInput.value = ""; // Clear the input value
  clearBtn.classList.add("opacity-0"); // Hide the clear button
}

// Show the clear button when there is text in the input field
cityInput.addEventListener("input", () => {
  clearBtn.classList.toggle("opacity-0", cityInput.value === ""); // Show or hide clear button based on input
});
