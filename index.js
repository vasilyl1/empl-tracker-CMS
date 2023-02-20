const { department, role, employee } = require('./lib/classes'); // defines the current record as objects
const CMS_init = require('./lib/inq'); // user interview functionality
const active_request = { // the request the user is working on
  department: new department,
  role: new role,
  employee: new employee
};

active_request.department.init().then(() => { // initialize objects and connect to database
  active_request.role.db = active_request.department.db;
  active_request.employee.db = active_request.department.db;
  CMS_init(active_request); // start CMS system
});

