module.exports = function (templateName) {
  return document.querySelector('#' + templateName + '-template').innerHTML;
};
