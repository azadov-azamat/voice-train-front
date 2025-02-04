"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { AudioCard } from "./audio-card"
import type { DataItem, PaginatedData } from "./types"
import { BiDownload } from "react-icons/bi"

export default function App() {
  const [data, setData] = useState<DataItem[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const baseUrl = `${import.meta.env.VITE_BACKEND_HOST}`;

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true)
      try {
        const response = await axios.get<PaginatedData>(baseUrl + "/data", {
          params: { page, limit },
        })
        setData(response.data.data)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    },
    [limit],
  )

  useEffect(() => {
    fetchData(page)
  }, [page, fetchData])

  const handleSave = async (id: number, text: string, isCorrect: boolean) => {
    try {
      await axios.patch(baseUrl + `/data/${id}`, {
        text,
        is_correct: isCorrect,
      })
      // Refresh data after save
      fetchData(page)
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const onDelete = async (id: number) => {
    try {
      await axios.delete(baseUrl + `/data/${id}`);
      // Refresh data after save
      fetchData(page)
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="relative w-full max-w-3xl flex items-center justify-center">
          <h1 className="md:text-3xl text-xl font-bold mb-8">Audio Ma'lumotlar</h1>
          <a href={baseUrl + "/export-csv"} className="absolute right-0 rounded-lg text-white px-3 py-2 bg-blue-600">
            <BiDownload size={22}/>
          </a>
      </div>
      {loading ? (
        <div className="text-blue-600 text-xl">Ma'lumotlar yuklanmoqda...</div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {data.map((item) => (
            <AudioCard key={item.id} item={item} onSave={handleSave} onDelete={onDelete} />
          ))}
        </div>
      )}
     <div className="flex items-center justify-between w-full max-w-3xl">
        <p>Umumiy {page}/{totalPages}</p>
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            Oldingi
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            Keyingi
          </button>
        </div>
     </div>
    </div>
  )
}
