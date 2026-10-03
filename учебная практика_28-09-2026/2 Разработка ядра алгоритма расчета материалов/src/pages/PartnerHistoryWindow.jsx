import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBox from '../components/MessageBox.jsx'

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`сервер ответил ${response.status}`)
  }
  return response.json()
}

function PartnerHistoryWindow() {
  const navigate = useNavigate()
  const { id } = useParams() // partner_id приходит из главной формы через URL
  const [companyName, setCompanyName] = useState('')
  const [shipments, setShipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialog, setDialog] = useState(null)

  useEffect(() => {
    document.title = companyName
      ? `CRM: История реализации продукции — ${companyName}`
      : 'CRM: История реализации продукции'
  }, [companyName])

  useEffect(() => {
    // название партнёра нужно для заголовка, история — для таблицы; грузим параллельно
    Promise.all([fetchJson(`/api/partners/${id}`), fetchJson(`/api/partners/${id}/shipments`)])
      .then(([partner, history]) => {
        setCompanyName(partner.companyName)
        setShipments(history)
      })
      .catch(() => {
        setDialog({
          type: 'error',
          message: 'Не удалось загрузить историю продаж партнёра. Проверьте соединение с сервером и повторите попытку.',
          onConfirm: () => navigate('/'),
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  return (
    <>
      <header className="app-header">
        <h1>История реализации продукции{companyName && ` — ${companyName}`}</h1>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Назад
        </button>
      </header>
      <main className="history">
        {isLoading && <p>Загрузка истории продаж…</p>}
        {!isLoading && !dialog && shipments.length === 0 && (
          <p>У этого партнёра пока нет продаж.</p>
        )}
        {shipments.length > 0 && (
          <table className="history-table">
            <thead>
              <tr>
                <th>Наименование продукции</th>
                <th>Количество (шт.)</th>
                <th>Дата продажи</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.saleId}>
                  <td>{shipment.productName}</td>
                  <td>{shipment.quantity}</td>
                  <td>{shipment.saleDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      {dialog && <MessageBox {...dialog} />}
    </>
  )
}

export default PartnerHistoryWindow
