const client = require('../lib/client');
const todos = require('./todos');

run();

async function run() {
    try {
        await client.connect();

        await client.query(`
        INSERT INTO users (email, hash)
        VALUES ($1, $2);
        `,
        ['hannah@hannah.com', 'hannahhanahahnanah']);
       
       
        await Promise.all(
            todos.map(todo => {
                return client.query(`
                INSERT INTO todos (task, complete)
                VALUES ($1, $2, $3);
                `,
                [todo.task, todo.complete, todo.user_id]);
            })
        );  

    }
    catch (err) {
        console.log(err)
    }
    finally {
        client.end();
    }
}