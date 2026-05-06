import Pusher from 'pusher'

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

const pusherInstance = appId && key && secret && cluster
  ? new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    })
  : null;

export const pusher = pusherInstance || {
  trigger: async () => {
    console.warn("Pusher keys missing. Skipping real-time update.");
    return;
  }
} as unknown as Pusher;
