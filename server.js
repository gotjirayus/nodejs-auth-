require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/run',(req,res)=> res.send('API Running!'))


const posts = [
    {
        username: 'god',
        title: 'Post 1'
    },
    {
        username: 'batman',
        title: 'Post 1'
    }
]

 

app.get('/posts', auth, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req,res) => {
    const username = req.body.username
    const user = { name: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken:accessToken })
})

function auth (req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(8000, () => {
    console.log(`Server Startd on Port 8000`)
})