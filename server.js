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
            // "view all roles",
            // "view all employees", 
            // "add a department",
            // "add a role",
            // "add an employee",
            // "update an employee role",
            "quit"
        ]
    }])
    switch (ans.choice){
        case "view all departments":
            await getDepartments();
            break;
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
    function quit(){
        process.exit()
        return false
    }
init();