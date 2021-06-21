const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { registerPrompt } = require('inquirer');

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
            updateEmployeeManager();
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
    const query = 'SELECT employees.id AS "employee id", employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT (m.first_name, " ", m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON employees.manager_id = m.id';

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        runSearch();
      });
  };

const viewAllEmployeesbyDept = () => {
    let departments = [];
    const query = 'SELECT name FROM departments'
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach ((d)=>{
            departments.push(d.name)
        })
        
        inquirer
        .prompt([{
          name: 'department',
          type: 'list',
          message: "For which department do you want to view all employees?",
          choices: departments
        },
      ])
        .then((answer) => {
          //when department chosen, run query to show only employees from that department
            connection.query(
                'SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS "Manager", departments.name AS Department FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON employees.manager_id = m.id WHERE departments.name = ' + connection.escape(answer.department), 
                (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.table(res);
                    //go back to main menu
                    runSearch();
                }
            );        
        });
    })
};

const viewAllEmployeesbyMgr = () => {
    let managers = [];
    let noDuplicateManagers = [];

    const query = 'SELECT CONCAT(m.first_name, " ", m.last_name) AS manager FROM employees LEFT JOIN employees m ON employees.manager_id = m.id'
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach ((m)=>{
            if (m.manager === null) {
                delete(m)
            } else {
            managers.push(m.manager)
            }
        })

        noDuplicateManagers = [...new Set(managers)];
        
        inquirer
        .prompt([{
          name: 'manager',
          type: 'list',
          message: "For which manager do you want to view all employees?",
          choices: noDuplicateManagers
        },
      ])
        .then((answer) => {
          //when department chosen, run query to show only employees from that department
            connection.query(
                'SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role, roles.salary, departments.name AS Department, CONCAT(m.first_name, " ", m.last_name) AS "Manager"  FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON employees.manager_id = m.id WHERE CONCAT(m.first_name, " ", m.last_name) = ' + connection.escape(answer.manager), 
                (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.table(res);
                    //go back to main menu
                    runSearch();
                }
            );        
        });
    })
 
};

const addEmployee = () => {
    let roles = [];
    let rolesWithIds = [];
    let managers = [];
    let managersWithIds = [];
    let newId;
    let mgrId;

    connection.query('SELECT title FROM roles', (err, res) => {
        if (err) throw err;

        res.forEach ((r)=>{
            roles.push(r.title)
        })
        getRolesWithIds()
    });


    const getRolesWithIds = () => {
        connection.query('SELECT id, title FROM roles', (err, res) => {
            if (err) throw err;

            rolesWithIds = res;
            getManagersWithIds();
        })
    }

    const getManagersWithIds = () => {
        connection.query('SELECT id, CONCAT(id, " ", first_name, " ", last_name) AS name FROM employees', (err, res) => {
            if (err) throw err;

            managersWithIds = res;
            getManagers();
        })

    }

    const getManagers = () => {
        connection.query('SELECT CONCAT(id, " ", first_name, " ", last_name) AS manager FROM employees', (err, res) => {
            if (err) throw err;
            res.forEach ((m)=>{
                if (m.manager === null) {
                    delete(m)
                } else {
                managers.push(m.manager)
                }
            })
            managers.push('none');

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
              name: 'role',
              type: 'list',
              message: "What is the employee's role?",
              choices: roles
            },
            {
              name: 'manager',
              type: 'list',
              message: "Who is the employee's manager?",
              choices: managers
            }
          ])
            .then((answer) => {
              //when questions finished, insert information into employees table in db
              for (i=0; i<rolesWithIds.length; i++) {
                if (rolesWithIds[i].title === answer.role) {
                    newId =  rolesWithIds[i].id;
                }
            }

            for (i=0; i<managersWithIds.length; i++) {
                if (managersWithIds[i].name === answer.manager) {
                    mgrId = managersWithIds[i].id
                }
            }

              connection.query(
                  'INSERT INTO employees SET ?',
                  {
                      first_name: answer.firstname,
                      last_name: answer.lastname,
                      role_id: newId,
                      manager_id: mgrId
                  },
                  (err) => {
                      if (err) throw err;
                      console.log('Employee entered successfully');
                      //go back to main menu
                      runSearch();
                  }
              );
            });

        });

    };


     

 
};
  
const removeEmployee = () => {
    let employees = [];
    let empIdToDele;
    let empNameToDele;

    connection.query ('SELECT id, CONCAT (id, " ", first_name, " ", last_name) AS name FROM employees', (err, res) => {
        if (err) throw err;

        res.forEach ((e)=>{
            employees.push(e)
        })
        employees.push("exit");
        
        inquirer
        .prompt([{
          name: 'name',
          type: 'list',
          message: "Which employee do you want to delete? or choose exit to return to main menu",
          choices: employees
        },
      ])
        .then((answer) => {
          //when employee chosen, delete it from db

          //set employee name to delete to variable so that it can be printed in the console when deletion performed
          empNameToDele = answer.name

          if (answer.name === 'exit')  {
            runSearch();
          } else {
            for (i=0; i<employees.length; i++) {
                if (employees[i].name === answer.name) {
                    empIdToDele =  employees[i].id;
                    deleEmp();
                }
            }
        }
    });

        const deleEmp = () => {
            connection.query(
                'DELETE FROM employees WHERE ?',
                {
                    id: empIdToDele,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee ' + empNameToDele + ' deleted successfully');
                    //go back to main menu
                    runSearch();
                }
            );  
        }  
        // );
    });

}; 


const updateEmployeeRole = () => {
    
    const query = 'SELECT CONCAT (id, " ", first_name, " ", last_name) AS name FROM employees'
    let employees = [];
    let roles = [];
    let rolesWithIds = [];
    let newId;
    let updateThisEmployee;

    connection.query(query, (err, res) => {
        if (err) throw err;

        res.forEach ((e)=>{
            employees.push(e)
        })
        findRoles();
    })
        
    const findRoles = () => {
            connection.query('SELECT title FROM roles', (err, res) => {
            if (err) throw err;

            res.forEach ((r)=>{
                roles.push(r.title)
            })
            getRolesWithIds();
        })
    };

    const getRolesWithIds = () => {
            connection.query('SELECT id, title FROM roles', (err, res) => {
                if (err) throw err;

                rolesWithIds = res;
                getEmpRoleAnswer();
            })
    }

    const getEmpRoleAnswer = () => {
        inquirer
        .prompt([{
            name: 'employeetoupdate',
            type: 'list',
            message: "Which employee do you want to update?",
            choices: employees
        },
        {
            name: 'newrole',
            type: 'list',
            message: "Which role do you want to assign this employee?",
            choices: roles
        }
    ])
        .then((answer) => {
               //when questions finished, update employee role in db
               updateThisEmployee = answer.employeetoupdate;
               for (i=0; i<rolesWithIds.length; i++) {
                   if (rolesWithIds[i].title === answer.newrole) {
                       newId =  rolesWithIds[i].id;
                        updateRole();
                   }
               }
            });
        }          
        const updateRole = () => {
            connection.query(
                'UPDATE employees SET role_id = ' + connection.escape(newId) + ' WHERE CONCAT (id, " ", first_name, " ", last_name) = ' + connection.escape(updateThisEmployee),
                (err, res) => {
                if (err) throw err;
                console.log('Employee role updated successfully');
                //go back to main menu
                runSearch();
            }
        );
        }     
        
};

const updateEmployeeManager = () => {

        
    const query = 'SELECT CONCAT (id, " ", first_name, " ", last_name) AS name FROM employees'
    let employees = [];
    let managers = [];
    let empsWithIds = [];
    let newMgrId;
    let updateThisEmployee;

    connection.query(query, (err, res) => {
        if (err) throw err;

        res.forEach ((e)=>{
            employees.push(e)
        })
        findManagers();
    })
        
    const findManagers = () => {
            connection.query('SELECT CONCAT (employees.manager_id, " ", m.first_name, " ", m.last_name) AS mgrname FROM employees INNER JOIN employees m ON employees.manager_id = m.id', (err, res) => {
            if (err) throw err;

            res.forEach ((m)=>{
                managers.push(m.mgrname)
            })
            getEmpsWithIds();
        })
    };

    const getEmpsWithIds = () => {
        connection.query('SELECT id, CONCAT (id, " ", first_name, " ", last_name) AS name FROM employees', (err, res) => {
            if (err) throw err;

            empsWithIds = res;
            getMgrAnswer();
        })
}

    const getMgrAnswer = () => {
        inquirer
        .prompt([{
            name: 'employeetoupdate',
            type: 'list',
            message: "Which employee do you want to update?",
            choices: employees
        },
        {
            name: 'newmgr',
            type: 'list',
            message: "Which manager do you want to assign this employee?",
            choices: employees
        }
    ])
        .then((answer) => {
               //when questions finished, update manager in db
               updateThisEmployee = answer.employeetoupdate;
               console.log(empsWithIds.length)
               for (i=0; i<empsWithIds.length; i++) {
                   if (empsWithIds[i].name === answer.newmgr) {
                       newMgrId =  empsWithIds[i].id;
                        updateMgr();
                   }
               }
            });
        }          
        const updateMgr = () => {
            connection.query(
                'UPDATE employees SET manager_id = ' + connection.escape(newMgrId) + ' WHERE CONCAT (id, " ", first_name, " ", last_name) = ' + connection.escape(updateThisEmployee),
                (err, res) => {
                if (err) throw err;
                console.log('Employee manager upated successfully');
                //go back to main menu
                runSearch();
            }
        );
        }  

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
      {
        name: 'department',
        type: 'list',
        message: "What is the department?",
        choices: departments
      },
    //   {
    //       name: 'department_ID',
    //       type: 'input',
    //       message: 'What is the department_id?'
    //   }
      
    ])
      .then((answer) => {
        //when questions finished, find department_id for chosen department 
        connection.query('SELECT * FROM departments WHERE departments.name = ' + connection.escape(answer.department), 
        (err, res) => {
            if (err) throw err; 
        //insert information into roles table in db
        connection.query(
            'INSERT INTO roles SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: res[0].id
            },
            (err) => {
                if (err) throw err;
                console.log('Role entered successfully');
                //go back to main menu
                runSearch();
            }
        );
        })
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