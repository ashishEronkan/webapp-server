# The Plant.Works Web Application Server
The Plant.Works Web Application Server - the browser front-end for the Plant.Works platform.

## **Setting up the Plant.Works WebApp Server development environment**
This section of the document described how to setup the webapp server codebase development environment, with the assumption that the development machine
is Ubuntu 18.04 LTS or later.

For non Debian-based Linux distros, or OS X / Windows machines, please refer to the appropriate manuals directly.

### **Pre-requisites**
The pre-requisites for runing the webapp server codebase are:

1. git version control system
2. build-essential (GCC toolchain)
3. PostgreSQL RDBMS V9.6+
4. Redis Server V5.0+
5. Apache Cassandra NoSQL V3.11+
6. node.js V12.0+

### **Installing Git and build-essential**
On Debian-based Linux distros, simply type in the following command:

```
sudo apt install git build-essential
```


### **Installing PostgreSQL**
On Debian-based Linux distros, follow these instructions:

**Add the PostgreSQL APT Repository**

```
sudo apt-get install wget ca-certificates
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
```

**Install the PostgreSQL server, client, and toolset**

```
sudo apt update
sudo apt upgrade

sudo apt-get install postgresql postgresql-contrib libpq-dev pgadmin3
```

**Test if the installation went through fine**
1. Login into the Server and set a password for the *postgres* user

```
$ sudo -u postgres psql

postgres=# \password

postgres=# \q
```

**Modify the configuration to allow logins from roles in the terminal**
1. Edit the pg_hba.conf file to use md5 instead of "peer" for authentication

```
$ sudo nano /etc/postgresql/9.6/main/pg_hba.conf
```

Find this line in the file:

```
# "local" is for Unix domain socket connections only
local	all		all		peer
```

And change it to:

```
# "local" is for Unix domain socket connections only
local	all		all		md5
```

Save and Exit.

2. Restart the PostgreSQL Server

```
$ sudo systemctl restart postgresql
```

**Launch *pgAdmin3* and connect to the PostgreSQL server installed on your localhost. Then execute the following steps:**

1. Create a database called **plantworks**

2. Create a *Login Role* called **plantworks** with password as **plantworks** and *superuser* privileges

3. Close pgAdmin3


**From the *Terminal*, test if the configuration is correct:**

Login into the PostgreSQL Server using the newly created user and password:

```
psql -U plantworks -W -d plantworks
```

If you see the standard psql prompt, the configuration has been succesful:

```
psql (9.6.3)
Type "help" for help.

plantworks=#
```


### **Installing Redis Server**
On Debian-based Linux distros, follow these instructions:

**From the *Terminal*, execute the following steps to install Redis server:**

1. Add the Redis server APT Repository

```
$ sudo apt-add-repository ppa:chris-lea/redis-server
```

2. Install the Redis server and client utilities

```
$ sudo apt-get update
$ sudo apt-get upgrade

$ sudo apt-get install redis-server
```

**Test if the installation went through fine:**

Type in the following command in the *Terminal*:

```
$ redis-cli ping
```

If the Redis server was installed succesfully, you should see the following response:

```
PONG
```


### **Installing Apache Cassandra**
On Debian-based Linux distros, follow the instructions at: [Installation from Debian packages](http://cassandra.apache.org/download/)


### **Installing node.js & npm**
On Debian-based Linux distros, follow these instructions:

**From the *Terminal*, execute the following steps to install the latest version of node.js and npm:**

1. Create a new sources.list file

```
$ sudo nano /etc/apt/sources.list.d/nodesource.list
```

2. Type in the following lines into the file:

```
deb https://deb.nodesource.com/node_12.x bionic main
deb-src https://deb.nodesource.com/node_12.x bionic main
```

3. Install node.js

```
$ sudo apt-get update
$ sudo apt-get upgrade

$ sudo apt-get install nodejs
```

**Test if the installation went through fine:**

Type in the following command in the *Terminal*:

```
$ node -v
```

If node.js was installed succesfully, you should see the following response:

```
v12.2.0 (or whatever the current version is)
```

**Installing the mandatory NPM modules**
The Web Application Server codebase requires the availability of the following NPM modules at a global level:

```
$ sudo npm i -g eslint jsdoc eslint-plugin-jsdoc knex
```

If all of the above steps have been executed successfully, the Ubuntu machine is ready for developing on the Plant.Works Web Application Server...

## **Getting the IDE**
There is no "official" preference for using a particular IDE within the Engineering Team. The more common ones (in alphabetical order) are:
1. [Atom](https://atom.io/)
2. [Emacs](https://www.gnu.org/software/emacs/)
3. [VScode](https://code.visualstudio.com/)

Whichever IDE / Code Editor you choose, do ensure that the following *mandatory* plugins are available and installed:
1. [Editor Config](http://editorconfig.org/)
2. [JSBeautify](https://www.npmjs.com/package/js-beautify)
3. [ESLint](http://eslint.org/)

## **Starting working with the code**
### **Installing the required NPM modules**
Before you can run the Server for the first time, you will need to install the dependencies required for the codebase. To do this, execute the following steps in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm install
```


### **Setting up the database schema**
Once the required npm modules have been installed, you will need to setup the basic database schema, and seed it with some data. To do this, execute the following steps in the *Terminal*:

```
$ cd ~/source/webapp-server/knex_migrations
$ knex migrate:latest
$ knex seed:run
```


## **Running the Web Application Server**
If ALL of the above steps have executed without errors, then the Web Application Server is ready to be run.

**Running the codebase**
To start the server execution, type the following in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm start
```

If the Server started successfully, you should see the following at the end of the start sequence:

```
PlantWorksWebAppServer started in: 21800.37ms
+----------+-----------+----------+---------------------------+------+
|  (index) | Interface | Protocol | Address                   | Port |
+----------+-----------+----------+---------------------------+------+
|     0    | lo        | IPv4     | 127.0.0.1                 | 9100 |
|     1    | lo        | IPv6     | ::1                       | 9100 |
|     2    | wlp1s0    | IPv4     | 192.179.4.130             | 9100 |
|     3    | wlp1s0    | IPv6     | fe80::5af4:ff3b:634d:4707 | 9100 |
+----------+-----------+----------+---------------------------+------+
```

To **shutdown** the Server instance gracefully, simply type **Ctrl+C** in the Terminal, and wait for a couple of seconds. IF the Server shutdown correctly, you should be taken back to the command prompt.


## **Running the build process**
Running the tests bundled with the codebase, and generating documentation, is similar to runing the server itself. To run the test cases, type the following in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm run build
```

If the Tests were run succesfully, you should see something similar to the following at the end of the test sequence:

```
  Application Class Test Cases
    Instantiate
      ✓ PlantWorksWebApp should be an instanceOf PlantWorksBaseModule

  Configuration Service Test Cases
    Instantiate
      ✓ Should be an instanceOf PlantWorksBaseService
      ✓ Loader should be an instanceOf PlantWorksModuleLoader
    Lifecycle Hooks Test Cases
      ✓ Load test (471ms)
      ✓ Unload test


  5 passing (491ms)
```

If the documentation was generated successfully, you should be able to browse it by opening up the **index.html** in the **/docs** folder.
