const timeT = document.getElementById('time');
const dateD = document.getElementById('date');
const currWeatherItems = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryC = document.getElementById('country');
const weatherForecast = document.getElementById('weather-forecast');
const currTemp = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Api_key ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    timeT.innerHTML = (hour < 10? '0'+hour : hour) + ':' + (minutes < 10? '0'+minutes: minutes)
    dateD.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${Api_key}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {uvi,humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryC.innerHTML = data.lat + 'N ' + data.lon+'E'

    currWeatherItems.innerHTML = 
    `<div class="weather-item">
        <div>UV Index</div>
        <div>${uvi}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} mb</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} km/h</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx)=>{
        if(idx==0){
            currTemp.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="wh-icon">
            <div class="items">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night-${day.temp.night}&#176;C</div>
                <div class="temp">Day-${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += 
            `<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="wh-icon">
                <div class="temp">Night-${day.temp.night}&#176;C</div>
                <div class="temp">Day-${day.temp.day}&#176;C</div>
            </div>`
        }
    })
    weatherForecast.innerHTML = otherDayForcast;
}