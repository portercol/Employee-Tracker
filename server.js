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
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit"
      ]
    })
  // Promise used to input answer in command line and then run the function down below 
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Departments":
          viewDepartment();
          break;

        case "View All Roles":
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

// Function to view employee - mysql query allows the user to view all employee data
// Using Inner Join to join together all 3 tables in mysql workbench
function viewEmployees() {
  var query = "SELECT * FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id";
  con.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};


// Function to view department \\ User can view specific departments based off their prompt choice
function viewDepartment() {
  inquirer.prompt([
    {
      name: "department_name",
      type: "list",
      message: "Which department do you want to view?",
      choices: ["Engineering", "Sales", "Human Resources"]
    }
  ])
// Promise used to input specific answer based off the choice from prior prompt
// MySQL query allows user to view all departments stored in DB
    .then(function (answer) {
      var query = "SELECT first_name, last_name, department_name, title, salary FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id";
      con.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
      });
    });
};


// function viewRole() {
// console.log("You are viewing a role");
// }

// Function to add an employee; user can input a first name, last name, role id and manager id
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
// Promise statement to input answers and MySQL query to update employee info in DB
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

// Function to add a new department - user is asked for the name of the new department
function addDepartment() {
  inquirer.prompt([
    {
      name: "department_name",
      type: "input",
      message: "What is the name of the department?"
    }
  ])
// Promise statement and MySQL query to update DB with new department
    .then(function (answer) {
      con.query("INSERT INTO department SET ?",
      {
        department_name: answer.department_name
      },
      function (err, res) {
        if (err) throw err;
        console.log("You've added a new department!");
        runSearch();
      });
    });
};

// Function to add a new role - user is asked questions about the title, salary and department name
function addRole() {
  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What is the title of the role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the role?"
    },
    {
      name: "department_id",
      type: "input",
      message: "Which department is the new role in? 1) Engineering 2) Sales"
    }
  ])
// Promise statement and MySQL query to update DB with new role info
    .then(function(answer){
      con.query("INSERT INTO role SET ?",
      {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
      function(err, res) {
        if (err) throw err;
        console.log("You've added a new role");
        runSearch();
      });
    });
};


// function updateRole() {
//   console.log("You are updating a role");
// }