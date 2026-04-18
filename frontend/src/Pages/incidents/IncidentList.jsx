import React, { useEffect, useState } from 'react';
import { getAllIncidents } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, resolved: 0 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlResourceId = searchParams.get('resourceId');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate stats whenever incidents change
    if (incidents.length > 0) {
      setStats({
        total: incidents.length,
        open: incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
        critical: incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length,
        resolved: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length
      });
    }
  }, [incidents]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incidentsData, facilitiesData] = await Promise.all([
        getAllIncidents(),
        facilityService.getAllFacilities()
      ]);
      setIncidents(incidentsData);
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'OPEN': { 
        color: 'bg-amber-50 text-amber-700 border-amber-200', 
        icon: '🟡',
        label: 'Open'
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-50 text-blue-700 border-blue-200', 
        icon: '🔵',
        label: 'In Progress'
      },
      'RESOLVED': { 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
        icon: '✅',
        label: 'Resolved'
      },
      'CLOSED': { 
        color: 'bg-gray-50 text-gray-700 border-gray-200', 
        icon: '✔️',
        label: 'Closed'
      },
      'REJECTED': { 
        color: 'bg-red-50 text-red-700 border-red-200', 
        icon: '❌',
        label: 'Rejected'
      }
    };
    return configs[status] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '📋', label: status };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'LOW': { color: 'bg-gradient-to-r from-green-400 to-emerald-400', bgLight: 'bg-green-50', text: 'text-green-700', icon: '🟢' },
      'MEDIUM': { color: 'bg-gradient-to-r from-yellow-400 to-amber-400', bgLight: 'bg-yellow-50', text: 'text-yellow-700', icon: '🟡' },
      'HIGH': { color: 'bg-gradient-to-r from-orange-400 to-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700', icon: '🟠' },
      'CRITICAL': { color: 'bg-gradient-to-r from-red-500 to-rose-500', bgLight: 'bg-red-50', text: 'text-red-700', icon: '🔴' }
    };
    return configs[priority] || { color: 'bg-gradient-to-r from-gray-300 to-gray-400', bgLight: 'bg-gray-50', text: 'text-gray-700', icon: '⚪' };
  };

  const getResourceName = (resourceId) => {
    const facility = facilities.find(f => String(f.id) === String(resourceId));
    return facility ? facility.name : resourceId;
  };

  const filteredIncidents = incidents.filter(ticket => {
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    const matchUrlResource = urlResourceId ? String(ticket.resourceId) === String(urlResourceId) : true;
    const resourceName = getResourceName(ticket.resourceId);
    const matchSearch = searchQuery 
        ? ticket.category?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
    return matchStatus && matchPriority && matchUrlResource && matchSearch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || priorityFilter !== '';

  // Stats Card Component
  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pb-16 font-sans">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pb-32 pt-16 px-6 shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 left-10 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-indigo-300/20 rounded-full blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    {urlResourceId ? getResourceName(urlResourceId) : 'Incident Management'}
                  </h1>
                  <p className="text-indigo-100 text-lg mt-1">
                    {urlResourceId ? 'Viewing incidents for this facility' : 'Track and resolve facility issues efficiently'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {urlResourceId && (
                <button 
                  onClick={() => navigate('/incidents')} 
                  className="group bg-white/15 backdrop-blur-md text-white border border-white/30 py-3 px-6 rounded-xl hover:bg-white/25 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  All Incidents
                </button>
              )}
              <Link 
                to={`/incidents/new${urlResourceId ? `?resourceId=${urlResourceId}` : ''}`}
                className="group bg-white text-indigo-600 py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-bold flex items-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Report Incident</span>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          {!loading && incidents.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <StatCard title="Total Incidents" value={stats.total} icon="📊" color="bg-indigo-100" />
              <StatCard title="Active Issues" value={stats.open} icon="⚠️" color="bg-amber-100" />
              <StatCard title="High Priority" value={stats.critical} icon="🔥" color="bg-red-100" />
              <StatCard title="Resolved" value={stats.resolved} icon="🎯" color="bg-emerald-100" />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl -mt-12 px-4 relative z-20">
        {/* Enhanced Filters Section */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search incidents by resource, category, or description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  className="appearance-none py-3.5 pl-4 pr-10 bg-gray-50 border-2 border-gray-100 text-gray-700 rounded-xl min-w-[160px] focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium cursor-pointer hover:bg-gray-100"
                >
                  <option value="">📋 All Status</option>
                  <option value="OPEN">🟡 Open</option>
                  <option value="IN_PROGRESS">🔵 In Progress</option>
                  <option value="RESOLVED">✅ Resolved</option>
                  <option value="CLOSED">✔️ Closed</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)} 
                  className="appearance-none py-3.5 pl-4 pr-10 bg-gray-50 border-2 border-gray-100 text-gray-700 rounded-xl min-w-[170px] focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium cursor-pointer hover:bg-gray-100"
                >
                  <option value="">🎯 All Priorities</option>
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {hasActiveFilters && (
                <button 
                  onClick={clearFilters} 
                  className="py-3.5 px-6 text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-red-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  🔍 Search: {searchQuery}
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  Status: {statusFilter}
                </span>
              )}
              {priorityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                  Priority: {priorityFilter}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-2">
                {filteredIncidents.length} {filteredIncidents.length === 1 ? 'result' : 'results'} found
              </span>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredIncidents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIncidents.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  const priorityConfig = getPriorityConfig(ticket.priority);
                  
                  return (
                    <div 
                      key={ticket.id} 
                      onClick={() => navigate(`/incidents/${ticket.id}`)} 
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-200 flex flex-col"
                    >
                      {/* Priority Bar */}
                      <div className={`h-1.5 w-full ${priorityConfig.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{priorityConfig.icon}</span>
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${statusConfig.color} border shadow-sm`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            #{ticket.id}
                          </span>
                        </div>
                        
                        {/* Title and Category */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {getResourceName(ticket.resourceId)}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.bgLight} ${priorityConfig.text}`}>
                            <span>{priorityConfig.icon}</span>
                            {ticket.priority}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            📂 {ticket.category || 'Uncategorized'}
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {ticket.description || "No description provided for this incident."}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            {/* User Info */}
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                  {ticket.reportedByUserId ? ticket.reportedByUserId.slice(0, 2).toUpperCase() : 'A'}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${ticket.status === 'OPEN' ? 'bg-amber-400' : ticket.status === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                                  {ticket.reportedByUserId || 'Anonymous'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Attachments Badge */}
                            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600">
                                  {ticket.attachmentUrls.length}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Time Info */}
                          <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {ticket.updatedAt ? `Updated ${new Date(ticket.updatedAt).toLocaleDateString()}` : `Created ${new Date(ticket.createdAt).toLocaleDateString()}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 mb-6 shadow-inner">
                  <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">No Incidents Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                  {hasActiveFilters 
                    ? "No incidents match your current filters. Try adjusting your search criteria."
                    : "Everything looks good! There are no incidents to display at the moment."}
                </p>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default IncidentList;