USE my_companyDB;

INSERT INTO departments (name)
VALUES ('Legal'), ('Production')





INSERT INTO roles (title, salary, department_id)
VALUES ('Manager', 150000, 7), ('Engineer', 102000, 8), ('Laywer', 165000, 11), ('Associate', 45000, 6)




INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 5, null)