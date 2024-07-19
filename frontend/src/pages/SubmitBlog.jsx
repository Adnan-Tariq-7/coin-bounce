import { useSelector } from "react-redux";
import { submitBlog } from "../api/internal";
import { useState } from "react";
import { TextInput } from "../components/index";
import { useNavigate } from "react-router-dom";

const SubmitBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhotot] = useState("");
  const author = useSelector((state) => state.user._id);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotot(reader.result);
    };
  };

  const submitHandler = async () => {
    const data = {
      author,
      title,
      content,
      photo
    };

    const response = await submitBlog(data);
    if (response.status === 201) {
      navigate("/");
    }
  };
  const disabled = title === "" || content === "" || photo === "";
  return (
    <div className="w-full flex items-center flex-col gap-6">
      <h1 className="text-2xl font-bold p-4">Create a Blog!</h1>
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
        {photo !== "" ? (
          <img className="w-[150px] h-[150px] object-cover" src={photo} />
        ) : (
          <div className="w-[150px] h-[150px]"></div>
        )}
      </div>
      <button
        className={`block w-[30%] mx-auto text-white py-2 px-4 rounded mt-8 ${
          disabled ? "bg-blue-300" : "bg-blue-600"
        }`}
        disabled={disabled}
        onClick={submitHandler}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitBlog;
