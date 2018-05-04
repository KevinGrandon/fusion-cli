// @flow

declare var self: DedicatedWorkerGlobalScope;

self.postMessage('worker2-included');
