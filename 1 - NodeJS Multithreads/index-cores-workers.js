const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3000;
const threads = process.env.THREADS || 4; // Declaring the threads to use paralelims in NodeJS

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./cores-workers.js", {
      workerData: { thread_count: threads },
    });

    worker.on("message", (data) => {
      resolve(data);
    });

    worker.on("error", (error) => {
      reject(`An error occured ${error}`);
    });
  });
}

app.get("/blocking", async (req, res) => {
  const workerPromises = [];

  for (let i = 0; i < threads; i++) {
    workerPromises.push(createWorker());
  }

  const thread_results = await Promise.all(workerPromises);
  let total = 0;

  for (const thread_result of thread_results) {
    total += thread_result;
  }

  res.status(200).send(`Result is ${total}`);
});

app.listen(port, (req, res) => {
  console.log(`App is listening on port ${port}`);
});
