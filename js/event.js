const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.3.2/socket.io.min.js';
script.integrity =
  'sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs';
script.crossOrigin = 'anonymous';

script.onload = () => {
  const socket = io('http://localhost:8888');
  socket.on('connect', function (socketItem) {
    console.log('Connected');

    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, (response) =>
      console.log('Identity:', response),
    );
  });
  socket.on('notifications', async function (data) {
      console.log('Notifications:');

      function escapeHtml(text) {
          if (!text) return '';
          return text.toString()
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
      }

      const authToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');

      if (!authToken || !savedUser) {
          showToast('Please log in to view notifications', 'warning');
          window.location.href = 'login.html';
          return;
      }

      const headers = {'Authorization': `Bearer ${authToken}`};

      try {
          const res = await fetch(`${BASE_URL}/users/notifications?itemPerPage=50&page=1`, {headers});
          if (!res.ok) throw new Error('Unable to load notifications');

          const data = await res.json();
          let notifications = [];

          if (data.data && Array.isArray(data.data.list)) {
              notifications = data.data.list;
          } else if (Array.isArray(data.data)) {
              notifications = data.data;
          }

          if (notifications.length > 0 && notifications[0].email !== undefined) {
              $('#notificationsList').html(`
            <div class="alert alert-warning text-center">
              <strong>Backend error:</strong> The notifications endpoint is returning user list instead of notifications.<br>
              No notifications can be displayed at the moment.<br>
              Please wait for backend fix or contact admin.
            </div>
          `);
              return;
          }

          const list = $('#notificationsList');
          list.empty();

          if (notifications.length === 0) {
              list.html('<div class="alert alert-info text-center">You have no notifications.</div>');
              return;
          }

          notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          notifications.forEach(noti => {
              const isRead = noti.isRead === true || noti.readAt !== null;
              const badge = isRead ? '' : '<span class="badge badge-danger ml-2">New</span>';
              const date = new Date(noti.createdAt).toLocaleString();

              const item = `
            <a href="#" class="list-group-item list-group-item-action ${isRead ? 'read' : 'unread'}">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${escapeHtml(noti.title || 'System Notification')} ${badge}</h5>
                <small>${date}</small>
              </div>
              <p class="mb-1">${escapeHtml(noti.message || noti.content || 'No content')}</p>
              ${noti.type ? `<small class="text-muted">Type: ${escapeHtml(noti.type)}</small>` : ''}
            </a>`;
              list.append(item);
          });

      } catch (err) {
          console.error(err);
          $('#notificationsList').html('<div class="alert alert-danger text-center">Connection error or notifications endpoint not working properly.</div>');
      }
      console.log(">>> reload noti")
  });
  socket.on('events', function (data) {
    console.log('event', data);
  });
  socket.on('exception', function (data) {
    console.log('event', data);
  });
  socket.on('disconnect', function () {
    console.log('Disconnected');
  });
};

script.onerror = () => {
  console.error('Load socket.io CDN failed');
};

document.head.appendChild(script);
