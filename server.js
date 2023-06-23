const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');
const figlet = require("figlet")
const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'piFyP89%c2',
    database: 'emp_db'
    },
    console.log(`Connected to the emp_db database.`)
);
const query = util.promisify(db.query).bind(db);

async function init(){
//console.clear()
// figlet.text("HR System", function (err, data){
//     console.log(data)
// })
    const ans = await inquirer.prompt([{
        type:"list",
        message : "What would you like to do?",
        name: "choice",
        choices:[
            "view all departments",
            "view all roles",
            "view all employees", 
            "add a department",
            "add a role",
            "add an employee",
            "update an employee's role",
            "delete a department",
            "delete a role",
            "delete an employee",
            "quit"
        ]
    }])
    switch (ans.choice){
        case "view all departments":
            await getDepartments();
            break;
        case "view all roles":
            await getRoles()
            break;
        case "view all employees":
            await getEmployees()
            break;
        case "add a department":
            await addDept()
            break;
        case "add a role":
            await addRole()
            break;
        case "add an employee":
            await addEmployee()
            break;
        case "update an employee's role":
            await updEmpRole()
            break;
        case "delete a department":
            await deleteDept()
            break;
        case "delete a role":
            await deleteRole()
            break;
        case "delete an employee":
            await deleteEmployee()
            break;
        case "quit":
            await quit()
            break;   
    }
};

async function getDepartments (){
    const response = await query("select * from department")
    console.table(response)
    init()
};

async function getRoles (){
    const response = await query("select * from role")
    console.table(response)
    init()
};

async function getEmployees (){
    const response = await query("select * from employee")
    console.table(response)
    init()
};

const addDept = () => {
    return inquirer.prompt([
    {
        type: "input",
        name: "name",
        message: "What is the name of the new department?",
        validate: nameInput => {
        if (nameInput) {
        return true;
        } else {
            console.log("Please enter a department name");
            return false;
        };
        }
    }
    ])
    .then(answer => {
    const sql = `INSERT INTO department (name)
        VALUES (?)`;
    const params = answer.name;
    db.query(sql, params, (err) => {
        if (err) {
        throw err;
        }
        console.clear()
        console.log("Department added!");
        return init();
    });
    });
};

const addRole = () => {
    return inquirer.prompt([
    {
        type: "input",
        name: "title",
        message: "What is the title for this role?",
        validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log("Please enter a role name");
            return false;
        };
        }
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
        validate: salaryInput => {
        if (isNaN(salaryInput)) {
            console.log("Please enter a salary");
            return false;
        } else {
            return true;
        };
        }
    }
    ])
    .then (answer => {
    const params = [answer.title, answer.salary];
      const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
        throw err;
        }
        const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "What department does this role belong to?",
            choices: departments
        }
        ])
        .then(departmentAnswer => {
        const department = departmentAnswer.department;
        params.push(department);
        const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
        db.query(sql, params, (err) => {
            if (err) {
            throw err;
            }
            console.clear()
            console.log("Role added!");
            return init();
        });
        });
    });
    });
};

const addEmployee = () => {
    return inquirer.prompt([
    {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log("Please enter a name");
            return false;
        };
        }
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: nameInput => {
        if (nameInput) {
            return true;
        } else {
            console.log("Please enter a name");
            return false;
        };
        }
    }
    ])
    .then (answer => {
    const params = [answer.firstName, answer.lastName];
      const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
        if (err) {
        throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "What is the role of this employee?",
            choices: roles
        }
        ])
        .then(roleAnswer => {
        const role = roleAnswer.role;
        params.push(role);
          const sql = `SELECT * FROM employee`;
        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
            }
            const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
            managers.push({name: "No manager", value: null});
            inquirer.prompt([
            {
                type: "list",
                name: "manager",
                message: "Who is this employee's manager?",
                choices: managers
            }
            ])
            .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.push(manager);
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
            db.query(sql, params, (err) => {
                if (err) {
                throw err;
                }
                console.clear()
                console.log("Employee added!");
                return init();
            });
            });
        });
        });
    });
    });
};

const updEmpRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
        db.query(sql, (err, rows) => {
        if (err) {
        throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
    {
    type: "list",
    name: "employee",
    message: "Which employee's role would you like to update?",
    choices: employees
    }
    ])
    .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT title, id FROM role`;
        db.query(sql, (err, rows) => {
        if (err) {
        throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
        {
        type: "list",
        name: "role",
        message: "What is the new role of this employee?",
        choices: roles
        }
        ])
    .then(roleAnswer => {
        const role = roleAnswer.role;
        params.unshift(role);
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
        db.query(sql, params, (err) => {
        if (err) {
        throw err;
        }
        console.clear()
        console.log("Employee updated!");
        return init();
        });
        });
        });
    });
    });
};

const deleteDept = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, rows) => {
    if (err) {
    throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
    {
    type: "list",
    name: "department",
    message: "Which department would you like to delete?",
    choices: departments
    }
    ])
    .then(departmentAnswer => {
        const department = departmentAnswer.department
        const params = department;
        const sql = `DELETE FROM department WHERE id = ?`
            db.query(sql, params, (err) => {
            if (err) {
            throw err;
        }
        console.clear()
        console.log("Department deleted!");
            return init();
        });
    });
    });
};

const deleteRole = () => {
    const sql = `SELECT id, title FROM role`
    db.query(sql, (err, rows) => {
        if (err) {
        throw err;
    }
    const roles = rows.map(({title, id}) => ({name: title, value: id}));
    inquirer.prompt([
    {
    type: "list",
    name: "role",
    message: "Which role would you like to delete?",
    choices: roles
    }
    ])
    .then(roleAnswer => {
        const role = roleAnswer.role
        const params = role;
        const sql = `DELETE FROM role WHERE id = ?`
        db.query(sql, params, (err) => {
            if (err) {
            throw err;
        }
        console.clear()
        console.log("Role deleted!");
        return init();
        });
    });
    });
};

const deleteEmployee = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
    db.query(sql, (err, rows) => {
        if (err) {
        throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
    {
    type: "list",
    name: "employee",
    message: "Which employee would you like to remove?",
    choices: employees
    }
    ])
    .then(employeeAnswer => {
        const employee = employeeAnswer.employee
        const params = employee;
        const sql = `DELETE FROM employee WHERE id = ?`
        db.query(sql, params, (err) => {
            if (err) {
            throw err;
        }
        console.clear()
        console.log("Employee removed!");
        return init();
        });
    });
    });
};

function quit(){
    process.exit()
    return false
};

init();