
// Libraries
import React from 'react';
import {Link} from 'react-router-dom';

// Componenets
import AvailableConversationList from './available-conversation-list';

export default function AvailableConversationSection() {
    return (
        <section className="available-conversation-section">
            <h2>Pick a topic with a differing viewpoint, or <Link to="./create-conversation">click here to start a topic...</Link></h2>
            <AvailableConversationList />
        </section>
    );
}