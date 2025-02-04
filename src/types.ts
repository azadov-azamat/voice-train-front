export interface DataItem {
    id: number
    text: string
    file_name: string
    is_correct: boolean
  }
  
  export interface PaginatedData {
    page: number
    limit: number
    total: number
    totalPages: number
    data: DataItem[]
  }
  
  