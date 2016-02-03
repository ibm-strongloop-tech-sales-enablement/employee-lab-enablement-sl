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
