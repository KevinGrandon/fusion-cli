// @flow

import React from 'react';
import {workerUrl} from 'fusion-core';

export default class Root extends React.Component<*, *> {
  workerContent: ?HTMLElement;

  componentDidMount() {
    const worker = new Worker(workerUrl('./worker.js'));
    const worker2 = new Worker(workerUrl('./worker2.js'));
    worker.onmessage = function(event) {
      this.workerContent.innerHTML = event.data;
    };
  }

  render() {
    return <div id="worker-content" ref={el => (this.workerContent = el)} />;
  }
}
