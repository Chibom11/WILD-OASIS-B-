import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !avatar) {
      toast.error("Please fill all fields including avatar");
      return;
    }
// If you're just sending JSON data (like text fields only, no files), you usually use:axios.post('/api/some-endpoint', {
//   username: 'john',
//   email: 'john@example.com'
// })
// But if you have files, FormData is necessary: 
// const formData = new FormData();
// formData.append('avatar', file);
// formData.append('username', 'john');

// axios.post('/api/register', formData, {
//   headers: { 'Content-Type': 'multipart/form-data' }
// });
    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);

    try {
      await axios.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success("Registration Successful!");
      navigate('/login',{replace:true});
    } catch (error) {
     if(error.response && error.response.status===409){
        toast.error('User with this email already exists..Try Logging in instead')
     }
     else if(error.response && error.response.status===400){
        toast.error('Error uploading avatar')
     }
     else{
        toast.error('Some Error occured')
     }
      

    }
  };

 return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/cabinhome.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent" />
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md text-gray-800"
        >
          {/* Avatar Upload at Top Center */}
          <div className="flex flex-col items-center mb-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 mb-2">
                Preview
              </div>
            )}
        <label
            htmlFor="avatar"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow-md transition duration-300"
            >
            Choose Avatar
        </label>
        <input
            type="file"
            accept="image/*"
            id="avatar"
            onChange={handleAvatarChange}
            className="hidden"
            />
          </div>

          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>

          {/* Footer Link */}
          <p className="mt-4 text-sm text-center">
            Already a user?{" "}
            <span
              onClick={() => navigate("/login",{replace:true})}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login instead
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}



export default RegisterPage;
