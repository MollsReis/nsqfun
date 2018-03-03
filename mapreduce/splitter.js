const express = require('express'),
    redis = require('redis'),
    {Writer} = require('nsqjs'),
    app = express(),
    client = redis.createClient({host: 'redis'}),
    w = new Writer('nsqd', '4150');

app.post('/:word', (req, res, next) => {
    const word = req.params.word;
    client.hdel('words', word, (err) => {
        if (err) return next(err);
        console.log(`Processing: "${word}"`);
        word.split('').forEach((letter) => {
            w.publish('map', {word: word, letter: letter});
        });
        res.send('OK');
    });
});

app.get('/', (req, res, next) => {
    client.hgetall('words', (err, h) => {
        if (err) return next(err);
        res.send(h)
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({err: err})
});

app.listen(8080, () => {
    w.connect();
    console.log('splitter ready');
});
