INSERT INTO department (name)
VALUES ("IT"),
       ("Engineering"),
       ("Sales"),
       ("HR"),
       ("Manufacturing"),
       ("Exec"),
       ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("Server Admin", 100000, 1),
       ("Desktop Support", 80000, 1),
       ("Sr. Dev", 180000, 2),
       ("Jr. Dev", 130000, 2),
       ("Account Manager", 150000, 3),
       ("Systems Emgineer", 125000, 3),
       ("HR Manager", 150000, 4),
       ("HR Associate", 120000, 4),
       ("MFG manager", 115000, 5),
       ("Assembly Technician", 70000, 5),
       ("Support Manager", 135000, 7),
       ("COO", 275000, 6),
       ("Customer Service Rep", 75000, 7);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rosa","Herrington", 12, null),
       ("Andrew","Horvath", 11, 1),
       ("Vicente","Barr", 9, 1),
       ("Breanna","Richard", 7, 1),
       ("Janette","Rowan", 4, 1),
       ("Kirk","Sargent", 5, 1),
       ("Analise","Brewer", 1, 1),
       ("Nehemiah","Kirk", 2, 1),
       ("Kaylynn","Eads", 3, 1),
	   ("Jaylyn","Cook", 8, 7),
       ("Samantha","Barnard", 4, 1),
       ("Chase","Templeton", 6, 1),
       ("Kerri","Tang", 5, 1),
       ("Edmund","Churchill", 10, 3),
       ("Irvin","Mattson", 13, 2),
       ("Kendyl","Stovall", 13, 2),
       ("Carlo","Robins", 3, 1),
       ("Danika","Houston", 8, 7),
       ("Racheal","Pereira", 13, 2);