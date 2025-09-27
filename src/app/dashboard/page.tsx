'use client';

import { useState, useEffect, useRef } from 'react';
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
import AlertModal from '@/components/AlertModal';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

// Mock data for admin panel
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Field Officer', email: 'officer@example.com', role: 'field_officer' },
  { id: '3', name: 'Ram Singh', email: 'ram@example.com', role: 'claimant' }
];

// Claims will be fetched from database

// Users will be fetched from database

// Analytics will be fetched from database

// Water bodies will be fetched from database

// Recommendations will be fetched from database

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'map' | 'dss' | 'analytics' | 'admin' | 'profile'>('form');
  const [newClaimId, setNewClaimId] = useState<string | null>(null);
  
  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });
  const [claims, setClaims] = useState<any[]>([]);
  const [documents, setDocuments] = useState([]);
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
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [justLoadedRecommendations, setJustLoadedRecommendations] = useState(false);

  // Track component renders
  const renderCount = useRef(0);
  renderCount.current += 1;

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mapLayers, setMapLayers] = useState({
    claims: true,
    waterBodies: true,
    forestCover: false,
    assets: false,
    heatmap: false
  });
  const [isOnline, setIsOnline] = useState(true);
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', user: 'Admin User', action: 'Approved claim #1234', timestamp: '2025-01-20 14:30', ip: '192.168.1.1' },
    { id: '2', user: 'Field Officer', action: 'Updated claim #1235', timestamp: '2025-01-20 13:45', ip: '192.168.1.2' },
    { id: '3', user: 'Ram Singh', action: 'Submitted new claim', timestamp: '2025-01-20 12:15', ip: '192.168.1.3' }
  ]);

  // Function to calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Function to get nearby features within 10km radius
  const getNearbyFeatures = (claimLat: number, claimLng: number) => {
    const features = [
      // Water bodies
      { name: 'Kanha River', type: 'River', lat: 23.8315, lng: 91.2862, category: 'water' },
      { name: 'Pench Reservoir', type: 'Reservoir', lat: 23.8415, lng: 91.2962, category: 'water' },
      { name: 'Bhoramdeo Lake', type: 'Lake', lat: 23.8215, lng: 91.2762, category: 'water' },
      { name: 'Mandla Stream', type: 'Stream', lat: 23.8515, lng: 91.3062, category: 'water' },
      
      // Forest areas
      { name: 'Kanha National Park', type: 'Forest', lat: 23.8015, lng: 91.2562, category: 'forest' },
      { name: 'Pench Tiger Reserve', type: 'Forest', lat: 23.8615, lng: 91.3162, category: 'forest' },
      { name: 'Bhoramdeo Wildlife Sanctuary', type: 'Forest', lat: 23.8115, lng: 91.2662, category: 'forest' },
      
      // Agricultural areas
      { name: 'Rice Fields', type: 'Agriculture', lat: 23.8415, lng: 91.2862, category: 'agriculture' },
      { name: 'Wheat Fields', type: 'Agriculture', lat: 23.8215, lng: 91.3062, category: 'agriculture' },
      { name: 'Vegetable Farms', type: 'Agriculture', lat: 23.8515, lng: 91.2762, category: 'agriculture' }
    ];

    return features
      .map(feature => ({
        ...feature,
        distance: calculateDistance(claimLat, claimLng, feature.lat, feature.lng)
      }))
      .filter(feature => feature.distance <= 10) // Within 10km radius
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 6); // Show top 6 nearby features
  };

  // Helper function to show alert modal
  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Helper function to close alert modal
  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };
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

    // Fetch claims from database
    const fetchClaims = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No userId found in localStorage');
          setClaims([]);
          return;
        }
        
        const response = await fetch(`/api/claims?userId=${userId}`);
        const result = await response.json();
        
        if (result.success) {
          // Transform database claims to match the expected format
          const transformedClaims = result.data.map((claim: any) => ({
            id: claim.id,
            claimant_name: claim.claimantName,
            village: claim.village,
            district: claim.district,
            state: claim.state,
            status: claim.status,
            land_area: claim.amount ? `${claim.amount} acres` : '',
            created_at: claim.createdAt.split('T')[0],
            tribal_group: 'Gond', // Default for now
            claim_type: claim.category,
            coordinates: {
              lat: 23.8315 + (Math.random() - 0.5) * 0.1,
              lng: 91.2862 + (Math.random() - 0.5) * 0.1
            },
          assets: [],
          documents: documents.filter((doc: any) => doc.claimId === claim.id).map((doc: any) => doc.originalName) || [],
            review_stage: 'Initial Review',
            last_updated: claim.updatedAt.split('T')[0],
            version: 1,
            submitted_by: claim.user?.name || 'Unknown'
          }));
          
          setClaims(transformedClaims);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        // Fallback to empty array if API fails
        setClaims([]);
      }
    };

    fetchClaims();
    
    // Fetch documents
    const fetchDocuments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No userId found in localStorage');
          setDocuments([]);
          return;
        }
        
        const response = await fetch(`/api/documents?userId=${userId}`);
        const result = await response.json();
        
        if (result.success) {
          setDocuments(result.data);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      }
    };

    fetchDocuments();

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
        
        // Store the processed document info for later database save
        // Keep the original file object and store additional data separately
        const fileWithData = Object.assign(file, {
          processedData: result.extractedData,
          accuracy: result.accuracy,
          extractedText: result.rawResponse
        });
        setUploadedFile(fileWithData);
      } else {
        showAlert('Document Processing Error', `Error processing document: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      showAlert('Document Processing Error', 'Error processing document. Please try again.', 'error');
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
        showAlert('Bulk Processing Complete', `Bulk processing completed! Processed ${result.processedCount} documents successfully.`, 'success');
        // Optionally refresh claims list or show results
      } else {
        showAlert('Bulk Processing Failed', `Bulk processing failed: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      showAlert('Bulk Processing Error', 'Error processing documents. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimEdit = (claimId: string) => {
    const claim = claims.find((c: any) => c.id === claimId);
    if (claim) {
      setFormData({
        claimant_name: (claim as any).claimant_name,
        village: (claim as any).village,
        district: (claim as any).district,
        state: (claim as any).state,
        land_area: (claim as any).land_area,
        tribal_group: (claim as any).tribal_group,
        claim_type: (claim as any).claim_type,
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
      showAlert('Claim Withdrawn', `Claim ${claimId} withdrawn successfully.`, 'success');
    }
  };

  const filteredClaims = claims.filter((claim: any) => {
    const matchesSearch = claim.claimant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedFilters.state === 'All' || claim.state === selectedFilters.state;
    const matchesStatus = selectedFilters.status === 'All' || claim.status === selectedFilters.status;
    const matchesTribalGroup = selectedFilters.tribalGroup === 'All' || claim.tribal_group === selectedFilters.tribalGroup;
    const matchesClaimType = selectedFilters.claimType === 'All' || claim.claim_type === selectedFilters.claimType;
    
    return matchesSearch && matchesState && matchesStatus && matchesTribalGroup && matchesClaimType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showAlert('Authentication Required', 'Please sign in to submit a claim', 'warning');
        router.push('/signin');
        return;
      }

      // Prepare claim data for API
      const claimData = {
        claimantName: formData.claimant_name,
        spouseName: formData.spouse_name || null,
        fatherMotherName: formData.father_mother_name,
        address: formData.address,
        village: formData.village,
        gramPanchayat: formData.gram_panchayat,
        tehsilTaluka: formData.tehsil_taluka,
        district: formData.district,
        state: formData.state,
        isScheduledTribe: formData.scheduled_tribe === 'Yes',
        isOtherTraditionalForestDweller: formData.other_traditional_forest_dweller === 'Yes',
        familyMembers: formData.family_members ? formData.family_members.split(',').map(member => {
          const [name, age] = member.trim().split(' ');
          return { name: name || member.trim(), age: parseInt(age) || 0 };
        }) : [],
        title: `${formData.claim_type} - ${formData.claimant_name}`,
        description: `Forest Rights Act claim for ${formData.claimant_name} in ${formData.village}, ${formData.district}`,
        category: formData.claim_type,
        amount: formData.land_area ? parseFloat(formData.land_area) : null,
        priority: 'MEDIUM',
        userId: userId
      };

      // Submit claim to API
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });

      const result = await response.json();

      if (result.success) {
        // Save uploaded document to database if file was uploaded
        if (uploadedFile) {
          try {
            const documentFormData = new FormData();
            documentFormData.append('file', uploadedFile);
            documentFormData.append('claimId', result.data.id);
            documentFormData.append('userId', userId);
            documentFormData.append('fileType', 'IDENTITY_DOCUMENT');
            
            const docResponse = await fetch('/api/documents/upload', {
              method: 'POST',
              body: documentFormData
            });
            
            const docResult = await docResponse.json();
            
            if (docResult.success) {
              // Update document with extracted text and processing results
              const updateResponse = await fetch(`/api/documents/${docResult.data.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'PROCESSED',
                  extractedText: (uploadedFile as any).extractedText || '',
                  confidence: (uploadedFile as any).accuracy || 0,
                  metadata: {
                    extractedData: (uploadedFile as any).processedData || {},
                    accuracy: (uploadedFile as any).accuracy || 0,
                    processedAt: new Date().toISOString()
                  }
                }),
              });
              
              if (!updateResponse.ok) {
                console.error('Failed to update document with processing results');
              }
            } else {
              console.error('Failed to save document:', docResult.error);
            }
          } catch (error) {
            console.error('Error saving document:', error);
          }
        }

        // Add the new claim to the local state
        const newClaim = {
          id: result.data.id,
          claimant_name: result.data.claimantName,
          village: result.data.village,
          district: result.data.district,
          state: result.data.state,
          status: result.data.status,
          land_area: result.data.amount ? `${result.data.amount} acres` : '',
          created_at: result.data.createdAt.split('T')[0],
          tribal_group: formData.tribal_group,
          claim_type: result.data.category,
          coordinates: {
            lat: 23.8315 + (Math.random() - 0.5) * 0.1,
            lng: 91.2862 + (Math.random() - 0.5) * 0.1
          },
          assets: [],
          documents: uploadedFile ? [uploadedFile.name] : [],
          review_stage: 'Initial Review',
          last_updated: result.data.updatedAt.split('T')[0],
          version: 1,
          submitted_by: user?.name || 'Unknown'
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
        
        showAlert('Claim Submitted', 'Claim submitted successfully!', 'success');
        
        // Redirect to Claims Map tab
        setActiveTab('map');
      } else {
        // Handle duplicate claim error specifically
        if (result.errorType === 'DUPLICATE_CLAIM') {
          showAlert('Duplicate Claim Detected', `${result.error}\n\nPlease check if you have already submitted a claim for this person in this location.`, 'warning');
        } else {
          showAlert('Claim Submission Failed', result.error || 'Failed to submit claim', 'error');
        }
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      showAlert('Submission Error', 'An error occurred while submitting the claim. Please try again.', 'error');
    }
  };

  const loadRecommendations = async (claimId: string) => {
    setSelectedClaim(claimId);
    setActiveTab('dss');
    setIsLoadingRecommendations(true);
    setRecommendations([]);
    
    try {
      // Find the claim data
      const claim = claims.find(c => c.id === claimId);
      if (!claim) {
        showAlert('Error', 'Claim not found', 'error');
        return;
      }

      // Prepare claim data for Gemini
      const claimData = {
        claimantName: claim.claimant_name,
        village: claim.village,
        district: claim.district,
        state: claim.state,
        tribalGroup: claim.tribal_group,
        claimType: claim.claim_type,
        isScheduledTribe: claim.tribal_group && claim.tribal_group !== 'Not specified',
        isOtherTraditionalForestDweller: false,
        landArea: claim.land_area,
        familyMembers: []
      };

      // Call the scheme recommendations API
      const response = await fetch('/api/scheme-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claimData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const newRecommendations = result.data.recommendations || [];
        setRecommendations(newRecommendations);
        setIsLoadingRecommendations(false);
      } else {
        showAlert('Error', result.error || 'Failed to generate recommendations', 'error');
        setRecommendations([]);
        setIsLoadingRecommendations(false);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      showAlert('Error', 'Failed to load scheme recommendations', 'error');
      setRecommendations([]);
      setIsLoadingRecommendations(false);
    }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r flex flex-col transition-all duration-300 sticky top-0 min-h-screen`}>
        {/* Top Section with Logo, User Info, and Logout */}
        <div className="p-4 border-b">
          {/* Collapse/Expand Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ArrowRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Image 
                src="/logo.png" 
                alt="FRA-Mitra Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-900">FRA-Mitra</h1>
                <p className="text-xs text-slate-500">AI-Powered FRA Atlas & DSS</p>
              </div>
            )}
          </Link>

          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userName');
              localStorage.removeItem('userId');
              localStorage.removeItem('userRole');
              router.push('/');
            }}
            className={`w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            {sidebarCollapsed ? (
              <span>🚪</span>
            ) : (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Tabs */}
        <nav className="bg-white border-b sticky top-0 z-10">
          <div className="px-6">
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
            {(user?.role === 'admin' || user?.role === 'field_officer') && (
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
            )}
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
        <main className="flex-1 px-6 py-8 overflow-y-auto">
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
                    <p className="text-blue-600 text-sm">💡 You can edit the extracted data below if needed</p>
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
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter state name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter district name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Tribe
                  </label>
                  <input
                    type="text"
                    name="scheduled_tribe"
                    value={formData.scheduled_tribe}
                    onChange={handleInputChange}
                    placeholder="Enter Yes/No or leave blank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Traditional Forest Dweller
                  </label>
                  <input
                    type="text"
                    name="other_traditional_forest_dweller"
                    value={formData.other_traditional_forest_dweller}
                    onChange={handleInputChange}
                    placeholder="Enter Yes/No or leave blank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
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
                  <input
                    type="text"
                    name="tribal_group"
                    value={formData.tribal_group}
                    onChange={handleInputChange}
                    placeholder="Enter tribal group name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Type
                  </label>
                  <input
                    type="text"
                    name="claim_type"
                    value={formData.claim_type}
                    onChange={handleInputChange}
                    placeholder="Enter claim type (e.g., Individual Forest Rights, Community Forest Rights, Habitat Rights)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced WebGIS & Mapping</h2>
              <p className="text-gray-600">Interactive GIS map with layer toggling, search, and asset mapping</p>
            </div>


            {/* Interactive Map */}
            <div className="mb-8">
              <MapComponent 
                claims={claims} 
                mapLayers={mapLayers} 
                newClaimId={newClaimId}
                onClaimZoomed={() => setNewClaimId(null)}
              />
            </div>

            {/* Enhanced Claims List with Nearby Features */}
            <div className="space-y-6">
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

              <div className="space-y-6">
                {filteredClaims.map((claim) => {
                  const nearbyFeatures = getNearbyFeatures(claim.coordinates.lat, claim.coordinates.lng);
                  
                  return (
                    <div key={claim.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{claim.claimant_name}</h4>
                          <p className="text-sm text-gray-600">{claim.village}, {claim.district}</p>
                          <p className="text-sm text-gray-500">{claim.state}</p>
                          <p className="text-sm text-gray-500">{claim.tribal_group} • {claim.claim_type}</p>
                          {claim.land_area && (
                            <p className="text-sm text-gray-500">Land: {claim.land_area}</p>
                          )}
                          <p className="text-xs text-gray-400">Version {claim.version} • Updated {claim.last_updated}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(claim.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </div>
                          <button 
                            onClick={() => {
                              setNewClaimId(claim.id);
                              // The map will automatically zoom to this claim
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                          >
                            <MapPin className="h-4 w-4" />
                            <span>Show on Map</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Nearby Features Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">Nearby Features (within 10km)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {nearbyFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                              <div className={`h-4 w-4 rounded-full mt-1 ${
                                feature.category === 'water' ? 'bg-blue-500' :
                                feature.category === 'forest' ? 'bg-green-500' :
                                'bg-yellow-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{feature.name}</p>
                                <p className="text-xs text-gray-600">{feature.type}</p>
                                <p className="text-xs text-gray-500">{feature.distance.toFixed(1)}km away</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {nearbyFeatures.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No nearby features found within 10km radius</p>
                        )}
                      </div>

                      {/* Assets */}
                      {claim.assets && claim.assets.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Assets:</p>
                          <div className="flex flex-wrap gap-1">
                            {claim.assets.map((asset: any, index: number) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {asset}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex space-x-2">
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
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Decision Support System Tab */}
        {activeTab === 'dss' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Decision Support System</h2>
              <p className="text-gray-600">Get personalized government scheme recommendations for your FRA claims</p>
            </div>

            {!selectedClaim ? (
              <div>
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center mb-4">
                    <Brain className="h-6 w-6 text-emerald-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">AI-Powered Scheme Recommendations</h3>
                  </div>
                  <p className="text-gray-600">
                    Select a claim below to get personalized government scheme recommendations based on your profile, 
                    location, and tribal status. Our AI analyzes your claim data to suggest the most relevant 
                    Centrally Sponsored Schemes (CSS) for your needs.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-6">Select a Claim for Recommendations</h3>
                
                {claims.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Claims Found</h4>
                    <p className="text-gray-600 mb-4">You need to submit at least one claim to get scheme recommendations.</p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Submit a Claim
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {claims.map((claim) => (
                      <div key={claim.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg mb-2">{claim.claimant_name}</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Location:</span> {claim.village}, {claim.district}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">State:</span> {claim.state}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Claim Type:</span> {claim.claim_type}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Land Area:</span> {claim.land_area}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                        <button
                          onClick={() => loadRecommendations(claim.id)}
                          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <Brain className="h-4 w-4" />
                          <span>Get AI Recommendations</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Scheme Recommendations</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on your claim data and profile information
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedClaim(null);
                      setRecommendations([]);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Claims</span>
                  </button>
                </div>

                {/* Simple Recommendations Display */}
                <div className="space-y-6">
                  {isLoadingRecommendations ? (
                    <div className="text-center py-16">
                      <div className="text-lg font-medium text-gray-900 mb-2">Loading Recommendations...</div>
                      <p className="text-gray-600">Please wait while we analyze your claim and find relevant government schemes.</p>
                    </div>
                  ) : recommendations.length > 0 ? (
                    <>
                      <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                          <div>
                            <h3 className="text-xl font-bold text-green-800">Recommendations Generated!</h3>
                            <p className="text-green-700 mt-1">
                              Found {recommendations.length} relevant government schemes for your claim
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="mb-4">
                              <h4 className="text-xl font-semibold text-gray-900 mb-2">{rec.schemeName}</h4>
                              <p className="text-gray-600 mb-3">
                                <span className="font-medium">Ministry:</span> {rec.ministry}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  rec.category === 'Housing and Infrastructure Schemes' ? 'bg-blue-100 text-blue-800' :
                                  rec.category === 'Agriculture and Forest-based Livelihood Schemes' ? 'bg-green-100 text-green-800' :
                                  rec.category === 'Livelihood and Employment Schemes' ? 'bg-purple-100 text-purple-800' :
                                  rec.category === 'Education and Skill Development Schemes' ? 'bg-yellow-100 text-yellow-800' :
                                  rec.category === 'Health and Nutrition Schemes' ? 'bg-red-100 text-red-800' :
                                  rec.category === 'Social Security and Welfare Schemes' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {rec.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {rec.priority} Priority
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{rec.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h5>
                                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{rec.eligibility}</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Benefits</h5>
                                  <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">{rec.benefits}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Application Process</h5>
                                  <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded-lg">{rec.applicationProcess}</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                  <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg">{rec.contactInfo}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2">
                                <span>Get Application Details</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Generated</h4>
                      <p className="text-gray-600 mb-4">We couldn't generate recommendations for this claim. Please try again.</p>
                      <button
                        onClick={() => {
                          const claimId = selectedClaim;
                          if (claimId) {
                            loadRecommendations(claimId);
                          }
                        }}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab - Admin and Field Officer only */}
        {activeTab === 'analytics' && (user?.role === 'admin' || user?.role === 'field_officer') && (
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
                    <p className="text-2xl font-bold text-emerald-600">{claims.length}</p>
                    <p className="text-xs text-gray-500">+12% from last month</p>
                  </div>
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-xs text-gray-500">Above target</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                    <p className="text-2xl font-bold text-blue-600">15 days</p>
                    <p className="text-xs text-gray-500">Within SLA</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tribal Groups</p>
                    <p className="text-2xl font-bold text-purple-600">12</p>
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
                    showAlert('Profile Updated', 'Profile updated successfully!', 'success');
                  }}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Update Profile
                </button>
              </div>

            </div>
          </div>
        )}
        </main>
      </div>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}