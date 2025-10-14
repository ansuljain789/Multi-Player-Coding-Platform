// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useEffect } from "react";
// import config from "../config"

// function ProfilePage() {
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);

//   const [history, setHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [expandedId, setExpandedId] = useState(null); // track which history is expanded
//   const [rooms, setRooms] = useState([]); // all rooms
// const [selectedRoom, setSelectedRoom] = useState(null); // roomId clicked
// const [roomHistory, setRoomHistory] = useState([]); // code history for selected room
// const [showRooms, setShowRooms] = useState(false);

// const [joinRoomId, setJoinRoomId] = useState("");


//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // 🔹 Fetch history from backend
//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${config.backendUrl}/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data.history || res.data || []);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       toast.error("Failed to fetch history");
//     }
//   };

//   //fetch rooms from backend
//   const fetchRooms = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.get(
//        `${config.backendUrl}/history/rooms`
//       , {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log(showRooms ? "Hiding rooms" : "Showing rooms");
    
//     setRooms(res.data.rooms || []);
//     console.log(res.data.rooms);
    
    
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch rooms");
//   }
// };

// //fetch history for a specific room
// const fetchRoomHistory = async (roomId) => {
//   try {
//     console.log(roomId);
    
//     const token = localStorage.getItem("token");
//     const res = await axios.get(`${config.backendUrl}/history/rooms/${roomId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setSelectedRoom(roomId);
//     setRoomHistory(res.data.history || []);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch room history");
//   }
// };


//   // 🔹 Toggle code view for one history item
//   const handleToggleCode = async (id) => {
//     if (expandedId === id) {
//       console.log("Collapsing code view");
      
//       setExpandedId(null); // collapse if already open
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       console.log("Fetching code for history ID:", id);
//       console.log("Using token:", token);
      
      
//       const res = await axios.get(`${config.backendUrl}/history/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Store code inside that history item
//       setHistory((prev) =>
//         prev.map((item) =>
//           item._id === id ? { ...item, code: res.data.code } : item
//         )
//       );
//       setExpandedId(id);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       toast.error("Failed to load code");
//     }
//   };

// const joinExistingRoom = async () => {
  
//   if (!joinRoomId.trim()) {
//     toast.error("Please enter a valid room ID");
//     return;
//   }

//   try {
//     // Call backend to check if room exists
//     const res = await axios.get(
//       `${config.backendUrl}/history/rooms/${joinRoomId}/exist`
//     );

//     if (res.data.exists) {
//       // Room exists → navigate
//       const username = localStorage.getItem("userEmail");
//       navigate(`/editor/${joinRoomId}`, { state: { username } });
//       toast.success("Joined existing room");
//     } else {
//       // Room does not exist → show error
//       toast.error("Room does not exist");
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Server error. Cannot join room.");
//   }
// };





//   return (
//     <div className="container text-center mt-5">
//       <h2>👤 Profile Page</h2>
//       <p color="red">Welcome! Start your journey here:</p>

//       <button
//       className="btn btn-info"
//       onClick={() => {
//         if (!showRooms) fetchRooms();
//         setShowRooms(!showRooms);
//       }}
//     >
//       {showRooms ? "Hide Rooms" : "Existing Rooms"}
//     </button>


//       <div className="d-flex justify-content-center gap-3 mt-4">
//         <button className="btn btn-primary" onClick={() => navigate("/home")}>
//           ➕ Create Room
//         </button>

//         <button
//           className="btn btn-info"
//           onClick={() => {
//             if (!showHistory) fetchHistory();
//             setShowHistory(!showHistory);
//           }}
//         >
//           {showHistory ? "Hide History" : "Show History"}
//         </button>

//         <button className="btn btn-danger" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </div>

//       <div className="mt-4">
//         <h5 className="text">🔑 Join an Existing Room</h5>
//         <div className="d-flex justify-content-center gap-2">
//           <input
//             type="text"
//             value={joinRoomId}
//             onChange={(e) => setJoinRoomId(e.target.value)}
//             className="form-control w-50"
//             placeholder="Enter Room ID"
//           />
//           <button className="btn btn-success" onClick={joinExistingRoom}>
//             Join
//           </button>
//         </div>
//       </div>


//        {/* 🔹 Rooms Section */}
//     {showRooms && (
//       <div className="bg-light p-3 mt-4 rounded text-start">
//         <h5>🏠 Your Existing Rooms</h5>
//         <ul className="list-group">
//           {rooms.length > 0 ? (
//       <>
//         <select
//           className="form-select mb-3"
//           value={selectedRoom || ""}
//           onChange={(e) => {
//             const selected = e.target.value;
//             setSelectedRoom(selected);
//             setExpandedId(null);
//             fetchRoomHistory(selected);
//           }}
//         >
//           <option value="">Select a room</option>
//           {rooms.map((room) => (
//             <option key={room} value={room}>
//               {room}
//             </option>
//           ))}
//         </select>

//         {selectedRoom && (
//           <div className="mt-3">
//             <h6>📂 History for: {" "}<span className="text-primary">{selectedRoom}</span></h6>
//             <ul className="list-group mt-2">
//               {roomHistory.length > 0 ? (
//                 roomHistory.map((h) => (
//                   <li key={h._id} className="list-group-item">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <span>
//                          {h.language} -{" "}
//                         {new Date(h.createdAt).toLocaleString()}
//                       </span>
//                       <button
//                         className="btn btn-sm btn-success"
//                         onClick={() => handleToggleCode(h._id)}
//                       >
//                         {expandedId === h._id ? "Hide Code" : "Load Code"}
//                       </button>
//                     </div>

//                     {expandedId === h._id && h.code && (
//                       <pre className="bg-dark text-white p-2 mt-2 rounded">
//                         <code>{h.code}</code>
//                       </pre>
//                     )}
//                   </li>
//                 ))
//               ) : (
//                 <li className="list-group-item text-muted">
//                   No history in this room yet
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </>
//     ) : (
//       <p className="text-muted">No rooms yet</p>
//     )}
//         </ul>
//       </div>
//     )}

//       {/* 🔹 History Section */}
//   {showHistory && (
//         <div className="bg-light p-3 mt-4 rounded text-start">
//           <h5>📜 Your Code History by room</h5>
//           <ul className="list-group">
//              {Array.isArray(history) && history.length > 0 ? (
//       <>
//         <select
//           className="form-select mb-3"
//           value={expandedId || ""}
//           onChange={(e) => setExpandedId(e.target.value)}
//         >
//           <option value="">Select a Code History</option>
//           {history.map((h) => (
//             <option key={h._id} value={h._id}>
//               {h.language} — {new Date(h.createdAt).toLocaleString()}
//             </option>
//           ))}
//         </select>

//         {expandedId && (
//           <>
//             {history
//               .filter((h) => h._id === expandedId)
//               .map((h) => (
//                 <pre
//                   key={h._id}
//                   className="bg-dark text-white p-2 mt-2 rounded"
//                 >
//                   <code>{h.code}</code>
//                 </pre>
//               ))}
//           </>
//         )}
//       </>
//     ) : (
//       <p className="text-muted">No history yet</p>
//     )}
//           </ul>
//         </div>
//       )}


//     </div>
//   );
// }

// export default ProfilePage;



import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import config from "../config";

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomHistory, setRoomHistory] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${config.backendUrl}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch history");
    }
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${config.backendUrl}/history/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rooms");
    }
  };

  const fetchRoomHistory = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${config.backendUrl}/history/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedRoom(roomId);
      setRoomHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch room history");
    }
  };

  const handleToggleCode = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${config.backendUrl}/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, code: res.data.code } : item
        )
      );
      setExpandedId(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load code");
    }
  };

  const joinExistingRoom = async () => {
    if (!joinRoomId.trim()) {
      toast.error("Please enter a valid room ID");
      return;
    }

    try {
      const res = await axios.get(
        `${config.backendUrl}/history/rooms/${joinRoomId}/exist`
      );

      if (res.data.exists) {
        const username = localStorage.getItem("userEmail");
        navigate(`/editor/${joinRoomId}`, { state: { username } });
        toast.success("Joined existing room");
      } else {
        toast.error("Room does not exist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Cannot join room.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
      color: "#fff",
      overflowX: "hidden",
      position: "relative",
      background: "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)",
    }}>

      {/* 🌌 Particle Background */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* ✨ Neon floating text */}
      <div style={{ position: "absolute", top: "10%", left: "5%", fontSize: "2rem", color: "rgba(0,255,255,0.15)", fontWeight: "700", transform: "rotate(-15deg)" }}>🚀 Code & Conquer</div>
      <div style={{ position: "absolute", bottom: "15%", right: "5%", fontSize: "3rem", color: "rgba(255,0,255,0.08)", fontWeight: "800", transform: "rotate(10deg)" }}>🌟 Build Magic</div>
      <div style={{ position: "absolute", top: "40%", right: "10%", fontSize: "2rem", color: "rgba(255,255,0,0.05)", fontWeight: "600" }}>💻 Collab & Learn</div>

      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          fontWeight: "700",
          fontSize: "1.8rem",
          background: "linear-gradient(90deg, #00f5ff, #007bff, #9b51e0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          🤖 AI Code Collaborator
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Logout
        </button>
      </header>

      {/* Welcome Banner */}
      <div style={{ textAlign: "center", margin: "30px 0", position: "relative", zIndex: 2 }}>
        <h2 style={{
  fontSize: "2.5rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #ff6ec4, #7873f5, #00f5ff, #ffcc33)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "12px",
  textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
  letterSpacing: "1px",
}}>
  👋 Welcome Back, Coder!
</h2>

        <p style={{ fontSize: "1.1rem", color: "#ccc", textShadow: "0 0 5px #000" }}>
          Dive into your coding rooms, track your history, or join a collaborative session!
        </p>
        <p style={{ fontStyle: "italic", color: "#aaa" }}>
          "The best way to predict the future is to code it." 🌟
        </p>
      </div>

      {/* Dashboard & Buttons */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px", position: "relative", zIndex: 2 }}>
        {/* Buttons panel */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
          <button onClick={() => navigate("/home")} style={btnStyle("#007bff", "#00f5ff")}>➕ Create Room</button>
          <button onClick={() => { if(!showRooms) fetchRooms(); setShowRooms(!showRooms); }} style={btnStyle("#ff7eb3", "#ff416c")}>{showRooms ? "Hide Rooms" : "Existing Rooms"}</button>
          <button onClick={() => { if(!showHistory) fetchHistory(); setShowHistory(!showHistory); }} style={btnStyle("#00f260", "#0575e6")}>{showHistory ? "Hide History" : "Show History"}</button>
        </div>

        {/* Join Room */}
        <div style={{ textAlign: "center" }}>
          <h4 style={{ color: "#ffdd57", fontWeight: "600" }}>🔑 Join an Existing Room</h4>
          <div style={{ display: "flex",            justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            <input
              type="text"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter Room ID"
              style={{
                padding: "8px 15px",
                borderRadius: "8px",
                border: "1px solid #00f5ff",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                minWidth: "250px",
                outline: "none",
              }}
            />
            <button onClick={joinExistingRoom} style={btnStyle("#56ab2f", "#a8e063")}>Join</button>
          </div>
        </div>

        {/* Rooms Section */}
        {showRooms && (
          <div style={panelStyle}>
            <h4 style={{ color: "#00f5ff", fontWeight: "600" }}>🏠 Your Existing Rooms</h4>
            {rooms.length > 0 ? (
              <>
                <select
                  className="form-select"
                  value={selectedRoom || ""}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedRoom(selected);
                    setExpandedId(null);
                    fetchRoomHistory(selected);
                  }}
                  style={selectStyle}
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>

                {selectedRoom && (
                  <div style={{ marginTop: "15px" }}>
                    <h6>📂 History for: <span style={{ color: "#ffdd57" }}>{selectedRoom}</span></h6>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {roomHistory.length > 0 ? roomHistory.map((h) => (
                        <li key={h._id} style={historyItemStyle}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{h.language} — {new Date(h.createdAt).toLocaleString()}</span>
                            <button onClick={() => handleToggleCode(h._id)} style={btnOutlineStyle}>
                              {expandedId === h._id ? "Hide Code" : "Load Code"}
                            </button>
                          </div>
                          {expandedId === h._id && h.code && (
                            <pre style={codeStyle}><code>{h.code}</code></pre>
                          )}
                        </li>
                      )) : <li style={{ color: "#aaa" }}>No history in this room yet</li>}
                    </ul>
                  </div>
                )}
              </>
            ) : <p style={{ color: "#888" }}>No rooms yet</p>}
          </div>
        )}

        {/* Global History Section */}
        {showHistory && (
          <div style={panelStyle}>
            <h4 style={{ color: "#00f5ff", fontWeight: "600" }}>📜 Your Global Code History</h4>
            {history.length > 0 ? (
              <>
                <select
                  value={expandedId || ""}
                  onChange={(e) => setExpandedId(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select a Code History</option>
                  {history.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.language} — {new Date(h.createdAt).toLocaleString()}
                    </option>
                  ))}
                </select>

                {expandedId && history.filter((h) => h._id === expandedId).map((h) => (
                  <pre key={h._id} style={codeStyle}><code>{h.code}</code></pre>
                ))}
              </>
            ) : <p style={{ color: "#888" }}>No history yet</p>}
          </div>
        )}

      </div>

      {/* CSS Animations */}
      <style>{`
        .particles { position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; z-index:0; }
        .particle {
          position:absolute;
          width:5px;
          height:5px;
          background: rgba(255,255,255,0.3);
          border-radius:50%;
          animation: float 15s infinite;
          opacity:0.7;
        }
        ${[...Array(50)].map((_, i) => `
          .particle:nth-child(${i+1}) {
            left: ${Math.random()*100}%;
            top: ${Math.random()*100}%;
            width: ${2 + Math.random()*6}px;
            height: ${2 + Math.random()*6}px;
            animation-delay: ${Math.random()*15}s;
            animation-duration: ${10 + Math.random()*15}s;
          }
        `).join('')}
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity:0.7; }
          50% { transform: translateY(-50px) translateX(20px); opacity:0.3; }
          100% { transform: translateY(0) translateX(0); opacity:0.7; }
        }
      `}</style>
    </div>
  );
}

// ===== Styles =====
const btnStyle = (start, end) => ({
  background: `linear-gradient(90deg, ${start}, ${end})`,
  border: "none",
  borderRadius: "10px",
  padding: "10px 20px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
});

const btnOutlineStyle = {
  border: "1px solid #00f5ff",
  borderRadius: "8px",
  padding: "5px 12px",
  background: "transparent",
  color: "#00f5ff",
  cursor: "pointer",
};

const panelStyle = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0,255,255,0.2)",
  borderRadius: "12px",
  padding: "20px",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #00f5ff",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  outline: "none",
};

const historyItemStyle = {
  background: "rgba(0,0,0,0.7)",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  color: "#fff",
};

const codeStyle = {
  background: "#000",
  color: "#00ff99",
  padding: "10px",
  borderRadius: "8px",
  overflowX: "auto",
  marginTop: "8px",
};

export default ProfilePage;

