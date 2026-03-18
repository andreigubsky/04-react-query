// Функцію fetchMovies для виконання HTTP-запитів
// винесіть в окремий файл src/services/movieService.ts.
// Типізуйте її параметри, результат, який вона повертає,
// та відповідь від Axios.
import axios from "axios";
import type { Movie } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const URL = "https://api.themoviedb.org/3/search/movie";

interface TmdbResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies(
  query: string,
  page: number,
): Promise<TmdbResponse> {
  try {
    const axiosConfig = {
      method: "get",
      url: URL,
      params: {
        query: query,
        language: "uk-UA", 
        include_adult: false,
        page: page,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    };

    const response = await axios.request<TmdbResponse>(axiosConfig);
    return response.data; 
  } catch (err) {
    console.error("fetchMovies error:", err);
    throw err;; 
  }
}
