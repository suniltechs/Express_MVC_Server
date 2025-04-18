const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const router = require('./routes/subdir')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500

// app.get('/', (req,res) => {
//     res.send('Vanakam da maplae')
// })


app.use(cors(corsOptions))

app.use(logger)

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./public')))
app.use('/subdir',express.static(path.join(__dirname,'./public')))

app.use('/subdir', require('./routes/subdir'))
app.use('/', require('./routes/root'))
app.use('/employees', require('./routes/api/employees'))

app.get(['/', '/index', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get(['/new-page','/new-page.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get(['/old-page','/old-page.html'], (req, res) => {
    res.redirect(301, 'new-page.html');

});

// app.get('/hello.html', (req,res,next) => {
//     console.log("Vanakam da maplae")
//     next()
// }, (req,res) => {
//     res.send("Hello Friends")
// })

// const one = (req,res,next) => {
//     console.log('One')
//     next()
// }

// const two = (req,res,next) => {
//     console.log('Two')
//     next()
// }

// const three = (req,res) => {
//     console.log('Three')
//     res.send('Finished')
// }

// app.get('/chain.html',[one,two,three])


app.use((req,res) => {
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    } else if (req.accepts('json')){
        res.json({"Error": "404 Not Found"})
    } else {
        res.type('txt').send("404 Not Found")
    }
})



app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`Server running on port no : ${PORT}`)
})