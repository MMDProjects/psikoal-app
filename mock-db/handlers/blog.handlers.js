const db = require('../db')
const { listMeta } = require('../helpers')

function serveBlog(blog) {
  return {
    ...blog,
    likeCount: db.blogLikes[blog.id] ?? blog.likeCount,
    liked: db.likedBlogIds.has(blog.id),
  }
}

function registerBlogHandlers(mock) {
  mock.onGet('/blogs').reply((config) => {
    const category = config.params?.category ?? ''
    const limit = config.params?.limit != null ? Number(config.params.limit) : undefined
    let result = db.blogs.map(serveBlog)
    if (category) result = result.filter((b) => b.categories.includes(category))
    const total = result.length
    if (limit != null) result = result.slice(0, limit)
    return [200, { data: result, meta: { ...listMeta(result), total } }]
  })

  mock.onGet(/\/blogs\/[\w-]+$/).reply((config) => {
    const lastSegment = config.url.split('/').pop()
    const blog = db.blogs.find((b) => b.slug === lastSegment || b.id === lastSegment)
    if (!blog) return [404, { code: 'BLOG_NOT_FOUND', message: 'Blog yazısı bulunamadı.' }]
    return [200, serveBlog(blog)]
  })

  mock.onPost(/\/blogs\/[\w-]+\/like/).reply((config) => {
    const slug = config.url.split('/').slice(-2, -1)[0]
    const blog = db.blogs.find((b) => b.slug === slug || b.id === slug)
    if (!blog) return [404, { code: 'BLOG_NOT_FOUND', message: 'Blog yazısı bulunamadı.' }]
    const current = db.blogLikes[blog.id] ?? blog.likeCount
    if (db.likedBlogIds.has(blog.id)) {
      db.likedBlogIds.delete(blog.id)
      db.blogLikes[blog.id] = Math.max(0, current - 1)
    } else {
      db.likedBlogIds.add(blog.id)
      db.blogLikes[blog.id] = current + 1
    }
    return [200, { likeCount: db.blogLikes[blog.id], liked: db.likedBlogIds.has(blog.id) }]
  })
}

module.exports = { registerBlogHandlers }
