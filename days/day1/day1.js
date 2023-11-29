document.addEventListener('DOMContentLoaded', function () {
    // ---------------
    // Misc Functions
    // ---------------
    const copyrightDate = document.getElementById('copyrightDate');
    const currentYear = new Date().getFullYear();
    copyrightDate.innerText = currentYear;
    const loader = document.getElementById('loader');
    const form = document.getElementById('form');
    const textInput = document.getElementById('town');
    let geoCoordinates = null;
    let location = document.getElementById('location');

    async function handleGetGeoLocation() {
        async function geoLocationSuccess(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const geoCoordinates = { lat, lon };

            try {
                const osm = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
                const response = await fetch(osm);
                
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }

                const data = await response.json();
                location ='loding...';
                location= data.address?.town + ', ' + data.address?.country || 'Unknown';
                store={
                    ...store,
                    name: location
                }

                await fetchWeatherData();

            } catch (error) {
                console.error('Error fetching town information:', error);

            }
        }

        function geoLocationError() {
            location = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            location.innerText = 'Geolocation is not supported by your browser';
        } else {
            location = 'Locating...';
            navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
        }
    }

    document.querySelector("#geoLocationBtn")?.addEventListener("click", handleGetGeoLocation);
    // ---------------
    // Weather API https://www.weatherapi.com/
    // ---------------
    const currentForcast = document.getElementById('forecast');
    const futureForecast = document.getElementById('future');
    let store = {
        name: location || localStorage.getItem('location_WW') || 'loding...',
        last_updated: "",
        last_updated_epoch: 0,
        localtime: "",
        conditionText: '',
        icon: '',
        feelslike_c: 0,
        is_day: 1,
        temp_c: 0,
        astro:{},
        properties: {
            cloud: {},
            uv: {},
            vis_km: {},
            humidity: {},
            wind_kph : {},
            avgtemp_c: {value: 0},

        },

        forecastday: [], 
    };


    const fetchWeatherData = async () => {
        try {
            loader.style.display = 'block';
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=87a5d91b5b6d49aeb31181805232011&q=${store.name}&days=3&aqi=no&alerts=no
        `);
            const weatherData = await response.json();
            loader.style.display = 'none';
            const {
                location: { name, country, localtime },
                current: {
                    last_updated,
                    cloud,
                    feelslike_c,
                    is_day,
                    temp_c,
                    humidity,
                    vis_km,
                    wind_kph,
                    uv,
                    condition: { text: conditionText, icon },
                },
            forecast: {
                forecastday
            }
            } = weatherData;
            console.log(weatherData);
            store = {
                ...store,
                name,
                country,
                localtime,
                conditionText,
                icon,
                last_updated,
                feelslike_c,
                is_day,
                temp_c,
                    properties: {
                        cloud: {
                            icon:`cloud`,
                            value:`Cloudiness:${cloud}%`
                        },
                        avgtemp_c: {
                            icon: "thermometer",
                            value:`Average Temp: ${forecastday[0].day.avgtemp_c}°C`
                        },
                        uv: {
                            icon: "sunny",
                            value:`UV Index:${uv}`
                        },
                        vis_km: {
                            icon: "visibility",
                            value:`Visibility: ${vis_km} km`
                        },
                        humidity: {
                            icon: "humidity_percentage",
                            value:`Humidity ${humidity}%`
                        },
                        wind_kph : {
                            icon: "air",
                            value:`Wind Speed: ${wind_kph} km/h`
                        }
                    },  
                    forecastday,
            };
            renderCurrentForecast();
            renderFutureForecast();
            changeBackgroundColor(is_day);
            document.getElementById('lastUpdated').innerHTML = `Last Updated: ${last_updated}`
     
        } catch (error) {
           
            currentForcast.innerHTML = `Error connecting to weather data, please try again later`;
            console.error('Error fetching weather data:', error.message);

        }
    }
    fetchWeatherData();

    const currentMarkup = () => {
        return `
     <h1 id="location">${store.name}</h1>
     <h3 class="info"> ${store.country}</h3>
     <small>${store.localtime.split(' ')[0]}, at <b>${store.localtime.split(' ')[1]}</b></small>
    <div class="astro">
    <p>

    <span class="material-symbols-outlined">
    water_lux
    </span>
    Sunrise: ${store.forecastday[0].astro.sunrise}</span> 
    </p>
    |
    <p> <span class="material-symbols-outlined">
    wb_twilight
    </span> Sunset: ${store.forecastday[0].astro.sunset}</p>
    </div>

    <div class="weatherIcon">
  <img class="icon" src=${store.icon} alt=${store.conditionText}/>
    </div>
    <p class="conditions">${store.conditionText}</p> 
    <p class="temp">${store.temp_c}</p>
    <p class="feelslike">Real Feel ${store.feelslike_c}</p>
    <div class="properties">${currentProperties(store.properties)}</div>
    `
}

    const currentProperties = (properties) => {
 return Object.values(properties).map(({icon, value}) => {
    return  `<p> <span class="property material-symbols-outlined">${icon}</span>
    ${value}
    </p>
    `
}).join('') }

const getDayOfWeek = (str) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(str);
    const dayIndex = date.getDay(); // weekday index (0-6)
    return daysOfWeek[dayIndex]; 
  };
const futureMarkup = () => {
    const { forecastday } = store || { forecastday: [] };
    return forecastday?.map((day, index) => {
      let dayText = '';
      if (index === 0) {
        dayText = day.date === store.localtime.split(' ')[0] ? 'Today' : getDayOfWeek(day.date);
      } else {
        dayText = getDayOfWeek(day.date); 
      }
      return `
        <div class="container">
          <h3 class="day">${dayText}</h3>
          <div class="weatherIcon">
            <img class="icon" src="${day.day.condition.icon}" alt="${day.day.condition.text}">
          </div>
          <p class="conditions">${day.day.condition.text}</p>
          <p class="tempRange">
            <span class="high">High: ${day.day.maxtemp_c}</span> |
            <span class="high"> Low: ${day.day.mintemp_c}</span>
          </p>
        </div>
      `;
    }).join('');
  };


    const renderCurrentForecast = () => {
        currentForcast.innerHTML = currentMarkup();
    }
    const renderFutureForecast = () => {
        futureForecast.innerHTML = futureMarkup();
    }

const changeBackgroundColor = (is_day) => {
    const body = document.body;
    if (is_day === 0) {
        body.style.backgroundColor = '#1a1b4b';
        body.style.color = '#f5f5f5';
    
    } else {
        body.style.backgroundColor = '#3a9efd';
        body.style.color = '#fff';
    }   
    
};
// ---------------
// Handle user input
// ---------------

const handleInput = (e) => {
    const value = e.target.value;
    const validValue = value.match(/^[a-zA-Z\s'-]+$/);
    if(validValue) {
        store.name = value.trim();
    }
   else {
    console.error('Invalid input');
}
}

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.name;
    if(!value || value === 'loding...') {
       return null
    }
    localStorage.setItem('location_WW', value);
    fetchWeatherData().then(()=>{
        textInput.value = '';
    });
}
form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        handleSubmit(event); 
    }
});
textInput.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);

   // handleGetGeoLocation()
})