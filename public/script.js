const socket = io();
const APP_ID = '296bae9142a84c179c57ab85d154afaf'; // Remplacez par votre App ID
const CHANNEL_NAME = 'testRoom'; // Nom de la chaîne

// Fonction pour démarrer la diffusion
document.getElementById('startBroadcast').addEventListener('click', () => {
  socket.emit('joinRoom', { roomId: CHANNEL_NAME, role: 'publisher' });

  socket.on('roomJoined', (data) => {
    const token = data.token;
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

    client.init(APP_ID, () => {
      console.log('AgoraRTC client initialized');
      
      client.join(token, CHANNEL_NAME, null, (uid) => {
        console.log('User ' + uid + ' joined the channel');
        
        // Créez et publiez le flux
        const localStream = AgoraRTC.createStream({
          streamID: uid,
          audio: true,
          video: true,
          screen: false
        });

        localStream.init(() => {
          client.publish(localStream, (err) => {
            console.log('Publish local stream error: ' + err);
          });
        });

        // Gérez les nouveaux flux entrants
        client.on('stream-added', (evt) => {
          const stream = evt.stream;
          client.subscribe(stream, (err) => {
            console.log('Subscribe stream failed', err);
          });
        });

        // Affichez les flux des spectateurs
        client.on('stream-subscribed', (evt) => {
          const stream = evt.stream;
          console.log('Subscribe stream successfully: ' + stream.getId());

          const streamElement = document.createElement('div');
          streamElement.id = `stream-${stream.getId()}`;
          document.getElementById('viewerContainer').appendChild(streamElement);

          stream.play(streamElement.id);
        });
      }, (err) => {
        console.log('Join channel failed', err);
      });
    }, (err) => {
      console.log('AgoraRTC client init failed', err);
    });
  });
});

// Fonction pour démarrer la visualisation
document.getElementById('startWatch').addEventListener('click', () => {
  socket.emit('joinRoom', { roomId: CHANNEL_NAME, role: 'subscriber' });

  socket.on('roomJoined', (data) => {
    const token = data.token;
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

    client.init(APP_ID, () => {
      console.log('AgoraRTC client initialized');

      client.join(token, CHANNEL_NAME, null, (uid) => {
        console.log('User ' + uid + ' joined the channel');

        // Gérez les nouveaux flux entrants
        client.on('stream-added', (evt) => {
          const stream = evt.stream;
          client.subscribe(stream, (err) => {
            console.log('Subscribe stream failed', err);
          });
        });

        // Affichez les flux des diffuseurs
        client.on('stream-subscribed', (evt) => {
          const stream = evt.stream;
          console.log('Subscribe stream successfully: ' + stream.getId());

          const streamElement = document.createElement('div');
          streamElement.id = `stream-${stream.getId()}`;
          document.getElementById('viewerContainer').appendChild(streamElement);

          stream.play(streamElement.id);
        });
      }, (err) => {
        console.log('Join channel failed', err);
      });
    }, (err) => {
      console.log('AgoraRTC client init failed', err);
    });
  });
});
