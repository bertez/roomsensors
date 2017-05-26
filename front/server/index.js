import { join } from 'path';

import redis from 'redis';
import express from 'express';
import exphbs from 'express-handlebars';

import { IS_PROD, SCRIPT_PATH } from '../config';

const client = redis.createClient({
    host: 'redis'
});

const app = express();
const root = join(__dirname, '..');

/**
* App config
*/

//Static
app.use('/dist', express.static(join(root, 'dist')));


app.set('views', join(root, 'views'));

const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    defaultLayout: 'main',
    helpers: {}
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

/**
* Routes
*/

//API
app.get(['/data', '/data/:range'], function(req, res) {
    const range = (req.params.range && Number(req.params.range - 1)) || 0;

    client.lrange('series', 0, range, (error, reply) => {
        const data = reply.map(log => {
            let [date, temperature, humidity, pressure] = log.split(',');

            return {
                date: new Date(date),
                temperature,
                humidity,
                pressure
            };
        });

        res.json(data);
    });
});

//Main
app.get('/', function(req, res) {
    return res.render('main', {
        meta: {
            title: 'Stats'
        },
        site: {
            name: 'Room Temp',
            url: 'http://pi1',
            description: 'Room temperature',
            image: '/dist/img/site.png',
            favicon: '/dist/img/favicon-96x96.png'
        },
        SCRIPT_PATH,
        IS_PROD,
        class: 'main',
        app: 'main'
    });
});

client.on('error', error => {
    console.error(error);
});

client.on('ready', () => {
    app.listen(3000);
});
