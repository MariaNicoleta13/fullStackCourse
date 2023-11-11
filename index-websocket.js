const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("listening on 3000");
});

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  
  server.close(() => {
    shutdownDB();
  });
});

/** Begin websocket */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients connected ", numClients);

  wss.broadcast(`current visitors ${numClients}`);
  db.run(
    `INSERT INTO visitors (count, time) VALUES(${numClients}, datetime('now')) `
  );
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

/**end websockets */
/**begin database */
const sqllite = require("sqlite3");
const db = new sqllite.Database(":memory:"); //gone when server is reset
db.serialize(() => {
  db.run(`CREATE TABLE visitors (
    count INTEGER,
    time TEXT
  )`);
});

function getCounts() {
  db.each("SELECT * from visitors", (err, row) => {
    console.log("err", err);
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("shutting down");
  db.close();
}
