import { useState } from 'react';
import { checkInstance, getSettings } from '../api/greenApi';

function Login({ onLogin }) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const credentials = { idInstance, apiTokenInstance };

    try {
      await checkInstance(credentials);
      const settings = await getSettings(credentials);

      if (settings.incomingWebhook !== 'yes' || settings.webhookUrl) {
        throw new Error(
          'Включите входящие уведомления и очистите webhookUrl в настройках инстанса.',
        );
      }

      onLogin(credentials);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark" aria-hidden="true">
          <span>m</span>
        </div>

        <h1>Вход в MAX Chat</h1>
        <p className="login-description">
          Введите данные вашего инстанса GREEN-API, чтобы начать общение.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            idInstance
            <input
              type="text"
              inputMode="numeric"
              placeholder="Например, 3100000000"
              value={idInstance}
              onChange={(event) => setIdInstance(event.target.value)}
              required
              autoFocus
            />
          </label>

          <label>
            apiTokenInstance
            <input
              type="password"
              placeholder="Введите токен доступа"
              value={apiTokenInstance}
              onChange={(event) => setApiTokenInstance(event.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Подключение…' : 'Войти'}
          </button>
        </form>

        <p className="privacy-note">Данные используются только для запросов к GREEN-API</p>
      </section>
    </main>
  );
}

export default Login;
