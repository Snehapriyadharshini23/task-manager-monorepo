"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [view, setView] = useState("pending");

  // 🔐 Protect Route
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
    } else {
      fetchTasks(user.id);
    }
  };

  // 📥 Fetch Tasks (User specific)
  const fetchTasks = async (userId: string) => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setTasks(data);
  };

  // ➕ Add Task
  const addTask = async () => {
    if (!task || !dueDate) {
      alert("Please enter task and due date");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (dueDate < today) {
      alert("Past date not allowed");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("tasks").insert([
      {
        title: task,
        priority,
        due_date: dueDate,
        is_completed: false,
        user_id: user.id,
      },
    ]);

    setTask("");
    setDueDate("");
    fetchTasks(user.id);
  };

  // ✅ Toggle Complete
  const toggleComplete = async (taskItem: any) => {
    await supabase
      .from("tasks")
      .update({
        is_completed: !taskItem.is_completed,
        completed_at: !taskItem.is_completed ? new Date() : null,
      })
      .eq("id", taskItem.id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) fetchTasks(user.id);
  };

  // ❌ Delete Task
  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) fetchTasks(user.id);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredTasks =
    view === "pending"
      ? tasks.filter((t) => !t.is_completed)
      : tasks.filter((t) => t.is_completed);

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    //<div className="min-h-screen bg-gray-100 p-8 flex justify-center">
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            🚀 Smart Task Manager
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">
            Completed: {completedCount} / {tasks.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${tasks.length === 0
                  ? 0
                  : (completedCount / tasks.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Add Task */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Enter new task..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="border p-2 rounded-lg"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              className="border p-2 rounded-lg"
              value={dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setView("pending")}
            className={`px-4 py-2 rounded-lg ${
              view === "pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            📌 Pending
          </button>

          <button
            onClick={() => setView("completed")}
            className={`px-4 py-2 rounded-lg ${
              view === "completed"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            ✅ Completed
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-400">
              No tasks here 🙂
            </p>
          )}

          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className={`font-medium ${t.is_completed ? "line-through text-gray-400" : ""}`}>
                  {t.title}
                </p>

                <p className="text-xs text-gray-500">
                  Priority: {t.priority} | Due: {t.due_date}
                </p>

                {t.completed_at && (
                  <p className="text-xs text-green-600">
                    Completed on: {new Date(t.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(t)}
                  className="text-sm px-3 py-1 bg-gray-200 rounded-lg"
                >
                  {t.is_completed ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}