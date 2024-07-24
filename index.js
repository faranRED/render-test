const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(cors())


morgan.token('tiny2', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :tiny2'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request,response) => {
    const person = persons.find(person => person.id === request.params.id)
    if(!person) {
        response.status(404).end()
    }
    response.json(person)

})
app.post('/api/persons/', (request, response) => {
    if(!request.body.name || !request.body.number) {
        return response.status(400).json({error: 'name or number missing'})
    }
    if(persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({error: 'name already exists'})
    }
    const person = {
        name: request.body.name,
        number: request.body.number,
        id: Math.round((Math.random() * 100) + 4)
    }
    persons = persons.concat(person)
    response.json(person)
})
app.delete('/api/persons/:id', (request,response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})