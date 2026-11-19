const EventEmitter = require('events');

class OrderTracker extends EventEmitter {
    constructor() {
        super();
    }

    placeOrder() {
        this.emit('placed');
    }

    shipOrder() {
        this.emit('shipped');
    }

    reportError() {
        this.emit('error', new Error('Order could not be processed'));
    }

}

const order = new OrderTracker();

order.on('placed', () => {
    console.log('Order has been placed!');
});

order.on('shipped', () => {
    console.log('Order has been shipped!');
});

order.once('shipped', () => {
    console.log('This message should appear only once!');
});

order.on('error', (error) => {
    console.log('Order error:', error.message);
});

console.log('Before emitting event');

order.placeOrder();

console.log('After emitting event');

order.placeOrder();
order.shipOrder();

order.shipOrder();
order.shipOrder();

order.reportError();

// Predicted
/*
I expected the OrderTracker class to emit events when an order was placed, shipped, or encountered an error. 
I also expected .once() to execute only once and event listeners to run synchronously.
*/

// Actual
/*
The placed and shipped listeners executed whenever their events were emitted. 
The .once() listener executed only on the first shipment. 
The output confirmed that event listeners execute before the next line of code. 
When I removed the error listener, Node.js threw an unhandled error and crashed the process.
*/

// Why
/*
EventEmitter allows objects to communicate through events. 
The .on() method registers a listener that remains active, while .once() removes its listener after the first execution.
The .emit() method executes registered listeners synchronously by default. The 'error' 
event is special in Node.js because emitting it without a registered listener causes an uncaught exception.
*/
