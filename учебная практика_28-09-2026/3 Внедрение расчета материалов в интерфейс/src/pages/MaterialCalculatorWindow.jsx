import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageBox from '../components/MessageBox.jsx'

function MaterialCalculatorWindow() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    productTypeId: '',
    materialTypeId: '',
    quantity: '',
    param1: '',
    param2: '',
  })
  const [materialAmount, setMaterialAmount] = useState(null)
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    document.title = 'CRM: Расчет материалов'
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMaterialAmount(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const response = await fetch('/api/materials/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        throw new Error(`сервер ответил ${response.status}`)
      }
      const body = await response.json()
      if (body.materialAmount === -1) {
        setDialog({
          type: 'error',
          message:
            'Расчет невозможен. Проверьте, что тип продукции и тип материала существуют, количество — целое число больше 0, а параметры продукции — положительные числа.',
          onConfirm: () => setDialog(null),
        })
        return
      }
      setMaterialAmount(body.materialAmount)
    } catch {
      setDialog({
        type: 'error',
        message: 'Не удалось выполнить расчет. Проверьте соединение с сервером и повторите попытку.',
        onConfirm: () => setDialog(null),
      })
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>Расчет материалов</h1>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Назад
        </button>
      </header>
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-form-fields">
          <label>
            ID типа продукции
            <input type="number" name="productTypeId" value={form.productTypeId} onChange={handleChange} />
          </label>
          <label>
            ID типа материала
            <input type="number" name="materialTypeId" value={form.materialTypeId} onChange={handleChange} />
          </label>
          <label>
            Количество продукции (шт.)
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
          </label>
          <label>
            Параметр 1
            <input type="number" step="any" name="param1" value={form.param1} onChange={handleChange} />
          </label>
          <label>
            Параметр 2
            <input type="number" step="any" name="param2" value={form.param2} onChange={handleChange} />
          </label>
        </div>
        <button type="submit" className="btn">
          Рассчитать
        </button>
        {materialAmount !== null && (
          <p className="calculator-result">Итоговый расход материала с учетом брака: {materialAmount}</p>
        )}
      </form>
      {dialog && <MessageBox {...dialog} />}
    </>
  )
}

export default MaterialCalculatorWindow
