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
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Role",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees By Department":
          viewDepartment();
          break;

        case "View All Employees By Role":
          viewRole();
          break;

        case "Add Employee":
          addEmployee();
          break;
        
        case "Add Department":
          addDepartment();
          break;
        
        case "Add Role":
          addRole();
          break;
        
        case "Update Employee Role":
          updateRole();
          break;

        case "Exit":
          con.end();
          break;
      }
    });
};


function viewEmployees() {
  var query = "SELECT * FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id";
  con.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};



function viewDepartment() {
  inquirer.prompt([
    {
      name: "department_name",
      type: "list",
      message: "Which department do you want to view?",
      choices: ["Engineering", "Sales", "Human Resources"]
    }
  ])
  .then(function(answer){
    var query = "SELECT first_name, last_name, department_name, title, salary FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id";
    con.query(query, function(err, res){
      if (err) throw err;
      console.table(res);
    });
  });
};


// function viewRole() {
// console.log("You are viewing a role");
// }


function addEmployee() {
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employees first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employees last name?"
    },
    {
      name: "role_id",
      type: "input",
      message: "What is the employees role id?"
    },
    {
      name: "manager_id",
      type: "input",
      message: "What is the employees manager id?"
    }
    // {
    //   name: "department_name",
    //   type: "input",
    //   message: "What is the employees department?"
    // },
    // {
    //   name: "title",
    //   type: "input",
    //   message: "What is the employees title?"
    // },
    // {
    //   name: "salary",
    //   type: "input",
    //   message: "What is the employees salary?"
    // },
    // {
    //   name: "department_id",
    //   type: "input",
    //   message: "What is the employees department id?"
    // }
  ])
    .then(function (answer) {
      con.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
          // department: answer.department,
          // title: answer.title,
          // salary: answer.salary,
          // department_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;
          console.log("Your employee was added successfully!");
          runSearch();
        }
      );
    });
};


// function addDepartment(){
//   console.log("You are adding a department");
// }


// function addRole() {
//   console.log("You are adding a role");
// }


// function updateRole() {
//   console.log("You are updating a role");
// }