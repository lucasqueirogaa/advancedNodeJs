const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3000;

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking", async (req, res) => {
  const worker = new Worker("./worker.js");

  worker.on("message", (data) => {
    res.status(200).send(`Result is ${data}`);
  });

  worker.on("error", (error) => {
    res.status(404).send(`An error ocurred ${error}`);
  });
});

app.listen(port, (req, res) => {
  console.log(`App is listening on port ${port}`);
});
