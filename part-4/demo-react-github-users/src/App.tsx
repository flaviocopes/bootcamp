import { useState } from 'react'

import Form from './components/Form'
import Card from './components/Card'

type GitHubData = {
  name: string
  avatar_url: string
  login: string
  public_repos: number
  created_at: string
  location: string
  bio: string
  html_url: string
  blog: string
}

function App() {
  const [cards, setCards] = useState<GitHubData[]>([])

  async function fetchData(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (response.status === 200) {
      const data = await response.json()

      setCards([...cards, data])
    } else {
      alert('Username not found')
    }
  }

  return (
    <div>
      <Form fetchData={fetchData} />
      <div className='mt-10'>
        {cards.map((card, index) => (
          <Card key={index} data={card} />
        ))}
      </div>
    </div>
  )
}

export default App
