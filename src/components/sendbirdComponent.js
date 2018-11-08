
import React from 'react';
const APP_ID = 'BDEEA390-7760-4E15-8C9B-06C311285004';

let instance = null;

class SendBird extends React.Component {
    constructor() {
        if (instance) {
        return instance;
        }
        this.SENDBIRD = new SendBird({ APP_ID });
        this.GROUP_CHANNEL = null;
        this.CHANNEL_HANDLER = null;
        this.userQuery = null;
        this.groupChannelQuery = null;
        this.previousMessageQuery = null;
        instance = this;
    }

    initializeSendBird = () => {
        console.log(`sendbird. initializeSendBird`);
        SENDBIRD = new SendBird({appId: 'BDEEA390-7760-4E15-8C9B-06C311285004'});
    }

    accessSendBird = (userId, username = "Dummy name.") => {
        console.log(`sendbird. accessSendBird. userId=`, userId);
        SENDBIRD.connect(userId, function(user, error) {
            console.log(`sendbird. accessSendBird user=`, user);
            const nickname = username;
            if (error) {
                console.log(`sendbird. accessSendBird. error=`, error);
                return;
            } else {
                SENDBIRD.updateCurrentUserInfo(nickname, null, (user, error) => {
                    if (error) {
                        console.log(`sendbird. accessSendBird. error=`, error);
                        return;
                    }
                    return user;
                });
            }
        });
    }

    createSendBirdChannel = (conversationData) => {
        console.log(`sendbird. createSendBirdChannel`);
        let params = new SENDBIRD.GroupChannelParams();
        params.isPublic = false;
        params.isEphemeral = false;
        params.isDistinct = false;
        params.addUserIds([conversationData.hostUserId, conversationData.guestUserId]);
        params.operators = []; //No one will be allowed to ban, mute, or delete comments in the chat.
        params.name = conversationData.topicName;
        //params.coverImage = FILE;
        //params.coverUrl = COVER_URL;
        //params.customType = CUSTOM_TYPE;
        params.data = {hostUsername : conversationData.hostUsername, guestUsername : conversationData.guestUsername};
        
        return new Promise((resolve, reject) => {
            SENDBIRD.GroupChannel.createChannel(params, function(groupChannel, error) {
                console.log(`sendbird. createSendBirdChannel groupChannel=`, groupChannel);
                GROUP_CHANNEL = groupChannel;
            error ? reject(error) : resolve(groupChannel);
            });
        });
    }

    inviteToSendBirdChannel = (conversationData) => {
        console.log(`sendbird. inviteToSendBirdChannel. conversationData=`, conversationData);
        // Do after createSendBirdChannel
        let userIds = [conversationData.hostUserId, conversationData.guestUserId];

        return new Promise((resolve, reject) => {
            GROUP_CHANNEL.inviteWithUserIds(userIds, function(response, error) {
                console.log(`sendbird. inviteToSendBirdChannel. response=`, response);
                error ? reject(error) : resolve(response);
            });
        })
    }

    setSendBirdChannelPreference = () => {
        console.log(`sendbird. setSendBirdChannelPrefernce.`);
        let autoAccept = true;    // If true, a user will automatically join a group channel with no choice of accepting and declining an invitation.
        return new Promise((resolve, reject) => {
            SENDBIRD.setChannelInvitationPreference(autoAccept, function(response, error) {
                console.log(`sendbird. setSendBirdChannelPreference. response=`, response);
                error ? reject(error) : resolve(response);
            });
        });
    }

    getSendBirdChannel = (channelURL) => {
        return new Promise((resolve, reject) => {
            SENDBIRD.GroupChannel.getChannel(channelURL, function(groupChannel, error) {
                if (error) {
                    return;
                }
                GROUP_CHANNEL = groupChannel;
                console.log(`after getSendBirdChannel. GROUP_CHANNEL=`,GROUP_CHANNEL);
                console.log(`after getSendBirdChannel. error=`, error);
                error ? reject(error) : resolve(groupChannel);
            });
        })
    }


    createChannelEventHandler = (channelId) => {
        return new Promise((resolve, reject) => {
            console.log(`ran createChannelEventHandler`);
            CHANNEL_HANDLER = new SENDBIRD.ChannelHandler();
            /*
            CHANNEL_HANDLER.onMessageReceived = (channel, message) => {
                console.log(`sendbird. in createChannel's onMessageReceived. channel=`, channel);
                console.log(`sendbird. in createChannel's onMessageReceived. message=`, message);
                if (this.onMessageReceived) {
                this.onMessageReceived(channel, message);
                }
                return channel;
            };
            CHANNEL_HANDLER.onMessageUpdated = (channel, message) => {
                console.log(`sendbird. in createChannel's onMessageUpdated. channel=`, channel);
                console.log(`sendbird. in createChannel's onMessageUpdated. message=`, message);
                if (this.onMessageUpdated) {
                this.onMessageUpdated(channel, message);
                }
                return channel;
            };
            */
            SENDBIRD.addChannelHandler(channelId, CHANNEL_HANDLER);
            resolve(CHANNEL_HANDLER);
        });
    }

    getChannelEventHandler = () => {
        if (CHANNEL_HANDLER) {
            return CHANNEL_HANDLER;
        }
    }

    removeChannelHandler = (channelId) => {
        SENDBIRD.removeChannelHandler(channelId);
    }

    postMessageToChannel = (message, username) => {
        // !!! Currently not using username.
        console.log(`sendbird. postMessage. message=`, message);
        console.log(`sendbird. postMessage. username=`, username);
        return new Promise((resolve, reject) => {
            GROUP_CHANNEL.sendUserMessage(message.message, function(message, error) {
                //handler(message, error)
                console.log(`sendbird. postMessage after sendUserMessage. message=`, message);
                console.log(`sendbird. postMessage after sendUserMessage. error=`, error);
                error ? reject(error) : resolve(message);
            });
        });
    }

    addMessageToList = (messageList, message) => {
        
    }

    getMessageList = () => {
        console.log(`in MessageList. CHANNEL_HANDLER`, CHANNEL_HANDLER);
        return new Promise((resolve, reject) => {
            if (!GROUP_CHANNEL.previousMessageQuery) {
                GROUP_CHANNEL.previousMessageQuery = GROUP_CHANNEL.createPreviousMessageListQuery();
            }
            console.log(`in getMessageList. GROUP_CHANNEL=`, GROUP_CHANNEL);
            if (GROUP_CHANNEL.previousMessageQuery.hasMore && !GROUP_CHANNEL.previousMessageQuery.isLoading) {
                GROUP_CHANNEL.previousMessageQuery.load(50, false, (messageList, error) => {
                console.log(`sendbird. getMessageList. messageList=`, messageList);
                error ? reject(error) : resolve(messageList);
            });
            } else {
            resolve([]);
            }
        });
    }

    messageRecievedEvent = () => {
        CHANNEL_HANDLER.onMessageReceived(function(channel, message) { 
            console.log(`sendbird. messageReceivedEvent. channel=`, channel);
            console.log(`sendbird. messageReceivedEvent. channel=`, message);
            //return message;
        });
    }

    leaveSendBirdChannel = () => {
        console.log(`sendbird. leaveSendBirdChannel.`);
        if (GROUP_CHANNEL) {
            GROUP_CHANNEL.leave(function(response, error) {
                console.log(`sendbird. leaveSendBirdChannel. response=`, response);
                if (error) {
                    return;
                }
            });
        }
    }

    exitSendBird = () => {
        console.log(`sendbird. exitSendBird (connection removed, still initialized).`);
        SENDBIRD.disconnect();
    }
}

export default SendBird;