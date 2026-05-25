import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9"
];

const PRIORITY_CONFIG = {
  HIGH:   { label: "High",   color: "#FF6B6B", bg: "#FFF0F0" },
  MEDIUM: { label: "Medium", color: "#F5A623", bg: "#FFF8EE" },
  LOW:    { label: "Low",    color: "#4ECDC4", bg: "#F0FFFE" },
};

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,15,20,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)", padding: "1rem"
    }}>
      <div style={{
        background: "#1C1C28", border: "1px solid #2E2E40",
        borderRadius: "16px", padding: "2rem", width: "100%",
        maxWidth: "480px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, color: "#F0F0F8", fontSize: "1.35rem", fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#888", cursor: "pointer",
            fontSize: "1.65rem", lineHeight: 1, padding: "0.2rem"
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.4rem", color: "#A0A0B8", fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.05em" }}>{label}</label>}
      <input style={{
        width: "100%", boxSizing: "border-box", background: "#0F0F1A",
        border: "1px solid #2E2E40", borderRadius: "8px",
        color: "#F0F0F8", padding: "0.6rem 0.8rem", fontSize: "1.05rem",
        outline: "none", fontFamily: "inherit"
      }} {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.4rem", color: "#A0A0B8", fontSize: "0.95rem", fontWeight: 500 }}>{label}</label>}
      <textarea style={{
        width: "100%", boxSizing: "border-box", background: "#0F0F1A",
        border: "1px solid #2E2E40", borderRadius: "8px",
        color: "#F0F0F8", padding: "0.6rem 0.8rem", fontSize: "1.05rem",
        outline: "none", fontFamily: "inherit", resize: "vertical", minHeight: "80px"
      }} {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.4rem", color: "#A0A0B8", fontSize: "0.95rem", fontWeight: 500 }}>{label}</label>}
      <select style={{
        width: "100%", background: "#0F0F1A", border: "1px solid #2E2E40",
        borderRadius: "8px", color: "#F0F0F8", padding: "0.6rem 0.8rem",
        fontSize: "1.05rem", outline: "none", fontFamily: "inherit"
      }} {...props}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "#7C6FFF", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "#A0A0B8", border: "1px solid #2E2E40" },
    danger: { background: "transparent", color: "#FF6B6B", border: "1px solid #FF6B6B" },
  };
  return (
    <button style={{
      ...styles[variant], borderRadius: "8px", padding: "0.55rem 1.1rem",
      fontSize: "1.15rem", cursor: "pointer", fontWeight: 500,
      fontFamily: "inherit", transition: "opacity 0.15s"
    }} {...props}>{children}</button>
  );
}

function ProjectForm({ initial = {}, onSave, onClose }) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [color, setColor] = useState(initial.color || COLORS[0]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim(), color });
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="PROJECT NAME" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" required />
      <Textarea label="DESCRIPTION" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this project about?" />
      <div style={{ marginBottom: "1.2rem" }}>
        <label style={{ display: "block", marginBottom: "0.6rem", color: "#A0A0B8", fontSize: "0.95rem", fontWeight: 500 }}>COLOR</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)} style={{
              width: "28px", height: "28px", borderRadius: "50%", background: c,
              border: color === c ? "3px solid #fff" : "3px solid transparent",
              cursor: "pointer", outline: "none", transition: "transform 0.1s"
            }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn type="submit" disabled={saving}>{saving ? "Saving…" : (initial.id ? "Update" : "Create Project")}</Btn>
      </div>
    </form>
  );
}

function TodoForm({ projectId, initial = {}, onSave, onClose }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [priority, setPriority] = useState(initial.priority || "MEDIUM");
  const [dueDate, setDueDate] = useState(initial.dueDate ? initial.dueDate.split("T")[0] : "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(), description: description.trim(),
        priority, completed: initial.completed || false,
        dueDate: dueDate ? dueDate + "T00:00:00" : null,
      };
      await onSave(payload);
      onClose();
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="TASK TITLE" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" required />
      <Textarea label="DESCRIPTION" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add details..." />
      <Select label="PRIORITY" value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="HIGH">🔴 High</option>
        <option value="MEDIUM">🟡 Medium</option>
        <option value="LOW">🟢 Low</option>
      </Select>
      <Input label="DUE DATE" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn type="submit" disabled={saving}>{saving ? "Saving…" : (initial.id ? "Update Task" : "Add Task")}</Btn>
      </div>
    </form>
  );
}

function TodoItem({ todo, onToggle, onEdit, onDelete, accentColor }) {
  const pc = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.MEDIUM;
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div style={{
      background: "#14141F", border: "1px solid #2E2E40",
      borderRadius: "10px", padding: "0.85rem 1rem",
      marginBottom: "0.5rem", display: "flex", alignItems: "flex-start",
      gap: "0.75rem", opacity: todo.completed ? 0.55 : 1,
      transition: "opacity 0.2s, transform 0.15s",
    }}>
      <button onClick={() => onToggle(todo.id)} style={{
        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${todo.completed ? accentColor : "#444"}`,
        background: todo.completed ? accentColor : "transparent",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: "2px", transition: "all 0.2s"
      }}>
        {todo.completed && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            color: todo.completed ? "#666" : "#F0F0F8",
            fontSize: "1.05rem", fontWeight: 500,
            textDecoration: todo.completed ? "line-through" : "none",
          }}>{todo.title}</span>
          <span style={{
            background: pc.bg, color: pc.color, fontSize: "0.92rem",
            padding: "1px 7px", borderRadius: "20px", fontWeight: 600, letterSpacing: "0.04em"
          }}>{pc.label}</span>
        </div>
        {todo.description && (
          <p style={{ margin: "0.25rem 0 0", color: "#888", fontSize: "0.92rem", lineHeight: 1.5 }}>{todo.description}</p>
        )}
        {todo.dueDate && (
          <span style={{ fontSize: "1.15rem", color: isOverdue ? "#FF6B6B" : "#666", marginTop: "0.3rem", display: "block" }}>
            {isOverdue ? "⚠ " : "📅 "}Due {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
        <button onClick={() => onEdit(todo)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1.05rem", padding: "0.2rem" }} title="Edit">✏️</button>
        <button onClick={() => onDelete(todo.id)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "1.05rem", padding: "0.2rem" }} title="Delete">🗑️</button>
      </div>
    </div>
  );
}

function ProjectCard({ project, selected, onClick }) {
  const done = project.todos?.filter(t => t.completed).length || 0;
  const total = project.todos?.length || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div onClick={onClick} style={{
      background: selected ? "#1C1C2E" : "#14141F",
      border: `1px solid ${selected ? project.color : "#2E2E40"}`,
      borderRadius: "12px", padding: "1rem", cursor: "pointer",
      marginBottom: "0.5rem", transition: "all 0.2s",
      boxShadow: selected ? `0 0 0 1px ${project.color}22, 0 4px 20px rgba(0,0,0,0.3)` : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: project.color, flexShrink: 0 }} />
        <span style={{ color: "#F0F0F8", fontWeight: 600, fontSize: "1.05rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.name}</span>
        <span style={{ color: "#666", fontSize: "1.05rem" }}>{done}/{total}</span>
      </div>
      <div style={{ background: "#0F0F1A", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
        <div style={{ background: project.color, width: `${pct}%`, height: "100%", borderRadius: "4px", transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | ACTIVE | DONE

  // Modals
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (selectedProject) loadTodos(selectedProject.id); }, [selectedProject]);

  async function loadProjects() {
    try {
      const data = await api("/projects");
      setProjects(data);
      if (data.length > 0 && !selectedProject) setSelectedProject(data[0]);
    } catch (e) { setError("Could not connect to backend. Make sure Spring Boot is running on port 8080."); }
  }

  async function loadTodos(projectId) {
    setLoading(true);
    try {
      const data = await api(`/projects/${projectId}/todos`);
      setTodos(data);
    } finally { setLoading(false); }
  }

  async function createProject(data) {
    const project = await api("/projects", { method: "POST", body: JSON.stringify(data) });
    setProjects(p => [...p, project]);
    setSelectedProject(project);
  }

  async function updateProject(data) {
    const project = await api(`/projects/${editingProject.id}`, { method: "PUT", body: JSON.stringify(data) });
    setProjects(p => p.map(x => x.id === project.id ? project : x));
    if (selectedProject?.id === project.id) setSelectedProject(project);
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project and all its tasks?")) return;
    await api(`/projects/${id}`, { method: "DELETE" });
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    setSelectedProject(remaining[0] || null);
    if (!remaining[0]) setTodos([]);
  }

  async function createTodo(data) {
    const todo = await api(`/projects/${selectedProject.id}/todos`, { method: "POST", body: JSON.stringify(data) });
    setTodos(t => [todo, ...t]);
    refreshProjectList();
  }

  async function updateTodo(data) {
    const todo = await api(`/todos/${editingTodo.id}`, { method: "PUT", body: JSON.stringify(data) });
    setTodos(t => t.map(x => x.id === todo.id ? todo : x));
    refreshProjectList();
  }

  async function toggleTodo(id) {
    const todo = await api(`/todos/${id}/toggle`, { method: "PATCH" });
    setTodos(t => t.map(x => x.id === todo.id ? todo : x));
    refreshProjectList();
  }

  async function deleteTodo(id) {
    await api(`/todos/${id}`, { method: "DELETE" });
    setTodos(t => t.filter(x => x.id !== id));
    refreshProjectList();
  }

  async function refreshProjectList() {
    const data = await api("/projects");
    setProjects(data);
  }

  const filteredTodos = todos.filter(t => {
    if (filter === "ACTIVE") return !t.completed;
    if (filter === "DONE") return t.completed;
    return true;
  });

  const accentColor = selectedProject?.color || "#7C6FFF";
  const doneCount = todos.filter(t => t.completed).length;
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0F0F1A", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#F0F0F8", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: "260px", flexShrink: 0, borderRight: "1px solid #1E1E2E", display: "flex", flexDirection: "column", padding: "1.5rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.45rem", fontWeight: 700, color: "#F0F0F8", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#7C6FFF" }}>◈</span> ProjectFlow
          </h1>
          <p style={{ margin: "0.2rem 0 0", color: "#555", fontSize: "1.05rem" }}>Task management</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ color: "#A0A0B8", fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.08em" }}>PROJECTS</span>
          <button onClick={() => { setEditingProject(null); setShowProjectForm(true); }} style={{
            background: "#7C6FFF22", border: "none", color: "#7C6FFF", cursor: "pointer",
            borderRadius: "6px", width: "24px", height: "24px", fontSize: "1.15rem", display: "flex", alignItems: "center", justifyContent: "center"
          }}>+</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} selected={selectedProject?.id === p.id} onClick={() => setSelectedProject(p)} />
          ))}
          {projects.length === 0 && (
            <p style={{ color: "#444", fontSize: "0.95rem", textAlign: "center", marginTop: "2rem" }}>No projects yet.<br />Create one to get started!</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selectedProject ? (
          <>
            {/* Header */}
            <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid #1E1E2E" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: accentColor }} />
                    <h2 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.03em" }}>{selectedProject.name}</h2>
                  </div>
                  {selectedProject.description && (
                    <p style={{ margin: "0.3rem 0 0 1.65rem", color: "#888", fontSize: "1.15rem" }}>{selectedProject.description}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Btn variant="secondary" onClick={() => { setEditingProject(selectedProject); setShowProjectForm(true); }}>Edit</Btn>
                  <Btn variant="danger" onClick={() => deleteProject(selectedProject.id)}>Delete</Btn>
                </div>
              </div>

              {/* Progress */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ flex: 1, background: "#1E1E2E", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
                  <div style={{ background: accentColor, width: `${pct}%`, height: "100%", borderRadius: "6px", transition: "width 0.5s" }} />
                </div>
                <span style={{ color: "#888", fontSize: "0.95rem", whiteSpace: "nowrap" }}>{doneCount} of {todos.length} done</span>
              </div>
            </div>

            {/* Toolbar */}
            <div style={{ padding: "0.75rem 2rem", borderBottom: "1px solid #1E1E2E", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {["ALL", "ACTIVE", "DONE"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? accentColor + "22" : "transparent",
                  border: `1px solid ${filter === f ? accentColor : "transparent"}`,
                  color: filter === f ? accentColor : "#666", borderRadius: "6px",
                  padding: "0.3rem 0.75rem", fontSize: "0.92rem", fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit"
                }}>{f}</button>
              ))}
              <div style={{ flex: 1 }} />
              <Btn onClick={() => { setEditingTodo(null); setShowTodoForm(true); }}>+ Add Task</Btn>
            </div>

            {/* Todo list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 2rem" }}>
              {loading ? (
                <p style={{ color: "#555", textAlign: "center", marginTop: "3rem" }}>Loading tasks…</p>
              ) : filteredTodos.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "4rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    {filter === "DONE" ? "🎉" : "📋"}
                  </div>
                  <p style={{ color: "#555", fontSize: "1.05rem" }}>
                    {filter === "DONE" ? "No completed tasks yet." : filter === "ACTIVE" ? "No pending tasks!" : "No tasks yet. Add one above!"}
                  </p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} accentColor={accentColor}
                    onToggle={toggleTodo}
                    onEdit={(t) => { setEditingTodo(t); setShowTodoForm(true); }}
                    onDelete={deleteTodo}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontSize: "3rem" }}>◈</div>
            <p style={{ color: "#555" }}>Create a project to get started</p>
            <Btn onClick={() => { setEditingProject(null); setShowProjectForm(true); }}>+ New Project</Btn>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", background: "#FF6B6B22",
          border: "1px solid #FF6B6B", borderRadius: "10px", padding: "1rem 1.25rem",
          maxWidth: "360px", color: "#FF6B6B", fontSize: "1.15rem", lineHeight: 1.5
        }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ display: "block", marginTop: "0.5rem", background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", textDecoration: "underline", padding: 0, fontSize: "0.95rem" }}>Dismiss</button>
        </div>
      )}

      {/* Project Modal */}
      {showProjectForm && (
        <Modal title={editingProject ? "Edit Project" : "New Project"} onClose={() => setShowProjectForm(false)}>
          <ProjectForm initial={editingProject || {}} onClose={() => setShowProjectForm(false)}
            onSave={editingProject ? updateProject : createProject} />
        </Modal>
      )}

      {/* Todo Modal */}
      {showTodoForm && (
        <Modal title={editingTodo ? "Edit Task" : "New Task"} onClose={() => setShowTodoForm(false)}>
          <TodoForm projectId={selectedProject?.id} initial={editingTodo || {}}
            onClose={() => setShowTodoForm(false)}
            onSave={editingTodo ? updateTodo : createTodo} />
        </Modal>
      )}
    </div>
  );
}
