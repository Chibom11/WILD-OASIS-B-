import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function UpdateDetails({ onClose }) {
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const prevAvatar = JSON.parse(localStorage.getItem("user"))?.user.avatar;

  const updateLocalStorageUser = (key, value) => {
    const rawuser = JSON.parse(localStorage.getItem("user"));
    if (rawuser && rawuser.user) {
      rawuser.user[key] = value;
      localStorage.setItem("user", JSON.stringify(rawuser));
    }
  };

  const handleUserName = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/update-username', {
        newUserName: username
      }, { withCredentials: true });

      updateLocalStorageUser("username", username.toLowerCase());
      toast.success("Username updated successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true
          });
          await axios.post('http://localhost:8000/api/users/update-username', {
            newUserName: username
          }, { withCredentials: true });

          updateLocalStorageUser("username", username.toLowerCase());
          toast.success("Username updated successfully");
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          toast.error("Failed to update username after retry.");
        }
      } else {
        toast.error("Failed to update username.");
      }
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/users/update-password',
        { newPassword },
        { withCredentials: true }
      );
      toast.success("Password changed successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true
          });
          await axios.post('http://localhost:8000/api/users/update-password',
            { newPassword },
            { withCredentials: true }
          );
          toast.success("Password changed successfully");
        } catch {
          toast.error("Failed to update password after retry.");
        }
      } else {
        toast.error("Failed to update password.");
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await axios.post('http://localhost:8000/api/users/update-avatar', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      updateLocalStorageUser("avatar", res.data.avatar);
      toast.success("Avatar updated successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.get('http://localhost:8000/api/auth/refresh-token', {
            withCredentials: true
          });

          const retryRes = await axios.post('http://localhost:8000/api/users/update-avatar', formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });

          updateLocalStorageUser("avatar", retryRes.data.avatar);
          toast.success("Avatar updated successfully");
        } catch {
          toast.error("Failed to update avatar after retry.");
        }
      } else {
        toast.error("Failed to update avatar.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Your Profile</h2>

        {/* Section 1: Change Avatar */}
        {/* <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Change Avatar</h3>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-300">
              <img
                src={avatar || prevAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleAvatarUpload}
            className="w-full py-2 bg-black text-white rounded hover:scale-105"
          >
            Update Avatar
          </button>
        </div> */}

        {/* Section 2: Change Username */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Change Username</h3>
          <input
            type="text"
            placeholder="Enter new username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleUserName}
            className="w-full py-2 bg-black text-white rounded hover:scale-105"
          >
            Update Username
          </button>
        </div>

        {/* Section 3: Change Password */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full py-2 bg-black text-white rounded hover:scale-105"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDetails;
