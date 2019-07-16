const express = require('express');
const app = express();
const port = process.env.PORT || 8000;


var bodyParser = require('body-parser');
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





app.post('/*', async (req, res) => {

    let place = req.body.queryResult.parameters.place.city;
    let date = req.body.queryResult.parameters.date.split('T')[0];

    if(date === 'today' || new Date().toISOString().split('T')[0] === date){
        res.send (await getCurrentWeather(place));
    }
    else{
        res.send (await getForecastWeather(place,date));
    }

});


async function getCurrentWeather(place) {

    let rawWeatherData = await weatherApi.current(place);


    let forecast = rawWeatherData.current;

    let condition = forecast.condition.text;
    let temp = forecast.temp_c+" °C";
    let image = "http:"+forecast.condition.icon;

    return prepareCurrentResponse(place,condition,temp,image);
}


async function getForecastWeather(place,date) {

    let daysCount =  10;
    let rawWeatherData = await weatherApi.forecast(place,daysCount);


    let forecast = rawWeatherData.forecast.forecastday.filter(x=>x.date===date)[0];

    let condition = forecast.day.condition.text;
    let maxWindSpeed = forecast.day.maxwind_kph+" kph";
    let image = "http:"+forecast.day.condition.icon;

    return prepareForecastResponse(place,condition,maxWindSpeed,date,image);

}

function prepareForecastResponse(place,condition,maxWindSpeed,date,image){

    return {

        "payload": {
            "facebook": {
                "attachment": {
                    "type":"template",
                    "payload":{
                        "template_type":"generic",
                        "elements":[
                            {
                                "title":"Weather in "+place+" on "+date,
                                "image_url":image,
                                "subtitle":condition+". Wind could be as fast as "+maxWindSpeed,

                            },
                        ]
                    }
                }
            }
        }
    };

}
function prepareCurrentResponse(place,condition,temp,image){

    return {

        "payload": {
            "facebook": {
                "attachment": {
                    "type":"template",
                    "payload":{
                        "template_type":"generic",
                        "elements":[
                            {
                                "title":"Weather in "+place+" now",
                                "image_url":image,
                                "subtitle":condition +". Temperature is "+temp,

                            },
                        ]
                    }
                }
            }
        }
    };

}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))





