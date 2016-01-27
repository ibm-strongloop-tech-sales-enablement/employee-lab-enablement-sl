/**
 * Created by KenAtIBM on 1/25/16.
 */
var async = require('async');
var faker =  require('faker');

var dbDatasourceName = 'db';

module.exports = function(app) {
  var dbDs = app.dataSources[dbDatasourceName];

  async.parallel({
    adminUser: async.apply(loginUser)
  }, function(err, results){
    if(err){
      createDepartments(function(err){
        if(err) throw err;
        console.log("> Departments created successfully");
      });

      createEmployees(function(err){
        if(err) throw err;
        console.log("> Employees created successfully");
      });

    }
  });

  function loginUser(callBack){
    dbDs.automigrate("Employee", function(err) {
      if(err) return callBack(err);

      console.log("> ATTEMPTING TO LOG IN ADMIN USER");
      var User = app.models.Employee;
      User.login({"username" : "admin", "password" : "12345"}, callBack);
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
      var fakeData = [{
        "username": "admin",
        "email": faker.internet.email(),
        "password": "12345",
        "firstName": "api",
        "lastName": "admin",
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
        "department" : "1"
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
          "department" : Math.floor(Math.random() * 3) + 1
        });
      }
      Employee.create(fakeData, callBack);
    });
  }
}
