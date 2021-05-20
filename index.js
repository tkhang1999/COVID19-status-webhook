const express = require('express');
const axios = require('axios');

// creates http server
const app = express().use(express.json());

// get status of a country from COVID-19 API
const responseCovidStatus = (res, country) => {
    if (country === 'global') {
        const url = "https://api.covid19api.com/world/total";

        axios({
            method:'get',
            url
        })
        .then((response) => {
            let status = response.data;
            let textResponse = `Total Confirmed: ${status['TotalConfirmed']} \r\n` +
                `Total Deaths: ${status['TotalDeaths']} \r\n` +
                `Total Recovered: ${status['TotalRecovered']}`;
            let message = getCovidStatusMessage(textResponse);

            return res.json(message);
        })
        .catch((error) => {
            console.log(error);
        });
    } else {
        const countryTotalUrl = "https://api.covid19api.com/total/country/";
        let url = countryTotalUrl + country;
        console.log('Country: ' + country);
    
        axios({
            method:'get',
            url
        })
        .then((response) => {
            let status = response.data[response.data.length - 1];
            let oldStatus = response.data[response.data.length - 2];
            let textResponse = `Country: ${status['Country']} \r\n` + 
                `Confirmed: ${status['Confirmed']} \r\n` +
                `Deaths: ${status['Deaths']} \r\n` +
                `Recovered: ${status['Recovered']} \r\n` +
                `Active: ${status['Active']} \r\n` + 
                `New cases: ${status['Confirmed'] - oldStatus['Confirmed']} \r\n` +
                `Updated Time: ${new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'})
                    .format(new Date(Date.parse(status['Date'])))}`;
            let message = getCovidStatusMessage(textResponse);

            return res.json(message);
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

// return the most updated status of a country
const getCovidStatusMessage = (textResponse) => {
    let resObj = {
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        textResponse
                    ]
                }
            }
        ]
    };

    console.log('Text Response: ' + textResponse);
    console.log('Response Object: ' + JSON.stringify(resObj));

    return resObj;
}

port = process.env.PORT || 3000;
// start the application
app.listen(port, () => console.log('[ChatBot] Webhook is listening on port ' + port));

// default get method
app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

// webhook API
app.post('/webhook', (req, res) => {
    let country = req.body.queryResult.parameters['country'];
    responseCovidStatus(res, country);
});
