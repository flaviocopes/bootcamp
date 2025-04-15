import { useState, useEffect } from 'react'

import AddBill from './components/AddBill'
import AddCategory from './components/AddCategory'
import BillsTable from './components/BillsTable'
import NavBar from './components/NavBar'

export type Bill = {
  amount: number
  category: string
  date: Date
}

function App() {
  const [shouldShowAddCategory, setShouldShowAddCategory] = useState(false)

  const [shouldShowAddBill, setShouldShowAddBill] = useState(false)

  const [categories, setCategories] = useState<string[]>([])
  const [bills, setBills] = useState<Bill[]>([])

  useEffect(() => {
    const categoriesInLocalStorage = localStorage.getItem('categories')
    const billsInLocalStorage = localStorage.getItem('bills')

    if (categoriesInLocalStorage) {
      setCategories(JSON.parse(categoriesInLocalStorage) as string[])
    }

    if (billsInLocalStorage) {
      setBills(JSON.parse(billsInLocalStorage) as Bill[])
    }

    if (!categoriesInLocalStorage) {
      setShouldShowAddCategory(true)
    }
    if (!billsInLocalStorage) {
      setShouldShowAddBill(true)
    }
  }, [])

  const addCategory = (category: string) => {
    const updatedCategories = [...(categories || []), category]
    setCategories(updatedCategories)
    setShouldShowAddCategory(false)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))
  }

  const showAddCategory = () => {
    setShouldShowAddCategory(true)
  }

  const removeBill = (index: number) => {
    let updatedBills = [...bills]
    updatedBills = updatedBills
      .slice(0, index)
      .concat(updatedBills.slice(index + 1, updatedBills.length))
    setBills(updatedBills)
    localStorage.setItem('bills', JSON.stringify(updatedBills))
  }

  const addBill = (amount: number, category: string, date: Date) => {
    const bill: Bill = { amount, category, date }
    const updatedBills = [...(bills || []), bill]
    setBills(updatedBills)
    setShouldShowAddBill(false)
    localStorage.setItem('bills', JSON.stringify(updatedBills))
  }

  const showAddBill = () => {
    setShouldShowAddBill(true)
  }

  return (
    <div className='App'>
      {shouldShowAddCategory ? (
        <AddCategory addCategory={addCategory} />
      ) : shouldShowAddBill ? (
        <AddBill addBill={addBill} categories={categories} />
      ) : (
        <div>
          <NavBar categories={categories} showAddCategory={showAddCategory} />
          <div className='container flex'>
            <BillsTable
              bills={bills}
              showAddBill={showAddBill}
              removeBill={removeBill}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
