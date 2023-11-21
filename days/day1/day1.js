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
});


// ---------------
// Weather API https://www.weatherapi.com/
// ---------------
	
let store = {
        name: 'Kongens Lyngby',
        last_updated: "2023-11-20 20:00",
        last_updated_epoch: 1700506800,
        cloud:0,
        conditionText: '',
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




let lat =55.765478;
let lon= 12.500029
let q=`${lat},${lon}`;

async function getGeoLocationKey() {
    try {
        const geopositionKey = await fetch(fetchGeoLocationKey);
        const geopositionKeyData = await geopositionKey.json();
       return geopositionKeyData.Key
    } catch (error) {
        console.error('Error fetching geoposition data:', error);
        throw error; 
    }
}
let globalKey;

async function setGlobalKey() {
    try {
        globalKey = await getGeoLocationKey();
        console.log('Global key:', globalKey); // Use the key retrieved here
    } catch (error) {
        console.error('Error setting global key:', error);
        throw error;}
}




(async () => {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=87a5d91b5b6d49aeb31181805232011&q=${store.name}&aqi=no
        `);
        const weatherData = await response.json();
        console.log('Weather data:', weatherData);
        const {location:{name}, last_updated,last_updated_epoch,current:{cloud, feelslike_c, feelslike_f, is_day, temp_c, temp_f, humidity, vis_km, vis_miles, wind_kph, wind_mph, uv, condition:{text:conditionText}}} = weatherData;

        store={
            ...store,
            name,
            conditionText,
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
            uv
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
})();


