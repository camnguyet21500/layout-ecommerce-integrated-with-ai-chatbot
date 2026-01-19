const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.3.2/socket.io.min.js';
script.integrity =
  'sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs';
script.crossOrigin = 'anonymous';

script.onload = () => {
  // socket.io đã sẵn sàng
  const socket = io('http://localhost:8888');
  socket.on('connect', function (socketItem) {
    console.log('Connected');

    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, (response) =>
      console.log('Identity:', response),
    );
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
