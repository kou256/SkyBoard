const functions =  require("firebase-functions");
const {SkyWayAuthToken, uuidV4, nowInSec} = require("@skyway-sdk/token");

const appId = process.env.VITE_SKYWAY_APP_ID;
const secretKey = process.env.VITE_SKYWAY_SECRET_KEY;

exports.fetchSkyWayToken = functions.https.onCall(() => {
    const skyWayToken = new SkyWayAuthToken({
        jti: uuidV4(),
        iat: nowInSec(),
        exp: nowInSec() + 60 * 60 * 24,
        scope: {
            app: {
                id: appId,
                turn: true,
                actions: ["read"],
                channels: [
                    {
                        id: "*",
                        name: "*",
                        actions: ["write"],
                        members: [
                            {
                                id: "*",
                                name: "*",
                                actions: ["write"],
                                publication: {
                                    actions: ["write"],
                                },
                                subscription: {
                                    actions: ["write"],
                                },
                            },
                        ],
                        sfuBots: [
                            {
                                actions: ["write"],
                                forwardings: [
                                    {
                                        actions: ["write"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    }).encode(secretKey);

    return {
        token: skyWayToken
    }
});
