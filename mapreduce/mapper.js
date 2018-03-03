const {Reader,Writer} = require('nsqjs'),
    w = new Writer('nsqd', '4150'),
    options = {maxInFlight: 10, nsqdTCPAddresses: 'nsqd:4150'},
    r = new Reader('map', 'default', options);

r.on('message', (msg) => {
    const data = msg.json(),
        value = data.letter.charCodeAt(0) - 96;
    console.log(`Received: ${JSON.stringify(data)}`);
    w.publish('reduce', {word: data.word, value: value});
    msg.finish();
});

r.connect();
w.connect();
console.log('mapper ready');
