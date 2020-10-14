DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE employee_tracker_DB;
USE employee_tracker_DB;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id)
-- FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT (10) NOT NULL,
manager_id INT (10) NULL,
PRIMARY KEY (id)
-- FOREIGN KEY (role_id) REFERENCES role (id),
-- FOREIGN KEY (manager_id) REFERENCES employee (id)
);