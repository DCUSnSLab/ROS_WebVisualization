import React, {useEffect, useState} from 'react';

function Usage() {
  useEffect(() => {

  var os = require('os');
  var loads = os.loadavg();
  console.log(loads);

  });
}

export default Usage;
