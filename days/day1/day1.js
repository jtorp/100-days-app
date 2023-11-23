document.addEventListener('DOMContentLoaded', function () {
    // ---------------
    // Misc Functions
    // ---------------

    const copyrightDate = document.getElementById('copyrightDate');
    const currentYear = new Date().getFullYear();
    copyrightDate.innerText = currentYear;

    let location = document.getElementById('location');
    const form = document.getElementById('form');
    const textInput = document.getElementById('town');
    let geoCoordinates = null;

    // Geolocation functions
    async function handleGetGeoLocation() {
        location = 'Locating...';
       
        async function geoLocationSuccess(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const osm = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
                const response = await fetch(osm);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }

                const data = await response.json();
                console.log('Coordinates:', data.lat, data.lon);
                location= data.address?.town + ', ' + data.address?.country || 'Unknown';
                store={
                    ...store,
                    name: location
                }
                console.log(store);
                await fetchWeatherData(); // Call the weather data fetching function

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
        name: 'Paris',
        last_updated: "",
        last_updated_epoch: 0,
        localtime: "",
        conditionText: '',
        icon: '',
        feelslike_c: 0,
        is_day: 1,
        temp_c: 0,
        properties: {
            cloud: {},
            uv: {},
            vis_km: {},
            humidity: {},
            wind_kph : {},
        },
        forecastday: [], 
    };


    const fetchWeatherData = async () => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=87a5d91b5b6d49aeb31181805232011&q=${store.name}&days=3&aqi=no&alerts=no
        `);
            const weatherData = await response.json();

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
                forecast: { forecastday }, 
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
                            icon:`cloud`,
                            value:`${cloud}%`
                        },
                        uv: {
                            icon: "sunny",
                            value:`UV Index:${uv}`
                        },
                        vis_km: {
                            icon: "visibility",
                            value:`${vis_km} km`
                        },
                        humidity: {
                            icon: "humidity_percentage",
                            value:`${humidity}%`
                        },
                        wind_kph : {
                            icon: "air",
                            value:`${wind_kph} km/h`
                        }
                    },             
                forecastday
            };
            renderCurrentForecast();
            renderFutureForecast();
            changeBackgroundColor(is_day);
            document.getElementById('lastUpdated').innerHTML = `Last Updated: ${last_updated}`

        } catch (error) {
            currentForcast.innerHTML = `Error connecting to weather data, please try again later`;
            console.error('Error fetching weather data:', error);

        }
    }


    const currentMarkup = () => {
        return `
     <h1 id="location">${store.name}</h1>
    <h2 class="info"> ${store.country}</h2>
    <p> Local time: ${store.localtime} </p>
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
    return  `<p class=''> <span class="material-symbols-outlined">${icon}</span>
    ${value}
    </p>
    `
}).join('') }

    const futureMarkup = () => {
    const { forecastday } = store || { forecastday: [] }; 
    return forecastday?.map(day => `
        <div class="container">
            <h3 class="day">${day.date}</h3>
            <div class="weatherIcon">
                <img class="icon" src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
            <p class="conditions">${day.day.condition.text}</p>
            <p class="tempRange"><span class="high">High: ${day.day.maxtemp_c}</span> | <span class="high"> Low: ${day.day.mintemp_c}</span></p>
        </div>
    `).join('');
}


    const renderCurrentForecast = () => {
        currentForcast.innerHTML = currentMarkup();
    }
    const renderFutureForecast = () => {
        futureForecast.innerHTML = futureMarkup();
    }
    fetchWeatherData();



// Body background color based on is_day value 1 for no & 0 for yes
const changeBackgroundColor = (is_day) => {
    const body = document.body;
    if (is_day === 1) {
        body.style.backgroundColor = '#3a9efd';
        body.style.color = '#ffffff';
    } else {
        body.style.backgroundColor = '#1a1b4b';
        body.style.color = '#f5f5f5';
        
    }
};
// ---------------
// Handle user input
// ---------------

const handleInput = (e) => {
    store={
        ...store,
        name: e.target.value
    }
}

const handleSubmit = (e) => {
    e.preventDefault();
    if(!store.name || !store.name.trim()) {
       return
    }
    fetchWeatherData();
}
form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Prevent default form submission behavior
        handleSubmit(event); // Call your form submission function
    }
});
textInput.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);












});