import { Form } from "react-bootstrap";
const Searchbar = ({ onSearch }) => {
  return (
    <Form.Control
      type="text"
      placeholder="Search By Name, Email or Role"
      onChange={onSearch}
    />
  );
};

export default Searchbar;
