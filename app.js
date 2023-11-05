const http = require("http");

http
  .createServer(function (req, res) {
    res.write("first reply");
    res.end();
  })
  .listen(3000);
console.log("server started on 3000");
