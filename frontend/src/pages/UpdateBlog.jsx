import { useSelector } from "react-redux";
import { getBlogById, updateBlog } from "../api/internal";
import { useState, useEffect } from "react";
import { TextInput } from "../components/index";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const author = useSelector((state) => state.user._id);
  const updateHandler = async () => {
    //http:backend_server:port/storage/filename.png
    //base64
    let data;
    if (photo.includes("http")) {
      data = {
        author,
        title,
        content,
        blogId,
      };
    } else {
      data = {
        author,
        title,
        content,
        photo,
        blogId,
      };
    }

    const response = await updateBlog(data);
    if (response.status === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photo);
      }
    }
    getBlogDetails();
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-6">
      <h1 className="text-2xl font-bold p-4">Edit Your Blog!</h1>
      <TextInput
        type="text"
        name="title"
        placeholder="title"
        className="w-[50%] p-3 border outline-none rounded-md"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        className="w-[50%] p-3 border outline-none rounded-md"
        placeholder="your content goes here..."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between w-[50%]">
        <p>Choose a photo</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpg ,image/jpeg , image/png"
          onChange={getPhoto}
        />
        <img className="w-[150px] h-[150px] object-cover" src={photo} />
      </div>
      <button
        className={`block w-[30%] mx-auto text-white py-2 px-4 rounded mt-8 
           bg-blue-600
    `}
        onClick={updateHandler}
      >
        Update
      </button>
    </div>
  );
};

export default UpdateBlog;
