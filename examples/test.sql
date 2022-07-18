/* From https://github.com/ckaradeniz/db-project/tree/master/sqlfiles */

select * from SCRUMTEAM_;

--adding new column
alter table SCRUMTEAM_ add salary Integer;

--update existing employees salary

update SCRUMTEAM_ set salary = 100000 where EMP_ID =1;

update SCRUMTEAM_ set salary = 90000 where EMP_ID = 2;

update SCRUMTEAM_ set salary = 120000 where EMP_ID = 4;

--rename the column
alter table SCRUMTEAM_ rename column salary to annual_salary;


---delete, drop column
alter table SCRUMTEAM_ drop column annual_salary;

--how to change table name?
alter table scrumteam_ rename to agileteam_;

select * from agileteam_;

--truncate, if we want to delete all data from the table, but still keep the table structure, we use truncate

truncate table agileteam_;

--if we want to delete the table and data together
drop table agileteam_;

select * from customer;

select * from address;

create table Developers(
                           Id_Number Integer primary key,
                           Names varchar(30),
                           Salary Integer
);
create table Testers(
                        Id_Number Integer primary key,
                        Names varchar(30),
                        Salary Integer
);

insert into developers values (1, 'Mike', 155000);
insert into developers values (2, 'John', 142000);
insert into developers values (3, 'Steven', 850000);
insert into developers values (4, 'Maria', 120000);
insert into testers values (1, 'Steven', 110000);
insert into testers values(2, 'Adam', 105000);
insert into testers values (3, 'Lex', 100000);

commit work;

/*
create table syntax:
    create table TableName(
        colName1 DataType Constraints,
        colName2 DataType Constraints(optional)
        colName3 DataType Constraints,
        ...
    );
*/

create table ScrumTeam_(
  Emp_ID Integer PRIMARY KEY,
  FirstName varchar(30) not null,
  LastName varchar(30),
  JobTitle varchar(20)

);

select * from ScrumTeam_;


/*
INSERT INTO tableName (column1, column2,…)
VALUES (value1, value2 … );
*/

INSERT INTO ScrumTeam_ (emp_id,firstname,lastname,jobtitle)
VALUES (1,'Severus','Snape','Tester');

INSERT INTO ScrumTeam_ VALUES (2,'Harold','Finch','Developer');

INSERT INTO ScrumTeam_ VALUES (3,'Phoebe','Buffay','ScrumMaster');

INSERT INTO ScrumTeam_ VALUES (4,'Michael','Scofield','PO');


--how to update data
/*
UPDATE table_name
SET column1 = value1,
column2 = value2 , …
WHERE condition;
*/

update ScrumTeam_
set JOBTITLE = 'Tester'
where EMP_ID = 4;

--Delete from table
/*
DELETE FROM table_name
WHERE condition;
*/

delete from ScrumTeam_
where EMP_ID = 3;

select * from ScrumTeam_;

--saving changes
commit;

CREATE TABLE address(

                        address_id Integer PRIMARY KEY,
                        address VARCHAR(50) NOT NULL,
                        phone Integer NOT NULL

);


INSERT INTO address (address_id, address, phone) VALUES (5,  '1913 Hanoi Way'  ,  28303384);
INSERT INTO address (address_id, address, phone) VALUES (7,  '692 Joliet Street'  ,  44847719);
INSERT INTO address (address_id, address, phone) VALUES (8,  '1566 Inegl Manor'  ,  70581400);
INSERT INTO address (address_id, address, phone) VALUES (10,  '1795 Santiago '  ,  86045262);
INSERT INTO address (address_id, address, phone) VALUES (11,  '900 Santiago '  ,  16571220);


CREATE TABLE customer(

                         customer_id Integer PRIMARY KEY,
                         first_name VARCHAR(50) NOT NULL,
                         last_name VARCHAR(50)NOT NULL,
                         address_id Integer REFERENCES address(address_id)

);


INSERT INTO customer (customer_id, first_name, last_name, address_id) VALUES (1, 'Mary' ,  'Smith',  5);
INSERT INTO customer (customer_id, first_name, last_name, address_id) VALUES (2,  'Patricia' ,  'Johnson' ,  NULl);
INSERT INTO customer (customer_id, first_name, last_name, address_id) VALUES (3,  'Linda' ,  'Williams' ,  7);
INSERT INTO customer (customer_id, first_name, last_name, address_id) VALUES (4, 'Barbara' ,  'Jones' , 8);
INSERT INTO customer (customer_id, first_name, last_name, address_id) VALUES (5,  'Elizabeth' ,  'Brown' ,  NULL);


commit work;

select * from customer;

select * from address;

select first_name,last_name,address,PHONE
from customer join ADDRESS
on customer.ADDRESS_ID = ADDRESS.ADDRESS_ID;


select first_name,last_name,c.ADDRESS_ID,address,PHONE
from customer c left join ADDRESS a
on c.ADDRESS_ID = a.ADDRESS_ID;


select first_name,last_name,c.ADDRESS_ID,a.ADDRESS_ID,address,PHONE
from customer c right join ADDRESS a
on c.ADDRESS_ID = a.ADDRESS_ID;


select first_name,last_name,c.ADDRESS_ID,a.ADDRESS_ID,address,PHONE
from customer c full join ADDRESS a
on c.ADDRESS_ID = a.ADDRESS_ID;

select * from EMPLOYEES;

select * from DEPARTMENTS;

select FIRST_NAME,LAST_NAME,DEPARTMENT_NAME
from EMPLOYEES e left join DEPARTMENTS d
on e.DEPARTMENT_ID = d.DEPARTMENT_ID;

--get me first_name,last_name and department name for all employees

select * from employees;

select * from departments;

select FIRST_NAME,LAST_NAME,DEPARTMENT_NAME
from EMPLOYEES e left join DEPARTMENTS d
on e.DEPARTMENT_ID = d.DEPARTMENT_ID
where e.department_id is null;

--get me first_name,last_name and department_name,city for all employees
select first_name,last_name,department_name,CITY
from employees e join departments d
on e.DEPARTMENT_ID=d.DEPARTMENT_ID
join LOCATIONS l
on d.LOCATION_ID = l.LOCATION_ID;

--get me firstname,lastname and deparment name, city,country_name for all employees;
select first_name,last_name,department_name,CITY,COUNTRY_NAME
from EMPLOYEES e join DEPARTMENTS d
on e.DEPARTMENT_ID=d.DEPARTMENT_ID
join LOCATIONS l
on d.LOCATION_ID = l.LOCATION_ID
join COUNTRIES c
on c.COUNTRY_ID = l.COUNTRY_ID;

--get me all employees firstname, lastname and their managers first and lastname

select EMPLOYEE_ID,FIRST_NAME,LAST_NAME,MANAGER_ID from EMPLOYEES;

select e1.employee_id,e1.first_name,e1.last_name,e1.manager_id,e2.employee_id,e2.first_name,e2.last_name
from employees e1 join employees e2
on e1.MANAGER_ID = e2.EMPLOYEE_ID
order by e1.EMPLOYEE_ID;

select * from testers
union
select * from developers;

select names from testers
union
select names from developers;

select names from developers
minus
select names from testers;

--how to find duplicate names in employees table
select FIRST_NAME,count(*)
from employees
group by FIRST_NAME
having count(*) > 1;

select FIRST_NAME,LAST_NAME,SALARY,JOB_ID
from EMPLOYEES
where ROWNUM < 6;

--how can we rename the column that we displayed
select first_name as given_name, last_name as surname
from EMPLOYEES;

--text functions,string mani.
--java first_name+" "+last_name
-- in sql concat is ||

select first_name ||' '|| last_name as full_name
from EMPLOYEES;



--Task;
--add @gmail.com and name new column to full_email
select email from employees;

select email ||'@gmail.com' as full_email
from EMPLOYEES;


--making all lowercase
select lower(email||'@gmail.com') as full_email
from EMPLOYEES;

--upper case
select upper(email||'@gmail.com') as full_email
from EMPLOYEES;

--length(value)
select first_name, length(first_name) as length_name
from EMPLOYEES
order by length_name desc;

--substr(colName,begIndex,NumberOfChar)
select substr(first_name,0,1) || '.' || substr(last_name,0,1) as initials
from EMPLOYEES;

select substr(first_name,0,1) || '.' || substr(last_name,0,1) as initials,
       FIRST_NAME||' '||LAST_NAME as full_name,lower(email||'gmail.com') as full_email
from EMPLOYEES;

--VIEW

CREATE VIEW Emaillist_jamal as select substr(first_name,0,1) || '.' || substr(last_name,0,1) as initials,
       FIRST_NAME||' '||LAST_NAME as full_name,lower(email||'gmail.com') as full_email
from EMPLOYEES;

select "full_name"
from Emaillist;

--to remove view
drop view EmailList_jamal;

--find the highest 14th salary
--list salary high to low without duplicate values
select distinct salary
from employees
order by salary desc;

--find the highest 14th salary(removing duplicate values)
select min(salary)
from (select distinct salary from employees order by salary desc)
where rownum <15;


--find employee info who is making 14th highest salary (without duplicates)

select *
from employees
where salary = (select min(salary)
                from (select distinct salary from employees order by salary desc)
                where rownum <15 );

--how to find employees information of who is making highest salary in the company ?

--get me highest salary
select max(SALARY) from EMPLOYEES;

--highest salary employee information
select *
from EMPLOYEES
where SALARY = 24000;


--subquery solution in one shot
select *
from EMPLOYEES
where SALARY = (select max(SALARY) from EMPLOYEES);

--finding second highest salary
--get highest salary first
select max(SALARY) from  EMPLOYEES;

--highest after 24k
select max(salary)
from EMPLOYEES
where salary < 24000;

--one shot combining two queries

select max(salary)
from EMPLOYEES
where salary < (select max(SALARY) from  EMPLOYEES);

--employee information of who is making second highest salary
select *
from EMPLOYEES
where salary = (select max(salary)
                from EMPLOYEES
                where salary < (select max(SALARY) from  EMPLOYEES));

------------
select * from employees;

select * from EMPLOYEES
order by SALARY desc;

select *
from EMPLOYEES
where rownum < 11;

--list the employees who is making top 10 salary

--get the first 10 people then order them high to low based on salary
select *
from employees
where rownum < 11
order by SALARY desc;

--order all employees based on salary high to low then display only first 10 result
select *
from (select * from EMPLOYEES
      order by SALARY desc)
where rownum < 11;

