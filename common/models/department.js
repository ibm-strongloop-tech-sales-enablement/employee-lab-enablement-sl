module.exports = function(Department) {

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
};
