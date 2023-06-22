const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');
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
            // "add an employee",
            // "update an employee role",
            // "Update an employee's manager",
            // "View employees by manager",
            // "View employees by department",
            // "Remove a department",
            // "Remove a role",
            // "Remove an employee"
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
        case "update an employee role":
            await updEmpRole()
            break;
        // case "update an employee's manager":
        //     await getRoles()
        //     break;
        // case "view employees by manager":
        //     await getEmployees()
        //     break;
        // case "view employees by department":
        //     await getRoles()
        //     break;
        // case "remove a department":
        //     await getRoles()
        //     break;
        // case "remove a role":
        //     await getRoles()
        //     break;
        // case "remove an employee":
        //     await getRoles()
        //     break;
        case "quit":
            await quit()
            break;   
    }
}
async function getDepartments (){
    const response = await query("select * from department")
    console.table(response)
    init()
}
async function getRoles (){
    const response = await query("select * from role")
    console.table(response)
    init()
}
async function getEmployees (){
    const response = await query("select * from employee")
    console.table(response)
    init()
}
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

async function addEmployee (){
    const response = await query("INSERT INTO employee (first_name, last_name, role_id, manager_id)")
    console.table(response)
    init()
}
async function updEmpRole (){
    const response = await query("update employees role")
    console.table(response)
    init()
}
function quit(){
    process.exit()
    return false
}
init();