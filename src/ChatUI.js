import { useState } from "react";
import axios from "axios";

export default function ChatUI() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const PROJECT_ID = "6966697d271449d58f2bef51";
  const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjY2MzYzMjcxNDQ5ZDU4ZjJiZWY0YyIsImlhdCI6MTc2ODMxODYxM30.TKwbU7TMspTI8StMe3sRjtWs1c6MW4QFMNt7X1padcA";

  const sendMsg = async () => {
    if (!msg.trim()) return;

    const userMsg = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
  `https://chatbot-backend-dcvu.onrender.com/api/chat/${PROJECT_ID}`,
  { message: msg },
  {
    headers: {
      Authorization: TOKEN
    }
  }
);


      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);

      // Auto history save
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: userMsg.text.slice(0, 25),
        },
      ]);
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={{ marginBottom: "10px" }}>🕒 History</h3>

        {history.length === 0 && (
          <p style={{ color: "#64748b" }}>No chats yet</p>
        )}

        {history.map((h) => (
          <div key={h.id} style={styles.historyItem}>
            💬 {h.title}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        <div style={styles.header}>🤖 Chatbot</div>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <p style={styles.empty}>Start typing 🚀</p>
          )}

          {messages.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  c.role === "user" ? "flex-end" : "flex-start",
                margin: "10px",
              }}
            >
              <div
                style={{
                  background:
                    c.role === "user" ? "#2563eb" : "#1f2937",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  maxWidth: "75%",
                  color: "white",
                }}
              >
                {c.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ margin: "10px", color: "#94a3b8" }}>
              Bot typing...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            style={styles.input}
            placeholder="Send a message..."
          />

          <button onClick={sendMsg} style={styles.sendBtn}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#020617",
    color: "white",
  },

  sidebar: {
    width: "260px",
    background: "#020617",
    borderRight: "1px solid #1e293b",
    padding: "12px",
    overflowY: "auto",
  },

  historyItem: {
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#cbd5f5",
    background: "#020617",
    marginBottom: "6px",
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    textAlign: "center",
    padding: "12px",
    borderBottom: "1px solid #1e293b",
    fontWeight: "bold",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },

  empty: {
    textAlign: "center",
    marginTop: "40px",
    color: "#64748b",
  },

  inputBar: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #1e293b",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
  },

  sendBtn: {
    marginLeft: "8px",
    padding: "10px 16px",
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};
