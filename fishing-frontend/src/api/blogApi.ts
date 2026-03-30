import { http } from './http'
import type { BlogPostDTO } from './types'

export async function fetchPublishedBlogPosts(): Promise<BlogPostDTO[]> {
  const { data } = await http.get<BlogPostDTO[]>('/api/Blog')
  return data
}

export async function fetchBlogPostById(id: number): Promise<BlogPostDTO | null> {
  const { data } = await http.get<BlogPostDTO>(`/api/Blog/${id}`)
  return data
}
