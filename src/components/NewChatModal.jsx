import { useState } from 'react';

function NewChatModal({ onClose, onCreate }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onCreate(phone);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Новый диалог</p>
            <h2 id="new-chat-title">Введите номер телефона</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Номер получателя
            <input
              type="tel"
              inputMode="numeric"
              placeholder="79991234567"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
          </label>
          <p className="field-hint">В международном формате, только цифры</p>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Проверка номера…' : 'Создать чат'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default NewChatModal;
