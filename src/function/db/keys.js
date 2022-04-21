const REQUIRED_KEYS_SOLUTIONS = {
  POST: ["name", "owner"],
  DELETE: ["id", "owner"],
  PATCH: ["id", "owner", "name"],
  GET: [],
};

const REQUIRED_KEYS_SCREENS = {
  POST: ["name", "solution_id"],
  DELETE: ["id", "solution_id"],
  PATCH: ["id", "solution_id", "name"],
  GET: [],
};

const REQUIRED_KEYS_WIDGETS = {
  POST: ["name", "screen_id", "data"],
  DELETE: ["id", "screen_id"],
  PATCH: ["id", "screen_id", "data", "name"],
  GET: [],
};

const compareKeys = (a, b) => {
  let included = true;
  if (a === undefined) return true;
  a.forEach((k) => {
    if (!b.includes(k)) included = false;
  });
  return included;
};

const checkRequiredKeysForSolutions = (action, data) => {
  return compareKeys(REQUIRED_KEYS_SOLUTIONS[action], Object.keys(data));
};

const checkRequiredKeysForScreens = (action, data) => {
  return compareKeys(REQUIRED_KEYS_SCREENS[action], Object.keys(data));
};

const checkRequiredKeysForWidgets = (action, data) => {
  return compareKeys(REQUIRED_KEYS_WIDGETS[action], Object.keys(data));
};

module.exports = {
  checkRequiredKeysForSolutions,
  checkRequiredKeysForScreens,
  checkRequiredKeysForWidgets,
};
