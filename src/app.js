const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')
const app = express()

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
            p1: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus distinctio voluptates tempora aut, magni quae necessitatibus tenetur temporibus repellat aspernatur totam, nihil deserunt quo possimus atque, sapiente dignissimos voluptas! Rem!",
            p2: "Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.",
        },
        ul: {
            head: "            How it works",
            span: "Here’ s what you need to know before getting started with the navbar:",
            list: {
                li1: "Navbars require a wrapping.navbar with.navbar - expand {-sm | -md | -lg | -xl }            for responsive collapsing and color scheme classes.            ",
                li2: "Navbars and their contents are fluid by            default.Use optional containers to limit their horizontal width.            ",
                li3: "Use our spacing and flex utility classes            for controlling spacing and alignment within navbars.",
                li4: "Navbars are responsive by            default,            but you can easily modify them to change that.Responsive behavior depends on our Collapse JavaScript plugin.",
                li5: " Navbars are hidden by            default when printing.Force them to be printed by adding.d - print to the.navbar.See the display utility class.",
                li6: "Ensure accessibility by using a < nav > element or,            if using a more generic element such as a < div > ,           add a role = 'navigation'            to every navbar to explicitly identify it as a landmark region            for users of assistive technologies.            ",
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
            span: "Navbars come with built-in support for a handful of sub-components. Choose from the following as needed:",
            list: {
                li1: ".navbar-brand for your company, product, or project name.",
                li2: ".navbar-nav for a full-height and lightweight navigation (including support for dropdowns).",
                li3: ".navbar-toggler for use with our collapse plugin and other navigation toggling behaviors.",
                li4: ".form-inline for any form controls and actions.",
                li5: ".navbar-text for adding vertically centered strings of text.",
                li6: ".collapse.navbar-collapse for grouping and hiding navbar contents by a parent breakpoint.",
                li7: "Here’s an example of all the sub-components included in a responsive light-themed navbar that automatically collapses at the lg (large) breakpoint."

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
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})