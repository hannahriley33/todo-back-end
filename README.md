# todo-back-end
make backend routes
    open postman
    make new heroku database
        terminal: heroku create
        in heroku proj: get URI and put into .env
    make server.js file
    copy all starter code
    in terminal: heroku local to run locally
    testing in pgadmin:
        instert into todos (task, complete)
        values ('${req.body.todo}', false)
        returning *
    
put route 
    in pg admin: 
        update in todos 
        set complete=true
        where id = 2;
        returning *
    copy and paste working sql into put endpoint ...query(`PASTE HERE)
    then change it a bit
        update todos
        set complete = ${req.body.todo.complete}
        where id = ${req.params.id}   

delete route 
    pg admin:
        delete from todos where id = 2
        returning *;
            * check if it was actually deleted- select * from todos

    again paste into the query parentheses 
        delete from todos where id = ${req.params.todo}
also paste in code from slack into after imports at top 

routes commented out: 
GET
get request that returns a whole list of todos
make a sql query using pg.client to select * from todos 
respond to the client with that data
handle errors

POST 
this endpoint creates a new todo
the user input lives in req.body.todo
use req.body.todo to build a sql query to add a new todo
we also return the new todo
respond to the client wrequest with the newly created todo

PUT
this route has a body with a complete property and an id in the params

front end 
