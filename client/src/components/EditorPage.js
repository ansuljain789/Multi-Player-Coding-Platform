// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import {
//   useNavigate,
//   useLocation,
//   Navigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import config from "../config"

// const LANGUAGES = [
//   "python3",
//   "java",
//   "cpp",
//   "nodejs",
//   "c",
//   "ruby",
//   "go",
//   "scala",
//   "bash",
//   "sql",
//   "pascal",
//   "csharp",
//   "php",
//   "swift",
//   "rust",
//   "r",
// ];

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python3");
//   const [history, setHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [editorValue, setEditorValue] = useState("");
//   const [isEditor, setIsEditor] = useState(false);


//   const codeRef = useRef(null);
//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

// const fetchLatestRoomCode = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log("entering to latest room code fetch");
    
//     const res = await axios.get(
//       `${config.backendUrl}/history/rooms/${roomId}/latest`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     codeRef.current = res.data.code || "";
//     console.log("Latest code fetched for room:", roomId, res.data.code);
    
//     // Optional: if your Editor component accepts value prop, you can trigger re-render:
//     setEditorValue(res.data.code || "");
//   } catch (err) {
//     console.error("Failed to fetch latest room code:", err);
//     codeRef.current = "";
//   }
// };



//   // 🔹 socket setup
//   useEffect(() => {
//     const init = async () => {
//       const handleErrors = (err) => {
//         console.log("❌ Socket error:", err.message);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };

//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", handleErrors);
//       socketRef.current.on("connect_failed", handleErrors);

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       });
//     //fetch latest code when joining
//       await fetchLatestRoomCode();
//       console.log(fetchLatestRoomCode());
      
      

//       socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//         if (username !== Location.state?.username) {
//           toast.success(`${username} joined the room.`);
//         }
//         setClients(clients);
//         socketRef.current.emit(ACTIONS.SYNC_CODE, {
//           code: codeRef.current,
//           socketId,
//         });
//       });

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) =>
//           prev.filter((client) => client.socketId !== socketId)
//         );
//       });
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current?.off(ACTIONS.JOINED);
//       socketRef.current?.off(ACTIONS.DISCONNECTED);
//     };
//   }, []);

//    //code auto save useEffect
   
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     console.log("⏳ Auto-saving code...");
//   //     saveCode();
//   //   }, 5* 1000); // 5 minutes = 300000 ms

//   //   return () => clearInterval(interval);
//   // }, []);

//   if (!Location.state) {
//     return <Navigate to="/" />;
//   }

//   // 🔹 copy room id
//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`Room ID is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   // 🔹 run code
//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${config.backendUrl}/compile`,
//         {
//           code: codeRef.current,
//           language: selectedLanguage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setOutput(response.data.output || JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An error occurred");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   // 🔹 toggle compiler
//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   // 🔹 CODE HISTORY FUNCTIONS
//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${config.backendUrl}/history`
//         , {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch history");
//     }
//   };

//   // const saveCode = async () => {
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     const res = await axios.post(
//   //       "http://localhost:5000/history",
//   //       { code: codeRef.current, language: selectedLanguage ,roomId: roomId},
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     setHistory(res.data.history);


      
//   //     toast.success("Code saved to history!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to save code");
//   //   }
//   // };


//   // 🔹 Common save function



//   const saveCode = async (isAutoSave = false) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `${config.backendUrl}/history`,
//       { code: codeRef.current, language: selectedLanguage, roomId: roomId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setHistory(res.data.history);

//     // ✅ Show toast only when it's NOT an auto-save
//     if (!isAutoSave) {
//       console.log("Code saved successfully ✅");
      
//        toast.success("Code saved to history!");
//     } else {
//       console.log("Auto-saved successfully ✅");
//     }

//   } catch (err) {
//     console.error(err);
//     if (!isAutoSave) {
//       toast.error("Failed to save code");
//     }
//   }
// };




 

//   const loadCode = (code) => {
//     codeRef.current = code;
//     console.log(codeRef.current);
    
//     toast.success("Code loaded from history!");
//   };
  
//   // ===============================

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         {/* Client panel */}
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//              src="/images/profile.jpeg"
//             alt="Logo"
//             className="img-fluid mx-auto"
//             style={{ maxWidth: "150px", marginTop: "-43px" }}
//           />
//           <hr style={{ marginTop: "-3rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} email={client.email} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         {/* Editor panel */}
//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-between">
//             <select
//               className="form-select w-auto"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//             >
//               {LANGUAGES.map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>

//             {/* 🔹 history buttons */}
//             <div className="d-flex gap-2">
//               <button className="btn btn-warning" onClick={saveCode}>
//                 Save Code
//               </button>
//               <button
//                 className="btn btn-info"
//                 onClick={() => {
//                   fetchHistory();
//                   setShowHistory(!showHistory);
//                 }}
//               >
//                 {showHistory ? "Hide History" : "Show History"}
//               </button>
//             </div>

//              <button
//     className="btn btn-secondary"
//     onClick={() => navigate("/")}
//   >
//     🔙 Back to Profile
//   </button>
//           </div>

//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             value={codeRef.current}
//             onCodeChange={(code) => {
//               codeRef.current = code;
//               setEditorValue(code);  
//             }}
//           />

//           {/* 🔹 history panel */}
//          {showHistory && (
//   <div className="bg-secondary p-3 mt-2 rounded">
//     <h5>Code History</h5>
//     <ul className="list-group">
//       {console.log("Rendering history:", history)}
// {Array.isArray(history) && history.length > 0 ? (
//   history.map((h) => (
//     <li key={h._id} className="list-group-item d-flex justify-content-between align-items-center">
//       <span>{h.language} - {new Date(h.createdAt).toLocaleString()}</span>
//       <button className="btn btn-sm btn-primary" onClick={() => loadCode(h.code)}>Load</button>
//     </li>
//   ))
// ) : (
//   <li className="list-group-item text-muted">No history yet</li>
// )}

//     </ul>
//   </div>
//          )}

//         </div>

        
//       </div>
       
//       {/* Compiler toggle button */}
//       <button
//         className="btn btn-primary position-fixed bottom-0 end-0 m-3"
//         onClick={toggleCompileWindow}
//         style={{ zIndex: 1050 }}
//       >
//         {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
//       </button>

//       {/* Compiler section */}
//       <div
//         className={`bg-dark text-light p-3 ${
//           isCompileWindowOpen ? "d-block" : "d-none"
//         }`}
//         style={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: isCompileWindowOpen ? "30vh" : "0",
//           transition: "height 0.3s ease-in-out",
//           overflowY: "auto",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0">Compiler Output ({selectedLanguage})</h5>
//           <div>
//             <button
//               className="btn btn-success me-2"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>
//             <button className="btn btn-secondary" onClick={toggleCompileWindow}>
//               Close
//             </button>
//           </div>
//         </div>
//         <pre className="bg-secondary p-3 rounded">
//           {output || "Output will appear here after compilation"}
//         </pre>
//       </div>



//     </div>
//   );
// }

// export default EditorPage;

import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import config from "../config";

const LANGUAGES = [
  "python3", "java", "cpp", "nodejs", "c", "ruby", "go",
  "scala", "bash", "sql", "pascal", "csharp", "php", "swift", "rust", "r",
];

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const codeRef = useRef(null);
  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  const fetchLatestRoomCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${config.backendUrl}/history/rooms/${roomId}/latest`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      codeRef.current = res.data.code || "";
      setEditorValue(res.data.code || "");
    } catch (err) {
      console.error("Failed to fetch latest room code:", err);
      codeRef.current = "";
    }
  };

  useEffect(() => {
    const init = async () => {
      const handleErrors = (err) => {
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      await fetchLatestRoomCode();

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== Location.state?.username) toast.success(`${username} joined the room.`);
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
      });
    };
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!Location.state) return <Navigate to="/" />;

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID copied`);
    } catch {
      toast.error("Unable to copy room ID");
    }
  };

  const leaveRoom = () => navigate("/");

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${config.backendUrl}/compile`,
        { code: codeRef.current, language: selectedLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutput(res.data.output || JSON.stringify(res.data));
    } catch (err) {
      setOutput(err.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const saveCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${config.backendUrl}/history`,
        { code: codeRef.current, language: selectedLanguage, roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data.history);
      toast.success("Code saved successfully!");
    } catch {
      toast.error("Failed to save code");
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${config.backendUrl}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch {
      toast.error("Failed to fetch history");
    }
  };

  const loadCode = (code) => {
    codeRef.current = code;
    toast.success("Code loaded from history!");
  };

  return (
    <div
      className="container-fluid vh-100 d-flex flex-column"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, #0a0f1f, #050813, #02050a)",
        color: "#e0e0e0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="row flex-grow-1">
        {/* Left Sidebar */}
        <div
          className="col-md-2 d-flex flex-column p-3"
          style={{
            background: "rgba(15, 20, 40, 0.85)",
            borderRight: "1px solid rgba(0, 255, 255, 0.3)",
            boxShadow: "2px 0 15px rgba(0, 200, 255, 0.2)",
            backdropFilter: "blur(6px)",
          }}
        >
          <h5
            className="text-center mb-3 fw-bold"
            style={{
              color: "#00f5ff",
              textShadow: "0 0 10px #00f5ff",
              letterSpacing: "1px",
            }}
          >
            🧠 Room: {roomId.slice(0, 6)}...
          </h5>

          <div className="flex-grow-1 overflow-auto mb-3">
            <h6 className="text-info text-center">👥 Members</h6>
            {clients.length ? (
              clients.map((c) => (
                <div
                  key={c.socketId}
                  className="bg-dark text-light rounded px-2 py-1 my-1 text-center"
                  style={{
                    border: "1px solid rgba(0,255,255,0.3)",
                    fontSize: "0.9rem",
                  }}
                >
                  {c.email || "Anonymous"}
                </div>
              ))
            ) : (
              <p className="text-muted text-center">No members</p>
            )}
          </div>

          <button
            className="btn btn-info mb-2"
            style={{ fontWeight: 600 }}
            onClick={copyRoomId}
          >
            🔗 Copy Room ID
          </button>
          <button
            className="btn btn-danger fw-semibold"
            onClick={leaveRoom}
          >
            🚪 Leave Room
          </button>
        </div>

        {/* Editor Section */}
        <div className="col-md-10 d-flex flex-column p-0">
          <div
            className="d-flex justify-content-between align-items-center p-2"
            style={{
              background: "rgba(0, 10, 25, 0.9)",
              borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
            }}
          >
            <select
              className="form-select w-auto bg-dark text-light border-info"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>

            <div className="d-flex gap-2">
              <button className="btn btn-warning fw-semibold" onClick={saveCode}>
                💾 Save
              </button>
              <button
                className="btn btn-outline-info fw-semibold"
                onClick={() => {
                  fetchHistory();
                  setShowHistory(!showHistory);
                }}
              >
                {showHistory ? "Hide History" : "Show History"}
              </button>
            </div>

            <button
              className="btn btn-outline-light fw-semibold"
              onClick={() => navigate("/")}
            >
              🔙 Exit
            </button>
          </div>

          <Editor
            socketRef={socketRef}
            roomId={roomId}
            value={codeRef.current}
            onCodeChange={(code) => {
              codeRef.current = code;
              setEditorValue(code);
            }}
          />

          {/* History Section */}
          {showHistory && (
            <div
              className="bg-dark text-light p-3"
              style={{
                borderTop: "1px solid rgba(0,255,255,0.3)",
                boxShadow: "0 -2px 10px rgba(0,255,255,0.2)",
              }}
            >
              <h6 className="text-info fw-bold">🕓 Code History</h6>
              <ul className="list-group">
                {Array.isArray(history) && history.length > 0 ? (
                  history.map((h) => (
                    <li
                      key={h._id}
                      className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-info"
                    >
                      <span>
                        {h.language} • {new Date(h.createdAt).toLocaleString()}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => loadCode(h.code)}
                      >
                        Load
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">
                    No history yet
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Compiler Toggle */}
      <button
        className="btn btn-primary position-fixed bottom-0 end-0 m-3 fw-semibold"
        onClick={() => setIsCompileWindowOpen(!isCompileWindowOpen)}
        style={{
          boxShadow: "0 0 20px #00f5ff",
          borderRadius: "15px",
          zIndex: 1050,
        }}
      >
        {isCompileWindowOpen ? "Close Compiler" : "⚙️ Open Compiler"}
      </button>

      {/* Compiler Output */}
      {isCompileWindowOpen && (
        <div
          className="p-3 text-light"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30vh",
            background: "rgba(10,15,25,0.95)",
            borderTop: "2px solid #00f5ff",
            boxShadow: "0 -2px 20px rgba(0,255,255,0.3)",
            overflowY: "auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-info mb-0">
              Compiler Output ({selectedLanguage})
            </h6>
            <button
              className="btn btn-success"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Running..." : "▶ Run"}
            </button>
          </div>
          <pre
            className="p-3 rounded bg-dark"
            style={{
              border: "1px solid rgba(0,255,255,0.3)",
              color: "#00f5ff",
              fontSize: "0.9rem",
            }}
          >
            {output || "Output will appear here..."}
          </pre>
        </div>
      )}
    </div>
  );
}

export default EditorPage;
