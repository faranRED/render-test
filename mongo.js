const mongoose = require('mongoose')


if(process.argv.length < 3) {
    console.log('Please provide password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://faranred:${password}@cluster0.dkp1c9n.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  Name: String,
  Number: String,
})

const PhoneBook = mongoose.model('Phonebook', phoneBookSchema)

 
if(process.argv.length > 3) {
    console.log('saving')
    const phonebook = new PhoneBook({
      Name: process.argv[3],
      Number: process.argv[4],
    })
    
    phonebook.save().then(result => {
      console.log('contact saved!')
      mongoose.connection.close()
    })
    
} else {
PhoneBook.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contact => {
        console.log(contact.Name, contact.Number)
})

    mongoose.connection.close()
})
    }
