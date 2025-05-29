'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [meta, setMeta] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleProses() {
    if (!url) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      setMeta(data.meta)
      setImgSrc(data.image)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate() {
    if (!meta) return
    setIsUpdating(true)
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(meta)
      })
      const data = await res.json()
      setImgSrc(data.image)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            News Image Generator
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Convert news articles into beautiful social media images
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <input
                className="flex-1 min-w-0 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Paste news article URL here..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleProses()}
              />
              <button
                onClick={handleProses}
                disabled={isLoading || !url}
                className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isLoading || !url) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Generate'}
              </button>
            </div>
          </div>

          {/* Meta Editing Section */}
          {meta && (
            <div className="p-6 border-b border-gray-200 space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Customize Content</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <textarea
                    id="title"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                    value={meta.title}
                    onChange={e => setMeta({ ...meta, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      id="section"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      value={meta.section}
                      onChange={e => setMeta({ ...meta, section: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      value={meta.date}
                      onChange={e => setMeta({ ...meta, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdating ? 'Updating...' : 'Update Image'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {imgSrc && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
              <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
                <img 
                  src={imgSrc} 
                  alt="Generated preview" 
                  className="max-w-full h-auto rounded shadow-md border border-gray-200" 
                />
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={imgSrc}
                  download="news-image.png"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download Image
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Paste any news article URL to generate a beautiful social media image</p>
        </div>
      </div>
    </main>
    
  )
}