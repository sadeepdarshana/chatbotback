const express = require('express')
const app = express()
const port = process.env.PORT || 80




const weatherApiLibrary = require('apixu');
const config = weatherApiLibrary.config;
config.apikey = 'a2f4881504954bb7a36114114191107';
const weatherApi = new weatherApiLibrary.Apixu(config);


function prepareCurrentResponse(rawWeatherData){

    let response = {};

    response.text = rawWeatherData.current.condition.text;
    response.temperature = rawWeatherData.current.temp_c+" °C";

    return response;
}



app.get('/', (req, res) => res.send('Hello World!'))



app.get('/getCurrentWeather', async (req, res) => {
    let place = req.query.place;
    console.log("getCurrentWeather '"+ place + "'");
    let rawWeatherData = await weatherApi.current(place);
    response.send(prepareCurrentResponse(rawWeatherData));
});


function prepareCurrentResponse(rawWeatherData){

    let response = {};

    response.text = rawWeatherData.current.condition.text;
    response.temperature = rawWeatherData.current.temp_c+" °C";

    return response;
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))



