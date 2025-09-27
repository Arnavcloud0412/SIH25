'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Upload, MapPin, Lightbulb, FileText, Users, TreePine, Droplets, CheckCircle, Clock, AlertCircle,
  Search, Filter, Download, Settings, TrendingUp, Eye, ArrowRight, ArrowLeft, Edit, Trash2,
  Layers, ZoomIn, ZoomOut, BarChart3, PieChart, Activity, Bell, User, Shield, Database,
  Globe, Smartphone, Wifi, WifiOff, RefreshCw, Plus, Minus, X, Save, Send, MessageSquare,
  FileCheck, FileX, FileEdit, History, Lock, Unlock, Key, Mail, Phone, Map, Satellite,
  Target, Zap, Brain, Cpu, HardDrive, Network, Cloud, CloudOff, Star, Award, Trophy
} from 'lucide-react';

// Enhanced mock data for demonstration
const mockClaims = [
  {
    id: '1',
    claimant_name: 'Ram Singh',
    village: 'Bharatpur',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    status: 'Submitted',
    land_area: '2.5 acres',
    created_at: '2025-01-15',
    tribal_group: 'Gond',
    claim_type: 'Individual Forest Rights (IFR)',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    assets: ['Agricultural land', 'Pond', 'Forest area'],
    documents: ['Land certificate', 'Identity proof'],
    review_stage: 'Initial Review',
    last_updated: '2025-01-15',
    version: 1
  },
  {
    id: '2',
    claimant_name: 'Sita Devi',
    village: 'Agartala',
    district: 'West Tripura',
    state: 'Tripura',
    status: 'Under Review',
    land_area: '1.8 acres',
    created_at: '2025-01-10',
    tribal_group: 'Tripuri',
    claim_type: 'Community Forest Rights (CFR)',
    coordinates: { lat: 23.8315, lng: 91.2868 },
    assets: ['Community forest', 'Water source'],
    documents: ['Community certificate', 'Village resolution'],
    review_stage: 'Field Verification',
    last_updated: '2025-01-12',
    version: 2
  },
  {
    id: '3',
    claimant_name: 'Lakshmi Bai',
    village: 'Koraput',
    district: 'Koraput',
    state: 'Odisha',
    status: 'Approved',
    land_area: '3.2 acres',
    created_at: '2025-01-05',
    tribal_group: 'Kondh',
    claim_type: 'Individual Forest Rights (IFR)',
    coordinates: { lat: 18.8067, lng: 82.7108 },
    assets: ['Forest land', 'Agricultural plot', 'Water body'],
    documents: ['Approved certificate', 'Land records'],
    review_stage: 'Completed',
    last_updated: '2025-01-20',
    version: 1
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fra-mitra.com',
    role: 'admin',
    permissions: ['view_all', 'edit_all', 'approve_claims', 'manage_users']
  },
  {
    id: '2',
    name: 'Field Officer',
    email: 'field@fra-mitra.com',
    role: 'field_officer',
    permissions: ['view_assigned', 'edit_assigned', 'verify_claims']
  },
  {
    id: '3',
    name: 'NGO Representative',
    email: 'ngo@fra-mitra.com',
    role: 'ngo',
    permissions: ['view_aggregated', 'generate_reports']
  }
];

const mockAnalytics = {
  totalClaims: 1247,
  approvedClaims: 892,
  pendingClaims: 203,
  rejectedClaims: 152,
  tribalGroupsCount: 45,
  forestAreasCount: 23,
  totalArea: 15420.5,
  approvalRate: 71.5,
  avgProcessingTime: 45,
  monthlyTrend: [
    { month: 'Jan', claims: 89, approved: 67 },
    { month: 'Feb', claims: 112, approved: 84 },
    { month: 'Mar', claims: 98, approved: 71 },
    { month: 'Apr', claims: 134, approved: 95 },
    { month: 'May', claims: 156, approved: 112 },
    { month: 'Jun', claims: 142, approved: 98 }
  ]
};

const mockWaterBodies = [
  {
    id: 'wb_001',
    name: 'Betwa River',
    type: 'River',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    lat: 23.2599,
    lng: 77.4126,
    description: 'Major river in Madhya Pradesh'
  },
  {
    id: 'wb_002',
    name: 'Gomati River',
    type: 'River',
    state: 'Tripura',
    district: 'West Tripura',
    lat: 23.8315,
    lng: 91.2868,
    description: 'Principal river of Tripura'
  }
];

const mockRecommendations = [
  {
    scheme_name: 'DAJGUA (Development of Antyodaya and Janjati Gram Utkarsh Abhiyan)',
    description: 'Focused development program for tribal villages',
    eligibility: 'Scheduled Tribe communities in selected villages',
    priority: 'High'
  },
  {
    scheme_name: 'Jal Shakti Mission - Borewell Program',
    description: 'Water security through borewells in water-stressed areas',
    eligibility: 'Villages with low water index',
    priority: 'High'
  },
  {
    scheme_name: 'Forest Rights Act - Community Forest Resource Rights',
    description: 'Rights over community forest resources for traditional forest dwellers',
    eligibility: 'Traditional forest dwelling communities',
    priority: 'High'
  },
  {
    scheme_name: 'PM-JANMAN (PM Janjati Adivasi Nyaya Maha Abhiyan)',
    description: 'Comprehensive scheme for tribal welfare and development',
    eligibility: 'Particularly Vulnerable Tribal Groups (PVTGs)',
    priority: 'Medium'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'map' | 'dss' | 'analytics' | 'admin' | 'profile'>('form');
  const [newClaimId, setNewClaimId] = useState<string | null>(null);
  const [claims, setClaims] = useState(mockClaims);
  const [formData, setFormData] = useState({
    claimant_name: '',
    spouse_name: '',
    father_mother_name: '',
    address: '',
    village: '',
    gram_panchayat: '',
    tehsil_taluka: '',
    district: '',
    state: '',
    scheduled_tribe: '',
    other_traditional_forest_dweller: '',
    family_members: '',
    land_area: '',
    tribal_group: '',
    claim_type: 'Individual Forest Rights (IFR)'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractionAccuracy, setExtractionAccuracy] = useState<number>(0);
  const [showAccuracy, setShowAccuracy] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    state: 'All',
    status: 'All',
    tribalGroup: 'All',
    claimType: 'All'
  });
  const [mapLayers, setMapLayers] = useState({
    claims: true,
    waterBodies: true,
    forestCover: false,
    assets: false,
    heatmap: false
  });
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'info', message: 'New claim submitted by Ram Singh', time: '2 hours ago' },
    { id: '2', type: 'success', message: 'Claim #1234 approved', time: '4 hours ago' },
    { id: '3', type: 'warning', message: 'Field verification required for claim #1235', time: '6 hours ago' }
  ]);
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', user: 'Admin User', action: 'Approved claim #1234', timestamp: '2025-01-20 14:30', ip: '192.168.1.1' },
    { id: '2', user: 'Field Officer', action: 'Updated claim #1235', timestamp: '2025-01-20 13:45', ip: '192.168.1.2' },
    { id: '3', user: 'Ram Singh', action: 'Submitted new claim', timestamp: '2025-01-20 12:15', ip: '192.168.1.3' }
  ]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole') || 'claimant';

    if (!isLoggedIn || !userEmail) {
      router.push('/signin');
      return;
    }

    setUser({
      name: userName || 'User',
      email: userEmail,
      role: userRole
    });

    // Initialize profile data
    setProfileData({
      name: userName || 'User',
      email: userEmail,
      role: userRole
    });

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to backend for Gemini processing
      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Auto-populate form with extracted data
        setFormData(prev => ({
          ...prev,
          ...result.extractedData
        }));
        
        setExtractionAccuracy(result.accuracy);
      } else {
        alert(`Error processing document: ${result.error}`);
      }
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error processing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      
      // Add all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      // Send to backend for bulk processing
      const response = await fetch('/api/process-documents-bulk', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Bulk processing completed! Processed ${result.processedCount} documents successfully.`);
        // Optionally refresh claims list or show results
      } else {
        alert(`Bulk processing failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      alert('Error processing documents. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimEdit = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      setFormData({
        claimant_name: claim.claimant_name,
        village: claim.village,
        district: claim.district,
        state: claim.state,
        land_area: claim.land_area,
        tribal_group: claim.tribal_group,
        claim_type: claim.claim_type,
        spouse_name: '',
        father_mother_name: '',
        address: '',
        gram_panchayat: '',
        tehsil_taluka: '',
        scheduled_tribe: '',
        other_traditional_forest_dweller: '',
        family_members: ''
      });
      setActiveTab('form');
    }
  };

  const handleClaimWithdraw = (claimId: string) => {
    if (confirm('Are you sure you want to withdraw this claim?')) {
      alert(`Claim ${claimId} withdrawn successfully.`);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedFilters.state === 'All' || claim.state === selectedFilters.state;
    const matchesStatus = selectedFilters.status === 'All' || claim.status === selectedFilters.status;
    const matchesTribalGroup = selectedFilters.tribalGroup === 'All' || claim.tribal_group === selectedFilters.tribalGroup;
    const matchesClaimType = selectedFilters.claimType === 'All' || claim.claim_type === selectedFilters.claimType;
    
    return matchesSearch && matchesState && matchesStatus && matchesTribalGroup && matchesClaimType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add the new claim to the claims list
    const newClaim = {
      id: `claim-${Date.now()}`,
      claimant_name: formData.claimant_name,
      village: formData.village,
      district: formData.district,
      state: formData.state,
      status: 'Submitted',
      land_area: formData.land_area,
      created_at: new Date().toISOString().split('T')[0],
      tribal_group: formData.tribal_group,
      claim_type: formData.claim_type,
      coordinates: {
        lat: 23.8315 + (Math.random() - 0.5) * 0.1, // Random coordinates around Tripura
        lng: 91.2862 + (Math.random() - 0.5) * 0.1
      },
      assets: [],
      documents: [],
      version: 1,
      last_updated: new Date().toISOString().split('T')[0],
      submitted_by: user?.name || 'Unknown',
      review_stage: 'Initial Review'
    };
    
    setClaims(prev => [newClaim, ...prev]);
    setNewClaimId(newClaim.id);
    
    // Reset form
    setFormData({
      claimant_name: '',
      spouse_name: '',
      father_mother_name: '',
      address: '',
      village: '',
      gram_panchayat: '',
      tehsil_taluka: '',
      district: '',
      state: '',
      scheduled_tribe: '',
      other_traditional_forest_dweller: '',
      family_members: '',
      land_area: '',
      tribal_group: '',
      claim_type: 'Individual Forest Rights (IFR)'
    });
    setUploadedFile(null);
    setShowAccuracy(false);
    setExtractionAccuracy(0);
    
    // Redirect to Claims Map tab
    setActiveTab('map');
  };

  const loadRecommendations = (claimId: string) => {
    setSelectedClaim(claimId);
    setRecommendations(mockRecommendations);
    setActiveTab('dss');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under review':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Image 
                  src="/logo.png" 
                  alt="FRA-Mitra Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FRA-Mitra</h1>
                <p className="text-sm text-slate-500">AI-Powered FRA Atlas & DSS</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userName');
                  router.push('/');
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'form'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Claim
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'map'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Claims Map
            </button>
            <button
              onClick={() => setActiveTab('dss')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'dss'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Decision Support
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            {(user?.role === 'admin' || user?.role === 'field_officer') && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submit Claim Tab */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Forest Rights Act Claim</h2>
              <p className="text-gray-600">Upload your FRA claim document and fill in the required information</p>
            </div>

            {/* Document Upload Section */}
            <div className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Upload (Optional)</h3>
                <p className="text-gray-600 mb-4">Upload your FRA claim document (PDF, JPEG, PNG) to auto-populate the form using Gemini AI</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {isProcessing && (
                  <div className="mt-4 flex items-center justify-center text-emerald-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                    Processing document with Gemini AI...
                  </div>
                )}
                {uploadedFile && !isProcessing && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-800">✅ Uploaded: {uploadedFile.name}</p>
                    <p className="text-emerald-700 text-sm">📄 Data extracted and auto-populated in form</p>
                    {extractionAccuracy > 0 && (
                      <p className="text-emerald-700 text-sm">🎯 Extraction Accuracy: {extractionAccuracy}%</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bulk Upload for Admins */}
            {user?.role === 'admin' && (
              <div className="mb-8 p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="text-center">
                  <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Upload (Admin Only)</h3>
                  <p className="text-gray-600 mb-4">Upload multiple scanned documents for batch processing with Gemini AI</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleBulkUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            )}

            {/* Claim Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name of the Claimant(s) *
                  </label>
                  <input
                    type="text"
                    name="claimant_name"
                    value={formData.claimant_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name of the Spouse
                  </label>
                  <input
                    type="text"
                    name="spouse_name"
                    value={formData.spouse_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name of Father/Mother *
                  </label>
                  <input
                    type="text"
                    name="father_mother_name"
                    value={formData.father_mother_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gram Panchayat *
                  </label>
                  <input
                    type="text"
                    name="gram_panchayat"
                    value={formData.gram_panchayat}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tehsil/Taluka *
                  </label>
                  <input
                    type="text"
                    name="tehsil_taluka"
                    value={formData.tehsil_taluka}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="">Select State</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="">Select District</option>
                    {formData.state === 'Madhya Pradesh' && (
                      <>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Gwalior">Gwalior</option>
                      </>
                    )}
                    {formData.state === 'Tripura' && (
                      <>
                        <option value="West Tripura">West Tripura</option>
                        <option value="North Tripura">North Tripura</option>
                        <option value="South Tripura">South Tripura</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Tribe
                  </label>
                  <select
                    name="scheduled_tribe"
                    value={formData.scheduled_tribe}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Traditional Forest Dweller
                  </label>
                  <select
                    name="other_traditional_forest_dweller"
                    value={formData.other_traditional_forest_dweller}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Members (Names and Ages)
                  </label>
                  <textarea
                    name="family_members"
                    value={formData.family_members}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List family members with their ages"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Area (if applicable)
                  </label>
                  <input
                    type="text"
                    name="land_area"
                    value={formData.land_area}
                    onChange={handleInputChange}
                    placeholder="e.g., 2.5 acres"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tribal Group
                  </label>
                  <select
                    name="tribal_group"
                    value={formData.tribal_group}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="">Select Tribal Group</option>
                    <option value="Gond">Gond</option>
                    <option value="Tripuri">Tripuri</option>
                    <option value="Kondh">Kondh</option>
                    <option value="Bhil">Bhil</option>
                    <option value="Santal">Santal</option>
                    <option value="Munda">Munda</option>
                    <option value="Oraon">Oraon</option>
                    <option value="Ho">Ho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Type
                  </label>
                  <select
                    name="claim_type"
                    value={formData.claim_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  >
                    <option value="Individual Forest Rights (IFR)">Individual Forest Rights (IFR)</option>
                    <option value="Community Forest Rights (CFR)">Community Forest Rights (CFR)</option>
                    <option value="Habitat Rights">Habitat Rights</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Claims Map Tab */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced WebGIS & Mapping</h2>
              <p className="text-gray-600">Interactive GIS map with layer toggling, search, and asset mapping</p>
            </div>

            {/* Map Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, claims: !prev.claims }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mapLayers.claims ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Claims
                </button>
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, waterBodies: !prev.waterBodies }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mapLayers.waterBodies ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Water Bodies
                </button>
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, forestCover: !prev.forestCover }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mapLayers.forestCover ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Forest Cover
                </button>
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, assets: !prev.assets }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mapLayers.assets ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Assets
                </button>
                <button
                  onClick={() => setMapLayers(prev => ({ ...prev, heatmap: !prev.heatmap }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mapLayers.heatmap ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Heatmap
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900"
                  />
                </div>
                <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="mb-8 h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-50"></div>
              
              {/* Map Markers */}
              <div className="relative h-full">
                {claims.map((claim, index) => {
                  if (!claim.coordinates) return null;
                  
                  const x = 20 + (claim.coordinates.lng - 91.2) * 200; // Convert lng to x position
                  const y = 20 + (23.9 - claim.coordinates.lat) * 200; // Convert lat to y position
                  
                  return (
                    <div
                      key={claim.id}
                      className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
                        claim.id === newClaimId ? 'bg-red-500 animate-pulse' : 
                        claim.status === 'Submitted' ? 'bg-green-500' :
                        claim.status === 'Under Review' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      title={`${claim.claimant_name} - ${claim.village}, ${claim.district}`}
                      onMouseEnter={(e) => {
                        const tooltip = document.getElementById(`tooltip-${claim.id}`);
                        if (tooltip) {
                          tooltip.style.display = 'block';
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = document.getElementById(`tooltip-${claim.id}`);
                        if (tooltip) {
                          tooltip.style.display = 'none';
                        }
                      }}
                    >
                      {/* Tooltip */}
                      <div
                        id={`tooltip-${claim.id}`}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 hidden"
                        style={{ display: 'none' }}
                      >
                        <div className="font-semibold">{claim.claimant_name}</div>
                        <div>{claim.village}, {claim.district}</div>
                        <div>Status: {claim.status}</div>
                        <div>Area: {claim.land_area}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Map Info Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Claims Map</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Submitted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Under Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">New Claim</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600">Other</span>
                  </div>
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button 
                  className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
                  onClick={() => {
                    // Zoom to new claim if it exists
                    if (newClaimId) {
                      const newClaim = claims.find(c => c.id === newClaimId);
                      if (newClaim && newClaim.coordinates) {
                        // Simulate zoom by highlighting the new claim
                        setTimeout(() => setNewClaimId(null), 3000);
                      }
                    }
                  }}
                >
                  <ZoomIn className="h-4 w-4 text-gray-600" />
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
                  <ZoomOut className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              {/* Map Layer Controls */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Layers</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={mapLayers.claims} onChange={() => setMapLayers(prev => ({ ...prev, claims: !prev.claims }))} />
                    <span className="text-sm">Claims</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={mapLayers.waterBodies} onChange={() => setMapLayers(prev => ({ ...prev, waterBodies: !prev.waterBodies }))} />
                    <span className="text-sm">Water Bodies</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={mapLayers.forestCover} onChange={() => setMapLayers(prev => ({ ...prev, forestCover: !prev.forestCover }))} />
                    <span className="text-sm">Forest Cover</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={mapLayers.assets} onChange={() => setMapLayers(prev => ({ ...prev, assets: !prev.assets }))} />
                    <span className="text-sm">Assets</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Enhanced Claims List with Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Claims ({filteredClaims.length})</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={selectedFilters.state}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, state: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                      >
                        <option value="All">All States</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Odisha">Odisha</option>
                      </select>
                      <select
                        value={selectedFilters.status}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                      >
                        <option value="All">All Status</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{claim.claimant_name}</h4>
                          <p className="text-sm text-gray-600">{claim.village}, {claim.district}</p>
                          <p className="text-sm text-gray-500">{claim.state}</p>
                          <p className="text-sm text-gray-500">{claim.tribal_group} • {claim.claim_type}</p>
                          {claim.land_area && (
                            <p className="text-sm text-gray-500">Land: {claim.land_area}</p>
                          )}
                          <p className="text-xs text-gray-400">Version {claim.version} • Updated {claim.last_updated}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(claim.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Assets */}
                      {claim.assets && claim.assets.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Assets:</p>
                          <div className="flex flex-wrap gap-1">
                            {claim.assets.map((asset, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {asset}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => loadRecommendations(claim.id)}
                          className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                        >
                          View Schemes
                        </button>
                        {claim.status === 'Submitted' && (
                          <>
                            <button
                              onClick={() => handleClaimEdit(claim.id)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleClaimWithdraw(claim.id)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Water Bodies</h3>
                <div className="space-y-4">
                  {mockWaterBodies.map((waterbody) => (
                    <div key={waterbody.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <Droplets className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{waterbody.name}</h4>
                          <p className="text-sm text-gray-600">{waterbody.type}</p>
                          <p className="text-sm text-gray-500">{waterbody.district}, {waterbody.state}</p>
                          <p className="text-sm text-gray-500">{waterbody.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decision Support System Tab */}
        {activeTab === 'dss' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Intelligent Decision Support System</h2>
              <p className="text-gray-600">AI-powered scheme recommendations with eligibility checking and simulation tools</p>
            </div>

            {!selectedClaim ? (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Scheme Eligibility Checker */}
                  <div className="lg:col-span-2 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center mb-4">
                      <Target className="h-6 w-6 text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Scheme Eligibility Checker</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Check eligibility for CSS schemes based on claim data</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium">PM-KISAN</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Eligible</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium">Jal Jeevan Mission</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Partially Eligible</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium">MGNREGA</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Eligible</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Tool */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <Brain className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Simulation Tool</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Simulate interventions and their impact</p>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Run Simulation
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-6">Select a Claim for Detailed Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {claims.map((claim) => (
                    <div key={claim.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{claim.claimant_name}</h4>
                          <p className="text-sm text-gray-600">{claim.village}, {claim.district}</p>
                          <p className="text-sm text-gray-500">{claim.state}</p>
                          <p className="text-sm text-gray-500">{claim.tribal_group}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                      <button
                        onClick={() => loadRecommendations(claim.id)}
                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                      >
                        Get Recommendations
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Personalized Scheme Recommendations</h3>
                  <button
                    onClick={() => {
                      setSelectedClaim(null);
                      setRecommendations([]);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    ← Back to Claims
                  </button>
                </div>

                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex-1">{rec.scheme_name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} Priority
                          </span>
                          <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">Eligibility:</span> {rec.eligibility}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">One-click application available</span>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                          Apply Now →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reporting</h2>
              <p className="text-gray-600">Real-time analytics, trend analysis, and custom reports</p>
            </div>

            {/* Analytics Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Claims</p>
                    <p className="text-2xl font-bold text-emerald-600">{mockAnalytics.totalClaims}</p>
                    <p className="text-xs text-gray-500">+12% from last month</p>
                  </div>
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-green-600">{mockAnalytics.approvalRate}%</p>
                    <p className="text-xs text-gray-500">Above target</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                    <p className="text-2xl font-bold text-blue-600">{mockAnalytics.avgProcessingTime} days</p>
                    <p className="text-xs text-gray-500">Within SLA</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tribal Groups</p>
                    <p className="text-2xl font-bold text-purple-600">{mockAnalytics.tribalGroupsCount}</p>
                    <p className="text-xs text-gray-500">Active communities</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Charts and Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Pie chart visualization would be implemented here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Generator */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                  <option>Select Report Type</option>
                  <option>FRA Progress Report</option>
                  <option>District-wise Analysis</option>
                  <option>Scheme Implementation</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                  <option>Select Time Period</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
                <button className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && (user?.role === 'admin' || user?.role === 'field_officer') && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
              <p className="text-gray-600">User management, approval workflows, and system administration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Management */}
              <div className="lg:col-span-2 p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs */}
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h3>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{log.user}</p>
                      <p className="text-xs text-gray-600">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h2>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <button 
                  onClick={() => {
                    // Update user data and localStorage
                    if (user) {
                      setUser({
                        ...user,
                        name: profileData.name,
                        email: profileData.email
                      });
                    }
                    localStorage.setItem('userName', profileData.name);
                    localStorage.setItem('userEmail', profileData.email);
                    alert('Profile updated successfully!');
                  }}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Update Profile
                </button>
              </div>

              {/* Notifications */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Bell className="h-5 w-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}