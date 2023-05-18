import "./Dashboard.css";import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import TableComponent from "./Table";
import { useEffect, useState } from "react";
import { getUsers } from "../getUsers/User";
import { Button } from "@mui/material";
import Edit from "./Edit";

const headers = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "actions", label: "Actions" },
];

const names = 10;
const startPage = 1;

function Dashboard() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataToBeDisplayed, setDataToBeDisplayed] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userEdit, setUserEdit] = useState(-1);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setCount(Math.ceil(filteredUsers.length / names));
    setCurrentPage(startPage);
    setDataToBeDisplayed(prepareDataToBeDisplayed(filteredUsers, startPage));
  }, [filteredUsers]);

  useEffect(() => {
    if (search.length === 0) {
      setFilteredUsers(users);
      setSearchNotFound(false);
    } else {
      const results = searchResults(search);
      if (results.length > 0) {
        setSearchNotFound(false);
        setFilteredUsers(results);
      } else {
        setSearchNotFound(true);
      }
    }
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const prepareDataToBeDisplayed = (userList, pageNumber) => {
    setSelectAll(false);
    setSelected([]);
    const endIndex = pageNumber * names;
    const startIndex = endIndex - names;
    return userList.slice(startIndex, endIndex);
  };

  const searchByName = (name) => {
    name.toLowerCase();
    return users.filter((user) => user.name.toLowerCase() === name);
  };

  const searchByEmail = (email) => {
    return users.filter((user) => user.email === email);
  };

  const searchByRole = (role) => {
    return users.filter((user) => user.role === role);
  };

  const searchResults = (search) => {
    const searchResultsByName = searchByName(search);
    const searchResultsByEmail = searchByEmail(search);
    const searchResultsByRole = searchByRole(search);

    if (searchResultsByName.length) {
      return searchResultsByName;
    } else if (searchResultsByEmail.length) {
      return searchResultsByEmail;
    } else {
      return searchResultsByRole;
    }
  };

  const handlePage = (event, value, userList) => {
    setCurrentPage(value);
    setSelectAll(false);
    setDataToBeDisplayed(prepareDataToBeDisplayed(userList, value));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataToBeDisplayed.map((n) => n.name);
      setSelectAll(true);
      setSelected(newSelected);
      return;
    }
    setSelectAll(false);
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleEdit = (userId) => {
    setIsEdit(true);
    setUserEdit(userId);
  };

  const handleSubmit = (userId, data) => {
    const newData = users.map((user) => {
      if (user.id === userId) {
        return {
          id: userId,
          name: data.name,
          email: data.email,
          role: data.role,
        };
      } else {
        return user;
      }
    });
    console.log(newData);
    setUsers(newData);
    setFilteredUsers(newData);
    setIsEdit(false);
    setUserEdit(-1);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserEdit(-1);
  };

  const handleDelete = (userId) => {
    const newData = users.filter((user) => user.id !== userId);
    setUsers(newData);
    setFilteredUsers(newData);
  };

  const handleDeleteSelected = (selected) => {
    const newData = users.filter((user) => !selected.includes(user.name));
    setUsers(newData);
    setFilteredUsers(newData);
  };

  return (
    <div className="container">
      <h3>Admin Dashboard</h3>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search"
          placeholder="Search by name, email or role"
          name="search"
          value={search}
          onChange={handleSearch}
        />
      </Box>
      {isEdit && (
        <Box m={1}>
          <Edit
            users={users}
            userId={userEdit}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        </Box>
      )}
      {searchNotFound ? (
        <Box>
          <p>No Results Found.</p>
        </Box>
      ) : (
        <Box>
          <TableComponent
            headers={headers}
            users={dataToBeDisplayed}
            handleSelectAllClick={handleSelectAllClick}
            handleClick={handleClick}
            isSelected={isSelected}
            selectAll={selectAll}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <Box mt={2}>
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteSelected(selected)}
              >
                Delete Selected
              </Button>
              <Pagination
                count={count}
                showFirstButton
                showLastButton
                onChange={(event, value) =>
                  handlePage(event, value, filteredUsers)
                }
                page={currentPage}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default Dashboard;
