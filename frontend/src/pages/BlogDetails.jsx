import { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getCommentsById,
  getBlogById,
  deleteBlog,
  postComment,
} from "../api/internal";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";
import {CommentList} from '../components/index'

const BlogDetails = () => {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState([]);
  const [newComment, setNewComment] = useState([]);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    async function getBlogDetails() {
      const commentResponse = await getCommentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        setOwnsBlog(username=== blogResponse.data.blog.authorUsername)
        setBlog(blogResponse.data.blog);
      }
    }
    getBlogDetails();
  },[reload]);

  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };
    const response = await postComment(data);
    if (response.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);

    if (response.status === 200) {
      navigate("/");
    }
  };
  if(blog.length===0){
    return <Loader text='blog details'/>
  }

  return (
    <div className="flex justify-between gap-36">
      <div className="left w-[50%] flex justify-center flex-col items-center gap-2">
        <h1 className="text-2xl font-bold mt-3">{blog.title}</h1>
        <div className="metaData">
          <p>@{blog.authorUsername + "on" + new Date(blog.createdAt).toDateString()}</p>
        </div>
        <div>
          <img className="w-[250px] h-[250px]" src={blog.photo} alt="" />
        </div>
        <p>{blog.content}</p>
        {ownsBlog && (
          <div className="flex justify-end w-full gap-3">
            <button className="edit font-bold bg-green-500 text-sm py-2 px-3 rounded-lg " onClick={() => {navigate(`/blog-update/${blog._id}`)}}>
              Edit
            </button>
            <button className="delete  font-bold bg-red-500 text-sm py-2 px-3 rounded-lg" onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="right w-[50%] flex flex-col justify-between mt-3">
       
          <CommentList  comments={comments}/>
          <div className="justify-self-start w-full ">
            <input
            className="w-[80%] border outline-none p-3 rounded-lg"
              type="text"
              placeholder="comment goes here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={postCommentHandler} className="outline-none bg-blue-500 ml-5 py-3 px-4 rounded-lg font-bold text-lg">post</button>
          </div>
        </div>
      </div>
   
  );
};

export default BlogDetails;
