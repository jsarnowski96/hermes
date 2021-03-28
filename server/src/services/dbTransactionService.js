const category = require('./db/categoryTransactions');
const comment = require('./db/commentTransactions');
const company = require('./db/companyTransactions');
const project = require('./db/projectTransactions');
const user = require('./db/userTransactions');
const task = require('./db/taskTransactions');
const organization = require('./db/organizationTransactions');
const recent = require('./db/recentTransactions');
const role = require('./db/roleTransactions');
const team = require('./db/teamTransactions');
const permission = require('./db/permissionTransactions');
const resourceAccess = require('./db/resourceAccessTransactions');

module.exports = Object.assign({}, category, comment, company, project, user, task, organization, recent, role, team, permission, resourceAccess);