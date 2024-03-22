/* import { Liveblocks } from '@liveblocks/node';
import { useUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_DEV_API_KEY!,
}); */

export async function POST(req: Request) {
  /* const { user } = useUser();
  const { orgId } = auth();

  if (!orgId || !user) return new Response('Unauthorized', { status: 401 });

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(user.id);

  // Implement your own security, and give the user access to the room
  const { room } = await req.json();
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status }); */
  return new Response('Not implemented', { status: 501 });
}
