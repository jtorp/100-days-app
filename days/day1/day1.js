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
    let location = document.getElementById('location');


    async function handleGetGeoLocation() {
        async function geoLocationSuccess(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const osm = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
                const response = await fetch(osm);


                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                loader.style.display = 'block';

                const data = await response.json();
                location = data.address?.town + ', ' + data.address?.country || 'Unknown';
                store = {
                    ...store,
                    name: location
                }

                await fetchWeatherData();
                loader.style.display = 'none';

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
            navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
        }
    }
    handleGetGeoLocation();
    document.querySelector("#geoLocationBtn")?.addEventListener("click", handleGetGeoLocation);
    // ---------------
    // Weather API https://www.weatherapi.com/
    // ---------------
    const currentForcast = document.getElementById('forecast');
    const futureForecast = document.getElementById('future');
    let store = {
        name: location || localStorage.getItem('location_WW') || 'Las Vegas',
        last_updated: "",
        last_updated_epoch: 0,
        localtime: "",
        conditionText: '',
        icon: '',
        feelslike_c: 0,
        is_day: 1,
        temp_c: 0,
        astro: {},
        properties: {
            cloud: {},
            uv: {},
            vis_km: {},
            humidity: {},
            wind_kph: {},
            avgtemp_c: { value: 0 },

        },

        forecastday: [],
    };


    const fetchWeatherData = async () => {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        try {
            loader.style.display = 'block';
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${store.name}&days=4&aqi=no&alerts=no
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
                        icon: `cloud`,
                        value: `Cloudiness:${cloud}%`
                    },
                    avgtemp_c: {
                        icon: "thermometer",
                        value: `Average Temp: ${forecastday[0].day.avgtemp_c}°C`
                    },
                    uv: {
                        icon: "sunny",
                        value: `UV Index:${uv}`
                    },
                    vis_km: {
                        icon: "visibility",
                        value: `Visibility: ${vis_km} km`
                    },
                    humidity: {
                        icon: "humidity_percentage",
                        value: `Humidity ${humidity}%`
                    },
                    wind_kph: {
                        icon: "air",
                        value: `Wind Speed: ${wind_kph} km/h`
                    }
                },
                forecastday,
            };
            renderCurrentForecast();
            renderFutureForecast();
            changeBackgroundColor(is_day);
            document.getElementById('lastUpdated').innerHTML = `Last Updated: ${last_updated}`

        } catch (error) {
            console.log(error)
            currentForcast.innerHTML = `${error.message}`;

        }
    }
    fetchWeatherData();

    const currentMarkup = () => {
        return `
     <h1 id="location">${store.name}</h1>
     <h3 class="info"> ${store.country}</h3>
     <small>
     <b>${getDayOfWeek(store.localtime.split(' ')[0])}</b>,
     ${store.localtime.split(' ')[0].slice(5)},
    ${store.localtime.split(' ')[1]}
     </small>
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
        return Object.values(properties).map(({ icon, value }) => {
            return `<p> <span class="property material-symbols-outlined">${icon}</span>
    ${value}
    </p>
    `
        }).join('')
    }

    const getDayOfWeek = (str) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(str);
        const dayIndex = date.getDay(); // weekday index (0-6)
        return daysOfWeek[dayIndex];
    };

    const futureMarkup = () => {
        const { forecastday } = store || { forecastday: [] };
        return forecastday?.slice(1).map((day, index) => {
            let dayText = getDayOfWeek(day.date);
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
        }).join('')
    }


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
        if (validValue) {
            store.name = value.trim();
        }
        else {
            console.error('Invalid input for location');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = store.name;
        if (!value || value === 'loding...') {
            return null
        }
        localStorage.setItem('location_WW', value);
        fetchWeatherData().then(() => {
            textInput.value = '';
        });
    }
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    });
    textInput.addEventListener('input', handleInput);
    form.addEventListener('submit', handleSubmit);
})