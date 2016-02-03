module.exports = function(Employee) {

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


  /**
   * REMOTE METHOD EXAMPLE
   *
   * A remote method is a static method of a model, exposed over a custom REST endpoint.
   * Use a remote method to perform operations not provided by LoopBack's standard model REST API.
   *
   * For more information, visit: https://docs.strongloop.com/display/public/LB/Remote+methods
   */

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


  /**
   * REMOTE HOOK EXAMPLE.
   *
   * Remote hooks, that execute before or after calling a remote method, either a
   * custom remote method or a standard create, retrieve, update, and delete method
   * inherited from PersistedModel.
   *
   * For more information, visit:
   */

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

};
