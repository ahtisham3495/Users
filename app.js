const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")

const app = express();
app.use(cors());
app.use(bodyParser.json());

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ahtisham@3495',
    database: 'testdata'
});
connection.connect((err) => {
    if (!err)
        console.log("Database connection succeded");
    else
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined, 2));
});

//Create new Data

app.post('/user', (req, res) => {
    let user = req.body;
    let data = [user.name, user.username, user.email, user.address.street, user.address.suite, user.address.city, user.address.zipcode, user.address.geo.lat, user.address.geo.lng, user.phone, user.website, user.company.companyname, user.company.catchphrase, user.company.bs]
    let query = 'INSERT into users (name, username, email, street, suite, city, zipcode,lat,lng,phone,website,companyname,catchphrase,bs) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

    connection.query(query, data, (error, results, ) => {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

//Without Array

// app.post('/user', (req, res) => {
//     let user = req.body;
//     var postData = {
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         street: user.address.street,
//         suite: user.address.suite,
//         city: user.address.city,
//         zipcode: user.address.zipcode,
//         lat: user.address.geo.lat,
//         lng: user.address.geo.lng,
//         phone: user.phone,
//         website: user.website,
//         companyname: user.company.companyname,
//         catchphrase: user.company.catchphrase,
//         bs: user.company.bs
//     }
//     connection.query('INSERT INTO users SET ?', postData, (error, results) => {
//         if (error) throw error;
//         res.send(JSON.stringify(results));
//     });
// });


app.get('/', (req, res) => {
    res.send('successfull');
})



//Get All Data
app.get('/users', (req, res) => {
    connection.query('SELECT * from users', (error, results) => {
        if (error) {
            throw error;
        } else {
            let obj = results.map((obj) => ({
                name: obj.name,
                username: obj.username,
                email: obj.email,
                address: {
                    street: obj.street,
                    suite: obj.suite,
                    city: obj.city,
                    zipcode: obj.zipcode,
                    geo: {
                        lat: obj.lat,
                        lng: obj.lng
                    },
                },
                phone: obj.phone,
                website: obj.website,
                company: {
                    company: obj.companyname,
                    catchphrase: obj.catchphrase,
                    bs: obj.bs
                }
            }))

            res.send(JSON.stringify(obj));
        }
    });
});

//Get Data by ID
app.get('/user/:id', (req, res) => {
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (!err) {
            let value = results.map((value) => ({
                name: value.name,
                username: value.username,
                email: value.email,
                address: {
                    street: value.street,
                    suite: value.suite,
                    city: value.city,
                    zipcode: value.zipcode,
                    geo: {
                        lat: value.lat,
                        lng: value.lng
                    },
                },
                phone: value.phone,
                website: value.website,
                company: {
                    companyname: value.companyname,
                    catchphrase: value.catchphrase,
                    bs: value.bs
                },
            }))
            res.send(JSON.stringify(value));
        } else
            console.log(err);
    })
});

//Update existing Data
app.put('/user/:id', (req, res) => {
    let user = req.body;
    connection.query('UPDATE `users` SET `name`=?,`username`=?,`email`=?,`street`=?,`suite`=?,`city`=?,`zipcode`=?,`lat`=?,`lng`=?,`phone`=?,`website`=?,`companyname`=?,`catchphrase`=?,`bs`=? where `Id`=?', [user.name, user.username, user.email, user.address.street, user.address.suite, user.address.city, user.address.zipcode, user.address.geo.lat, user.address.geo.lng, user.phone, user.website, user.company.companyname, user.company.catchphrase, user.company.bs, req.params.id], (error, results) => {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});



//Delete Data by ID
app.delete('/user/:id', (req, res) => {
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err)
            res.send('User Record deleted successfully.');
        else
            console.log(err);
    })
});





// Map function

// var data = [{ "name": "Ali" }, { "name": "Ahmer" }, { "name": "Uzair" }]
// data.map((value,index) => value.age = 22)
// console.log(data);


// var array = [{ name: 'Ali' }, { name: 'Ahmer' }];
// array.map((e) => {
//     e.age = 21;
// });

// console.log(array);





app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on Port 3000!")
})