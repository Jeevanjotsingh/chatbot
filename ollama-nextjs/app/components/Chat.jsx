import { useState, useEffect } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAnswer('')
    const response = await fetch('/api/get_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n\n')
      lines.forEach(line => {
        if (line.startsWith('data: ')) {
          const token = line.slice(6)
          setAnswer(prev => prev + token + ' ')
        }
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div>{answer}</div>
    </div>
  )
}