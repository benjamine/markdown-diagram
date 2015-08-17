module.exports = function ajax(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      callback(this.response);
    } else {
      // We reached our target server, but it returned an error
      callback(new Error('request error ' + this.status));
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
    callback(new Error('request error ' + this.status));
  };
  request.send();
};
