const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');

function readConfig() {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error('Error reading config.json:', error.message);
    return { sources: {} };
  }
}

function writeConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing config.json:', error.message);
    return false;
  }
}

function listSources() {
  const config = readConfig();
  return config.sources;
}

function addSource(name, url) {
  const config = readConfig();
  if (config.sources[name]) {
    return { success: false, message: `Source '${name}' already exists.` };
  }
  config.sources[name] = url;
  if (writeConfig(config)) {
    return { success: true, message: `Source '${name}' added.` };
  } else {
    return { success: false, message: `Failed to add source '${name}'.` };
  }
}

function removeSource(name) {
  const config = readConfig();
  if (!config.sources[name]) {
    return { success: false, message: `Source '${name}' not found.` };
  }
  delete config.sources[name];
  if (writeConfig(config)) {
    return { success: true, message: `Source '${name}' removed.` };
  } else {
    return { success: false, message: `Failed to remove source '${name}'.` };
  }
}

module.exports = {
  listSources,
  addSource,
  removeSource,
};
