const express = require("express");
const axios = require("axios");

// creates http server
const app = express().use(express.json());

// get status of a country from COVID-19 API
const getCovidStatus = async (country) => {
  let textResponse = "";

  try {
    // get raw data from REST API
    const url =
      country === "global"
        ? "https://disease.sh/v3/covid-19/all?allowNull=true"
        : `https://disease.sh/v3/covid-19/countries/${country}?allowNull=true`;
    const [todayResponse, yesterdayResponse] = await Promise.all([
      getStatus(url),
      getStatus(url + "&yesterday=true"),
    ]);
    const [today, yesterday] = [todayResponse.data, yesterdayResponse.data];
    // enrich status data
    const useYesterdayData =
      today["todayCases"] === null &&
      today["cases"] === yesterday["cases"] &&
      today["todayDeaths"] === null &&
      today["deaths"] === yesterday["deaths"] &&
      today["todayRecovered"] === null &&
      today["recovered"] === yesterday["recovered"];
    const status = {
      country: today["country"] || "Global",
      cases: today["cases"] || 0,
      deaths: today["deaths"] || 0,
      recovered: today["recovered"] || 0,
      newCases:
        (!useYesterdayData ? today["todayCases"] : yesterday["todayCases"]) ||
        0,
      newDeaths:
        (!useYesterdayData ? today["todayDeaths"] : yesterday["todayDeaths"]) ||
        0,
      newRecovered:
        (!useYesterdayData
          ? today["todayRecovered"]
          : yesterday["todayRecovered"]) || 0,
      active: today["active"] || 0,
      critical: today["critical"] || 0,
      tests: today["tests"] || 0,
      updated: today["updated"],
    };
    // construct text response
    textResponse =
      `Country: ${status["country"]} \r\n` +
      `Cases: ${numberWithCommas(status["cases"])} \r\n` +
      `Deaths: ${numberWithCommas(status["deaths"])} \r\n` +
      `Recovered: ${numberWithCommas(status["recovered"])} \r\n` +
      `New Cases: ${numberWithCommas(status["newCases"])} \r\n` +
      `New Deaths: ${numberWithCommas(status["newDeaths"])} \r\n` +
      `New Recovered: ${numberWithCommas(status["newRecovered"])} \r\n` +
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

// get status from REST API
const getStatus = (url) => {
  return axios({ method: "get", url });
};

// return webhook response object in the format defined in
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
app.get("/", (_, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(
    '<html><body><h1>This is an Express Server for <a href="https://github.com/tkhang1999/COVID19-status-webhook">COVID19-status-webhook</a></h1></body></html>'
  );
});

// webhook API
app.post("/webhook", async (req, res) => {
  // webhook request object format is defined in
  // https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook?hl=en#webhook_request
  const country = req.body.queryResult.parameters["country"]
    .toString()
    .toLowerCase();
  const status = await getCovidStatus(country);

  return res.json(status);
});
