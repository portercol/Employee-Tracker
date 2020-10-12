// Require npm modules
const inquirer = require("inquirer");
const mysql = require("mysql");
const conTable = require("console.table");

// Create connection for MySQL Database
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_DB"
});

// Run the connection and initial prompt funtion 'runSearch'
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected on id: " + con.threadId);
  runSearch();
});

// Initial prompt of questions function
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
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees By Department":
          // viewDepartEmp();
          break;

        case "View All Employees By Manager":
          // viewManagEmp();
          break;

        case "Add Employee":
          //  addEmployee();
          break;
      }
    });
};

function viewEmployees() {
  // inquirer.prompt({
  //   name: "employee",
  //   type: "input",
  //   message: "What is the employees name?"
  // })
    // .then(function (answer) {
      var query = "SELECT * FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id";
      con.query(query, function(err, res) {
        if (err) throw err;
        // for (var i = 0; i < res.length; i++)
        console.table(res); 
          // console.log(res.employee);
      });
    // });
};