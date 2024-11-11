import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import "./Admin-css/displayUsers.css";

function DisplayUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "",
    department: "",
  });

  // Fetches users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Editing user functions
  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const confirmEditUser = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/users/${editUser.userID}`,
        editUser
      );
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Deleting user function
  const handleDeleteUser = async (userID) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${userID}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Adding new user functions
  const handleAddUser = () => {
    setNewUser({ email: "", name: "", role: "", department: "" });
    setIsAddModalOpen(true);
  };

  const confirmAddUser = async () => {
    try {
      await axios.post("http://localhost:3000/users/register", newUser);
      fetchUsers();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // DataTable columns
  const columns = [
    { name: "UserID", selector: (row) => row.userID, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="button edit-user"
            onClick={() => handleEditUser(row)}
          >
            Edit
          </button>
          <button
            className="button delete-user"
            onClick={() => handleDeleteUser(row.userID)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users Management</h1>

      {/* Add User Button */}
      <button className="button add-user" onClick={handleAddUser}>
        Add User
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by UserID, Email, Name, Role, or Department"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "20px 0", padding: "8px", width: "300px" }}
      />

      {/* DataTable */}
      <DataTable
        title="Users List"
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
      />

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
        >
          <h2>Edit User</h2>
          <input
            type="text"
            placeholder="Email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={editUser.role}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            value={editUser.department}
            onChange={(e) =>
              setEditUser({ ...editUser, department: e.target.value })
            }
          />
          <button className="button confirm-user" onClick={confirmEditUser}>
            Confirm
          </button>
          <button
            className="button cancel-user"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
        </Modal>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <h2>Add User</h2>
          <input
            type="text"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            value={newUser.department}
            onChange={(e) =>
              setNewUser({ ...newUser, department: e.target.value })
            }
          />
          <button className="button confirm-user" onClick={confirmAddUser}>
            Confirm
          </button>
          <button
            className="button cancel-user"
            onClick={() => setIsAddModalOpen(false)}
          >
            Cancel
          </button>
        </Modal>
      )}
    </div>
  );
}

export default DisplayUser;
