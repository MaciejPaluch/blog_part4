const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})


  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Viewing blogs (GET)', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('id is defined instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('Adding blogs (POST)', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog Title',
      author: 'New Author',
      url: 'http://newurl.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('New Blog Title'))
  })

  test('0 is default for likes', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author',
      url: 'Link',
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('400 if title or url missing', async () => {
      const newBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('Deleting blogs (DELETE)', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })
})

describe('Updating blogs (PUT)', () => {
  test('succeeds with status 200 and updates likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      likes: blogToUpdate.likes + 10,
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const processedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(processedBlog.likes, blogToUpdate.likes + 10)
  })
})


after(async () => {
  await mongoose.connection.close()
})