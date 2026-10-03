const DEFAULTS = {
  error: { icon: '✕', title: 'Ошибка' },
  warning: { icon: '!', title: 'Предупреждение' },
  info: { icon: 'i', title: 'Информация' },
}

function MessageBox({ type, title, message, confirmText = 'ОК', cancelText, onConfirm, onCancel }) {
  const defaults = DEFAULTS[type]

  return (
    <div className="messagebox-backdrop">
      <div className={`messagebox messagebox-${type}`} role="alertdialog" aria-modal="true">
        <div className="messagebox-header">
          <span className="messagebox-icon">{defaults.icon}</span>
          <span className="messagebox-title">{title ?? defaults.title}</span>
        </div>
        <p className="messagebox-message">{message}</p>
        <div className="messagebox-actions">
          {cancelText && (
            <button type="button" className="btn" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button type="button" className="btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageBox
