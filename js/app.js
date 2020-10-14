class Forecast {
    constructor() {
        this.key = '3b7c57b688484f579c3130213201410';
        this.cityURI = `http://api.weatherapi.com/v1/current.json`;
    }
    async getCity(cityName) {
        const query = `?key=${this.key}&q=${cityName}`;
        const response = await fetch(this.cityURI + query);
        const data = await response.json();
        return data;
    }
    async updateCityWeather(cityName) {
        const cityWeather = await this.getCity(cityName);
        return { cityWeather };
    }
}

const weatherForm = document.querySelector('.form-location');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const icon = document.querySelector('.icon');
const time = document.querySelector('img.time');

const updateUI = (data) => {
    const { cityWeather } = data;

    details.innerHTML = `
        <h5 class="my-3">${cityWeather.location.name}</h5>
          <div class="my-3"> ${cityWeather.current.condition.text} </div>
          <div class="display-4 my-4">
            <span> ${cityWeather.current.temp_c} </span>
            <span>&deg;C</span>
          </div>  
    `;

    // updating UI day & night image and weather icon
    let iconSrc = `${cityWeather.current.condition.icon}`;
    icon.setAttribute('src', iconSrc);

    let timeSrc = null;
    if (cityWeather.current.is_day) {
        timeSrc = './img/day.svg';
    } else {
        timeSrc = './img/night.svg';
    }
    time.setAttribute('src', timeSrc);

    // make card shows when updatingUI
    if (card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }
}

function updateError() {
    details.innerHTML = `
        <br><br>
        <div class="display-4 my-4">
            <img class="bg-light mx-auto text-center" style="width: 100px;" src="img/404.svg" />
            <h5 class="my-3">location not found</h5>
        </div>    
    `;
    icon.removeAttribute('src');
    time.removeAttribute('src');

    // make card shows when updatingError
    if (card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const forecast = new Forecast();

    const cityNameValue = weatherForm.location.value.trim();
    weatherForm.reset();

    forecast.updateCityWeather(cityNameValue)
        .then(data => updateUI(data))
        .catch(err => updateError(err))
});