import React from "react";

const Comment = ({ comment }) => {
  const date= new Date(comment.createdAt).toDateString();
  return(
    <div>
        <div className="mt-3 mr-32">
            <div className="text-md">{comment.authorUsername}</div>
            <div className="text-[10px]">{date}</div>
            <div className="text-lg"> {comment.content}</div>
            <div className="w-full border-t-[1px] mt-2"></div>
        </div>
    </div>
  )
};

export default Comment;
