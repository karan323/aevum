import React, { useEffect, useMemo, useState } from 'react'
import { getUsers } from '../../lib/storage'

export default function Users(){
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    try { setUsers(getUsers()) } catch { setUsers([]) }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.firstName||'').toLowerCase().includes(q) ||
      (u.lastName||'').toLowerCase().includes(q) ||
      (u.email||'').toLowerCase().includes(q) ||
      (u.phone||'').toLowerCase().includes(q)
    )
  }, [users, query])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Users</h2>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search name, email, phone"
          className="border rounded px-3 py-1"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <React.Fragment key={u.id}>
                <tr className="border-b">
                  <td className="py-2 pr-4">{u.firstName} {u.lastName}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.phone}</td>
                  <td className="py-2 pr-4">{new Date(u.createdAt||Date.now()).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    <button className="px-2 py-1 border rounded" onClick={()=>setOpenId(openId===u.id?null:u.id)}>
                      {openId===u.id? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {openId===u.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold">Address</div>
                          <div className="text-gray-700 whitespace-pre-line">
                            {u.address?.addr1}
                            {u.address?.addr2 ? `\n${u.address.addr2}` : ''}
                            {`\n${u.address?.city || ''}${u.address?.province? ', ' + u.address.province : ''}`}
                            {`\n${u.address?.country || ''} ${u.address?.postal || ''}`}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Preferences</div>
                          <div className="text-gray-700 text-sm">
                            <div>Newsletter: {u.newsletter ? 'Yes' : 'No'}</div>
                            <div>Personalized Ads: {u.ads ? 'Yes' : 'No'}</div>
                            <div>Gender: {u.gender || '-'}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length===0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

