import { useEffect, useState } from 'react';
import {
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from './api/greenApi';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import NewChatModal from './components/NewChatModal';

const getTime = (timestamp = Date.now()) =>
  new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

function App() {
  const [credentials, setCredentials] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [receiveError, setReceiveError] = useState('');

  useEffect(() => {
    if (!credentials) return;

    let isPolling = true;

    const pollNotifications = async () => {
      while (isPolling) {
        try {
          const notification = await receiveNotification(credentials);
          setReceiveError('');
          if (!isPolling) break;
          if (!notification) continue;

          const { body, receiptId } = notification;
          const isTextMessage =
            body.typeWebhook === 'incomingMessageReceived' &&
            body.messageData?.typeMessage === 'textMessage';

          if (isTextMessage) {
            const chatId = String(body.senderData.chatId);
            const phoneNumber = body.senderData.senderPhoneNumber;
            const phone = phoneNumber ? String(phoneNumber) : chatId;
            const incomingMessage = {
              id: body.idMessage,
              text: body.messageData.textMessageData.textMessage,
              time: getTime(body.timestamp * 1000),
              direction: 'incoming',
            };

            setChats((currentChats) => {
              const chatExists = currentChats.some((chat) => chat.chatId === chatId);

              if (!chatExists) {
                return [...currentChats, { chatId, phone, messages: [incomingMessage] }];
              }

              return currentChats.map((chat) =>
                chat.chatId === chatId
                  ? { ...chat, messages: [...chat.messages, incomingMessage] }
                  : chat,
              );
            });
          }

          await deleteNotification(credentials, receiptId);
        } catch (error) {
          setReceiveError(error.message);
          if (isPolling) await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    };

    pollNotifications();
    return () => {
      isPolling = false;
    };
  }, [credentials]);

  const handleCreateChat = async (phone) => {
    const account = await checkAccount(credentials, phone);

    if (!account.exist) {
      throw new Error(account.reason || 'Этот номер не зарегистрирован в MAX.');
    }

    const chatId = String(account.chatId);

    setChats((currentChats) =>
      currentChats.some((chat) => chat.chatId === chatId)
        ? currentChats
        : [{ chatId, phone, messages: [] }, ...currentChats],
    );
    setActiveChatId(chatId);
    setIsModalOpen(false);
  };

  const handleSend = async (text) => {
    setIsSending(true);
    setSendError('');

    try {
      const response = await sendMessage(credentials, activeChatId, text);
      const outgoingMessage = {
        id: response.idMessage,
        text,
        time: getTime(),
        direction: 'outgoing',
      };

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.chatId === activeChatId
            ? { ...chat, messages: [...chat.messages, outgoingMessage] }
            : chat,
        ),
      );
    } catch (error) {
      setSendError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    setCredentials(null);
    setChats([]);
    setActiveChatId('');
    setSendError('');
    setReceiveError('');
  };

  if (!credentials) {
    return <Login onLogin={setCredentials} />;
  }

  const selectedChat = chats.find((chat) => chat.chatId === activeChatId);

  return (
    <div className="app-shell">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelect={setActiveChatId}
        onNewChat={() => setIsModalOpen(true)}
        onLogout={handleLogout}
      />
      <ChatWindow
        chat={selectedChat}
        onSend={handleSend}
        isSending={isSending}
        error={sendError || receiveError}
      />
      {isModalOpen && (
        <NewChatModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateChat}
        />
      )}
    </div>
  );
}

export default App;
