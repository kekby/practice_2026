import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MainWindow() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'CRM: Реестр партнеров'
  }, [])

  useEffect(() => {
    fetch('/api/partners')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`сервер ответил ${response.status}`)
        }
        return response.json()
      })
      .then(setPartners)
      .catch(() => setError('Не удалось загрузить список партнёров'))
  }, [])

  return (
    <>
      <header className="app-header">
        <h1>Реестр партнеров</h1>
        <button type="button" className="btn" onClick={() => navigate('/partners/new')}>
          Добавить партнера
        </button>
      </header>
      <main className="partners-list">
        {error && <p className="error-message">{error}</p>}
        {!error && partners.map((partner) => (
          <div className="partner-card" key={partner.partnerId}>
            <div className="partner-card-top">
              <span>{partner.companyName}</span>
              <span>{partner.discountPercent}%</span>
            </div>
            <div className="partner-detail">ИНН: {partner.inn}</div>
            <div className="partner-detail">Телефон: {partner.phone ?? '—'}</div>
            <div className="partner-detail">Рейтинг: {partner.rating ?? '—'}</div>
          </div>
        ))}
      </main>
    </>
  )
}

export default MainWindow
