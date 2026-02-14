const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')



blogsRouter.get('/', (request, response, next) => {
  Blog.find({}).populate('user').then((blogs) => {
    response.json(blogs)
  }).catch(error => next(error))
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body=request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id',userExtractor, async (request, response, next) => {
  try {
    const user= request.user
    const blog = await Blog.findById(request.params.id)
    if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() === user._id.toString()){
      await blog.deleteOne()
      response.status(204).end()
    }else{
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }  
  } catch (error) {
    next(error)
  }
})
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter