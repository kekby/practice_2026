import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageBox from '../components/MessageBox.jsx'

function MainWindow() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState([])
  const [selectedId, setSelectedId] = useState(null)
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
        <div className="header-actions">
          <button
            type="button"
            className="btn"
            disabled={selectedId === null}
            onClick={() => navigate(`/partners/${selectedId}/history`)}
          >
            История продаж
          </button>
          <button type="button" className="btn" onClick={() => navigate('/calculator')}>
            Расчет материалов
          </button>
          <button type="button" className="btn" onClick={() => navigate('/partners/new')}>
            Добавить партнера
          </button>
        </div>
      </header>
      <main className="partners-list">
        {partners.map((partner) => (
          // клик выделяет партнёра (для кнопки «История продаж»), двойной клик — открывает редактирование;
          // partnerId передаём в URL — по нему следующее окно понимает, с каким партнёром работать
          <div
            className={`partner-card${partner.partnerId === selectedId ? ' partner-card-selected' : ''}`}
            key={partner.partnerId}
            onClick={() => setSelectedId(partner.partnerId)}
            onDoubleClick={() => navigate(`/partners/${partner.partnerId}/edit`)}
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
