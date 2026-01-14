import React, { useEffect, useState } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setName(user.name || "");
    setEmail(user.email || "");
    setAvatar(user.avatar || "");
    setAvatar(user.profilePic || "");
  }, []);

  const handleSave = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  // Update name & email
  const res = await fetch("http://localhost:5000/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    setMessage("Profile updated successfully!");
  } else {
    setMessage("Failed to update profile");
  }

  // Upload profile picture if selected
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    const imgRes = await fetch("http://localhost:5000/api/user/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const imgData = await imgRes.json();
    if (imgData.success && imgData.user) {
  localStorage.setItem("user", JSON.stringify(imgData.user));
  setAvatar(imgData.user.avatar || "");
} else {
  console.log("Upload response:", imgData);
}}};

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/user/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="settings-page">
      <form className="settings-card" onSubmit={handleSave}>
        <h2>Profile Settings</h2>

        {message && <p className="status">{message}</p>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        {/* Profile Picture */}
        <label>Profile Picture</label>

{avatar && (
  <img
    src={`http://localhost:5000${avatar}`}
    alt="Profile"
    className="profile-preview"
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={(e) => setFile(e.target.files[0])}
/>
        <label>Old Password</label>
<input
  type="password"
  value={oldPassword}
  onChange={(e) => setOldPassword(e.target.value)}
/>

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        

        <button type="button" onClick={handlePasswordChange}>
          Change Password
        </button>

        <button type="submit">Save Changes</button>

        {/* Back Button */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default Settings;
