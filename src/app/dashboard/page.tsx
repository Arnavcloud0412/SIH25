'use client';

import { useState } from 'react';
import {
  Map,
  BarChart3,
  Users,
  TreePine,
  FileText,
  Filter,
  Search,
  Download,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { dashboardStats, mockFRAClaims, mockTribalGroups } from '@/data/mockData';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/signin');
    } else {
      setUserEmail(email || 'User');
    }
  }, [router]);
  const [selectedFilters, setSelectedFilters] = useState({
    state: 'All',
    tribalGroup: 'All',
    status: 'All',
    claimType: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = mockFRAClaims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedFilters.state === 'All' || claim.state === selectedFilters.state;
    const matchesTribalGroup = selectedFilters.tribalGroup === 'All' || claim.tribalGroup === selectedFilters.tribalGroup;
    const matchesStatus = selectedFilters.status === 'All' || claim.status === selectedFilters.status;
    const matchesClaimType = selectedFilters.claimType === 'All' || claim.claimType === selectedFilters.claimType;

    return matchesSearch && matchesState && matchesTribalGroup && matchesStatus && matchesClaimType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Under Review': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Community': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Habitat': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusData = [
    { status: 'Approved', count: dashboardStats.approvedClaims, color: 'bg-green-500' },
    { status: 'Pending', count: dashboardStats.pendingClaims, color: 'bg-yellow-500' },
    { status: 'Rejected', count: dashboardStats.rejectedClaims, color: 'bg-red-500' },
    { status: 'Under Review', count: mockFRAClaims.filter(c => c.status === 'Under Review').length, color: 'bg-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <TreePine className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">FRA-Mitra</h1>
                  <p className="text-sm text-slate-500">AI-Powered FRA Atlas & DSS</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Claims</p>
                <p className="text-2xl font-bold text-slate-900">{dashboardStats.totalClaims}</p>
                <p className="text-xs text-slate-500">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{dashboardStats.approvedClaims}</p>
                <p className="text-xs text-slate-500">{Math.round((dashboardStats.approvedClaims / dashboardStats.totalClaims) * 100)}% success rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tribal Groups</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.tribalGroupsCount}</p>
                <p className="text-xs text-slate-500">Across 3 states</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-xl">
                <TreePine className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Forest Areas</p>
                <p className="text-2xl font-bold text-teal-600">{dashboardStats.forestAreasCount}</p>
                <p className="text-xs text-slate-500">{dashboardStats.totalArea.toFixed(1)} ha covered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Claims Status Distribution</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusData.map((item) => (
              <div key={item.status} className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{item.count}</span>
                </div>
                <p className="text-sm font-medium text-slate-600">{item.status}</p>
                <p className="text-xs text-slate-500">
                  {Math.round((item.count / dashboardStats.totalClaims) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search claims by name, village, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <select
                    value={selectedFilters.state}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="All">All States</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Jharkhand">Jharkhand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tribal Group</label>
                  <select
                    value={selectedFilters.tribalGroup}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, tribalGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="All">All Groups</option>
                    {mockTribalGroups.map(group => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Claim Type</label>
                  <select
                    value={selectedFilters.claimType}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, claimType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Individual">Individual</option>
                    <option value="Community">Community</option>
                    <option value="Habitat">Habitat</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">FRA Claims ({filteredClaims.length})</h3>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Claimant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tribal Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Area (ha)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{claim.claimantName}</div>
                        <div className="text-sm text-slate-500">ID: {claim.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-slate-900">{claim.village}</div>
                        <div className="text-sm text-slate-500">{claim.district}, {claim.state}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {claim.tribalGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getClaimTypeColor(claim.claimType)}`}>
                        {claim.claimType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        <span className="ml-1">{claim.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {claim.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
