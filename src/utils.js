const keytar = require('keytar');
const configPath = require('os').homedir() + '/' + '.bandwidth_cli';
const { CliError, BadInputError } = require('./errors');

const writeConfig = (config, value) => {
  let mapping;
  try {
    mapping = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    mapping = {}
  }
  mapping[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(mapping));
}
const readConfig = (config) => {
  try {
    mapping = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return mapping[config];
  } catch (err) {
    throw new BadInputError(`Unable to read config '${config}'. Check that you have configured it correctly.`, config);
  }
}
const saveDashboardCredentials = await ({username, password}) => {
  writeConfig('dashboard username', username)
  await keytar.savePassword('Bandwidth_cli_dashboard_username', username, password);
}
