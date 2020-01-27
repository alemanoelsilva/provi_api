const run = (error, [task, ...tasks], deps, res) => {
  let result = res;

  if (!error && typeof task === 'function') {
    result = task(deps);
    return run(result ? result.error : false, tasks, deps, result);
  }

  return result;
};

exports.taskRunner = (deps) => {
  const tasks = [];

  return {
    addTasks: allTasks => allTasks.forEach(task => tasks.push(task)),

    exec: async () => run(false, tasks, deps),
  };
};
