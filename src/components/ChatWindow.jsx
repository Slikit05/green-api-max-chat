import { useEffect, useRef, useState } from 'react';
import { ChatIcon, SendIcon } from './Icons';

function ChatWindow({ chat, onSend, isSending, error }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text) return;

    setMessage('');
    await onSend(text);
  };

  if (!chat) {
    return (
      <main className="chat-empty">
        <div className="empty-chat-icon"><ChatIcon /></div>
        <h2>Выберите чат</h2>
        <p>Или создайте новый, чтобы отправить сообщение</p>
      </main>
    );
  }

  return (
    <main className="chat-window">
      <header className="chat-header">
        <div>
          <h2>+{chat.phone}</h2>
          <p>MAX</p>
        </div>
      </header>

      <div className="messages">
        <div className="date-label">Сегодня</div>

        {chat.messages.length === 0 && (
          <div className="conversation-start">
            <strong>+{chat.phone}</strong>
            <span>Начните общение прямо сейчас</span>
          </div>
        )}

        {chat.messages.map((item) => (
          <article className={`message ${item.direction}`} key={item.id}>
            <p>{item.text}</p>
            <time>{item.time}</time>
          </article>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <div className="message-input-wrap">
          {error && <span className="send-error">{error}</span>}
          <input
            type="text"
            placeholder="Сообщение"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSending}
            autoFocus
          />
        </div>
        <button
          className="send-button"
          type="submit"
          aria-label="Отправить сообщение"
          disabled={!message.trim() || isSending}
        >
          <SendIcon />
        </button>
      </form>
    </main>
  );
}

export default ChatWindow;
