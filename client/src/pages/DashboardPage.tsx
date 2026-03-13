import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const SAMPLE_PROJECTS = [
  {
    id: '1',
    name: 'RoadmapPro',
    description: 'System zarządzania projektami',
    tasksCount: 12,
    sprintsCount: 3,
    progress: 65,
  },
  {
    id: '2',
    name: 'E-commerce App',
    description: 'Sklep internetowy z płatnościami online',
    tasksCount: 24,
    sprintsCount: 5,
    progress: 40,
  },
  {
    id: '3',
    name: 'Mobile Banking',
    description: 'Aplikacja mobilna do bankowości',
    tasksCount: 18,
    sprintsCount: 4,
    progress: 20,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Witaj, {user?.name}! 👋</h1>
          <p>Oto przegląd Twoich projektów</p>
        </div>
        <button className="btn-new-project">+ Nowy projekt</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📂</span>
          <div>
            <div className="stat-value">3</div>
            <div className="stat-label">Projekty</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-value">54</div>
            <div className="stat-label">Zadania</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏃</span>
          <div>
            <div className="stat-value">2</div>
            <div className="stat-label">Aktywne sprinty</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">18</div>
            <div className="stat-label">Ukończone</div>
          </div>
        </div>
      </div>

      <section className="projects-section">
        <h2>Twoje projekty</h2>
        <div className="projects-grid">
          {SAMPLE_PROJECTS.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span>📋 {project.tasksCount} zadań</span>
                <span>🗓️ {project.sprintsCount} sprintów</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="progress-text">{project.progress}% ukończono</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
