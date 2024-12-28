const getCurrentDate = () => {
  const d = new Date();
  return d.toDateString();
};

const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=YOUR_API_KEY&units=imperial";
const serverURL = "http://127.0.0.1:4000";

const errorDisplay = document.getElementById("hiba-error");

const generateData = async () => {
  const zip = document.getElementById("hiba-zip").value;
  const feelings = document.getElementById("hiba-feelings").value;

  try {
    const weatherData = await getWeatherData(zip);

    if (weatherData) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = weatherData;

      const info = {
        date: getCurrentDate(),
        city,
        temp: Math.round(temp),
        description,
        feelings,
      };

      await postData(`${serverURL}/add`, info);
      await updateUI();
      document.getElementById("hiba-entry").style.opacity = 1;
    }
  } catch (error) {
    console.error("Error generating data:", error);
    displayError("Something went wrong while generating data. Please try again.");
  }
};

document.getElementById("hiba-generate").addEventListener("click", generateData);

const getWeatherData = async (zip) => {
  try {
    const response = await fetch(`${baseURL}${zip}${apiKey}`);
    const data = await response.json();

    if (data.cod !== 200) {
      displayError(data.message);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const postData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Data saved:", result);
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    displayError("Failed to save data. Please try again.");
  }
};

const updateUI = async () => {
  try {
    const response = await fetch(`${serverURL}/all`);
    const savedData = await response.json();

    document.getElementById("hiba-date").innerHTML = savedData.date;
    document.getElementById("hiba-city").innerHTML = savedData.city;
    document.getElementById("hiba-temp").innerHTML = `${savedData.temp}&deg;F`;
    document.getElementById("hiba-description").innerHTML = savedData.description;
    document.getElementById("hiba-content").innerHTML = savedData.feelings;
  } catch (error) {
    console.error("Error updating UI:", error);
    displayError("Could not update UI. Please refresh the page.");
  }
};

const displayError = (message) => {
  errorDisplay.innerHTML = message;
  setTimeout(() => (errorDisplay.innerHTML = ""), 3000);
};
