const express = require('express');
const router = express.Router();
const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
  dateStrings: 'conf.dateStrings'
});
connection.connect();

var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
const days = moment().format('YYYY-MM-DD HH:mm:ss');



const multer = require("multer");
const upload = multer({ dest: "./upload" });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });

});

router.get("/api/board", (req,res) => {
  connection.query(
      "SELECT *FROM BOARD WHERE isDeleted = 0",
      (err, rows, fields) => {
        res.send(rows);
      }
  );
});
router.delete("/api/board/:id", (req, res) => {
  let sql = "UPDATE BOARD SET isDeleted =1 WHERE id =?";
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fileds) => res.send(rows));
});

router.post("/api/board", upload.single("image"), (req, res) => {
  let sql = "INSERT INTO BOARD VALUES (null,?,?,?,(now()+interval 9 HOUR),0)";
  let image = "/image/" + req.file.filename;
  let title = req.body.title;
  let writer = req.body.writer;
  let params = [image, title, writer];

  connection.query(sql, params, (err, rows, fileds) => {
    res.send(rows);
  });
});

router.use("/image", express.static("./upload"));


module.exports = router;
