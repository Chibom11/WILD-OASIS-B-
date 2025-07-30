import React from 'react';

function HostDetails({ avatar, bio,name}) {
  return (
    <div className="max-w-6xl mx-auto mt-16 px-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">👤 Meet the Host, {name}</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-6  shadow-md relative">
        {/* Avatar with gradient ring and gloss */}
        <div className="relative bg-gradient-to-tr from-pink-500 via-rose-400 shadow-xl">
          <img
            src={avatar}
            alt="Host Avatar"
            className="  object-cover shadow-md"
          />
          {/* Glossy overlay */}
          <div className="absolute inset-0  overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent  mix-blend-soft-light" />
          </div>
        </div>

        {/* Bio on right */}
        <p className="text-gray-700 text-lg leading-relaxed md:text-left text-center flex-1">
          {bio || "No bio available."}
        </p>

        {/* Get in touch button
        <div className="absolute bottom-4 right-4">
          <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow hover:from-pink-600 hover:to-rose-600 transition">
            Message Host
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default HostDetails;
