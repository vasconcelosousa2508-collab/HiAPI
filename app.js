const express = require('express')
const app = express()
const PORT = 8000
app.set('json spaces', 4);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()=> {
    const msg = `Hello API running on PORT ${PORT}`
    const link = `http://localhost:${PORT}`
    const flink = `\x1b[1m${link}\x1b[0m`
    console.log(msg + '\n' + flink)
})

app.get('/v1/hi', function(req, res) {
    const out = {
        msg: "Hello, world!"
    }
    console.log('GET /v1/hi:', out)
    res.status(200).json(out)
})

app.get('/v1/hi/user/:name', function(req, res) {
    const out = {
        out: `Hello, ${req.params.name}`
    }
    console.log(`GET /v1/hi/user/${req.params.name}:`, out)
    res.status(200).json(out)
})

app.get('/v1/hi/:name', function(req, res) {
    const out = {
        msg: "Hello, " + req.params.name.toUpperCase()
    }
    console.log(`GET /v1/hi/${req.params.name}:`, out)
    res.status(200).json(out)
})

app.post('/v1/hi', (req, res) => {
    const { name } = req.body;

    if (!name) {
        const error = { error: "Name is required" };
        console.log('POST /v1/hi:', error)
        return res.status(400).json(error);
    }

    const out = {
        msg: `Hello, ${name.toUpperCase()} from POST!`,
    };
    console.log('POST /v1/hi:', out)
    res.status(200).json(out);
});
const greetings = {
    'pt-br': name => `Olá, ${name || 'mundo'}!`,
    es: name => `¡Hola, ${name || 'mundo'}!`,
    en: name => `Hello, ${name || 'world'}!`,
};

function sendV2Hello(res, lang, name) {
    const makeGreeting = greetings[lang];

    if (!makeGreeting) {
        return res.status(400).json({
            error: 'Idioma inválido. Use pt-br, es ou en.'
        });
    }

    const out = { msg: makeGreeting(name) };
    console.log('Resposta v2:', out);
    return res.status(200).json(out);
}

app.get('/v2/hi', function(req, res) {
    sendV2Hello(res, req.query.lang, req.query.name);
});

app.post('/v2/hi', function(req, res) {
    sendV2Hello(res, req.body.lang, req.body.name);
});

// Express 5 wildcard route for invalid GET endpoints.
app.get('/*splat', function(req, res) {
    const err = {
        error: 'Invalid endpoint'
    }
    console.log(`GET ${req.originalUrl}:`, err)
    res.json(err)
})