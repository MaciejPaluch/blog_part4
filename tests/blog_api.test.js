const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})

test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'Link',
    likes: 1
  }

  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length + 1
  )

  const titles = blogsAtEnd.body.map(b => b.title)
  assert(titles.includes('Title'))
})
test.only('id instead of _id', async () => {

  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert(blog.id)
  assert.strictEqual(blog._id, undefined)

})

test.only('0 is default for likes', async () => {
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'Link',
  }
  const response = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)

  assert.strictEqual(response.body.likes, 0)

})

test.only('400 if element missing in body', async () => {
    const newBlog = {
    title: 'Title1',
    url: 'Link',
  }
  const response = await api
  .post('/api/blogs')
  .send(newBlog)

  assert.strictEqual(response.status, 400)

})

after(async () => {
  await mongoose.connection.close()
})