import apiClient from '@/lib/axios' // ✅ default import


export interface Blog {
  id: number
  username: string
  date_added: string
  title: string
  body: string
  thumbs_up_count: number
  image_url?: string | null
}

export interface BlogsResponse {
  blogs: Blog[]
}

export const blogService = {
  // Get all blogs
  getAllBlogs: async (): Promise<BlogsResponse> => {
    const response = await apiClient.get('/community/blogs/')
    return response.data
  },

  // Get user's blogs (requires authentication)
  getMyBlogs: async (): Promise<BlogsResponse> => {
    const response = await apiClient.get('/community/blogs/my/')
    return response.data
  },

  // Get a single blog by ID
  getBlogById: async (blogId: number): Promise<Blog> => {
    const response = await apiClient.get(`/community/blogs/${blogId}/`)
    console.log('getBlogById response:', response.data)
    
    // Handle the actual response format from your backend
    if (response.data && typeof response.data === 'object') {
      // If the response has a 'blog' property (your actual backend format)
      if (response.data.blog && typeof response.data.blog === 'object') {
        console.log('Found blog in response.data.blog:', response.data.blog)
        return response.data.blog
      }
      // If it's in the same format as getAllBlogs (with blogs array), extract first item
      if (response.data.blogs && Array.isArray(response.data.blogs) && response.data.blogs.length > 0) {
        console.log('Found blog in response.data.blogs[0]:', response.data.blogs[0])
        return response.data.blogs[0]
      }
      // If it's already a single blog object, return it directly
      if (response.data.id && response.data.title && response.data.username) {
        console.log('Found direct blog object:', response.data)
        return response.data
      }
    }
    console.error('Invalid response format:', response.data)
    throw new Error('Invalid response format from server')
  },

  // Create a new blog post
  createBlog: async (formData: FormData): Promise<{ success: boolean; blog?: Blog }> => {
    const response = await apiClient.post('/community/blogs/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Edit a blog post
  editBlog: async (blogId: number, formData: FormData): Promise<{ success: boolean; blog?: Blog }> => {
    const response = await apiClient.post(`/community/blogs/${blogId}/edit/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete a blog post
  deleteBlog: async (blogId: number): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.delete(`/community/blogs/${blogId}/delete/`)
    return response.data
  },

  // Like/thumbs up a blog post
  thumbsUpBlog: async (blogId: number): Promise<{ success: boolean; thumbs_up_count?: number }> => {
    const response = await apiClient.post(`/community/blogs/${blogId}/thumbs-up/`)
    return response.data
  }
}