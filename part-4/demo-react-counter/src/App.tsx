import { useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)

  const increment = (step) => {
    setCount(count + step)
  }

  return (
    <div className='App'>
      <h1>Counter: {count}</h1>
      <Button step={1} increment={increment} />
      <Button step={10} increment={increment} />
      <Button step={100} increment={increment} />
    </div>
  )
}

export default App