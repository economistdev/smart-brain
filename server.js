const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'gian',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.put("/image", (req, res) => {
    const { id } = req.body;
    db("users").where("id", id)
       .increment({entries : 1})
       .returning("entries")
       .then(data => {
            if (data) {
                res.json(data[0].entries)
            } else {
                res.status(400).json(`User not found. ID used: ${id}`)
            }
       })
    .catch(error => res.status(400).json(`User not found`))
})

app.post("/signin", (req, res) => {
    db.select("email", "hash").from("login")
    .where( "email", req.body.email)
    .then( data => {
        const isValidPW = bcrypt.compareSync(req.body.password, data[0].hash)
        if (isValidPW) {
            return db.select("*").from("users")
            .where("email", req.body.email)
            .then( userReturn => {
                return res.json(userReturn[0]);
            })
            .catch(error => res.status(400).json("Unable to retrieve user."))
        } else {
            return res.status(400).json("Incorrect credentials.")
        }
    })
    .catch(error => res.status(400).json("Incorrect credentials."))
})

app.post("/register", (req, res) => {
    const { name, email, password} = req.body
    const user = { 
            email : email,
            name : name,
            joined : new Date()
    }
    if (name && email && password) {
        db.transaction(trx => {
            trx.insert({
                hash : bcrypt.hashSync(password,5),
                email : email
            })
            .into("login")
            .then(
                trx.insert(user)
                .into("users")
                .returning("*")
                .then(userReturn => {
                    return res.json(userReturn[0])
                })
                .catch( error => res.status(400).json("Error signing up. Bad Request1."))
            )
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch( error => res.status(400).json("Error signing up. Bad Request2."));
    }
})

app.listen(3001)