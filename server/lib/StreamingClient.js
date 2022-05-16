const { RevAiStreamingClient, AudioConfig } = require("revai-node-sdk");
const axios = require("axios");

const translateText = async (text, language = "es") => {
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", text);
  encodedParams.append("target", language);
  encodedParams.append("source", "en");

  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.GOOGLE_TRANSLATE_KEY,
    },
    data: encodedParams,
  };

  const { data } = await axios.request(options);
  if (!data.data.translations?.length) return "";
  return data.data.translations[0].translatedText;
};

module.exports = class StreamingClient {
  constructor(accessToken, io, room) {
    this.accessToken = accessToken;
    this.io = io;
    this.room = room;
  }

  start() {
    this.revAiStreamingClient = new RevAiStreamingClient(
      this.accessToken,
      new AudioConfig("audio/x-wav")
    );

    this.revAiStreamingClient.on("close", (code, reason) => {
      console.log(`Connection closed, ${code}: ${reason}`);
    });

    this.revAiStreamingClient.on("httpResponse", (code) => {
      console.log(`Streaming client received http response with code: ${code}`);
    });

    this.revAiStreamingClient.on("connectFailed", (error) => {
      console.log(`Connection failed with error: ${error}`);
    });

    this.revAiStreamingClient.on("connect", (connectionMessage) => {
      console.log(`Connected with job id: ${connectionMessage.id}`);
      this.io.to(this.room).emit("streaming-connected", connectionMessage);
    });

    this.revStream = this.revAiStreamingClient.start();
    this.revStream.on("data", async (data) => {
      this.io.to(this.room).emit("transcript", data);
      if (data.type === "final") {
        try {
          const str = data.elements.reduce((a, b) => {
            a += `${b.value}`;
            return a;
          }, " ");
          const translation = await translateText(str, "es");
          this.io.to(this.room).emit("translation", translation);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  end() {
    this.revStream = null;
    this.revAiStreamingClient?.end();
  }

  stream(data) {
    this.revStream && this.revStream.write(data);
  }
};
