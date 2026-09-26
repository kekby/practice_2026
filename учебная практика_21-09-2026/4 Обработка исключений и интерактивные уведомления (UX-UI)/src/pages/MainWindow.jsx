import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageBox from '../components/MessageBox.jsx'

function MainWindow() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState([])
  const [dialog, setDialog] = useState(null)

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
      .catch(() => {
        setDialog({
          type: 'error',
          message: 'Не удалось загрузить список партнёров. Проверьте соединение с сервером и обновите страницу.',
          onConfirm: () => setDialog(null),
        })
      })
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
        {partners.map((partner) => (
          // partnerId передаём в URL — по нему PartnerEditWindow поймёт, что это редактирование, а не добавление
          <div
            className="partner-card"
            key={partner.partnerId}
            onClick={() => navigate(`/partners/${partner.partnerId}/edit`)}
          >
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
      {dialog && <MessageBox {...dialog} />}
    </>
  )
}

export default MainWindow
