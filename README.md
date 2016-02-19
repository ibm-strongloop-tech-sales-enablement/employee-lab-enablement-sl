# StrongLoop Employee Tutorial
The purpose of this tutorial is to give the technical seller enough knowledge to create a custom demonstration. It includes additional features such as using the command line, filtering, hooks, disabling methods, modify the access control levels, and creating relationships between models.

By the end of this tutorial you should be able to
+ Use the StrongLoop Command Line to Create a Project
+ Create Models, Relations, Access Control Levels using the StrongLoop Command line
+ Create Before and After method hooks.
+ Create Custom Remote Methods
+ Apply Filters to Model Methods

*All demonstrations are presented using a Macintosh.*
Please direct any questions to: 
**Ken Nelson**
e: ken.nelson@us.ibm.com
p: (949) 444-6308
t: @KenAtIBM

Last updated: 2/1/2016
---- 

----
## Download and Run Option
If you want to just run this application, you can clone it and perform an npm install. Otherwise scroll down to the Script section to manually create.
* To do that, open a terminal and type:
```
git clone https://github/com/ibm-strongloop-tech-sales-enablement/employee-lab-enablement-sl
```

* Change directories to employee-lab-enalbement-sl
```
cd employee-lab-enablement-sl
```

* Install the required modules from npm
```
npm install
```

* Start the server
```
node .
```

* Open a browser and navigate to http://0.0.0.0:3000/explorer

----


# Script


## Create a New Project
From your project directory create new loopback project called employee-lab-enablement-sl

`slc loopback employee-lab-enablement-sl`

----
## Create the Department Model

```
slc loopback:model
```
```
Enter the model name: Department
Select the data-source to attach Department to: db (memory)
Select model's base class: PersistedModel
Expose Employee via REST API? Y
Custom plural form (used to build REST URL): Leave blank
Common model or server only? common
```
```
Property name: name
Property type: string
Required?: y
```
```
Property name: manager
Property type: number
Required?: n
```

When Property name appears again, press enter to close the wizard.
---- 
## Create the Employee Model
```
slc loopback:model
```

```
Enter the model name: Employee
Select the data-source to attach Employee to: db (memory)
Select model's base class: User
Expose Employee via REST API? Y
Custom plural form (used to build REST URL): Leave blank
Common model or server only? common
```
```
Property name: lastName
Property type: string
Required?: y 
```
```
Property name: firstName
Property type: string
Required?: y
```
```
Property name: jobTitle
Property type: string
Required?: n
```
```
Property name: workPhoneNo
Property type: string
Required?: n
```
```
Property name: avatar
Property type: string
Required?: n 
```
```
Property name: departmentId
Property type: number
Required?: n
```

## Start your server
In your terminal type the following:

``node .``

Now that you have created a couple of models, test them out.
+ Open a browser and navigate to explorer
+ Notice that you have a User model even though you created an Employee model that extends the User model. Something to fix.

## Test the Department Model
+ Expand the Department model. Expand the **GET /Departments** method. Press the **Try it Out!** button. Notice that there are no records in the response.
+ Create a Department record by expanding the **POST /Departments** method.
+ Try the **GET /Departments** method again. Notice that now there is a Department.

## Test the Employee Model
+ Expand the Employee model. Expand the **GET /Employees** method. Press the **Try it Out!** button. Notice that you get an authorization error. This is because you have to be logged in to retrieve a user. There also has to be a user. Finally access control level has to be set.
+ From the command line, type the following:
```
slc loopback:acl
```
```
Select the model to apply the ACL entry to: Employee
Select the ACL scope: All methods and properties
Select the access type: Execute
Select the role: Any authenticated user
Select the permission to apply: Explicitly grant access
```

+ **Restart the server**
+ To create a user, expand the  **POST /Employees**. The only attributes that are required are firstName, lastName, email, username, and special attribute - password.
```json
{
   "lastName":"admin",
   "firstName":"admin",
   "email": "admin@nomail.com",
   "username": "admin",
   "password":"12345"
}
```
+ Press the **Try it Out!** button. This will create a new user record.
+ Now that there is a user, login to get an access token.  Expand the **POST /Employees/login** method. For the credentials, enter the following:
```json
{
   "username": "admin",
   "password":"12345"
}
```
+ Press the **Try it Out!** button. This should login the admin user and return response with the access token. The id attribute contains the access token.
+ Copy the access token and paste it in the text field next “Token Not Set” and the **Set Access Token** button.
+ Press the **Set Access Token** button. This will set the access token for all requests. The text field “Token Not Set” should change to “Token Set”.
+ Retry the **Get /Employees** method.
++It is **recommended** that you also set the ACL for the Department model. Follow the steps used to set the ACL for the Employee to set the ACL for the Department.
## Create relations 
+ Stop your server. 
+ Create a one-to-many relation between Department and Employee, in the terminal type:
```
slc loopback:relation
```
```
Select the model to create the relationship from: Department
Relation type: has many
Choose a model to create a relationship with: Employee
Enter the property name for the relation:  Accept the default
Optionally enter a custom foriegn key: departmentId
Require a through model? N
```

+ Create a many-to-one relation between Employee and Department, in the terminal type:
```
slc loopback:relation
```
```
Select the model to create the relationship from: Employee
Relation type: belongs to
Choose a model to create a relationship with: Department
Enter the property name for the relation:  Accept the default
Optionally enter a custom foriegn key: departmentId
```

+ Start the server
+ Review the models. Notice that there are a number of new methods that support the new relations.

## Disable the User Model
+ Open the server/model-config.json file. Edit the “User” model to make the public interface private.
+ Restart the server.

## Disable unnecessary model methods
Disable the unnecessary methods for both the Department and Employee models.
+ Disable the unnecessary Department model methods. Open the common/models/department.js file.
+ Add the following to the modules.exports = function(Department)
```javascript
// Disable model methods.
   Department.disableRemoteMethod('create', true);
   Department.disableRemoteMethod('find', false);
   Department.disableRemoteMethod('upsert', true);
   Department.disableRemoteMethod('exists', true);
   Department.disableRemoteMethod('findById', false);
   Department.disableRemoteMethod('deleteById', true);
   Department.disableRemoteMethod('createChangeStream', true);
   Department.disableRemoteMethod('count', false);
   Department.disableRemoteMethod('updateAll', true);
   Department.disableRemoteMethod('findOne', false);
 
   // Disable prototype/relation methods.
   // Note that the attribute to enable/disable is reversed.
   Department.disableRemoteMethod('updateAttributes', false);
   Department.disableRemoteMethod('__findById__employees', false);
   Department.disableRemoteMethod('__delete__employees', false);
   Department.disableRemoteMethod('__create__employees', false);
   Department.disableRemoteMethod('__destroyById__employees', false);
   Department.disableRemoteMethod('__updateById__employees', false);
```

+ Disable the unnecessary Employee model methods. Open the common/models/employee.js file.
+ Add the following to the modules.exports = function(Employee)
```javascript
// Disable model methods.
   Employee.disableRemoteMethod('create', false);
   Employee.disableRemoteMethod('find', false);
   Employee.disableRemoteMethod('upsert', false);
   Employee.disableRemoteMethod('exists', false);
   Employee.disableRemoteMethod('findById', false);
   Employee.disableRemoteMethod('deleteById', false);
   Employee.disableRemoteMethod('createChangeStream', true);
   Employee.disableRemoteMethod('count', false);
   Employee.disableRemoteMethod('updateAll', false);
   Employee.disableRemoteMethod('findOne', false);
 
   // Disable prototype/relation methods.
   // Note that the attribute to enable/disable is reversed.
   Employee.disableRemoteMethod('updateAttributes', false);
   Employee.disableRemoteMethod('__get__accessTokens', false);
   Employee.disableRemoteMethod('__create__accessTokens', false);
   Employee.disableRemoteMethod('__delete__accessTokens', false);
   Employee.disableRemoteMethod('__findById__accessTokens', false);
   Employee.disableRemoteMethod('__updateById__accessTokens', false);
   Employee.disableRemoteMethod('__destroyById__accessTokens', false);
   Employee.disableRemoteMethod('__count__accessTokens', false);
```

## Persist data
Restarting the server clears all the data previous created. To persist the data between server restarts, edit the /server/datasources.json file. Change:
```json
{
   "db": {
     "name": "db",
     "connector": "memory"
   }
 }
```
To
```
{
   "db": {
     "name": "db",
     "connector": "memory",
     "file": "mydata.json"
   }
}
```

This is will create a file called mydata.json in the root of the project that will persist any records created.
## Creating Mock Data
Manually entering data is very time consuming. The following will create mock data for the application.
+ Stop the server.
+ In the terminal add the faker library
''npm install faker --save
+ The —save flag adds the faker library to package.json dependencies. This ensures that running npm install will include the faker library.
+ In the terminal add the async library
```
npm install async --save
```

+ Create a new file in the server/boot directory called 01-create-user-data.js
```javascript
/**
  * Created by KenAtIBM on 1/25/16.
  */
 
/**
  Async is a utility module which provides straight-forward, powerful functions for
  working with asynchronous JavaScript.
  For more information, visit: https://www.npmjs.com/package/async
  */
var async = require('async');
 
/**
  * Faker is a utility to create mock data for applications.
  * For more information, visit: https://github.com/marak/Faker.js/
  *                          or: https://www.npmjs.com/package/Faker
  */
var faker =  require('faker');
 
var dbDatasourceName = 'db';
 
var ADMIN_USERID            = "admin";
var ADMIN_INITIAL_PASSWORD  = "passw0rd"
 
module.exports = function(app) {
  var dbDs = app.dataSources[dbDatasourceName];
 
  async.parallel({
    adminUser: async.apply(loginUser)
  }, function(err, results){
    // If there was an error, check to see if it was a login error.
    // If no error found, that means the admin user is logged in and
    // the mock data has been previously created so there is nothing
    // more to do other then log out as admin.
    if(err){
      // Check to see if the error is because the admin user was not found. This would indicated that
      // the mock data has not been created.
      // If the error is not a failed login, then send the err to the console and stop processing.
      if(err.code == "LOGIN_FAILED"){
        console.log("> ADMIN USER NOT FOUND. CREATING MOCK DATA.");
 
        createDepartments(function(err){
          if(err) throw err;
          console.log("> Departments created successfully");
        });
 
         createEmployees(function(err){
          if(err) throw err;
          console.log("> Employees created successfully");
        });
       } else {
        console.log(err);
        throw err;
      }
     } else {
      // Login of the admin user was successful.
      console.log("> LOGGED IN AS ADMIN USER SUCCESSFULLY");
 
      // Next logout as admin user since
      // there is no reason to stay logged in.
      console.log("> ATTEMPTING TO LOGOUT AS ADMIN USER");
      var User = app.models.Employee;
      User.logout(results.adminUser.id, function(err){
        if(err){
          console.log(err);
          throw err;
         } else {
          console.log("> LOGOUT OF ADMIN USER SUCCESSFULLY");
        }
      })
    }
  });
 
  function loginUser(callBack){
    dbDs.automigrate("Employee", function(err) {
      if(err) return callBack(err);
 
      console.log("> ATTEMPTING TO LOG IN ADMIN USER");
      var User = app.models.Employee;
      User.login({"username" : ADMIN_USERID, "password" : ADMIN_INITIAL_PASSWORD}, callBack);
    });
  }
 
  function createDepartments(callBack){
    dbDs.automigrate("Department", function(err){
      if(err) return callBack(err);
 
      var Department = app.models.Department;
 
      var fakeData = [
        {"name" : "Information Technology"},
        {"name" : "Sales & Marketing"},
        {"name" : "Human Resources"}
      ];
      Department.create(fakeData, callBack);
    });
  }
 
  // Populate the Employee data.
  function createEmployees(callBack){
    dbDs.automigrate('Employee', function(err){
      if(err) return callBack(err);
 
      var Employee = app.models.Employee;
      faker.locale = "en_US";
 
      //  Create an API Administrator account
      //  This account will be used to test and see if the fake data has been created.
      var fakeData = [{
        "username": ADMIN_USERID,
        "email": faker.internet.email(),
        "password": ADMIN_INITIAL_PASSWORD,
        "firstName": "api",
        "lastName": ADMIN_USERID,
        "jobTitle": "API Administrator",
        "workPhoneNo": "",
        "emailVerified" : true,
        "created" : (new Date()),
        "lastUpdated" : (new Date()),
        "status" : "A",
        "realm" : "",
        "credentials" : {},
        "challenges" : {},
        "verificationToken" : "",
        "avatar" : faker.image.avatar(),
        "departmentId" : 1
      }];
 
      // Create fake data
      for (i = 0; i < 24; i++) {
        fakeData.push({
          "username": faker.internet.userName(),
          "email": faker.internet.email(),
          "password": "12345",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "jobTitle": faker.name.jobTitle(),
          "workPhoneNo": faker.phone.phoneNumber(),
          "emailVerified" : false,
          "created" : (new Date()),
          "lastUpdated" : (new Date()),
          "status" : "A",
          "realm" : "",
          "credentials" : {},
          "challenges" : {},
          "verificationToken" : "",
          "avatar" : faker.image.avatar(),
          "departmentId" : Math.floor(Math.random() * 3) + 1
        });
      }
      Employee.create(fakeData, callBack);
    });
  }
}
```

+ Start the server. Notice the console output.
+ Check the mydata.json file. Notice Employee and Department entries.
+ Test the models, both Department and Employee. The admin password is 12345.

## Remote Hooks
Remote hooks, that execute before or after calling a remote method, either a custom remote method or a standard create, retrieve, update, and delete method inherited from PersistedModel.

For this example, there are two remote hooks. the first remote hook occurs before the find function for the employee and simply prints a console log. The second hook occurs after the find and prints a console log as well as adds a new attribute to the payload that is returned that has the current timestamp and a calculated field of firstName & lastName.

+ Open the common/models/employee.js file. Enter the following below the code to disable remote methods:
```
// Before executing remote hook.
  Employee.beforeRemote("find", function(context, unused, next){
    console.log(('> Before Find (GET /Employees)'));

    // Continue processing
    next();
  });

  // After executing remote hook
  // Calculate and add fullName to the returned objects.
  Employee.afterRemote("find", function(conext, remoteMethodOutput, next){
    console.log(('> After Find (GET /Employees)'));

    // Loop through each user and add the date that get was run.
    var asOfDate = (new Date());
    remoteMethodOutput.forEach(function(user){
      user.fullName = user.firstName + " " + user.lastName;
      user.asOfDate = asOfDate;
    });
    // Continue processing
    next();
  });
```
  
+ Restart the server.
+ Run the **GET /Employees** method. Watch the console to see the console messages. Check the response to see the newly calculated fields.

## Remote Methods
You may need to create custom method to perform some processing. Remote methods are similar to hooks, but are really custom methods that do not rely on an existing one to hook into.

There are two parts to the method. The actual method itself and a definition of the method.  For this example there are two remote methods.

The first provides a way to search by the user id field.  The second provides a way to search by first name and last name.

+ Open the common/models/employee.js file. Enter the following below the code to disable remote methods:
```
// Find employee by id. Only return business card information
  Employee.lookupEmployeeById =  function(employeeId, callBack){
    Employee.findById(employeeId, {fields: {firstName: true, lastName: true, jobTitle: true, email: true, workPhoneNo: true} },
      function(err, instance){
        if(err){
          console.log(err);
          callBack(err);
        }

        callBack(null, instance);
    });
  }

  Employee.remoteMethod('lookupEmployeeById', {
      http: {path: '/lookupEmployeeById', verb: 'get'},
      accepts: {arg: 'id', type: 'number', http: {source: 'query'}},
      returns: {arg: 'businessCard', type: 'string'}
    }
  );

  //  Find employees by first and last name. Only return business card information.
  Employee.lookupEmployeeByName =  function(firstName, lastName, callBack){
    Employee.find( {fields:
                    {firstName: true, lastName: true, jobTitle: true, email: true, workPhoneNo: true},
                    where:{
                      and: [{firstName:{like:firstName}}, {lastName: {like: lastName}}] }},
      function(err, instance){
        if(err){
          console.log(err);
          callBack(err);
        }

        callBack(null, instance);
      });
  }

  Employee.remoteMethod('lookupEmployeeByName', {
      http: {path: '/lookupEmployeeByName', verb: 'get'},
      accepts: [{arg: 'firstName', type: 'string'},{arg: 'lastName', type: 'string'}],
      returns: {arg: 'businessCard', type: 'string'}
    }
  );
```

## Completed Project
If you get stuck, you can review the completed project on github.
[https://github.com/ibm-strongloop-tech-sales-enablement/employee-lab-enablement-sl.git]

## More information

[StrongLoop Documentation]
[StrongLoop Blog]
[Signup for StrongLoop Newsletter]
[StrongLoop: Standard project structure]
[StrongLoop: Getting Started Tutorial - Part 1]
[StrongLoop: Getting Started Tutorial - Part 2]
[StrongLoop: Access Control Tutorial]
[StrongLoop: Creating Model Relations Tutorial]
[StrongLoop: YouTube Videos]
