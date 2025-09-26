'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, MapPin, Lightbulb, FileText, Users, TreePine, Droplets, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Mock data for demonstration
const mockClaims = [
  {
    id: '1',
    claimant_name: 'Ram Singh',
    village: 'Bharatpur',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    status: 'Submitted',
    land_area: '2.5 acres',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    claimant_name: 'Sita Devi',
    village: 'Agartala',
    district: 'West Tripura',
    state: 'Tripura',
    status: 'Under Review',
    land_area: '1.8 acres',
    created_at: '2025-01-10'
  }
];

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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'map' | 'dss'>('form');
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
    land_area: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!isLoggedIn || !userEmail) {
      router.push('/signin');
      return;
    }

    setUser({
      name: userName || 'User',
      email: userEmail
    });
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        // Auto-populate some fields for demo
        setFormData(prev => ({
          ...prev,
          claimant_name: 'Ram Singh',
          village: 'Bharatpur',
          district: 'Bhopal',
          state: 'Madhya Pradesh'
        }));
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Claim submitted successfully! (Demo mode)');
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
      land_area: ''
    });
    setUploadedFile(null);
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
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'form'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Claim
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Claims Map
            </button>
            <button
              onClick={() => setActiveTab('dss')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dss'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Decision Support
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
                <p className="text-gray-600 mb-4">Upload your FRA claim document (PDF, JPEG, PNG) to auto-populate the form</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {isProcessing && (
                  <div className="mt-4 flex items-center justify-center text-emerald-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                    Processing document...
                  </div>
                )}
                {uploadedFile && !isProcessing && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-800">✅ Uploaded: {uploadedFile.name}</p>
                    <p className="text-emerald-700 text-sm">📄 Data extracted and auto-populated in form</p>
                  </div>
                )}
              </div>
            </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Claims Visualization Map</h2>
              <p className="text-gray-600">View all submitted claims and water bodies on an interactive map</p>
            </div>

            {/* Map Container */}
            <div className="mb-8 h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive GIS Map</h3>
                <p className="text-gray-600 mb-4">Map visualization would be implemented here using Leaflet or similar mapping library</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Submitted Claims</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Under Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Water Bodies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Claims</h3>
                <div className="space-y-4">
                  {mockClaims.map((claim) => (
                    <div key={claim.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{claim.claimant_name}</h4>
                          <p className="text-sm text-gray-600">{claim.village}, {claim.district}</p>
                          <p className="text-sm text-gray-500">{claim.state}</p>
                          {claim.land_area && (
                            <p className="text-sm text-gray-500">Land: {claim.land_area}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(claim.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => loadRecommendations(claim.id)}
                        className="mt-3 w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        View Schemes
                      </button>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Decision Support System</h2>
              <p className="text-gray-600">Get AI-powered recommendations for government schemes based on your claim data</p>
            </div>

            {!selectedClaim ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Select a Claim for Scheme Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockClaims.map((claim) => (
                    <div key={claim.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{claim.claimant_name}</h4>
                          <p className="text-sm text-gray-600">{claim.village}, {claim.district}</p>
                          <p className="text-sm text-gray-500">{claim.state}</p>
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
                  <h3 className="text-xl font-semibold text-gray-900">Scheme Recommendations</h3>
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Eligibility:</span> {rec.eligibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}