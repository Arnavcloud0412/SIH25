from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import json
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage, FileContentWithMimeType

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create upload directory
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# FRA Claim Models
class FRAClaimData(BaseModel):
    claimant_name: str = ""
    spouse_name: str = ""
    father_mother_name: str = ""
    address: str = ""
    village: str = ""
    gram_panchayat: str = ""
    tehsil_taluka: str = ""
    district: str = ""
    state: str = ""
    scheduled_tribe: str = ""
    other_traditional_forest_dweller: str = ""
    family_members: str = ""
    land_area: str = ""
    location_lat: float = 0.0
    location_lng: float = 0.0

class FRAClaim(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    claim_data: FRAClaimData
    document_path: Optional[str] = None
    document_base64: Optional[str] = None
    document_filename: Optional[str] = None
    document_extracted_data: Optional[Dict[str, Any]] = None
    status: str = "Submitted"  # Submitted, Under Review, Approved, Rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FRAClaimCreate(BaseModel):
    claim_data: FRAClaimData

class SchemeRecommendation(BaseModel):
    scheme_name: str
    description: str
    eligibility: str
    priority: str  # High, Medium, Low

# Sample data for states and districts
STATE_DISTRICTS = {
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
    "Tripura": ["West Tripura", "North Tripura", "South Tripura", "Dhalai", "Gomati", "Khowai", "Sepahijala", "Unakoti"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Berhampur", "Sambalpur", "Rourkela", "Balasore", "Baripada", "Bhadrak", "Jharsuguda", "Jeypore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"]
}

# Sample waterbody data
SAMPLE_WATERBODIES = [
    {
        "id": "wb_001",
        "name": "Betwa River",
        "type": "River",
        "state": "Madhya Pradesh",
        "district": "Bhopal",
        "lat": 23.2599,
        "lng": 77.4126,
        "owner_claim_id": None,
        "description": "Major river in Madhya Pradesh"
    },
    {
        "id": "wb_002", 
        "name": "Gomati River",
        "type": "River",
        "state": "Tripura",
        "district": "West Tripura",
        "lat": 23.8315,
        "lng": 91.2868,
        "owner_claim_id": None,
        "description": "Principal river of Tripura"
    },
    {
        "id": "wb_003",
        "name": "Mahanadi River",
        "type": "River", 
        "state": "Odisha",
        "district": "Cuttack",
        "lat": 20.4625,
        "lng": 85.8830,
        "owner_claim_id": None,
        "description": "Major river in Odisha"
    },
    {
        "id": "wb_004",
        "name": "Godavari River",
        "type": "River",
        "state": "Telangana",
        "district": "Hyderabad",
        "lat": 17.3850,
        "lng": 78.4867,
        "owner_claim_id": None,
        "description": "Major river in Telangana"
    }
]

# Initialize Gemini Chat
async def get_gemini_chat():
    api_key = os.environ.get('GOOGLE_GEMINI_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"fra_extraction_{uuid.uuid4()}",
        system_message="You are a Forest Rights Act document processor. Extract structured data from uploaded documents and return it in JSON format with the exact field names provided."
    ).with_model("gemini", "gemini-2.0-flash")
    
    return chat

async def extract_data_from_document(file_path: str, mime_type: str) -> Dict[str, Any]:
    """Extract FRA claim data from uploaded document using Gemini"""
    try:
        chat = await get_gemini_chat()
        
        # Create file content object
        file_content = FileContentWithMimeType(
            file_path=file_path,
            mime_type=mime_type
        )
        
        extraction_prompt = """
        Extract the following information from this Forest Rights Act claim document and return it as JSON:
        
        {
            "claimant_name": "Name of the claimant(s)",
            "spouse_name": "Name of the spouse",
            "father_mother_name": "Name of father/mother",
            "address": "Full address",
            "village": "Village name",
            "gram_panchayat": "Gram Panchayat",
            "tehsil_taluka": "Tehsil/Taluka",
            "district": "District",
            "state": "State",
            "scheduled_tribe": "Scheduled Tribe status (Yes/No or details)",
            "other_traditional_forest_dweller": "Other Traditional Forest Dweller status",
            "family_members": "Names and ages of family members",
            "land_area": "Land area claimed (if mentioned)"
        }
        
        Return only the JSON object with the extracted data. If any field is not found, use an empty string.
        """
        
        user_message = UserMessage(
            text=extraction_prompt,
            file_contents=[file_content]
        )
        
        response = await chat.send_message(user_message)
        
        # Try to parse JSON response
        try:
            # Extract JSON from response if it contains additional text
            response_text = str(response).strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            extracted_data = json.loads(response_text)
            return extracted_data
        except json.JSONDecodeError:
            # If JSON parsing fails, return empty data
            return {}
            
    except Exception as e:
        print(f"Error extracting data: {str(e)}")
        return {}

def get_scheme_recommendations(claim_data: FRAClaimData) -> List[SchemeRecommendation]:
    """Generate scheme recommendations based on claim data"""
    recommendations = []
    
    # DAJGUA scheme
    recommendations.append(SchemeRecommendation(
        scheme_name="DAJGUA (Development of Antyodaya and Janjati Gram Utkarsh Abhiyan)",
        description="Focused development program for tribal villages",
        eligibility="Scheduled Tribe communities in selected villages",
        priority="High" if claim_data.scheduled_tribe.lower() in ['yes', 'true', '1'] else "Medium"
    ))
    
    # Jal Shakti Mission
    recommendations.append(SchemeRecommendation(
        scheme_name="Jal Shakti Mission - Borewell Program",
        description="Water security through borewells in water-stressed areas",
        eligibility="Villages with low water index",
        priority="High"
    ))
    
    # Forest Rights Act benefits
    recommendations.append(SchemeRecommendation(
        scheme_name="Forest Rights Act - Community Forest Resource Rights",
        description="Rights over community forest resources for traditional forest dwellers",
        eligibility="Traditional forest dwelling communities",
        priority="High" if claim_data.other_traditional_forest_dweller else "Low"
    ))
    
    # PM-JANMAN Scheme
    recommendations.append(SchemeRecommendation(
        scheme_name="PM-JANMAN (PM Janjati Adivasi Nyaya Maha Abhiyan)",
        description="Comprehensive scheme for tribal welfare and development",
        eligibility="Particularly Vulnerable Tribal Groups (PVTGs)",
        priority="Medium"
    ))
    
    return recommendations

# Geocoding function (simplified - using approximate coordinates)
def get_coordinates_for_address(village: str, district: str, state: str) -> tuple:
    """Get approximate coordinates for given address"""
    # Simplified geocoding - in production, use proper geocoding service
    state_coordinates = {
        "Madhya Pradesh": (23.2599, 77.4126),
        "Tripura": (23.9408, 91.9882),
        "Odisha": (20.9517, 85.0985),
        "Telangana": (18.1124, 79.0193)
    }
    
    base_lat, base_lng = state_coordinates.get(state, (20.5937, 78.9629))
    
    # Add some variation based on district/village (simplified)
    district_offset = hash(district) % 100 / 10000
    village_offset = hash(village) % 100 / 10000
    
    lat = base_lat + district_offset + village_offset
    lng = base_lng + district_offset + village_offset
    
    return lat, lng

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Forest Rights Act Claims Management System"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.get("/states-districts")
async def get_states_districts():
    """Get list of supported states and their districts"""
    return STATE_DISTRICTS

@api_router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process FRA document"""
    try:
        # Validate file type and size
        if file.content_type not in ["application/pdf", "image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(status_code=400, detail="Only PDF, JPEG, and PNG files are supported")
        
        # Read file content
        content = await file.read()
        
        # Check file size (50MB limit)
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 50MB limit")
        
        # Save file
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1] if file.filename else 'bin'
        file_path = UPLOAD_DIR / f"{file_id}.{file_extension}"
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Convert to base64 for storage
        file_base64 = base64.b64encode(content).decode('utf-8')
        
        # Determine MIME type
        mime_type_map = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png'
        }
        mime_type = mime_type_map.get(file_extension.lower(), 'application/octet-stream')
        
        # Extract data using Gemini
        extracted_data = await extract_data_from_document(str(file_path), mime_type)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "file_base64": file_base64,
            "extracted_data": extracted_data,
            "message": "Document uploaded and processed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@api_router.post("/claims", response_model=FRAClaim)
async def create_claim(claim: FRAClaimCreate):
    """Create a new FRA claim"""
    try:
        # Get coordinates for the location
        lat, lng = get_coordinates_for_address(
            claim.claim_data.village,
            claim.claim_data.district, 
            claim.claim_data.state
        )
        
        # Update coordinates
        claim.claim_data.location_lat = lat
        claim.claim_data.location_lng = lng
        
        # Create claim object
        fra_claim = FRAClaim(claim_data=claim.claim_data)
        
        # Convert to dict for MongoDB storage
        claim_dict = fra_claim.dict()
        claim_dict['created_at'] = claim_dict['created_at'].isoformat()
        claim_dict['updated_at'] = claim_dict['updated_at'].isoformat()
        
        # Insert into database
        await db.fra_claims.insert_one(claim_dict)
        
        return fra_claim
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating claim: {str(e)}")

@api_router.post("/claims-with-document")
async def create_claim_with_document(
    claim_data: str = Form(),  # JSON string of claim data
    file_id: str = Form(),
    filename: str = Form(),
    file_base64: str = Form(),
    extracted_data: str = Form()  # JSON string of extracted data
):
    """Create claim with uploaded document"""
    try:
        # Parse JSON strings
        claim_data_dict = json.loads(claim_data)
        extracted_data_dict = json.loads(extracted_data) if extracted_data else {}
        
        # Create FRAClaimData object
        fra_claim_data = FRAClaimData(**claim_data_dict)
        
        # Get coordinates
        lat, lng = get_coordinates_for_address(
            fra_claim_data.village,
            fra_claim_data.district,
            fra_claim_data.state
        )
        fra_claim_data.location_lat = lat
        fra_claim_data.location_lng = lng
        
        # Create claim
        fra_claim = FRAClaim(
            claim_data=fra_claim_data,
            document_base64=file_base64,
            document_filename=filename,
            document_extracted_data=extracted_data_dict
        )
        
        # Store in database
        claim_dict = fra_claim.dict()
        claim_dict['created_at'] = claim_dict['created_at'].isoformat()
        claim_dict['updated_at'] = claim_dict['updated_at'].isoformat()
        
        await db.fra_claims.insert_one(claim_dict)
        
        return {"message": "Claim created successfully", "claim_id": fra_claim.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating claim with document: {str(e)}")

@api_router.get("/claims", response_model=List[FRAClaim])
async def get_claims():
    """Get all FRA claims"""
    try:
        claims = await db.fra_claims.find().to_list(1000)
        
        # Parse datetime strings back to datetime objects
        for claim in claims:
            if isinstance(claim.get('created_at'), str):
                claim['created_at'] = datetime.fromisoformat(claim['created_at'])
            if isinstance(claim.get('updated_at'), str):
                claim['updated_at'] = datetime.fromisoformat(claim['updated_at'])
        
        return [FRAClaim(**claim) for claim in claims]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching claims: {str(e)}")

@api_router.get("/claims/{claim_id}", response_model=FRAClaim)
async def get_claim(claim_id: str):
    """Get specific claim by ID"""
    try:
        claim = await db.fra_claims.find_one({"id": claim_id})
        if not claim:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        # Parse datetime strings
        if isinstance(claim.get('created_at'), str):
            claim['created_at'] = datetime.fromisoformat(claim['created_at'])
        if isinstance(claim.get('updated_at'), str):
            claim['updated_at'] = datetime.fromisoformat(claim['updated_at'])
        
        return FRAClaim(**claim)
    except Exception as e:
        if "not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error fetching claim: {str(e)}")

@api_router.get("/map-data")
async def get_map_data():
    """Get claims data for map visualization"""
    try:
        claims = await db.fra_claims.find().to_list(1000)
        
        map_data = []
        for claim in claims:
            claim_data = claim.get('claim_data', {})
            map_data.append({
                "id": claim.get('id'),
                "claimant_name": claim_data.get('claimant_name', ''),
                "village": claim_data.get('village', ''),
                "district": claim_data.get('district', ''),
                "state": claim_data.get('state', ''),
                "status": claim.get('status', 'Submitted'),
                "lat": claim_data.get('location_lat', 0),
                "lng": claim_data.get('location_lng', 0),
                "land_area": claim_data.get('land_area', ''),
                "created_at": claim.get('created_at')
            })
        
        return {
            "claims": map_data,
            "waterbodies": SAMPLE_WATERBODIES
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching map data: {str(e)}")

@api_router.get("/recommendations/{claim_id}")
async def get_recommendations(claim_id: str):
    """Get scheme recommendations for a specific claim"""
    try:
        claim = await db.fra_claims.find_one({"id": claim_id})
        if not claim:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        # Create FRAClaimData object
        claim_data = FRAClaimData(**claim.get('claim_data', {}))
        
        # Get recommendations
        recommendations = get_scheme_recommendations(claim_data)
        
        return {
            "claim_id": claim_id,
            "recommendations": [rec.dict() for rec in recommendations]
        }
    except Exception as e:
        if "not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()