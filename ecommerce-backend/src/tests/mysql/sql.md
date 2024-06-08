## Create Table

```sql
create table test_table(
    id int not null,
    name varchar(255) default null,
    age int default null,
    address varchar(255) default null,
    primary key (id)

) engine = InnoDB default charset = utf8mb4;

```