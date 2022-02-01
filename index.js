const express = require("express");
const axios = require("axios");

// creates http server
const app = express().use(express.json());

// get status of a country from COVID-19 API
const getCovidStatus = async (country) => {
  let textResponse = "";

  try {
    const url =
      country === "global"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${country}`;
    const response = await axios({ method: "get", url });
    const status = response.data;

    textResponse =
      `Country: ${status["country"] || "Global"} \r\n` +
      `Cases: ${numberWithCommas(status["cases"])} \r\n` +
      `Deaths: ${numberWithCommas(status["deaths"])} \r\n` +
      `Recovered: ${numberWithCommas(status["recovered"])} \r\n` +
      `Today Cases: ${numberWithCommas(status["todayCases"])} \r\n` +
      `Today Deaths: ${numberWithCommas(status["todayDeaths"])} \r\n` +
      `Today Recovered: ${numberWithCommas(status["todayRecovered"])} \r\n` +
      `Active: ${numberWithCommas(status["active"])} \r\n` +
      `Critical: ${numberWithCommas(status["critical"])} \r\n` +
      `Tests: ${numberWithCommas(status["tests"])} \r\n` +
      `Updated: ${new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "long",
      }).format(new Date(status["updated"]))}`;
  } catch (error) {
    // error logs
    console.log(`Input country: ${country}`);
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);

      if (error.response.status === 404) {
        textResponse =
          "Country not found or doesn't have any cases! Try again?";
      } else {
        textResponse = "Something unexpectedly happened! Again one more time?";
      }
    } else {
      console.log(error.message);
      textResponse = "Seem like I got a bug :(. One more time?";
    }
  } finally {
    return formatWebhookResponse(textResponse);
  }
};

// format webhook response object as defined in
// https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_response
const formatWebhookResponse = (textResponse) => {
  const resObj = {
    fulfillmentMessages: [
      {
        text: {
          text: [textResponse],
        },
      },
    ],
  };

  return resObj;
};

// format numbers with comma
const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

port = process.env.PORT || 3000;
// start the application
app.listen(port, () =>
  console.log("[ChatBot] Webhook is listening on port " + port)
);

// default get method
app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

// webhook API
app.post("/webhook", (req, res) => {
  let country = req.body.queryResult.parameters["country"]
    .toString()
    .toLowerCase();
  getCovidStatus(country).then((status) => {
    return res.json(status);
  });
});
