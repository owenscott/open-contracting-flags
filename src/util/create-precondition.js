const createPrecondition = (name, testFunction, details) => {
  const { description } = details;
  const precondition = release => testFunction(release);
  precondition.name = name;
  precondition.selfDocument = () => ({ name, description });
  return precondition;
};

module.exports = createPrecondition;
