import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PartnerEditWindow() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'CRM: Карточка партнера [Редактирование]'
  }, [])

  return (
    <>
      <header className="app-header">
        <h1>Карточка партнера</h1>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Назад
        </button>
      </header>
      <main className="edit-form">
        <label>
          Название
          <input type="text" name="companyName" />
        </label>
        <label>
          ИНН
          <input type="text" name="inn" />
        </label>
        <label>
          Телефон
          <input type="text" name="phone" />
        </label>
      </main>
    </>
  )
}

export default PartnerEditWindow
