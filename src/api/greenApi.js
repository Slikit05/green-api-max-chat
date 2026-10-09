const API_URL = 'https://api.green-api.com';

const createUrl = ({ idInstance, apiTokenInstance }, method) =>
  `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`;

const request = async (url, options) => {
  const response = await fetch(url, options);
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : null;

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.description ||
      'Не удалось выполнить запрос. Проверьте данные инстанса.',
    );
  }

  return data;
};

export const checkInstance = (credentials) =>
  request(createUrl(credentials, 'getStateInstance'));

export const getSettings = (credentials) =>
  request(createUrl(credentials, 'getSettings'));

export const checkAccount = (credentials, phoneNumber) =>
  request(createUrl(credentials, 'checkAccount'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
  });

export const sendMessage = (credentials, chatId, message) =>
  request(createUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });

export const receiveNotification = (credentials) =>
  request(`${createUrl(credentials, 'receiveNotification')}?receiveTimeout=5`);

export const deleteNotification = (credentials, receiptId) =>
  request(`${createUrl(credentials, 'deleteNotification')}/${receiptId}`, {
    method: 'DELETE',
  });
