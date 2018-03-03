const redis = require('redis'),
    {Reader} = require('nsqjs'),
    client = redis.createClient({host: 'redis'}),
    options = {nsqdTCPAddresses: 'nsqd:4150'},
    r = new Reader('reduce', 'default', options);

r.on('message', (msg) => {
    const data = msg.json();
    console.log(`Received: ${JSON.stringify(data)}`);
    client.hincrby('words', data.word, data.value);
    msg.finish();
});

r.connect();
console.log('reducer ready');
