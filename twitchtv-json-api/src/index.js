import React from 'react';
import {render} from 'react-dom';

import fetchJsonp from 'fetch-jsonp';
import moment from 'moment';

const usernames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "sdfgsgdsfghddh"];
const apiStream = 'https://wind-bow.gomix.me/twitch-api/streams/__USERNAME__';
const apiChannel = 'https://wind-bow.gomix.me/twitch-api/channels/__USERNAME__';

class TwitchtvJsonApi extends React.Component {
  
    constructor() {
        super();
        
        this.state = {
            streams: [],
            filter: 'all'
        }
    }
    
    fetchStreamInfo(username) {
        
        usernames.forEach((username) => {
        
            fetchJsonp(apiStream.replace('__USERNAME__', username))
                .then((response) => {
                    if(response.status >= 400) {
                         throw new Error("Bad response from server");
                    }
                    return response.json();
                })
                .then((streamData) => {                    
                    
                    let data = {};
                
                    switch(streamData.stream) {
                        
                        case null:                        
                            data = {game: "Offline", status: 'offline', username: username};
                            break;
                        
                        case undefined:
                            data = {game: "Account Closed", status: 'invalid', username: username};
                            break;
                        
                        default:
                            data = {game: streamData.stream.game,status: 'online', username: username};
                            break;
                    }
            
                    
                    fetchJsonp(apiChannel.replace('__USERNAME__', username))
                        .then((response) => {
                            if(response.status >= 400) {
                                 throw new Error("Bad response from server");
                            }
                            return response.json();
                        })
                        .then((channelData) => {

                            const {streams} = this.state;
                        
                            if(channelData.status === 404) {
                                data.game = "Account Closed"; 
                                data.status = 'invalid';
                            }
                            
                            data.logo = channelData.logo ? channelData.logo : 'https://dummyimage.com/200x200/612c61/fff&text=n/a';
                            data.name = channelData.display_name ? channelData.display_name : username;
                            data.description = data.status == 'online' ? ': ' + channelData.status : data.status;
                            data.url = channelData.url;
                            data.updated_at = moment(channelData.updated_at).fromNow();
                            streams.push(data);
                            this.setState({streams});
                        });
                    
                });
            
        });
    }
    
    componentDidMount() {
        this.fetchStreamInfo();
    }
    
    setFilter(filter) {
        this.setState({filter});
    }
    
    render () {
        const {streams, filter} = this.state;
        
        const ss = streams.filter((item) => {
                        if(filter == 'all') {
                            return true;
                        } else {
                            if(filter == 'online') {
                                return item.status == 'online';
                            } else {
                                return item.status != 'online';
                            }
                        }
                    });
        return (
            <div className="twitch">
                <div className="twitch-header">
                    <div className="twitch-header-wrapper">
                        Twitchtv JSON API
                        <ul className="twitch-filter">
                        { ['all', 'online', 'offline'].map((item) => {
                            return <li key={item} className={item==filter ? 'active' : ''} onClick={() => this.setFilter(item)}>{item}</li>
                            })
                        }
                        </ul>
                    </div>
                </div>
            {  ss.map((stream) => {
                    return <div className="twitch-stream" key={stream.username}>
                                <img src={stream.logo}/>
                                
                                <div className="twitch-details">
                                    <div className="twitch-username">
                                        <a href={stream.url} target="_blank">{stream.username}</a> 
                                        { stream.status != 'invalid' ? <span className="updated">{stream.updated_at}</span> : '' }
                                    </div>
                                    <div className="twitch-description">
                                        { stream.status == 'online' ?
                                            <a href={stream.url} target="_blank">{stream.description}</a> :
                                            stream.description
                                        }
                                    </div>
                                </div>
                            </div>
                })
            
            }
            </div>
        )
    }
}

render(<TwitchtvJsonApi/>, document.getElementById('app'));
