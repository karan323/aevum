import React from 'react'

export default function Profile(){
  let user = null
  try { user = JSON.parse(localStorage.getItem('aevum_user') || 'null') } catch {}
  if (!user) return <div className="max-w-xl mx-auto">Please log in to view your profile.</div>

  const addr = user.address || {}

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div className="font-semibold">Name</div>
          <div className="text-gray-700">{user.firstName} {user.lastName}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Email</div>
          <div className="text-gray-700">{user.email}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Phone</div>
          <div className="text-gray-700">{user.phone}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Gender</div>
          <div className="text-gray-700">{user.gender}</div>
        </div>
      </div>
      <div className="mt-6 p-4 border rounded">
        <div className="font-semibold">Address</div>
        <div className="text-gray-700 mt-1 whitespace-pre-line">
          {addr.addr1}
          {addr.addr2 ? `\n${addr.addr2}` : ''}
          {`\n${addr.city}, ${addr.province}`}
          {`\n${addr.country} ${addr.postal}`}
        </div>
        <p className="text-sm text-gray-500 mt-2">Edit your address during checkout.</p>
      </div>
    </div>
  )
}

