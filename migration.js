const util = require('util');
const exec = util.promisify(require('child_process').exec);

exec(`npx sequelize --debug --env database --config config.json db:migrate`);
