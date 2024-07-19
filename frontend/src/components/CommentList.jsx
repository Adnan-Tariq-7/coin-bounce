import React from "react";
import {Comment} from "./index";

const CommentList = ({ comments }) => {
  return (
    <div>
      {comments.length === 0 ? (
        <div>No comments posted</div>
      ) : (
        comments.map((comment) => {
          return <Comment key={comment._id} comment={comment}/>;
        })
      )}
    </div>
  );
};

export default CommentList;
