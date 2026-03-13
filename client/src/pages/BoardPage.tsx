import { useState } from 'react';
import './Board.css';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type TaskType = 'TASK' | 'BUG' | 'FEATURE';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  priority: Priority;
  status: TaskStatus;
  assignee?: string;
}

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'Do zrobienia' },
  { status: 'IN_PROGRESS', label: 'W trakcie' },
  { status: 'REVIEW', label: 'Review' },
  { status: 'DONE', label: 'Gotowe' },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

const TYPE_ICONS: Record<TaskType, string> = {
  TASK: '📋',
  BUG: '🐛',
  FEATURE: '✨',
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Zaprojektować stronę główną', type: 'TASK', priority: 'HIGH', status: 'TODO', assignee: 'Jan K.' },
  { id: '2', title: 'Naprawić błąd logowania', type: 'BUG', priority: 'CRITICAL', status: 'TODO' },
  { id: '3', title: 'Dodać filtrowanie zadań', type: 'FEATURE', priority: 'MEDIUM', status: 'IN_PROGRESS', assignee: 'Anna M.' },
  { id: '4', title: 'Napisać testy API', type: 'TASK', priority: 'MEDIUM', status: 'IN_PROGRESS', assignee: 'Piotr S.' },
  { id: '5', title: 'Przegląd kodu sprintu 2', type: 'TASK', priority: 'LOW', status: 'REVIEW', assignee: 'Jan K.' },
  { id: '6', title: 'Ciemny motyw', type: 'FEATURE', priority: 'LOW', status: 'REVIEW' },
  { id: '7', title: 'Konfiguracja CI/CD', type: 'TASK', priority: 'HIGH', status: 'DONE', assignee: 'Piotr S.' },
  { id: '8', title: 'Walidacja formularzy', type: 'BUG', priority: 'MEDIUM', status: 'DONE', assignee: 'Anna M.' },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedId(taskId);
  };

  const handleDrop = (status: TaskStatus) => {
    if (!draggedId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedId ? { ...t, status } : t)),
    );
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="board">
      <header className="board-header">
        <div>
          <h1>Tablica Kanban</h1>
          <p>Sprint 3 — RoadmapPro</p>
        </div>
      </header>

      <div className="board-columns">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className="board-column"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.status)}
            >
              <div className="column-header">
                <span className="column-title">{col.label}</span>
                <span className="column-count">{columnTasks.length}</span>
              </div>
              <div className="column-tasks">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-card ${draggedId === task.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <div className="task-top">
                      <span className="task-type">{TYPE_ICONS[task.type]}</span>
                      <span
                        className="task-priority"
                        style={{ background: PRIORITY_COLORS[task.priority] }}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-title">{task.title}</div>
                    {task.assignee && (
                      <div className="task-assignee">👤 {task.assignee}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
