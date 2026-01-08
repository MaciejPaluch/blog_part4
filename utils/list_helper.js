const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs)=>{
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
  }, 0)

}

const favoriteBlog =(blogs)=>{
    if(blogs.length!=0){
        return blogs.reduce((favorite,blog)=>{
            if(blog.likes>favorite.likes){
                return blog;
            }
                return favorite;
            }, blogs[0])

    }else{
        return null;
    }
    
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}