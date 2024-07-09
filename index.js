const express = require('express')
const app = express()
const fs = require('fs');

require('dotenv').config()
const port = process.env.PORT
const bodyParser = require('body-parser');
const cors=require('cors')
const { Pool } = require('pg');

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());




const pool = new Pool({
    user: 'sudarsanam',
    host: 'tinyurl.postgres.database.azure.com',
    database: 'tinyurl',
    password: '@7JuN2004',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
  });

  function generateRandomAlphaNumeric() {
    const length = 6;
    let result = '';
    const characters = process.env.characters;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



app.get('/', (req, res) => res.send('Hello World!'))

app.post('/urlshortner', (req, res) => {
    const url=req.body;
    const randomString = generateRandomAlphaNumeric();  


  const query = 'INSERT INTO users (id, url) VALUES ($1, $2)';
    const values = [randomString, url.url];
     

    pool.query(query, values, (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        } else {
        res.send(randomString);
        }
    });
       

})

app.get('/url/:url',(req,res)=>{
    const id=req.params.url;
    
    const query = "SELECT url FROM users WHERE id = $1";
const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            }
            else{
             
        res.send(result.rows[0].url)}
    })
    

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))