# COVID19 Status Webhook

## Introduction

This is the Webhook service to feed the Dialogflow COVID19 Status Chatbot.
Given an input country, it returns the COVID-19 status of that country by making a request to the
[COVID19 API](https://github.com/disease-sh/API) provided by **disease.sh**.

## Deployment

The service is deployed at [https://covid19-status-webhook.onrender.com](https://covid19-status-webhook.onrender.com)

## Host the service locally

```
$ npm install
$ npm start
```

## Make a POST request

You may make a POST request to the URL: `https://covid19-status-webhook.onrender.com/webhook` or `localhost:3000/webhook` (if hosted locally) using Postman.

Sample request body:

```
{
    "queryResult": {
        "parameters": {
            "country": "singapore"
        }
    }
}
```

Sample response:

```
{
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                    "Country: Singapore \r\n\nCases: 62,493 \r\nToday Cases: 0 \r\n\nDeaths: 35 \r\nToday Deaths: 0 \r\n\nRecovered: 62,140 \r\nToday Recovered: 0 \r\n\nActive: 318 \r\nCritical: 4 \r\nTests: 13,287,834 \r\n\nUpdated Time: Jun 25, 2021, 11:34:46 AM GMT+8"
                ]
            }
        }
    ]
}
```

## Chatbot Demo

You can have a try with the COVID19 Status Chatbot on Telegram at [t.me/COVID19_Status_Chatbot](https://t.me/COVID19_Status_Chatbot).

The bot is able to return the COVID19 status globally as well as for most countries.
Because the webhook is deployed on a free dyno, it will sleep after a half hour of inactivity.
Hence, if you do not receive any reply after a chat, please try one more time.

<p align="center">
  <img src="./chatbot_demo.png" alt="Chatbot Demo" />
</p>
