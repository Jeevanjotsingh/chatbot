import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/get_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: question }),
      })
      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      setAnswer('An error occurred while fetching the answer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Ollama LLM Model</title>
      </Head>

      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Getting Answer...' : 'Get Answer'}
          </button>
        </form>

        {answer && (
          <div className="answer">
            <p>{answer}</p>
          </div>
        )}
      </main>
    </div>
  )
}