import express from "express"
import mysql from "mysql"

const app = express();

const connection = mysql.createConnection( {
    host: 'localhost',
    user:'root',
    password: '',
    database: 'posty'
}) 

app.set('view engine', 'ejs')

app.use(express.static('public'))

// config to access form information
app.use(express.urlencoded({extended: false}))

// homepage
app.get('/', (req, res) => {
    res.render('index')
})

// display login form
app.get('/login', (req, res) => {
    const user = {
        email: '',
        password: ''
    }
    res.render('login', {user,error: false, message: ''})
})


// submit login form
app.post('/login', (req, res) => {
    res.render('/signup')
})




// display signup form
app.get('/signup', (req, res) => {
    const user = {
        fulname: '',
        email: '',
        password: '',
        confirmPassword:''
    }
    res.render('signup',{user, error: false, message:''})
})

// submit signup form
app.post('/signup', (req, res) => {
    const user = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    if (user.password === user.confirmPassword) {
        // check if user exists

        let sql = 'SELECT * FROM users WHERE email = ?'
        connection.query(
            sql,
            [user.email],
            (error, results) => {
                if (results.length > 0) {
                    // user exists
                    let error = true
                    let message = 'Accout already exists with the email provided'

                    res.render('signup', {user, error, message})
                } else {
                    // create user
                    let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
                    connection.query(
                        sql,
                        [user.fullname, user.email, user.password],
                        (error, results) => {
                            console.log('user successfully created')
                        }
                    )
                    
                }
            }
        )

    } else {
        // passwords do not match
        let error = true
        let message = 'Passwords Mismatch'
        res.render('signup', {user, error, message})
    }
})


app.listen(4000, () => {
    console.log("app is running")
})


