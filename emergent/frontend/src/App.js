import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different claim statuses
const submittedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const reviewIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const waterbodyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const FRAClaimsSystem = () => {
  const [activeTab, setActiveTab] = useState('form');
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

  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [statesDistricts, setStatesDistricts] = useState({});
  const [mapData, setMapData] = useState({ claims: [], waterbodies: [] });
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [claims, setClaims] = useState([]);

  // Load states and districts
  useEffect(() => {
    loadStatesDistricts();
    loadMapData();
    loadClaims();
  }, []);

  const loadStatesDistricts = async () => {
    try {
      const response = await axios.get(`${API}/states-districts`);
      setStatesDistricts(response.data);
    } catch (error) {
      console.error('Error loading states and districts:', error);
    }
  };

  const loadMapData = async () => {
    try {
      const response = await axios.get(`${API}/map-data`);
      setMapData(response.data);
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

  const loadClaims = async () => {
    try {
      const response = await axios.get(`${API}/claims`);
      setClaims(response.data);
    } catch (error) {
      console.error('Error loading claims:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await axios.post(`${API}/upload-document`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedFile({
        id: response.data.file_id,
        filename: response.data.filename,
        base64: response.data.file_base64
      });

      const extracted = response.data.extracted_data || {};
      setExtractedData(extracted);

      // Auto-populate form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extracted
      }));

      alert('Document uploaded and processed successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (uploadedFile) {
        // Submit with document - using URLSearchParams as expected by backend
        const payload = new URLSearchParams();
        payload.append('claim_data', JSON.stringify(formData));
        payload.append('file_id', uploadedFile.id);
        payload.append('filename', uploadedFile.filename);
        payload.append('file_base64', uploadedFile.base64);
        payload.append('extracted_data', JSON.stringify(extractedData));

        await axios.post(`${API}/claims-with-document`, payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      } else {
        // Submit without document - fix the payload structure
        await axios.post(`${API}/claims`, {
          claim_data: formData
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      alert('Claim submitted successfully!');
      
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
      setExtractedData({});

      // Refresh data
      loadMapData();
      loadClaims();
      
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const loadRecommendations = async (claimId) => {
    try {
      const response = await axios.get(`${API}/recommendations/${claimId}`);
      setRecommendations(response.data.recommendations);
      setSelectedClaim(claimId);
      
      // Auto-scroll to recommendations section after they load
      setTimeout(() => {
        const recommendationsSection = document.querySelector('.recommendations-section');
        if (recommendationsSection) {
          recommendationsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      alert('Error loading recommendations: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const getMarkerIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return submittedIcon;
      case 'under review': return reviewIcon;
      default: return submittedIcon;
    }
  };

  return (
    <div className="fra-system">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">Forest Rights Act Claims Management</h1>
          <p className="subtitle">Tribal and Forest Dwellers Rights Portal</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Submit Claim
            </button>
            <button 
              className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              Claims Map
            </button>
            <button 
              className={`nav-tab ${activeTab === 'dss' ? 'active' : ''}`}
              onClick={() => setActiveTab('dss')}
            >
              Decision Support
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {/* Submit Claim Tab */}
          {activeTab === 'form' && (
            <div className="tab-content">
              <div className="form-section">
                <h2>Submit Forest Rights Act Claim</h2>
                
                {/* Document Upload */}
                <div className="upload-section">
                  <h3>Document Upload (Optional)</h3>
                  <p className="upload-help">Upload your FRA claim document (PDF, JPEG, PNG) to auto-populate the form</p>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="file-input"
                      disabled={isProcessing}
                    />
                    {isProcessing && <div className="processing">Processing document...</div>}
                  </div>
                  {uploadedFile && (
                    <div className="file-info">
                      <p>✅ Uploaded: {uploadedFile.filename}</p>
                      {Object.keys(extractedData).length > 0 && (
                        <p>📄 Data extracted and auto-populated in form</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Claim Form */}
                <form onSubmit={handleSubmit} className="claim-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name of the Claimant(s) *</label>
                      <input
                        type="text"
                        name="claimant_name"
                        value={formData.claimant_name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Name of the Spouse</label>
                      <input
                        type="text"
                        name="spouse_name"
                        value={formData.spouse_name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Name of Father/Mother *</label>
                      <input
                        type="text"
                        name="father_mother_name"
                        value={formData.father_mother_name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Village *</label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Gram Panchayat *</label>
                      <input
                        type="text"
                        name="gram_panchayat"
                        value={formData.gram_panchayat}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tehsil/Taluka *</label>
                      <input
                        type="text"
                        name="tehsil_taluka"
                        value={formData.tehsil_taluka}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesDistricts).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>District *</label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                        disabled={!formData.state}
                      >
                        <option value="">Select District</option>
                        {formData.state && statesDistricts[formData.state]?.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Scheduled Tribe</label>
                      <select
                        name="scheduled_tribe"
                        value={formData.scheduled_tribe}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Other Traditional Forest Dweller</label>
                      <select
                        name="other_traditional_forest_dweller"
                        value={formData.other_traditional_forest_dweller}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Family Members (Names and Ages)</label>
                      <textarea
                        name="family_members"
                        value={formData.family_members}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="3"
                        placeholder="List family members with their ages"
                      />
                    </div>

                    <div className="form-group">
                      <label>Land Area (if applicable)</label>
                      <input
                        type="text"
                        name="land_area"
                        value={formData.land_area}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., 2.5 acres"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      Submit Claim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Claims Map Tab */}
          {activeTab === 'map' && (
            <div className="tab-content">
              <h2>Claims Visualization Map</h2>
              <div className="map-container">
                <MapContainer 
                  center={[20.5937, 78.9629]} 
                  zoom={5} 
                  style={{ height: '600px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Claims markers */}
                  {mapData.claims.map(claim => (
                    <Marker
                      key={claim.id}
                      position={[claim.lat, claim.lng]}
                      icon={getMarkerIcon(claim.status)}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h4>{claim.claimant_name}</h4>
                          <p><strong>Village:</strong> {claim.village}</p>
                          <p><strong>District:</strong> {claim.district}</p>
                          <p><strong>State:</strong> {claim.state}</p>
                          <p><strong>Status:</strong> <span className={`status ${claim.status.toLowerCase().replace(' ', '-')}`}>{claim.status}</span></p>
                          {claim.land_area && <p><strong>Land Area:</strong> {claim.land_area}</p>}
                          <button 
                            className="view-recommendations-btn"
                            onClick={() => loadRecommendations(claim.id)}
                          >
                            View Schemes
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Waterbodies markers */}
                  {mapData.waterbodies.map(waterbody => (
                    <Marker
                      key={waterbody.id}
                      position={[waterbody.lat, waterbody.lng]}
                      icon={waterbodyIcon}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h4>{waterbody.name}</h4>
                          <p><strong>Type:</strong> {waterbody.type}</p>
                          <p><strong>State:</strong> {waterbody.state}</p>
                          <p><strong>District:</strong> {waterbody.district}</p>
                          <p><strong>Description:</strong> {waterbody.description}</p>
                          <p><strong>Status:</strong> {waterbody.owner_claim_id ? 'Claimed' : 'Available'}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="map-legend">
                <h3>Legend</h3>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-marker green"></div>
                    <span>Submitted Claims</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-marker orange"></div>
                    <span>Under Review</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-marker blue"></div>
                    <span>Water Bodies</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decision Support System Tab */}
          {activeTab === 'dss' && (
            <div className="tab-content">
              <h2>Decision Support System</h2>
              
              <div className="dss-content">
                <div className="claims-list">
                  <h3>Select a Claim for Scheme Recommendations</h3>
                  <div className="claims-grid">
                    {claims.map(claim => (
                      <div key={claim.id} className="claim-card">
                        <h4>{claim.claim_data.claimant_name}</h4>
                        <p>{claim.claim_data.village}, {claim.claim_data.district}</p>
                        <p><strong>State:</strong> {claim.claim_data.state}</p>
                        <p><strong>Status:</strong> <span className={`status ${claim.status.toLowerCase().replace(' ', '-')}`}>{claim.status}</span></p>
                        <button 
                          className="recommendations-btn"
                          onClick={() => loadRecommendations(claim.id)}
                        >
                          Get Recommendations
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="recommendations-section">
                    <h3>Scheme Recommendations</h3>
                    <div className="recommendations-grid">
                      {recommendations.map((rec, index) => (
                        <div key={index} className={`recommendation-card priority-${rec.priority.toLowerCase()}`}>
                          <div className="rec-header">
                            <h4>{rec.scheme_name}</h4>
                            <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                              {rec.priority} Priority
                            </span>
                          </div>
                          <p className="rec-description">{rec.description}</p>
                          <p className="rec-eligibility"><strong>Eligibility:</strong> {rec.eligibility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Forest Rights Act Claims Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default FRAClaimsSystem;