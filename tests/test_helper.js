const Blog = require('../models/blog') 

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://temp.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,      
  nonExistingId
}