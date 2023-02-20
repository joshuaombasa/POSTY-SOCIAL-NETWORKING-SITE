
import express from "express"
import mysql from "mysql"
import bcrypt from "bcrypt"
import session from "express-session"

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'posty'
})

// prepare to use sessions
app.use(session({
    secret: 'siri ya watatu',
    resave: true,
    saveUninitialized: false
}))

app.set('view engine', 'ejs')

app.use(express.static('public'))

// config to access form information
app.use(express.urlencoded({ extended: false }))

// constantly check if the user is logged in, the function will be executed with every request made
app.use((req, res, next) => {
    if (req.session.userID === undefined) {
        res.locals.isLoggedIn = false
        res.locals.username = 'Guest'
    } else {
        res.locals.isLoggedIn = true
        res.locals.username = req.session.username.toString().split(' ')[0]
        
    }
    // promp what to do after
    next()
})

// homepage
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM posts JOIN users ON posts.u_id_fk = users.u_id ORDER BY posts.created_at DESC'
    connection.query(
        sql, (error, results) => {
            res.render('index', {posts: results})
        }
    )
    
})

// display login form
app.get('/login', (req, res) => {
    const user = {
        email: '',
        password: ''
    }
    res.render('login', { user, error: false, message: '' })
})


// submit login form
app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    // check if user exists
    let sql = 'SELECT * FROM users WHERE email = ?'
    connection.query(
        sql,
        [user.email],
        (error, results) => {
            if (results.length > 0) {
                // compare password subited with password stored in the db
                bcrypt.compare(user.password, results[0].password, (error, isEqual) => {
                    if (isEqual) {
                        // grant access
                        req.session.userID = results[0].u_id
                        req.session.username = results[0].username
                        console.log('user successfully logged in ')
                        res.redirect('/')



                    } else {
                        // incorrect password
                        let error = true
                        let message = 'Incorect Password'
                        res.render('login', {
                            user, error, message
                        })
                    }
                })




            } else {
                // user does not exist
                let error = true
                let message = 'Account does not exist.'
                res.render('login', { user, error, message })
            }
        }
    )
})




// display signup form
app.get('/signup', (req, res) => {
    const user = {
        fulname: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    res.render('signup', { user, error: false, message: '' })
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

                    res.render('signup', { user, error, message })
                } else {
                    // hash password and create user
                    bcrypt.hash(user.password, 10, (error, hash) => {
                        let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
                        connection.query(
                            sql,
                            [user.fullname, user.email, hash],
                            (error, results) => {
                                res.redirect('/login')
                            }
                        )
                    })




                }
            }
        )

    } else {
        // passwords do not match
        let error = true
        let message = 'Passwords Mismatch'
        res.render('signup', { user, error, message })
    }
})

// logout
app.get('/logout', (req,res)=> {
    req.session.destroy(() => {
        res.redirect('/')
    })
}) 

// create a post
app.post('/create-a-post', (req,res) => {
    let sql = 'INSERT INTO posts (post, u_id_fk) VALUES (?,?)'
    connection.query(
        sql,
        [req.body.post, req.session.userID],
        (error, results) => {
            res.redirect('/')
        }
    )
})

app.listen(4000, () => {
    console.log("app is running")
})


