import {
  Container,
  Row,
  Col,
  Form,
  Stack,
  Table,
  Button
} from "react-bootstrap";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Searchbar from "./components/Searchbar";
import Page from "./components/Page";
import Usersinfo from "./components/Usersinfo";
function Dashboard() {
  const URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [findKey, setFindKey] = useState("");
  const [usersId, setUsersId] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [bootstrapModal, setBootstrapModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [presentPage, setPresentPage] = useState(1);
  const DATA_PERPAGE = 10;

  const updateUser = (userId) => {
    setUpdateId(userId);
    setBootstrapModal(true);
  };

  const selectAll = (event) => {
    let updatedList = [...usersId];
    if (event.target.checked) {
      setAllChecked(true);
      updatedList = presentUsers.map((user) => user.id);
    } else {
      setAllChecked(false);
      updatedList = [];
    }
    setUsersId(updatedList);
  };

  const deleteSelected = () => {
    const updatedList = users.filter((user) => !usersId.includes(user.id));
    setUsers(updatedList);
    setAllChecked(false);
  };

  const onSelect = (event) => {
    const userId = event.target.value;
    let updatedList = [...usersId];

    if (event.target.checked) {
      updatedList = [...usersId, userId];
    } else {
      setAllChecked(false);
      updatedList.splice(usersId.indexOf(userId), 1);
    }
    setUsersId(updatedList);
  };

  const onDelete = (userId) => {
    const updatedList = users.filter((user) => user.id !== userId);
    setUsers(updatedList);
  };

  const onSearch = (event) => {
    setFindKey(event.target.value);
  };

  const filter = useCallback(() => {
    if (findKey !== "") {
      const result = users.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(findKey))
      );
      setFilterUsers(result);
    } else {
      setFilterUsers(users);
    }
  }, [users, findKey]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(URL);
      setUsers(response.data);
    } catch (error) {
      console.log("Error in getting users", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filter();
  }, [filter]);

  const LastUser = presentPage * DATA_PERPAGE;
  const FirstUser = LastUser - DATA_PERPAGE;
  const presentUsers = filterUsers.slice(FirstUser, LastUser);
  const entireUsers = filterUsers.length;
  const overallPages = Math.ceil(entireUsers / DATA_PERPAGE);
  const paginate = (pageNumber) => setPresentPage(pageNumber);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={selectAll}
                    checked={allChecked}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {presentUsers.length ? (
                presentUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={usersId.includes(user.id) ? "bg-gray" : ""}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          value={user.id}
                          onChange={onSelect}
                          checked={usersId.includes(user.id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => updateUser(user.id)}>
                            <i class="bi bi-pencil-square"></i>
                            Edit
                          </Button>

                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => onDelete(user.id)}>
                            <i class="bi bi-trash"></i>Delete
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      {presentUsers.length > 0 ? (
        <Row className="pt-2 pt-md-0">
          <Col xs="12" md="4">
            <Button
              variant="danger"
              size="sm"
              onClick={deleteSelected}
              disabled={usersId.length > 0 ? false : true}>
              Delete Selected
            </Button>
          </Col>
          <Col xs="12" md="8">
            <Page
              presentPage={presentPage}
              paginate={paginate}
              overallPages={overallPages}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}
      {bootstrapModal ? (
        <Usersinfo
          users={users}
          setUsers={setUsers}
          userId={updateId}
          setModalShow={setBootstrapModal}
          show={bootstrapModal}
          onHide={() => setBootstrapModal(false)}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export default Dashboard;
