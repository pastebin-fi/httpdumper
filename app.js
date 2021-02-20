const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const { uuid } = require('uuidv4');

let db = new sqlite3.Database('./dumps.db', (err) => {
    if (err) {
        return console.error(err.message);
    }

    db.run("CREATE TABLE IF NOT EXISTS dump_names (id TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS dump_rows (id TEXT, useragent TEXT, ip TEXT, query TEXT)");

    console.log('Connected to the in-memory SQlite database.');
});

app.set('view engine', 'ejs');

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/new/', function(req, res) {
    let id = uuid();
    console.log(id)
    db.run("INSERT INTO dump_names VALUES (?)", [id], (err) => {
        if (err) throw err;
        res.redirect(`/dumpstats/${id}`)
    });
});

app.get('/dump/:id/', function(req, res) {
    let id = req.params.id

    db.get('SELECT * FROM dump_names WHERE id IS ?', [id], (err, row) => {
        if (err) throw err;

        if (row) {
            db.run("INSERT INTO dump_rows VALUES (?, ?, ?, ?)", [id, req.headers['user-agent'], req.ip, JSON.stringify(req.query)], (err) => {
                if (err) throw err;
                res.send({ status: "Success" });            
            });            
        } else {
            res.status(404).send({ error: "Dump not found. 😕" });            
        }
    });
});

app.get('/dumpstats/:id/', function(req, res) {
    let id = req.params.id

    db.get('SELECT * FROM dump_names WHERE id IS ?', [id], (err, row) => {
        if (err) throw err;

        console.log(row)

        if (row) {
            db.all('SELECT * FROM dump_rows WHERE id IS ?', [id], (err, rows) => {
                if (err) throw err;
                res.render('dumpstats', {
                    rows,
                    req,
                    id
                });
            });        
        } else {
            res.status(404).send({ error: "Dump not found. 😕" });            
        }
    });
});

app.get('*', function(req, res) {
    res.status(404).send({ error: "Not found. 😕" });            
});

app.listen(8080);
console.log('server is listening on port 8080');