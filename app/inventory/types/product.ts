type Product = {
  id: string
  user_id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  status: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
  updated_at: string
}