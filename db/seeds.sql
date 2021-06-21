USE my_companyDB;

INSERT INTO departments (name)
VALUES ('R&D'), ('Process Development'), ('Production'), ('Quality Control'), ('Quality Assurance'), ('Facilities'), ('Corporate');





INSERT INTO roles (title, salary, department_id)
VALUES ('Site Head', 250000, 7),
    ('Research Associate', 65000, 1), ('Scientist', 165000, 1), ('Lead Scientist', 189000, 1), 
    ('Chemist', 67000, 2), ('Engineer', 110000, 2), ('Process Development Manager', 145000, 2),
    ('Associate I', 55000, 3), ('Associate II', 70000, 3), ('Production Supervisor', 89000, 3),
    ('Analyst', 75000, 4), ('QC Manager', 112000, 4),
    ('Reviewer', 72000, 5), ('QA Manager', 118000, 5),
    ('Janitor', 52000, 6), ('Technician', 78000, 6), ('Facilities Manager', 115000, 6);
    




INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Doe', 1, null), 
        ('Bay', 'Lee', 4, 1),
        ('John', 'Smith', 7, 1),
        ('Jasper', 'Fels', 10, 1),
        ('Violet', 'Ptery', 12, 1),
        ('Sonny', 'Orping', 14, 1),
        ('Speck', 'Flurry', 17, 1),
        ('Buster', 'Orange', 2, 4),
        ('Oracle', 'Equin', 3, 4),
        ('Red', 'Hoover', 5, 7),
        ('Jen', 'Berry', 6, 7),
        ('Jill', 'Hill', 8, 10),
        ('Jack', 'Wasser', 9, 10),
        ('June', 'Sebring', 11, 12),
        ('Aurora', 'Schlaf', 13, 14),
        ('Cinder', 'Ella', 15, 17),
        ('Fora', 'Faun', 16, 17);