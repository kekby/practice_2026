import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const PARTNER_TYPES = ['ООО', 'ЗАО', 'АО', 'ИП', 'ТК']

function PartnerEditWindow() {
  const navigate = useNavigate()
  const { id } = useParams() // есть id в URL -> редактируем существующего партнера, нет -> добавляем нового
  const isEditMode = Boolean(id)

  const [form, setForm] = useState({
    companyName: '',
    partnerType: PARTNER_TYPES[0],
    rating: 0,
    address: '',
    directorName: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    document.title = isEditMode
      ? 'CRM: Карточка партнера [Редактирование]'
      : 'CRM: Карточка партнера [Добавление]'
  }, [isEditMode])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <header className="app-header">
        <h1>{isEditMode ? 'Карточка партнера' : 'Новый партнер'}</h1>
        <button type="button" className="btn" onClick={() => navigate('/')}>
          Назад
        </button>
      </header>
      <div className="edit-form">
        <label>
          Наименование
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder='ООО «Ромашка»'
          />
        </label>
        <label>
          Тип партнера
          <select name="partnerType" value={form.partnerType} onChange={handleChange}>
            {PARTNER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Рейтинг
          <input
            type="number"
            name="rating"
            min="0"
            step="1"
            value={form.rating}
            onChange={handleChange}
          />
        </label>
        <label>
          Адрес
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </label>
        <label>
          ФИО директора
          <input
            type="text"
            name="directorName"
            value={form.directorName}
            onChange={handleChange}
            placeholder="Иванов Иван Иванович"
          />
        </label>
        <label>
          Телефон
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
            title="Формат: +7 (999) 123-45-67"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="partner@company.ru"
            title="Формат: name@example.com"
          />
        </label>
      </div>
    </>
  )
}

export default PartnerEditWindow
