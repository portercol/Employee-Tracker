// Require npm modules
const inquirer = require("inquirer");
const mysql = require("mysql");


// Create connection for MySQL Database
const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_DB"
});


// Run the connection and initial prompt funtion 'startPrompt'
con.connect((err) => {
  if (err) throw err;
  console.log("Connected on id: " + con.threadId);
  startPrompt();
});


// Initial prompt of questions function
function startPrompt() {
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
    .then(({ action }) => {
      // Switch statement will check for user input then run a function based off that input
      switch (action) {
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
  con.query("SELECT * FROM employee INNER JOIN department ON employee.id = department.id INNER JOIN role ON department.id = role.id"
    , (err, res) => {
      console.table(res);
      startPrompt();
    });
};


// Function to view department \\ User can view specific departments based off their prompt choice
function viewDepartment() {
  // MySQL query allows user to view all departments stored in DB
  con.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    startPrompt();
  });
};


// Function to view roles, MySQL query statement and printing the table to the console
function viewRole() {
  // MySQL query allows user to view all departments stored in DB
  con.query("SELECT * FROM role", (err, res) => {
    console.table(res);
    startPrompt();
  });
};


//Function to add an employee; user can input a first name, last name, role id and manager id
function addEmployee() {
  con.query("SELECT * FROM role", (err, res) => {
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employees last name?"
      },
      {
        name: "employeeRole",
        type: "list",
        message: "What is the employees role?",
        // '.map' creates a new array that returns of titles
        choices: res.map((role) => role.title)
      }
    ])
      // Promise statement to input answers and MySQL query to update employee info in DB
      .then(({ firstName, lastName, employeeRole }) => {
        // Store roleID in a variable to use later
        var roleID;
        // Using looping, if title is the same as a pre-existing role ID, then assign 'roleID' to actual role_id
        res.map(finds => {
          if (finds.title === employeeRole) {
            roleID = finds.id;
            // Insert statement to use input and insert into the employee table
            con.query("INSERT INTO employee SET ?",
              {
                first_name: firstName,
                last_name: lastName,
                role_id: roleID
              },
              console.log("You've added an employee")
            );
            con.query("SELECT * FROM employee", (err, res) => {
              console.table(res);
              startPrompt();
            });
          };
        });
      });
  });
};


// Function to add a new department - user is asked for the name of the new department
function addDepartment() {
  inquirer.prompt([
    {
      name: "newDepartment",
      type: "input",
      message: "What is the name of the department?"
    }
  ])
    // Promise statement and MySQL query to update DB with new department
    .then(({ addDepartment }) => {
      con.query("INSERT INTO department SET ?",
        {
          department_name: addDepartment
        },
      );
      con.query("SELECT * FROM department", (err, res) => {
        console.table(res);
        startPrompt();
      })
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
    .then(function (answer) {
      con.query("INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;
          console.log("You've added a new role");
          startPrompt();
        });
    });
};


// function updateRole() {
//   console.log("You are updating a role");
// }