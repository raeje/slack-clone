const axios = require("axios");

exports.handler = async (event, context) => {
  try {
    const response = await axios({
      method: event.httpMethod,
      url: "http://206.189.91.54/api/v1",
      headers: event.headers,
      data: event.body,
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.response.data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
