import { ChangeEvent, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type Props = {
  addBill: (amount: number, category: string, date: Date) => void
  categories: string[]
}

function AddBill(props: Props) {
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState(props.categories[0])
  const [date, setDate] = useState(new Date())

  const handleChangeDate = (date: Date | null) => {
    if (date) setDate(date)
  }

  const handleChangeAmount = (event: ChangeEvent) => {
    let newAmount = parseInt((event.target as HTMLInputElement).value, 10)
    if (isNaN(newAmount)) newAmount = 0
    setAmount(newAmount)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!amount) {
      alert('Please enter an amount')
      return
    }

    //

    props.addBill(amount, category || props.categories[0], date)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='h-100 w-full flex items-center justify-center font-sans'>
      <div className='bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg'>
        <div className='mb-4'>
          <h1 className='text-grey-darkest'>Enter a new bill</h1>
          <div className='flex mt-4'>
            <select onChange={(event) => setCategory(event.target.value)}>
              {props.categories
                ? props.categories.map((value, index) => {
                    return (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    )
                  })
                : ''}
            </select>
            <div className='mt-2 ml-1'>
              <DatePicker selected={date} onChange={handleChangeDate} />
            </div>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker'
              placeholder='Add category'
              value={amount}
              onChange={handleChangeAmount}
            />
            <button className='flex-no-shrink p-2 border-2 rounded bg-teal bg-green-500 text-white border-teal hover:text-white hover:bg-teal'>
              Add
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddBill
