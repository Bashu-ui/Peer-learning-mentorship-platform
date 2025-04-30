import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AddSkillModal from './AddSkillModal';

const initialSkills = [
  { id: 1, name: 'React.js', category: 'Frontend', description: 'Build modern web applications with React.js', image: 'https://cdn.iconscout.com/icon/free/png-256/free-react-1-282599.png' },
  { id: 2, name: 'Node.js', category: 'Backend', description: 'Create scalable server-side applications', image: 'https://cdn.iconscout.com/icon/free/png-256/free-nodejs-2-226035.png' },
  { id: 3, name: 'Python', category: 'Programming', description: 'Master Python programming fundamentals', image: 'https://cdn.iconscout.com/icon/free/png-256/free-python-3521655-2945099.png' },
  { id: 4, name: 'Data Structures', category: 'DSA', description: 'Learn essential data structures concepts', image: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/data-structure-1645675-1396552.png' },
  { id: 5, name: 'MongoDB', category: 'Database', description: 'Master MongoDB database management', image: 'https://cdn.iconscout.com/icon/free/png-256/free-mongodb-5-1175140.png' },
];

const SkillListings = () => {
  const { user, switchRole } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState(initialSkills);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSkill = (newSkill) => {
    setSkills(prevSkills => [...prevSkills, newSkill]);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/90 to-accent/90 text-white py-16 mb-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Skills
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8">
              Explore a wide range of skills and connect with expert mentors to accelerate your learning journey.
            </p>
          </div>
          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-colors text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              All Skills
            </button>
            {['Frontend', 'Backend', 'Programming', 'DSA', 'Database'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">Test as:</label>
            <select
              value={user.role}
              onChange={(e) => switchRole(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Add Skill Button */}
          {(user.role === 'mentor' || user.role === 'admin') && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap py-2.5 px-6 rounded-full hover:bg-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </button>
          )}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="group bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src={skill.image} 
                  alt={skill.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <span className="inline-block px-4 py-1.5 mt-2 text-sm font-medium text-primary bg-primary/10 rounded-full">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    4.5 Rating
                  </span>
                </div>

                <p className="text-gray-600 text-base mb-6">{skill.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium text-sm rounded-full hover:bg-primary/90 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Session
                  </button>
                  <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    15 reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSkill}
      />
    </div>
  );
};

export default SkillListings;
