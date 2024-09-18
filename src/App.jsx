import React from 'react'
import ImageUpload from './components/ImageUpload'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Image Upload</h1>
        <ImageUpload />
      </div>
    </div>
  )
}

export default App