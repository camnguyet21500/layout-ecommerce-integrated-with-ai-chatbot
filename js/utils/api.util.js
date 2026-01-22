const fetchHandler = async (endpoint, body, configs = {}) => {
  //   const baseUrl =
  //     'https://ecommerce-integrated-with-ai-chatbot.onrender.com/api';

  const baseUrl = 'http://localhost:8888/api';

  try {
    let token = localStorage.getItem('authToken');
    if (!token) {
      const res = await fetch(`${baseUrl}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'nvo28@example.com', password: 'nvo28' }),
      });
      const { data } = await res.json();
      token = data.accessToken;
    }
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...configs,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const get = async (endpoint) => {
  const data = await fetchHandler(endpoint);
  return data;
};

const post = async (endpoint, payload) => {
  const data = await fetchHandler(endpoint, payload, { method: 'POST' });
  return data;
};

const patch = async (endpoint, payload) => {
  const data = await fetchHandler(endpoint, payload, { method: 'PATCH' });
  return data;
};

const _delete = async (endpoint, payload) => {
  const data = await fetchHandler(endpoint, payload, { method: 'DELETE' });
  return data;
};
