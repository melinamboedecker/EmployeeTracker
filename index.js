const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'word123',
  database: 'my_companyDB',
});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
  });
  
console.log(' ________________________________________________________________')
console.log('')
console.log('                Employee Tracker                                 ')
console.log(' ________________________________________________________________')
console.log('')
console.log('')



const runSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all employees by department',
          'View all employees by manager',
          'Add employee',
          'Remove employee',
          'Update employee role',
          'Update employee manager',
          'View all roles',
          'Add role',
          'Remove role',
          'View all departments',
          'Add department',
          'Remove department',
          'exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all employees':
            viewAllEmployees();
            break;
  
          case 'View all employees by department':
            viewAllEmployeesbyDept();
            break;
  
          case 'View all employees by manager':
            viewAllEmployeesbyMgr();
            break;
  
          case 'Add employee':
            //   console.log('add emp')
            addEmployee();
            break;

          case 'Remove employee':
            removeEmployee();
            break;
            
          case 'Update employee role':
            updateEmployeeRole();
            break;

          case 'Update employee manager':
              console.log('update emp mgr')
            // updateEmployeeManager();
            break; 

          case 'View all roles': 
            viewAllRoles();
            break;

          case 'Add role':  
            addRole();
            break;    
  
          case 'Remove role':   
            removeRole();
            break;

          case 'View all departments':   
            viewAllDepartments();
            break;

          case 'Add department': 
            addDepartment();
            break;
    
          case 'Remove department': 
            removeDepartment();
            break;

          case 'exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

  const viewAllEmployees = () => {
    const query = 'SELECT employees.id AS "employee id", employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary, CONCAT (m.first_name, " ", m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id JOIN employees m ON employees.manager_id = m.id';

    connection.query(query, (err, res) => {
        console.log('\n');
        console.table(res);
        runSearch();
      });
  };

const viewAllEmployeesbyDept = () => {
    const query = 'SELECT departments.name AS Department, employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role, employees.manager_id AS "Manager ID" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.name'

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        runSearch();
      });
};

const viewAllEmployeesbyMgr = () => {
    const query = 'SELECT employees.manager_id AS "Manager ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role FROM employees LEFT JOIN roles ON employees.role_id = roles.id ORDER BY employees.manager_id'

    connection.query(query, (err, res) => {
        console.log('\n');
        console.table(res);
        runSearch();
      });


    console.table([
        query
    ])
};

const addEmployee = () => {
    inquirer
      .prompt([{
        name: 'firstname',
        type: 'input',
        message: "What is the employee's first name?",
      },
      {
        name: 'lastname',
        type: 'input',
        message: "What is the employee's last name?",
      },
      {
        name: 'role_ID',
        type: 'input',
        message: "What is the employee's role ID number?",
      },
      {
        name: 'manager_ID',
        type: 'input',
        message: "What is the employee's manager ID number?",
      }
    ])
      .then((answer) => {
        //when questions finished, insert information into employees table in db
        connection.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.role_ID,
                manager_id: answer.manager_ID
            },
            (err) => {
                if (err) throw err;
                console.log('Employee entered successfully');
                //go back to main menu
                runSearch();
            }
        );
      });
};
  
const removeEmployee = () => {
    console.log('make fn to remove employee here')
  
    let emps;
   const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
        const emps = res
        console.log(emps);
    })
//     inquirer
//     .prompt([{
//       name: 'employeetoremove',
//       type: 'list',
//       message: "Which employee do you wish to remove?",
//       choices: [emps]
//     },
//   ])
    // .then((answer) => {
    //     console.log('now delete')
    //   //when questions finished, insert information into employees table in db
    //   connection.query(
    //       'INSERT INTO employees SET ?',
    //       {
    //           first_name: answer.firstname,
    //           last_name: answer.lastname,
    //           role_id: answer.role_ID,
    //           manager_id: answer.manager_ID
    //       },
    //       (err) => {
    //           if (err) throw err;
    //           console.log('Employee entered successfully');
    //           //go back to main menu
    //           runSearch();
    //       }
    //   );
    // });
}; 


const updateEmployeeRole = () => {
    console.log('write update EMp role functino');
    const query = 'SELECT * FROM employees'
    let employees;

    connection.query(query, (err, res) => {
        if (err){
            throw err;
        }
        employees = res
        console.log(res)
    })




    inquirer
      .prompt([{
        name: 'employeetoupdate',
        type: 'list',
        message: "Which employee do you want to update?",
      },
    ])
        .then((answer) => {
            //put answer here and pull current role from it
        })



        .prompt([{
            name: 'new role',
            type: 'input',
            message: "Enter new role ID",
          },
        ])

      .then((answer) => {
        //when questions finished, update employee role in db
        connection.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.role_ID,
                manager_id: answer.manager_ID
            },
            (err) => {
                if (err) throw err;
                console.log('Employee entered successfully');
                //go back to main menu
                runSearch();
            }
        );
      });

};


const viewAllRoles = () => {
    const query = 'SELECT roles.id, title, salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id';

    connection.query(query, (err, res) => {
        console.log('\n');
        console.table(res);
        runSearch();
      });

  };


const addRole = () => {
    let departments = [];
    const query = 'SELECT name FROM departments';

    connection.query (query, (err, res) => {
        if (err) throw err;
        res.forEach ((d)=>{
            departments.push(d.name)
        })
    
    console.log(departments)
    inquirer
      .prompt([{
        name: 'title',
        type: 'input',
        message: "What is the title?",
      },
      {
        name: 'salary',
        type: 'input',
        message: "What is the salary?",
      },
    //   {
    //     name: 'department',
    //     type: 'list',
    //     message: "What is the department?",
    //     choices: departments
    //   },
      {
          name: 'department_ID',
          type: 'input',
          message: 'What is the department_id?'
      }
      
    ])
      .then((answer) => {
        //when questions finished, insert information into roles table in db

        connection.query(
            'INSERT INTO roles SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_ID
            },
            (err) => {
                if (err) throw err;
                console.log('Role entered successfully');
                //go back to main menu
                runSearch();
            }
        );
      });

    });
};

const removeRole= () => {
    const query = 'SELECT title FROM roles';
    let roles = [];

    connection.query (query, (err, res) => {
        if (err) throw err;
        res.forEach ((r)=>{
            roles.push(r.title)
        })
        roles.push("exit");
        
        inquirer
        .prompt([{
          name: 'role',
          type: 'list',
          message: "What role do you want to delete? or choose exit to return to main menu",
          choices: roles
        },
      ])
        .then((answer) => {
          //when role chosen, delete it from db
          if (answer.role === 'exit') {
            runSearch();
          } else {
            connection.query(
                'DELETE FROM roles WHERE ?',
                {
                    title: answer.role,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Role ' + answer.role + ' deleted successfully');
                    //go back to main menu
                    runSearch();
                }
            );  
            }
        });

      });
};


const viewAllDepartments = () => {
    const query = 'SELECT id, name AS "department name" FROM departments';

    connection.query(query, (err, res) => {
        console.log('\n');
        console.table(res);
        runSearch();
      });
  };

const addDepartment = () => {
    inquirer
      .prompt([{
        name: 'name',
        type: 'input',
        message: "What is the department name?",
      },
    ])
      .then((answer) => {
        //when questions finished, insert information into departments table in db
        connection.query(
            'INSERT INTO departments SET ?',
            {
                name: answer.name,
            },
            (err) => {
                if (err) throw err;
                console.log('Department entered successfully');
                //go back to main menu
                runSearch();
            }
        );
      });
};

const removeDepartment = () => {
    const query = 'SELECT name FROM departments';
    let departments = [];

    connection.query (query, (err, res) => {
        if (err) throw err;
        res.forEach ((d)=>{
            departments.push(d.name)
        })
        departments.push("exit");
        
        inquirer
        .prompt([{
          name: 'department',
          type: 'list',
          message: "What department do you want to delete? or choose exit to return to main menu",
          choices: departments
        },
      ])
        .then((answer) => {
          //when department chosen, delete it from db
          if (answer.department === 'exit') {
            runSearch();
          } else {
            connection.query(
                'DELETE FROM departments WHERE ?',
                {
                    name: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Department ' + answer.department + ' deleted successfully');
                    //go back to main menu
                    runSearch();
                }
            );  
            }
        });

      });
};