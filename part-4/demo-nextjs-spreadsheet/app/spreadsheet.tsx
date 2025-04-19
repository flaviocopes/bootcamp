'use client'

import { useState } from 'react'
import Cell from '@/app/cell'
import { updateSpreadsheetData } from '@/app/actions/spreadsheet'

type Props = {
  initialData: string[][]
}

export default function Spreadsheet({ initialData }: Props) {
  const [data, setData] = useState(initialData)

  function updateValue(x: number, y: number, value: string) {
    const _data = structuredClone(data)
    _data[y][x] = value
    setData(_data)

    // Update the database using the server action
    updateSpreadsheetData(_data)
  }

  /* possible grid-cols-* values are grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 */
  return (
    <div className={`grid grid-cols-${data[0].length}`}>
      {data.map((row, y) => {
        return row.map((cell, x) => {
          return (
            <Cell
              key={y + '-' + x}
              value={cell}
              x={x}
              y={y}
              updateValue={updateValue}
            />
          )
        })
      })}
    </div>
  )
}
