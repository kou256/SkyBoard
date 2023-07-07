import {
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
export let context = null;
export let room = null;
export let me = null;
export let dataStream = null;

/**
 * SkyWayのP2Pルームを作成する。
 * @param skyWayToken
 * @param { string } roomName
 * @param { LocalAudioStream } audio
 * @param { LocalVideoStream } video
 * @returns { Promise<LocalP2PRoomMember> | void } member
 */
export async function createRoom(
    skyWayToken,
  roomName,
  audio = undefined,
  video = undefined
) {
  if (roomName === "") {
    return;
  }

  context = await SkyWayContext.Create(skyWayToken);

  room = await SkyWayRoom.FindOrCreate(context, {
    type: "p2p",
    name: roomName,
  });

  me = await room.join();
  dataStream = await SkyWayStreamFactory.createDataStream(context);
  if (audio) {
    await me.publish(audio);
  }
  if (video) {
    await me.publish(video);
  }
  if (dataStream) {
    await me.publish(dataStream);
  }

  return { me, room };
}

/**
 * SkyWayのP2Pルームを探す。
 * @param skyWayToken
 * @param { string } roomName
 * @returns { Promise<LocalP2PRoomMember> | void } member
 */
export async function findRoom(skyWayToken, roomName) {
  if (roomName === "") {
    return;
  }

  context = await SkyWayContext.Create(skyWayToken);

  room = await SkyWayRoom.Find(
    context,
    {
      id: "28743620-3c32-4700-bb2e-3a7c9727c8af",
    },
    "p2p"
  );

  me = await room.join();
  console.debug(me.id);

  return { me, room };
}

/**
 * SkyWayのP2Pルームに参加する。
 * @param skyWayToken
 * @param { string } roomName
 * @returns { Promise<LocalP2PRoomMember> | void } member
 */
export async function joinRoom(skyWayToken, roomName) {
  if (roomName === "") {
    return;
  }

  context = await SkyWayContext.Create(skyWayToken);

  room = await SkyWayRoom.Find(
    context,
    {
      name: roomName,
    },
    "p2p"
  );
  console.log(room);

  me = await room.join();

  const streams = [];
  for (const publication of room.publications.filter((publication) => {
    return publication.publisher.id !== me.id;
  })) {
    if (publication.state === "closed") continue;
    const { stream } = await me.subscribe(publication.id);
    streams.push(stream);
  }

  return { me, room, streams };
}

export async function publishComment(comment) {
  if (!dataStream) {
    dataStream = await SkyWayStreamFactory.createDataStream(context);
    await me.publish(dataStream);
    return;
  }
  if (comment.length === 0) return;
  await dataStream.write(comment);
}

export async function subscribeComment() {
  if (!dataStream) {
    dataStream = await SkyWayStreamFactory.createDataStream(context);
    await me.publish(dataStream);
  }
  return dataStream;
}
