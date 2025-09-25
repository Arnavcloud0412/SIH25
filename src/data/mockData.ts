// Mock data for FRA-Mitra application

export interface FRAClaim {
  id: string;
  claimantName: string;
  village: string;
  district: string;
  state: string;
  tribalGroup: string;
  claimType: 'Individual' | 'Community' | 'Habitat';
  status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review';
  area: number; // in hectares
  coordinates: [number, number]; // [longitude, latitude]
  submissionDate: string;
  decisionDate?: string;
  documents: string[];
  assets: string[];
}

export interface TribalGroup {
  id: string;
  name: string;
  population: number;
  districts: string[];
  traditionalOccupation: string;
  culturalSignificance: string;
}

export interface ForestArea {
  id: string;
  name: string;
  type: 'Reserved Forest' | 'Protected Forest' | 'Community Forest' | 'Village Forest';
  area: number;
  coordinates: [number, number][]; // Polygon coordinates
  biodiversity: string[];
  threats: string[];
  conservationStatus: 'Critical' | 'Vulnerable' | 'Stable' | 'Recovering';
}

export interface DashboardStats {
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  totalArea: number;
  tribalGroupsCount: number;
  forestAreasCount: number;
}

// Mock FRA Claims Data
export const mockFRAClaims: FRAClaim[] = [
  {
    id: 'FRA001',
    claimantName: 'Ram Singh Gond',
    village: 'Bichhiya',
    district: 'Mandla',
    state: 'Madhya Pradesh',
    tribalGroup: 'Gond',
    claimType: 'Individual',
    status: 'Approved',
    area: 2.5,
    coordinates: [80.3639, 22.5937],
    submissionDate: '2023-01-15',
    decisionDate: '2023-06-20',
    documents: ['Land Record', 'Identity Proof', 'Village Certificate'],
    assets: ['Agricultural Land', 'Water Source']
  },
  {
    id: 'FRA002',
    claimantName: 'Community Forest Rights Committee',
    village: 'Korba',
    district: 'Korba',
    state: 'Chhattisgarh',
    tribalGroup: 'Baiga',
    claimType: 'Community',
    status: 'Pending',
    area: 150.0,
    coordinates: [82.7167, 22.3500],
    submissionDate: '2023-03-10',
    documents: ['Community Resolution', 'Forest Map', 'Traditional Use Evidence'],
    assets: ['Forest Land', 'Medicinal Plants', 'Wildlife Habitat']
  },
  {
    id: 'FRA003',
    claimantName: 'Sita Devi Oraon',
    village: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    tribalGroup: 'Oraon',
    claimType: 'Individual',
    status: 'Under Review',
    area: 1.8,
    coordinates: [85.3342, 23.3441],
    submissionDate: '2023-05-22',
    documents: ['Land Survey', 'Family Tree', 'Traditional Rights Document'],
    assets: ['Residential Land', 'Agricultural Plot']
  },
  {
    id: 'FRA004',
    claimantName: 'Jharkhand Tribal Federation',
    village: 'Gumla',
    district: 'Gumla',
    state: 'Jharkhand',
    tribalGroup: 'Munda',
    claimType: 'Habitat',
    status: 'Approved',
    area: 500.0,
    coordinates: [84.5386, 23.0500],
    submissionDate: '2022-11-30',
    decisionDate: '2023-08-15',
    documents: ['Habitat Map', 'Cultural Documentation', 'Traditional Governance Records'],
    assets: ['Sacred Groves', 'Traditional Water Bodies', 'Cultural Sites']
  },
  {
    id: 'FRA005',
    claimantName: 'Mahadev Korku',
    village: 'Betul',
    district: 'Betul',
    state: 'Madhya Pradesh',
    tribalGroup: 'Korku',
    claimType: 'Individual',
    status: 'Rejected',
    area: 3.2,
    coordinates: [77.9000, 21.9167],
    submissionDate: '2023-02-14',
    decisionDate: '2023-07-10',
    documents: ['Land Record', 'Identity Proof'],
    assets: ['Agricultural Land']
  }
];

// Mock Tribal Groups Data
export const mockTribalGroups: TribalGroup[] = [
  {
    id: 'TG001',
    name: 'Gond',
    population: 1200000,
    districts: ['Mandla', 'Balaghat', 'Dindori', 'Chhindwara'],
    traditionalOccupation: 'Agriculture, Forest Collection, Handicrafts',
    culturalSignificance: 'One of the largest tribal groups in Central India with rich cultural heritage'
  },
  {
    id: 'TG002',
    name: 'Baiga',
    population: 250000,
    districts: ['Korba', 'Bilaspur', 'Raigarh', 'Sarguja'],
    traditionalOccupation: 'Shifting Cultivation, Forest Collection, Traditional Medicine',
    culturalSignificance: 'Known for their traditional knowledge of forest medicines and sustainable practices'
  },
  {
    id: 'TG003',
    name: 'Oraon',
    population: 800000,
    districts: ['Ranchi', 'Gumla', 'Lohardaga', 'Simdega'],
    traditionalOccupation: 'Agriculture, Animal Husbandry, Traditional Crafts',
    culturalSignificance: 'Rich oral traditions and traditional governance systems'
  },
  {
    id: 'TG004',
    name: 'Munda',
    population: 600000,
    districts: ['Ranchi', 'Khunti', 'West Singhbhum', 'East Singhbhum'],
    traditionalOccupation: 'Agriculture, Forest Collection, Traditional Mining',
    culturalSignificance: 'Strong traditional governance and land rights systems'
  },
  {
    id: 'TG005',
    name: 'Korku',
    population: 150000,
    districts: ['Betul', 'Hoshangabad', 'Harda', 'Khandwa'],
    traditionalOccupation: 'Agriculture, Forest Collection, Traditional Crafts',
    culturalSignificance: 'Known for their traditional agricultural practices and forest management'
  }
];

// Mock Forest Areas Data
export const mockForestAreas: ForestArea[] = [
  {
    id: 'FA001',
    name: 'Kanha National Park',
    type: 'Reserved Forest',
    area: 940.0,
    coordinates: [[80.2, 22.3], [80.5, 22.3], [80.5, 22.6], [80.2, 22.6], [80.2, 22.3]],
    biodiversity: ['Tiger', 'Barasingha', 'Indian Bison', 'Sal Trees', 'Bamboo'],
    threats: ['Poaching', 'Habitat Fragmentation', 'Human-Wildlife Conflict'],
    conservationStatus: 'Stable'
  },
  {
    id: 'FA002',
    name: 'Achanakmar Wildlife Sanctuary',
    type: 'Protected Forest',
    area: 557.0,
    coordinates: [[82.3, 22.1], [82.6, 22.1], [82.6, 22.4], [82.3, 22.4], [82.3, 22.1]],
    biodiversity: ['Leopard', 'Wild Boar', 'Teak', 'Mahua', 'Tendu'],
    threats: ['Mining', 'Deforestation', 'Illegal Logging'],
    conservationStatus: 'Vulnerable'
  },
  {
    id: 'FA003',
    name: 'Betla National Park',
    type: 'Reserved Forest',
    area: 231.0,
    coordinates: [[84.2, 23.1], [84.5, 23.1], [84.5, 23.4], [84.2, 23.4], [84.2, 23.1]],
    biodiversity: ['Elephant', 'Sloth Bear', 'Sal Trees', 'Palash', 'Kusum'],
    threats: ['Mining Activities', 'Encroachment', 'Forest Fires'],
    conservationStatus: 'Critical'
  },
  {
    id: 'FA004',
    name: 'Community Forest - Gumla',
    type: 'Community Forest',
    area: 125.0,
    coordinates: [[84.4, 23.0], [84.7, 23.0], [84.7, 23.3], [84.4, 23.3], [84.4, 23.0]],
    biodiversity: ['Traditional Medicinal Plants', 'Fruit Trees', 'Wildlife'],
    threats: ['Over-exploitation', 'Climate Change'],
    conservationStatus: 'Recovering'
  }
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalClaims: mockFRAClaims.length,
  approvedClaims: mockFRAClaims.filter(claim => claim.status === 'Approved').length,
  pendingClaims: mockFRAClaims.filter(claim => claim.status === 'Pending').length,
  rejectedClaims: mockFRAClaims.filter(claim => claim.status === 'Rejected').length,
  totalArea: mockFRAClaims.reduce((sum, claim) => sum + claim.area, 0),
  tribalGroupsCount: mockTribalGroups.length,
  forestAreasCount: mockForestAreas.length
};

// GeoJSON data for map visualization
export const forestAreasGeoJSON = {
  type: "FeatureCollection",
  features: mockForestAreas.map(area => ({
    type: "Feature",
    properties: {
      id: area.id,
      name: area.name,
      type: area.type,
      area: area.area,
      conservationStatus: area.conservationStatus,
      biodiversity: area.biodiversity,
      threats: area.threats
    },
    geometry: {
      type: "Polygon",
      coordinates: [area.coordinates]
    }
  }))
};

export const claimsGeoJSON = {
  type: "FeatureCollection",
  features: mockFRAClaims.map(claim => ({
    type: "Feature",
    properties: {
      id: claim.id,
      claimantName: claim.claimantName,
      village: claim.village,
      district: claim.district,
      state: claim.state,
      tribalGroup: claim.tribalGroup,
      claimType: claim.claimType,
      status: claim.status,
      area: claim.area,
      submissionDate: claim.submissionDate,
      decisionDate: claim.decisionDate
    },
    geometry: {
      type: "Point",
      coordinates: claim.coordinates
    }
  }))
};
