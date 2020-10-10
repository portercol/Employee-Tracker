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
    runSearch();
});

function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View All Employees":
        
          break;
  
        case "View All Employees By Department":
        
          break;
  
        case "View All Employees By Manager":
        
          break;
  
        case "Add Employee":
       
          break;
        }
      });
  };