import { useEffect, useState } from 'react'
import Cell from './Cell'

export default function Spreadsheet() {
  const [data, setData] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', 'xxx', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ])

  useEffect(() => {
    const data = window.localStorage.getItem('spreadsheet')
    if (data) setData(JSON.parse(data))
  }, [])

  function updateValue(x: number, y: number, value: string) {
    const _data = structuredClone(data)
    _data[y][x] = value
    setData(_data)

    if (window && window.localStorage) {
      window.localStorage.setItem('spreadsheet', JSON.stringify(_data))
    }
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
