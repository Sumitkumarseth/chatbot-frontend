import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatUI() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatRef = useRef(null);

  const PROJECT_ID = "6966697d271449d58f2bef51";
  const TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

  // auto scroll bottom
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const typeEffect = (text) => {
    let i = 0;
    let temp = "";

    const interval = setInterval(() => {
      temp += text[i];
      i++;

      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1].text = temp;
        return arr;
      });

      if (i === text.length) clearInterval(interval);
    }, 30);
  };

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
        { headers: { Authorization: TOKEN } }
      );

      const botMsg = { role: "bot", text: "" };
      setMessages((prev) => [...prev, botMsg]);

      typeEffect(res.data.reply);

      setHistory((prev) => [
        ...prev,
        { id: Date.now(), title: msg.slice(0, 25) },
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
        <h3>🕒 History</h3>

        {history.map((h) => (
          <div key={h.id} style={styles.historyItem}>
            💬 {h.title}
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={styles.chatArea}>
        <div style={styles.header}>🤖 Chatbot</div>

        <div style={styles.chatBox}>
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
                }}
              >
                {c.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatRef}></div>
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            style={styles.input}
            placeholder="Type message..."
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
    width: "240px",
    padding: "10px",
    borderRight: "1px solid #1e293b",
  },

  historyItem: {
    padding: "6px",
    margin: "4px 0",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#020617",
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #1e293b",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },

  typing: {
    display: "flex",
    gap: "5px",
    padding: "10px",
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
  },

  sendBtn: {
    marginLeft: "8px",
    borderRadius: "50%",
    padding: "10px 16px",
    border: "none",
    background: "#2563eb",
    color: "white",
  },
};
