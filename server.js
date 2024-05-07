const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  fetchCarsFromDB();
});

async function fetchCarsFromDB() {
  try {
      var con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "2611"
        });
        
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
        });

  } catch (error) {
      console.error('Error fetching data:', error);
  }
}