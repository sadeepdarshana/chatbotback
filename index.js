const express = require('express')
const app = express()
const port = process.env.PORT || 8000


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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



app.post('/*', (req, res) => {
    res.send(req.body);
    console.log(req.body);
})



app.get('/getCurrentWeather', async (req, res) => {
    let place = req.query.place;
    console.log("getCurrentWeather '"+ place + "'");
    let rawWeatherData = await weatherApi.current(place);
    res.send(prepareCurrentResponse(rawWeatherData));
});


function prepareCurrentResponse(rawWeatherData){

    let response = {};

    response.text = rawWeatherData.current.condition.text;
    response.temperature = rawWeatherData.current.temp_c+" °C";

    return response;
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))



