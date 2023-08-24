import { Pagination } from "react-bootstrap";

const Page = ({ presentPage, paginate, overallPages }) => {
  const pageNumbers = [];

  for (let i = 1; i <= overallPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="float-md-end d-flex justify-content-center pt-2">
      <Pagination.First
        className={presentPage === 1 ? "disabled" : ""}
        onClick={() => paginate(1)}
      />
      <Pagination.Prev
        className={presentPage === 1 ? "disabled" : ""}
        onClick={() => paginate(presentPage - 1)}
      />

      {pageNumbers.map((number) => (
        <Pagination.Item
          className={number === presentPage ? "active" : ""}
          onClick={() => paginate(number)}
          key={number}>
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        className={presentPage === overallPages ? "disabled" : ""}
        onClick={() => paginate(presentPage + 1)}
      />
      <Pagination.Last
        className={presentPage === overallPages ? "disabled" : ""}
        onClick={() => paginate(overallPages)}
      />
    </Pagination>
  );
};

export default Page;
