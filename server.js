require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client');

client.connect();

const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors()); 
app.use(express.static('public')); 
app.use(express.json()); 


// auth routes
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('././lib/auth/create-auth-routes');

const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
        SELECT id, email, hash
        FROM users
        WHERE email = $1;
        `, [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        return client.query(`
        INSERT into users (email, hash)
        VALUES ($1, $2, $3)
        RETURNING id, email;
        `,
        [user.email, hash]
        ).then(result => result.rows[0]);
    }
});

// for every route, on every request make sure there is a token
app.use('/api/auth', authRoutes);
app.use('/api', ensureAuth);
app.use(express.urlencoded({ extended: true }));

//todos 
//get request that returns whole list of my todos

app.get('/api/test', (req, res) => {
    res.json ({
        message: `the user's id is ${req.userId}`
    });
});

app.get('/api/todos' , async (req, res) => {
    
    try {
        const result = await client.query(`
            select * from todos where user_id=$1;
        `, [req.userId]);
       
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
app.post('/api/todos', async (req, res) => {
    
    try {
        const result = await client.query(`
            INSERT into todos (task, complete, user_id)
            VALUES ($1, false, $2)
            returning *;
        `,
        [req.body.task, req.userId]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
    });
app.put('/api/todos/:id', async (req, res) => {
   
    try {
        const result = await client.query(`
            update todos
            set complete=${req.body.complete}
            where id = ${req.params.id}
            returning *;
        `, []);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
app.delete('api/todos/:id', async (req, res) => {
    try {
        const result = await client.query(`
            delete from todos where id=${req.params.id}
            returning *;
        `, []);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});
