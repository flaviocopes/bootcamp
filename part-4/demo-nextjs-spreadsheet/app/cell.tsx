'use client'

import { useEffect, useState } from 'react'

type Props = {
  value: string
  x: number
  y: number
  updateValue: (x: number, y: number, value: string) => void
}

export default function Cell({ value, x, y, updateValue }: Props) {
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    window.document.addEventListener('unselectAll', () => {
      setSelected(false)
    })
  }, [])

  if (selected) {
    return (
      <input
        className='border-2 p-3 border-zinc-300'
        value={value}
        onChange={(e) => {
          updateValue(x, y, e.target.value)
        }}
      />
    )
  }
  return (
    <div
      className='border-2 p-3 border-zinc-300'
      onClick={() => {
        window.document.dispatchEvent(new Event('unselectAll'))
        setSelected(true)
      }}>
      {value || <span className='text-zinc-200'>-</span>}
    </div>
  )
}
