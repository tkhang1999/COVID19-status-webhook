const express = require('express');
const axios = require('axios');

// creates http server
const app = express().use(express.json());

// get status of a country from COVID-19 API
const responseCovidStatus = (res, country) => {
    if (country === 'global') {
        const url = "https://disease.sh/v3/covid-19/all";

        axios({
            method:'get',
            url
        })
        .then((response) => {
            let status = response.data;
            let textResponse = `Cases: ${numberWithCommas(status['cases'])} \r\n` +
                `Today Cases: ${numberWithCommas(status['todayCases'])} \r\n\n` +
                `Deaths: ${numberWithCommas(status['deaths'])} \r\n` +
                `Today Deaths: ${numberWithCommas(status['todayDeaths'])} \r\n\n` +
                `Recovered: ${numberWithCommas(status['recovered'])} \r\n` +
                `Today Recovered: ${numberWithCommas(status['todayRecovered'])} \r\n\n` +
                `Active: ${numberWithCommas(status['active'])} \r\n` + 
                `Critical: ${numberWithCommas(status['critical'])} \r\n` +
                `Tests: ${numberWithCommas(status['tests'])} \r\n`;
            return getCovidStatusMessage(textResponse);
        })
        .catch((error) => {
            // error logs
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            return getCovidStatusMessage("Something unexpectedly happened! Please try again!");
        })
        .then((message) => {
            return res.json(message);
        });
    } else {
        const countryTotalUrl = "https://disease.sh/v3/covid-19/countries/";
        let url = countryTotalUrl + country;
        console.log('Country: ' + country);
    
        axios({
            method:'get',
            url
        })
        .then((response) => {
            let status = response.data;
            let textResponse = `Country: ${numberWithCommas(status['country'])} \r\n\n` + 
                `Cases: ${numberWithCommas(status['cases'])} \r\n` +
                `Today Cases: ${numberWithCommas(status['todayCases'])} \r\n` +
                `Deaths: ${numberWithCommas(status['deaths'])} \r\n` +
                `Today Deaths: ${numberWithCommas(status['todayDeaths'])} \r\n\n` +
                `Recovered: ${numberWithCommas(status['recovered'])} \r\n` +
                `Today Recovered: ${numberWithCommas(status['todayRecovered'])} \r\n\n` +
                `Active: ${numberWithCommas(status['active'])} \r\n` + 
                `Critical: ${numberWithCommas(status['critical'])} \r\n` + 
                `Tests: ${numberWithCommas(status['tests'])} \r\n\n` + 
                `Updated Time: ${new Intl.DateTimeFormat('en-US', {dateStyle: 'medium', timeStyle: 'long'})
                    .format(new Date(status['updated']))}`;
            return getCovidStatusMessage(textResponse);
        })
        .catch((error) => {
            // error logs
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            if (error.response.status === 404) {
                return getCovidStatusMessage("Country not found! Please try again!");
            } else {
                return getCovidStatusMessage("Something unexpectedly happened! Please try again!");
            }
        })
        .then((message) => {
            return res.json(message);
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

    return resObj;
}

// format numbers with comma
const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    let country = req.body.queryResult.parameters['country']
        .toString().toLowerCase();
    responseCovidStatus(res, country);
});
