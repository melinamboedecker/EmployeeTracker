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
console.log('                Employee Tracker                                  ')
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
            viewEmployees();
            break;
  
          case 'View all employees by department':
            console.log('view all emp by dept')
            // viewAllEmployeesbyDept();
            break;
  
          case 'View all employees by manager':
            console.log('view all emp by mgr')
            // viewAllEmployeesbyMgr();
            break;
  
          case 'Add employee':
            //   console.log('add emp')
            addEmployee();
            break;

          case 'Remove employee':
              console.log('remove emp')
            // removeEmployee();
            break;
            
          case 'Update employee role':
              console.log('update emp role')
            // updateEmployeeRole();
            break;

          case 'Update employee manager':
              console.log('update emp mgr')
            // updateEmployeeManager();
            break; 

          case 'View all roles':
              console.log('view all roles')   
            // viewAllRoles();
            break;

          case 'Add role':
            console.log('add roles')   
            //addRole();
            break;    
  
          case 'Remove role':
            console.log('remove role')   
            //removeRole();
            break;

          case 'View all departments':
            console.log('view all departments')   
            //viewAllDepartments();
            break;

          case 'Add department':
            console.log('add department')   
            //addDepartment();
            break;
    
          case 'Remove department':
            console.log('remove department')   
            //removeDepartment();
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

  const viewEmployees = () => {
    const query = 'SELECT * FROM employees';

    connection.query(query, (err, res) => {
        console.log('\n');
        console.table(res);
        runSearch();
      });


    console.table([
        query
    ])
    runSearch();
  }

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
          console.log(answer.firstname)
        //when questions finished, insert information into employees table in db
        connection.query(
            // console.log(answer.firstname)
            // console.log(answer.lastname);
            // console.log(answer.role_id);
            // console.log(answer.manager_id);
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.role_id,
                manager_id: answer.manager_id
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
  
  