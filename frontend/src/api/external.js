import axios from "axios";

// const NEWS_API_KEY=process.env.REACT_APP_NEWS_API_KEY;

// const NEWS_API_ENDPOINT=`https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=${'24dac18f64ec4d91b21c0fe0d61b4a0b'}`

const NEWS_API_ENDPOINT='https://saurav.tech/NewsAPI/top-headlines/category/health/in.json'

export const getNews=async()=>{
    let response;
    try {
        response=await axios.get(NEWS_API_ENDPOINT);
        response=response.data.articles.slice(0,15);
    } catch (error) {
        return error
    }
    return response
}