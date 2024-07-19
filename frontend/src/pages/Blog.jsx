import { Loader } from "../components/index";
import { getAllBlogs } from "../api/internal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Blog() {
    const navigate=useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getAllBlogsApiCall = async () => {
      try {
        const response = await getAllBlogs();

        if (response.status === 200) {
          setBlogs(response.data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    getAllBlogsApiCall();

    return () => {
      setBlogs([]);
    };
  }, []);

  if (blogs.length === 0) {
    return <Loader text="blogs" />;
  }
  console.log(blogs)

  return (
    <div className="flex flex-col items-center gap-11 p-5">
      {blogs.map((blog) => (
        <div onClick={()=>navigate(`/blog/${blog._id}`)} className="text-center border border-white border-solid p-5 rounded-xl" key={blog._id}>
          <h2 className="text-2xl font-bold capitalize">{blog.title}</h2>
          <img className="w-[400px] h-[400px] object-cover object-center" src={blog.photo} alt="" />
          <p className="py-5">{blog.content}</p>
          
        </div>
      ))}
    </div>
  );
}

export default Blog;
