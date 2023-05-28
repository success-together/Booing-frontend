module.exports = async taskData => {
  console.log('fetching files .....');
  setTimeout(() => {
  	console.log('fetched all files.');
  	return true;
  }, 10000)
};