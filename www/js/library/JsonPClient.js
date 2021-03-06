JsonPClient = {
  maxUrl : 1500,
  
  currRequests : {},

  // this function is known to the server
  serverCallback: function (id, data) {
    // Logger.write("id is " + id)
    if (this.currRequests[id]) {
      this.currRequests[id].callback(data);
      delete(this.currRequests[id]);
    }
  },

  send : function (scriptName, data, callbackFunction) {
    if (typeof(data) === 'object')
      data = JSON.stringify(data);
    data = encodeURIComponent(data);
    var id = Math.floor(Math.random()*999999);
    var prefix = scriptName + '?i=' + id + '&n=';
    var dataStrings = JsonPClient.chopUpUrlEncodedString(data, this.maxUrl - prefix.length);
    prefix += dataStrings.length + '&d='
    for (var i=0; i<dataStrings.length; i++) {
      var e = document.createElement('script');
      e.src = prefix + dataStrings[i] + '&c=' + i;
      // Logger.write(e.src)
      e.type = 'text/javascript';
      document.body.appendChild(e);
    }
    this.currRequests[id] = {
      callback: callbackFunction,
      timestamp: new Date().getTime()
    };
  },
  
  //---------------------------------------------
  // break a string into an array of smaller strings.
  // Doesn't break url encoding (avoids splitting "%23" type things)
  chopUpUrlEncodedString : function (str, maxChar) {
    var a = [];
    var count = 0;
    
    while(str.length > maxChar) {
      var len = maxChar-1;
      if(str.charAt(maxChar-3) == '%')
        len = maxChar-3;
      else if(str.charAt(maxChar-2) == '%')
        len = maxChar-2;
      a[count] = str.substring(0, len);
      str = str.substring(len);
      count++;
    }
    a[count] = str;
    return a;
  }
};
