export default async function handler(req, res) {
    if (req.method === 'POST') {
        const response = await fetch('http://localhost:8000/api/get_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        })
        const data = await response.json()
        res.status(200).json(data)
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}