import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBox from '../components/MessageBox.jsx'

const PARTNER_TYPES = ['ООО', 'ЗАО', 'АО', 'ИП', 'ТК']

// проверка полей перед отправкой в БД — возвращает текст ошибки для MessageBox или null, если всё ок
function validateForm(form) {
  if (!form.companyName.trim()) {
    return 'Наименование партнёра — обязательное поле. Пожалуйста, заполните его и повторите попытку.'
  }
  if (!form.email.trim()) {
    return 'Email партнёра — обязательное поле. Пожалуйста, заполните его и повторите попытку.'
  }
  const rating = Number(form.rating)
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    return 'Рейтинг должен быть целым числом от 0 до 5. Пожалуйста, удалите знаки препинания и повторите попытку.'
  }
  return null
}

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
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [dialog, setDialog] = useState(null) 
  useEffect(() => {
    document.title = isEditMode
      ? 'CRM: Карточка партнера [Редактирование]'
      : 'CRM: Карточка партнера [Добавление]'
  }, [isEditMode])

  // режим редактирования — подгружаем актуальные данные партнёра из БД по id из URL
  useEffect(() => {
    if (!isEditMode) return
    fetch(`/api/partners/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`сервер ответил ${response.status}`)
        }
        return response.json()
      })
      .then((partner) => {
        setForm({
          companyName: partner.companyName ?? '',
          partnerType: partner.partnerType ?? PARTNER_TYPES[0],
          rating: partner.rating ?? 0,
          address: partner.address ?? '',
          directorName: partner.directorName ?? '',
          phone: partner.phone ?? '',
          email: partner.email ?? '',
        })
      })
      .catch(() => {
        setDialog({
          type: 'error',
          message: 'Не удалось загрузить данные партнёра. Проверьте соединение с сервером и повторите попытку.',
          onConfirm: () => navigate('/'),
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, isEditMode, navigate])

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
    if (!isDirty) {
      navigate('/')
      return
    }
    // предупреждение вместо мгновенного перехода — то же самое, что делает beforeunload
    // для закрытия вкладки, но для перехода внутри приложения (его beforeunload не ловит)
    setDialog({
      type: 'warning',
      message: 'Изменения не сохранены. Если продолжить, все введённые данные будут потеряны безвозвратно.',
      confirmText: 'Уйти без сохранения',
      cancelText: 'Остаться',
      onConfirm: () => navigate('/'),
      onCancel: () => setDialog(null),
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationMessage = validateForm(form)
    if (validationMessage) {
      setDialog({ type: 'error', message: validationMessage, onConfirm: () => setDialog(null) })
      return
    }

    try {
      // добавление и редактирование — разные REST-ручки: POST на коллекцию / PUT на конкретный id
      const url = isEditMode ? `/api/partners/${id}` : '/api/partners'
      const method = isEditMode ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.errors?.join('; ') ?? body?.error ?? `сервер ответил ${response.status}`)
      }
      setIsDirty(false)
      setDialog({
        type: 'info',
        message: isEditMode ? 'Данные партнёра успешно обновлены.' : 'Партнёр успешно добавлен.',
        // возврат на главную ремонтирует MainWindow и он сам перезапросит список — отдельно обновлять не нужно
        onConfirm: () => navigate('/'),
      })
    } catch {
      setDialog({
        type: 'error',
        message: 'Не удалось сохранить данные партнёра. Проверьте соединение с сервером и повторите попытку.',
        onConfirm: () => setDialog(null),
      })
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
        {isLoading && <p>Загрузка данных партнёра…</p>}
        <fieldset className="edit-form-fields" disabled={isLoading}>
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
              max="5"
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
        </fieldset>
        <button type="submit" className="btn" disabled={isLoading}>
          Сохранить
        </button>
      </form>
      {dialog && <MessageBox {...dialog} />}
    </>
  )
}

export default PartnerEditWindow
