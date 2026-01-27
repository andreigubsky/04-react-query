import css from "./Pagination.module.css";

export default function Pagination() {
    pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
  return <p className={css.text}>Loading movies, please wait...</p>;
}
