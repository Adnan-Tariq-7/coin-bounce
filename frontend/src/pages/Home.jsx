import { useEffect, useState } from "react";
import { getNews } from "../api/external";
import { Loader } from "../components/index";

const Home = () => {
  const [articles, setArticles] = useState([]);
  console.log(articles);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_PATH;
    console.log(apiUrl);
    const newsApiCall = async () => {
      try {
        const response = await getNews();
        if (response.length !== 0) {
          setArticles(response);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Failed to fetch news articles", error);
      }
    };

    newsApiCall();

    // Cleanup function
    return () => {
      setArticles([]);
    };
  }, []);

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  if (articles.length == 0) {
    return <Loader text="Home Page" />;
  }
  return (
    <div>
      <h1 className="text-center text-3xl font-bold p-6 ">Latest Articles</h1>
      <div className="grid grid-cols-4 gap-5 w-full p-6 cursor-pointer">
        {articles.map((article, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(article.url)}
            className=" w-[100%] p-5 border border-white rounded-md"
          >
            <img
              className="w-[100%] aspect-video object-cover object-center"
              src={article.urlToImage}
              alt=""
            />
            <h3 className="pt-3">{article.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
