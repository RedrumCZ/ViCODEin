import { useState, useMemo } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GeographicFilter } from './components/GeographicFilter';
import { ProjectCard } from './components/ProjectCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Showroom } from './components/Showroom';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { useProjects } from './hooks/useProjects';
import { GeographicCategory, Project } from './types/project';
import { updateProject, deleteProject } from './services/adminService';

function App() {
  const { projects, loading, refreshProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [geographicCategory, setGeographicCategory] = useState<GeographicCategory>('All');

  const handleUpdate = async (id: string, updates: Partial<Project>) => {
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (!adminKey) throw new Error('Admin key not configured');
    await updateProject(id, updates, adminKey);
    await refreshProjects();
  };

  const handleDelete = async (id: string) => {
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (!adminKey) throw new Error('Admin key not configured');
    await deleteProject(id, adminKey);
    await refreshProjects();
  };

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply geographic filter
    if (geographicCategory !== 'All') {
      filtered = filtered.filter((project) => project.region === geographicCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(query) ||
          (project.tech_stack && project.tech_stack.toLowerCase().includes(query)) ||
          project.author_info.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, searchQuery, geographicCategory]);

  return (
    <div className="min-h-screen text-gray-100 font-sans">
      <AnimatedBackground />

      <Header />

      <main className="relative pb-20">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4">
            <LoadingSpinner />
          </div>
        ) : filteredProjects.length > 0 ? (
          <Showroom projects={filteredProjects} />
        ) : null}

        <div className="max-w-7xl mx-auto px-4 mt-12">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <GeographicFilter
            activeCategory={geographicCategory}
            onCategoryChange={setGeographicCategory}
          />

          {loading ? (
            <LoadingSpinner />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 font-mono">
                {searchQuery || geographicCategory !== 'All'
                  ? `No projects found matching your criteria`
                  : 'No projects yet. Be the first to prescribe a build!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AdminPanel
        projects={projects}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
