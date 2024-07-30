require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.json())
app.use(cors())


morgan.token('tiny2', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :tiny2'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(result => {
        response.json(result)
    })
})

app.post('/api/persons/', (request, response) => {
    if(!request.body.name || !request.body.number) {
        return response.status(400).json({error: 'name or number missing'})
    }
    const person = new Person({
        name: request.body.name,
        number: request.body.number,
    })

    person.save().then(result => {
        response.json(result)
    })
})
app.delete('/api/persons/:id', (request,response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})