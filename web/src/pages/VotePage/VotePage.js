import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { topicsStore, votesStore } from '../../stores';
import './VotePage.css';

@withRouter
@observer
class VotePage extends Component {
    state = {};

    componentDidMount() {
        this.loadTopic();
    }

    componentDidUpdate(prevProps) {
        if (this.getTopicId() !== prevProps.match.params.topicId) {
            this.loadTopic();
        }
    }

    componentWillUnmount() {
        this.closeSocket && this.closeSocket();
    }

    handleVote = (candidateName) => {
        votesStore.vote(this.getTopicId(), candidateName, true);
    };

    getTopicId() {
        return this.props.match.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();

        this.closeSocket && this.closeSocket();
        this.closeSocket = votesStore.onVote(topicId);

        const topic = await topicsStore.getTopic(topicId);

        this.setState({
            topicId,
            topic: { ...topic }
        });
    }

    render() {
        const { topic } = this.state;
        const { topicVotes } = votesStore;

        return (
            <div className='vote-page'>
                {JSON.stringify(topicVotes)}

                {topic && <div>
                    <h1>{topic.name}</h1>
                    <div>
                        {topic.candidates.map(c => (
                            <div key={c.name}>
                                <span>{c.name}</span>
                                <button onClick={() => this.handleVote(c.name)}>Vote</button>
                                <span>0</span>
                            </div>
                        ))}
                    </div>
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default VotePage;
