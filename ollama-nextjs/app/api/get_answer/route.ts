import { NextResponse } from 'next/server'

export const config = {
  api: {
    responseLimit: false,
  },
}

const TIMEOUT_MS = 120000 // 120 seconds

export async function POST(request: Request) {
  const body = await request.json()
  
  const controller = new AbortController()
  const signal = controller.signal

  const fetchPromise = fetch('http://localhost:8000/api/get_answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: signal,
  })

  const response = await Promise.race([
    fetchPromise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
    )
  ])

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    return NextResponse.json({ error: `Server error: ${response.status} - ${errorText}` }, { status: response.status })
  }
  
  const data = await response.json()
  return NextResponse.json(data)
}