"use client";

import React, { useState } from "react";

const Voting = () => {
  // Initialize state to keep track of vote counts
  const [voteCount, setVoteCount] = useState(0);

  // Handler function to increment the vote count for upvote
  const handleUpvote = () => {
    setVoteCount(voteCount + 1);
  };

  // Handler function to decrement the vote count for downvote
  const handleDownvote = () => {
    setVoteCount(voteCount - 1);
  };

  return (
    <div>
      <h3>Vote on this post</h3>
      <div>
        <button className={"bg-secondary shadow-md m-4 p-4"} onClick={handleUpvote}>
          Upvote
        </button>
        <button className={"bg-secondary shadow-md m-4 p-4"} onClick={handleDownvote}>
          Downvote
        </button>
      </div>
      <div>
        <p>Current Vote Count: {voteCount}</p>
      </div>
    </div>
  );
};

export default Voting;
