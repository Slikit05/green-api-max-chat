import { useState } from 'react';
import { LogoutIcon, PlusIcon, SearchIcon } from './Icons';

const getInitial = (phone) => phone.slice(-2);

function ChatSidebar({ chats, activeChatId, onSelect, onNewChat, onLogout }) {
  const [search, setSearch] = useState('');
  const filteredChats = chats.filter((chat) => chat.phone.includes(search));

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="sidebar-title">
          <div className="small-brand" aria-hidden="true">m</div>
          <h1>Чаты</h1>
        </div>
        <div className="sidebar-actions">
          <button className="icon-button" type="button" onClick={onNewChat} aria-label="Новый чат">
            <PlusIcon />
          </button>
          <button className="icon-button" type="button" onClick={onLogout} aria-label="Выйти">
            <LogoutIcon />
          </button>
        </div>
      </header>

      <div className="search-box">
        <SearchIcon />
        <input
          type="search"
          placeholder="Поиск"
          value={search}
          onChange={(event) => setSearch(event.target.value.replace(/\D/g, ''))}
          aria-label="Поиск по номеру телефона"
        />
      </div>

      <div className="chat-list">
        {chats.length === 0 ? (
          <div className="empty-list">
            <p>Здесь появятся ваши чаты</p>
            <button type="button" onClick={onNewChat}>Начать общение</button>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const lastMessage = chat.messages.at(-1);

            return (
              <button
                className={`chat-list-item ${chat.chatId === activeChatId ? 'active' : ''}`}
                type="button"
                key={chat.chatId}
                onClick={() => onSelect(chat.chatId)}
              >
                <span className="avatar">{getInitial(chat.phone)}</span>
                <span className="chat-preview">
                  <span className="chat-preview-heading">
                    <strong>+{chat.phone}</strong>
                    {lastMessage && <time>{lastMessage.time}</time>}
                  </span>
                  <span className="last-message">
                    {lastMessage?.text || 'Новый чат'}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
