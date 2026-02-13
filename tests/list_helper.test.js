const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper') 

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe("favorite blog", ()=>{
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'xyz',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harry Potter',
      author: 'Rowling',
      url: 'abc',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f0',
      title: 'Toy Story',
      author: 'Pixar',
      url: 'def',
      likes: 7,
      __v: 0
    }
  ]
  test('Harry Potter is winning', () => {
    const result = listHelper.favoriteBlog(listWithBlogs)
    assert.deepStrictEqual(result, listWithBlogs[1]) 
  })    
})