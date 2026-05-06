import PusherJs from 'pusher-js';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export const pusherClient = pusherKey && pusherCluster 
  ? new PusherJs(pusherKey, { cluster: pusherCluster })
  : null;
