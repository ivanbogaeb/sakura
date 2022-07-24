const timer = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = timer;