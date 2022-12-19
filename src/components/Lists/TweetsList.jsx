import React, { useContext } from 'react'
import { TweetContext } from '../../contexts/TweetContext';
import { StyledTweetsList } from '../common/StyledGroup'
import TweetItem from './TweetItem'

const TweetsList = () => {
  const { tweets } = useContext(TweetContext);
  return (
    <StyledTweetsList>
      {tweets.map((tweet) => {
        return <TweetItem 
        key={tweet.id} 
        tweet={tweet}/>;
      })}
    </StyledTweetsList>
  );
};

export default TweetsList