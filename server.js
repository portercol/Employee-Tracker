const inquirer = require("inquirer");
const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: ""
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected");
});