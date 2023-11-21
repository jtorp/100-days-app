document.addEventListener('DOMContentLoaded', function() { 
// ---------------
// Misc Functions
// ---------------

const copyrightDate = document.getElementById('copyrightDate');
const currentYear = new Date().getFullYear();
copyrightDate.innerText = currentYear;

const location = document.getElementById('location');
let geoCoordinates = null;
const town = document.getElementById('town');


// let lat =55.765478;
// let lon= 12.500029
// let q=`${lat},${lon}`;


// Geolocation functions
function getGeoLocation() {
    location.innerText = 'Locating...';

async function geoLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;     

        try {
            const osm = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            const response = await fetch(osm);
            if(!response.ok) {
                throw new Error('Error fetching data');
            }

            const data = await response.json();
            console.log('Coordinates:', data.lat, data.lon);
            location.innerText = data.address?.town + ', ' + data.address?.country || 'Unknown';
        } catch (error) {
            console.error('Error fetching town information:', error);

        }
}

function geoLocationError() {
    location.innerText = 'Unable to retrieve your location';
}
    
if (!navigator.geolocation) {
    location.innerText = 'Geolocation is not supported by your browser';
} else {
    location.innerText = 'Locating...';
    navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
}
}
    
document.querySelector("#geoLocationBtn").addEventListener("click", getGeoLocation);

// ---------------
// Weather API https://www.weatherapi.com/
// ---------------
const currentForcast = document.getElementById('forecast');
const futureForecast = document.getElementById('future');

let store = {
        name: 'Copenhagen',
        last_updated: "",
        last_updated_epoch: 0,
        cloud:0,
        conditionText: '',
        icon:'',
        feelslike_c:0,
        feelslike_f:0,
        is_day:1,
        temp_c:0,
        temp_f:0,
        humidity:0,
        vis_km:0,
        vis_miles:0,
        wind_kph:0, 
        wind_mph:0,
        uv:null //Measure of the strength of the ultraviolet radiation from the sun. May be NULL.
};


const fetchWeatherData = async () => {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=87a5d91b5b6d49aeb31181805232011&q=${store.name}&days=3&aqi=no&alerts=no
        `);
        const weatherData = await response.json();
        console.log(weatherData)

        const {
            location: { name, country, localtime },
            last_updated,
            last_updated_epoch,
            current: {
              cloud,
              feelslike_c,
              feelslike_f,
              is_day,
              temp_c,
              temp_f,
              humidity,
              vis_km,
              vis_miles,
              wind_kph,
              gust_kph,
              wind_mph,
              gust_mph,
              uv,
              condition: { text: conditionText, icon },
            },
            forecast: { forecastday }, // Destructuring forecastday directly
          } = weatherData;

        store={
            ...store,
            name,
            country,
            localtime,
            conditionText,
            icon,
            last_updated,
            last_updated_epoch,
            cloud,
            feelslike_c,
            feelslike_f,
            is_day,
            temp_c,
            temp_f,
            humidity,
            vis_km,
            vis_miles,
            wind_kph,
            wind_mph,
            uv,forecastday
        };
        renderCurrentForecast();
        renderFutureForecast();
        changeBackgroundColor(is_day);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


const currentMarkup = () =>{
    return `
    <div>
  
     <h1  id="location">${store.name}</h1>
    <h2 class="info"> ${store.country}</h2>
    <div class="weatherIcon">
    ${store.is_day === 1 ? '<img class="icon" src="./images/cloud.png" alt="./images/sun.png">' : '<img class="icon" src="./images/shooting-star.png" alt="./images/moon.png">'}
    </div>
    <p class="conditions">${store.conditionText}</p> 
    <p class="temp">${store.temp_c}</p>
    <p class="feelslike">Real Feel ${store.feelslike_c}</p>
    <div class="additional">
        <p id="">Wind ${store.wind_kph} km/h </p>
        <p id="">Cloud Cover ${store.cloud}%</p>
        <p id="">Humidity ${store.humidity} %</p>
        <p id="">Visibility ${store.vis_km} km</p>
    </div>
    `
}
const futureMarkup = () =>{
    return  store.forecastday.map(day => {
        return `
        <div class="wrapper" >
        <div class="container">
            <h3 class="day">${day.date}</h3>
            <div class="weatherIcon">
                <img class="icon" src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="${day.day.condition.text}">
                    <div class="inner"></div>
                </div>
            </div>
            <p class="conditions">${day.day.condition.text}</p>
            <p class="tempRange"><span class="high">${day.day.maxtemp_c}</span> | <span class="low">${day.day.mintemp_c}</span></p>
        </div>
        </div>
        `
    }).join('')
}


const renderCurrentForecast =  () => {
    currentForcast.innerHTML = currentMarkup();
}
const renderFutureForecast =  () => {
    futureForecast.innerHTML = futureMarkup();
}
    fetchWeatherData();

});

// Body background color based on is_day value 1 for no & 0 for yes
const changeBackgroundColor = (is_day) => {
    const body = document.body;
    const isDay = is_day === 1;

    if (isDay) {
      body.style.backgroundColor = '#001247'; 
    } else {
      body.style.backgroundColor = '#003366'; 
    }
  };
  