import "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ReactPaginate from "react-paginate";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import fetchMovies from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css"
import type { TmdbResponse } from "../../types/movie";


// використовувати відповідні хуки безпосередньо в тому компоненті, 
// де необхідна обробка отриманих даних
export default function App() {
  const [query, setQuery] = useState<string>("");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  const loadDataMovies = async (query: string, currentPage: number) => {
    try {
      const response = await fetchMovies(query, currentPage);
      console.log("Test", response.results);
      
      if (response.results.length === 0) {
        toast.error("No movies found for your request.");
        throw new Error("No movies found");
      }
      return response;
    } catch (error) {
      
      toast.error("Щось пішло не так");
      throw error;
    } finally {
      
    }
  };


  const { data, isLoading, isError } = useQuery<TmdbResponse>({
    queryKey: ['movie', query, currentPage], 
    queryFn: ()=>loadDataMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,  
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };
  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
     
      {isError && <ErrorMessage />}
      {isLoading && !isError && <Loader />}
      {!isLoading && !isError && totalPages  > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
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
