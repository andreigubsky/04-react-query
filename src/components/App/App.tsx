import "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import Pagination from "../Pagination/Pagination";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import fetchMovies from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await fetchMovies(query);
        console.log(data);
        // Посмотри в консоль: это массив [] или объект {}?
        // setMovies(Array.isArray(data) ? data : data.results || []);
        setMovies(data);
        if (data.length === 0) {
          //Якщо в результаті запиту масив фільмів порожній
          toast.error("No movies found for your request.");
          setMovies([]);
          return;
        }
      } catch (error) {
        setIsError(true);
        toast.error("Щось пішло не так");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    //При кожному новому пошуку колекція фільмів з попереднього пошуку повинна очищатись.
    setMovies([]);
    setQuery(newQuery);
  };
  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Clicked!", event);
    console.log("Target:", event.target); // сам <button>
  };
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <button onClick={handleClick}>Second button</button>
      {isError && <ErrorMessage />}
      {isLoading && !isError && <Loader />}
      {/* {!isLoading && !isError && movies.length > 1 && (
        <Pagination
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )} */}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
