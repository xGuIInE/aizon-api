const REQUIRED_KEYS = {
  POST: ["name", "owner"],
  DELETE: ["id", "owner"],
  PATCH: ["id", "owner"],
  GET: [],
};

const compareKeys = (a, b) => {
  let included = true;
  a.forEach((k) => {
    if (!b.includes(k)) included = false;
  });
  return included;
};

const checkRequiredKeys = (action, data) => {
  return compareKeys(REQUIRED_KEYS[action], Object.keys(data));
};

module.exports = {
  checkRequiredKeys,
};
