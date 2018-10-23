
// Libraries
import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

// Actions
import {prepareConversation, getAvailableConversationsList} from '../actions/join-convo'

// Components
import AvailableConversation from './available-conversation';
import ErrorNotification from './error-notification';

export class AvailableConversationList extends React.Component {
    componentDidMount() {
        this.props.dispatch(getAvailableConversationsList());
    }

    startConversation(availableConversationData) {
        console.log(`start conversation. availableConversationData= `, availableConversationData);  // availableConversationData has conversationId, conversationUserId, topicId, topicName
        this.props.dispatch(prepareConversation(availableConversationData));
    }
    
    render() {
        if (this.props.conversationStarted) {
            const route = `/conversation/${this.props.conversationData.conversationId}`;
            return (<Redirect to={route} />);
        }
        console.log(`render() this.props.conversationList= `, this.props.conversationList);
        const conversationList = this.props.conversationList.map((convo, index) => 
            <AvailableConversation {...convo} key={index} startConversation={availableConversationData => this.startConversation(availableConversationData)} />
        );
        let error;
        let loading;
        if (this.props.error) {
            error = <ErrorNotification {...this.props.error} />;
        }
        if (this.props.loading === true) {
            loading = <div>Loading...</div>
        }

        return (
            <div className="container">
                {error}
                {loading}
                <ul>
                    {conversationList}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(`in mapStateToProps. state.joinConvo = `, state.joinConvo);
    return ({
        userId : state.auth.userId,
        conversationList : state.joinconvo.conversationList,
        conversationData : state.joinconvo.conversationData,
        conversationStarted : state.joinconvo.conversationStarted,
        loading : state.joinconvo.loading,
        error : state.joinconvo.error
    });
};

export default connect(mapStateToProps)(AvailableConversationList);