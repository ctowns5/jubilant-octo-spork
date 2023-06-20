const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'piFyP89%c2',
    database: 'emp_db'
    },
    console.log(`Connected to the emp_db database.`)
);