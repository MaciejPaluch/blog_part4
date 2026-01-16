const Note = require('../models/blog')

const initialBlogs = [
  {
    title: "Harry Potter",
    author: "JK Rowling",
    url: "www.wizardingworld.com",
    likes: 1000
  },
  {
    title: "Ninjago",
    author: "Canada",
    url: "www.wizardingworld.com",
    likes: 2000
  },
    {
    title: "Transformers",
    author: "Bay",
    url: "www.wizardingworld.com",
    likes: 500
  }
]

// const nonExistingId = async () => {
//   const note = new Note({ content: 'willremovethissoon' })
//   await note.save()
//   await note.deleteOne()

//   return note._id.toString()
// }

// const notesInDb = async () => {
//   const notes = await Note.find({})
//   return notes.map(note => note.toJSON())
// }

module.exports = {
  initialBlogs
}