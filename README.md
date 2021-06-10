# COVID19 Status Webhook

## Introduction

This is the Webhook service to feed the Dialogflow COVID19 Status Chatbot.
Given an input country, it returns the COVID-19 status of that country by making a request to the 
[COVID19 API](https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest) provided by Postman.

## Deployment

The service is deployed using Heroku at [https://safe-bastion-98853.herokuapp.com/](https://safe-bastion-98853.herokuapp.com/)

## Host the service locally

```
$ npm install
$ npm start
```

## Make a POST request

You may make a POST request to the URL: `https://safe-bastion-98853.herokuapp.com/webhook` or `localhost:3000/webhook` (if hosted locally) using Postman.

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
                    "Country: Singapore \r\nConfirmed: 62223 \r\nDeaths: 34 \r\nRecovered: 61740 \r\nActive: 483 \r\nNew cases: 13 \r\nUpdated Time: Jun 08, 2021"
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
