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
    Person.find({}).then(result => {
        console.log(result)
    response.send(`<p>Phonebook has info for ${result.length} people</p> <p>${new Date()}</p>`)
    })
})
app.get('/api/persons/:id', (request,response, next) => {
    Person.findById(request.params.id).then(result => {
        if(result) {
        response.json(result)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
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
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (request,response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body

    const newPerson = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, newPerson, {new: true, runValidators: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === "CastError") {
        return response.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError') {
        if(error.errors.name) {
        return response.status(400).json({error : 'Name cannot be less than 3 letters'})
    } else if(error.errors.number) {
        return response.status(400).send({error : 'Number cannot be less than 8 digits and should be in the format 000-000 or 00-0000'})
    }
}
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})