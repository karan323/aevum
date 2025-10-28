import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between">
        <div>© {new Date().getFullYear()} Aevum. All rights reserved.</div>
        <div>Designed for demo • Contact: info@aevum.example</div>
      </div>
    </footer>
  )
}
