const chatEl = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const modelSelect = document.getElementById("model");

let messages = [];
let awaitingQualifications = true; // ask for quals first

function addMessage(role, content) {
  const row = document.createElement("div");
  row.className = `msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "U" : "J";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  row.appendChild(avatar);
  row.appendChild(bubble);

  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function welcome() {
  addMessage("bot", "Welcome to JobFinder!\nPlease list your qualifications (degrees, years of experience, key skills, notable projects).");
}
welcome();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";
  input.style.height = "auto";
  btn.disabled = true;

  try {
    if (awaitingQualifications) {
      const crafted = `Tell me how i can find a job: here are my qualifications : ${text}`;
      messages.push({ role: "user", content: crafted });
      awaitingQualifications = false;
    } else {
      messages.push({ role: "user", content: text });
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelSelect.value,
        messages
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const content = data.content || "(No response)";
    addMessage("bot", content);
    messages.push({ role: "assistant", content });
  } catch (err) {
    addMessage("bot", "⚠️ Error: " + err.message);
  } finally {
    btn.disabled = false;
  }
});

// Autosize textarea
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 180) + "px";
});
