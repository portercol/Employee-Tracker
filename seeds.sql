INSERT INTO department (department_name) 
VALUES 
      ("Engineer"), 
      ("Sales"), 
      ("Business Development"),
      ("Marketing"), 
      ("Human Resources");


INSERT INTO role (title, salary, department_id) 
VALUES 
      ("Sr. Engineer", 100000, 1), 
      ("Jr. Developer", 60000, 1), 
      ("Sales Rep", 80000, 2), 
      ("BD Director", 70000, 3), 
      ("Marketing Analyst", 90000, 4), 
      ("HR Director", 65000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
      ("Josh", "Martin", 2, null), 
      ("Taylor", "Mitchell", 3, null), 
      ("Cameron", "Harrell", 1, null), 
      ("Collin", "Davis", 5, null), 
      ("Nate", "Christiansen", 6, null), 
      ("Eric", "Armstrong", 4, null);
