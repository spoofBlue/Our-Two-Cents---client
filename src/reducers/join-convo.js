
// Actions
import {DISPLAY_LOADING, MOVE_TO_CONVERSATION, DISPLAY_ERROR, DISPLAY_AVAILABLE_CONVERSATIONS_LIST, RESET_COMPONENT} from '../actions/join-convo';

// Initial
const initialState = {
    conversationStarted : false,
    conversationList : [],
    conversationRoute : "",
    loading : false,
    error : null
}

//Reducer
export default function joinConvoReducer(state=initialState, action) {
    if (action.type === DISPLAY_LOADING) {
        console.log(`ran displayLoading`);
        return Object.assign({}, state, {
            loading : true,
        });
    } else if (action.type === DISPLAY_ERROR) {
        return Object.assign({}, state, {
            loading : false,
            error : action.error
        });
    } else if (action.type === MOVE_TO_CONVERSATION) {
        return Object.assign({}, state, {
            conversationStarted : true,
            conversationRoute : action.conversationId,
            loading : false,
            error : null
        });
    } else if (action.type === DISPLAY_AVAILABLE_CONVERSATIONS_LIST) {
        console.log(`ran displayAvailableConversationList from within reducer. action.conversationList = `, action.conversationList);
        return Object.assign({}, state, {
            conversationList : action.conversationList,
            loading : false,
            error : null
        });
    } else if (action.type === RESET_COMPONENT) {
        return Object.assign({}, state, {
            conversationStarted : false,
            conversationData : {},
            conversationList : [],
            loading : false,
            error : null
        });
    }
    return state;
}