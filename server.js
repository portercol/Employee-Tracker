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
  con.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    (err, res) => {
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
                role_id: roleID,
                manager_id: 2
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
    .then(({ newDepartment }) => {
      con.query("INSERT INTO department SET ?",
        {
          department_name: newDepartment
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
  con.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the role?"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of the role? (must be a number)",
        // Validates that the user enters a number and returns an error is input is invalid
        validate: (salary) => {
          if (isNaN(salary) === false) {
            return true;
          }
          return "Please enter a valid number";
        }
      },
      {
        name: "roleID",
        type: "rawlist",
        // message: "Which department is the role in?",
        // Using .map, it loops over results of role and runs through every department name in DB
        choices: res.map(department => department.department_name)
      }
    ])
      .then(({ roleTitle, roleSalary, roleID }) => {
        // Store dept id # in a variable
        var deptID;
        // Loop over the results and if the deptartment_name input is equal to an existing department ID, then assign the variable deptID to the actual department id
        res.map(finds => {
          if (finds.department_name === roleID) {
            deptID = finds.id;
            // Insert user input into the role table in DB
            con.query("INSERT INTO role SET ?",
              {
                title: roleTitle,
                salary: roleSalary,
                department_id: deptID
              });
            console.log("You've added a new role!");
          }
        })
        con.query("SELECT * FROM role", (err, res) => {
          console.table(res);
          startPrompt();
        })
      });
  });
};

// Function to update the employees role where user will be asked to choose an employee and a role to then update to
function updateRole() {
  // Query statemtnt to select all info from employee table
  con.query("SELECT * FROM employee", (err, res) => {

    inquirer.prompt([
      {
        name: "employeeID",
        type: "rawlist",
        message: "Which employee role do you want to update?",
        choices: () => {
          var empArr = [];
          res.forEach((data) => {
            var name = (data.first_name + " " + data.last_name)
            var value = data.id
            empArr.push({ name, value })
          })
          console.log(empArr);
          return empArr;
        }
      }
    ])
      // Promise statement to pass through user input for which employee to update + query statment to select all info from the role table
      .then((empmloyeeAnswer) => {
        con.query("SELECT * FROM role", (err, roleRes) => {
          inquirer.prompt([
            {
              name: "employeeRole",
              type: "list",
              message: "What is the employees new role?",
              choices: () => {
                var roleArr = [];
                roleRes.forEach((data1) => {
                  var name = data1.title
                  var value = data1.id
                  roleArr.push({ name, value })
                })
                return roleArr;
              }
            }
          ])
            // Promise statement to pass through user input for which role then want to update the employee to
            .then((roleAnswer) => {
              for (var i = 0; i < roleRes.length; i++) {
                if (roleAnswer.employeeRole === (roleRes[i].id)) {
                  // Query statement to update the table of which employee role was updated
                  con.query("UPDATE employee SET ? WHERE ?",
                    [
                      {
                        role_id: roleAnswer.employeeRole
                      },
                      {
                        id: empmloyeeAnswer.employeeID
                      }
                    ],
                  );
                };
              };
              startPrompt();
            });
        });
      });
  });
};
