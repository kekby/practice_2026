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
  const [isDirty, setIsDirty] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    document.title = isEditMode
      ? 'CRM: Карточка партнера [Редактирование]'
      : 'CRM: Карточка партнера [Добавление]'
  }, [isEditMode])

  // предупреждаем о потере несохранённых изменений при закрытии/обновлении вкладки
  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!isDirty) return
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  function handleBack() {
    // та же защита, что и beforeunload, но для перехода внутри приложения — его beforeunload не ловит
    if (isDirty && !window.confirm('Изменения не сохранены. Всё равно вернуться назад?')) {
      return
    }
    navigate('/')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    try {
      const url = isEditMode ? `/api/partners/${id}` : '/api/partners'
      const method = isEditMode ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        throw new Error(`сервер ответил ${response.status}`)
      }
      setIsDirty(false)
      navigate('/')
    } catch {
      setSubmitError('Не удалось отправить данные партнёра')
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>{isEditMode ? 'Карточка партнера' : 'Новый партнер'}</h1>
        <button type="button" className="btn" onClick={handleBack}>
          Назад
        </button>
      </header>
      <form className="edit-form" onSubmit={handleSubmit}>
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
        {submitError && <p className="error-message">{submitError}</p>}
        <button type="submit" className="btn">
          Сохранить
        </button>
      </form>
    </>
  )
}

export default PartnerEditWindow
