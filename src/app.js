const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

hbs.registerHelper('getTime', function(timestamp) {
    d = new Date(timestamp * 1000)
    y = d.getHours()
    m = d.getMinutes()
    return y + " : " + m
});
hbs.registerHelper('checkTime', function(timestamp) {
    if (timestamp > 1000000) {
        d = new Date(timestamp * 1000)
        y = d.getHours()
        m = d.getMinutes()
        return y + " : " + m
    } else {
        return timestamp
    }
});

hbs.registerHelper('console', function(c) {
    console.log(c)
});

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Ajay Chauhan"
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "Ajay Chauhan"
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: {
                message: "You Must provide a city for example",
                cities: "New Delhi, Moscow",
                example: req.host + "/weather?address=Bombay"
            }
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.render('weather', {
                data: forecastData,
                location
            })
        })

    })


})



app.get('/help', (req, res) => {
    res.render('help', {
        bg: "https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg",

        title: "Help",
        name: "Ajay Chauhan",
        background: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        para: {
            p1: "Hi!",
            p2: "Documentation and examples will be available later.",
        },
        ul: {
            head: "            How it works",
            span: "Here’ s what you need to know before getting started with this weather app:",
            list: {
                li1: "Your city",
                li2: "More help will be here soon",
            }
        },

        ul2: {
            img: {
                src: "https://www.bigstockphoto.com/images/homepage/module-6.jpg",
                alt: "Earth Img",
            },

            img2: {
                src: "https://www.cloudflare.com/img/homepage/header-globe.jpg",
                alt: "Globe Img",
            },
            head: "Supported content",
            span: "",
            list: {
                li1: ".",

            }
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        r: res,
        title: '404',
        msg: 'This Help Page Not Found',
        subMsg: "Please recheck the address or go back to previous page"
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You Must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Page Not Found',
        subMsg: "Please recheck the address or go back to previous page"
    })
})
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})