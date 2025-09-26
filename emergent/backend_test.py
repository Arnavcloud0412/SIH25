#!/usr/bin/env python3
"""
Forest Rights Act Claims Management System - Backend API Tests
Tests all critical endpoints and integrations including Gemini document processing
"""

import requests
import json
import base64
import os
import sys
from pathlib import Path
import time
from typing import Dict, Any

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "https://fra-claims.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

print(f"Testing FRA Claims Management System at: {API_URL}")

class FRATestSuite:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_claim_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{API_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "Forest Rights Act" in data.get("message", ""):
                    self.log_test("Health Check", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected message: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_states_districts(self):
        """Test states and districts endpoint"""
        try:
            response = self.session.get(f"{API_URL}/states-districts")
            if response.status_code == 200:
                data = response.json()
                expected_states = ["Madhya Pradesh", "Tripura", "Odisha", "Telangana"]
                
                # Check if all expected states are present
                missing_states = [state for state in expected_states if state not in data]
                if not missing_states:
                    # Check if districts are present for each state
                    mp_districts = data.get("Madhya Pradesh", [])
                    if len(mp_districts) >= 5:  # Should have multiple districts
                        self.log_test("States-Districts Data", True, f"Found {len(data)} states with districts")
                        return True
                    else:
                        self.log_test("States-Districts Data", False, f"Insufficient districts for Madhya Pradesh: {mp_districts}")
                        return False
                else:
                    self.log_test("States-Districts Data", False, f"Missing states: {missing_states}")
                    return False
            else:
                self.log_test("States-Districts Data", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("States-Districts Data", False, f"Exception: {str(e)}")
            return False
    
    def create_test_pdf_content(self):
        """Create a simple test PDF content in base64"""
        # This is a minimal PDF content for testing
        pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(FRA Test Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF"""
        return pdf_content
    
    def test_document_upload(self):
        """Test document upload and Gemini processing"""
        try:
            # Create test PDF content
            pdf_content = self.create_test_pdf_content()
            
            # Prepare multipart form data
            files = {
                'file': ('test_fra_document.pdf', pdf_content, 'application/pdf')
            }
            
            response = self.session.post(f"{API_URL}/upload-document", files=files)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['file_id', 'filename', 'file_base64', 'extracted_data', 'message']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    # Check if file_base64 is present and valid
                    if data.get('file_base64') and len(data['file_base64']) > 100:
                        self.log_test("Document Upload & Processing", True, 
                                    f"File uploaded, extracted_data keys: {list(data.get('extracted_data', {}).keys())}")
                        return True, data
                    else:
                        self.log_test("Document Upload & Processing", False, "file_base64 missing or too short")
                        return False, None
                else:
                    self.log_test("Document Upload & Processing", False, f"Missing fields: {missing_fields}")
                    return False, None
            else:
                self.log_test("Document Upload & Processing", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("Document Upload & Processing", False, f"Exception: {str(e)}")
            return False, None
    
    def test_create_claim_without_document(self):
        """Test creating FRA claim without document"""
        try:
            # Realistic FRA claim data
            claim_data = {
                "claim_data": {
                    "claimant_name": "Ramesh Kumar Meena",
                    "spouse_name": "Sunita Meena",
                    "father_mother_name": "Mohan Lal Meena",
                    "address": "Village Khajuraho, Post Khajuraho",
                    "village": "Khajuraho",
                    "gram_panchayat": "Khajuraho Gram Panchayat",
                    "tehsil_taluka": "Khajuraho",
                    "district": "Bhopal",
                    "state": "Madhya Pradesh",
                    "scheduled_tribe": "Yes",
                    "other_traditional_forest_dweller": "No",
                    "family_members": "Ramesh Kumar Meena (45), Sunita Meena (40), Raj Kumar (18), Priya (16)",
                    "land_area": "2.5 hectares"
                }
            }
            
            response = self.session.post(f"{API_URL}/claims", json=claim_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'claim_data', 'status', 'created_at']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    # Check if coordinates were generated
                    claim_data_resp = data.get('claim_data', {})
                    if claim_data_resp.get('location_lat', 0) != 0 and claim_data_resp.get('location_lng', 0) != 0:
                        self.created_claim_id = data['id']  # Store for later tests
                        self.log_test("Create Claim (No Document)", True, 
                                    f"Claim created with ID: {data['id']}, Coordinates: ({claim_data_resp.get('location_lat')}, {claim_data_resp.get('location_lng')})")
                        return True
                    else:
                        self.log_test("Create Claim (No Document)", False, "Coordinates not generated")
                        return False
                else:
                    self.log_test("Create Claim (No Document)", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Create Claim (No Document)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Claim (No Document)", False, f"Exception: {str(e)}")
            return False
    
    def test_create_claim_with_document(self, upload_data):
        """Test creating claim with uploaded document"""
        if not upload_data:
            self.log_test("Create Claim (With Document)", False, "No upload data available")
            return False
            
        try:
            # Realistic claim data for Tripura
            claim_data = {
                "claimant_name": "Bijoy Tripura",
                "spouse_name": "Kamala Tripura", 
                "father_mother_name": "Ratan Tripura",
                "address": "Village Agartala, Post Agartala",
                "village": "Agartala",
                "gram_panchayat": "Agartala Gram Panchayat",
                "tehsil_taluka": "Agartala",
                "district": "West Tripura",
                "state": "Tripura",
                "scheduled_tribe": "Yes",
                "other_traditional_forest_dweller": "Yes",
                "family_members": "Bijoy Tripura (38), Kamala Tripura (35), Amit (15), Rina (12)",
                "land_area": "1.8 hectares"
            }
            
            # Prepare query parameters as expected by the endpoint
            params = {
                'claim_data': json.dumps(claim_data),
                'file_id': upload_data['file_id'],
                'filename': upload_data['filename'],
                'file_base64': upload_data['file_base64'],
                'extracted_data': json.dumps(upload_data.get('extracted_data', {}))
            }
            
            response = self.session.post(f"{API_URL}/claims-with-document", params=params)
            
            if response.status_code == 200:
                data = response.json()
                if 'claim_id' in data and 'message' in data:
                    self.log_test("Create Claim (With Document)", True, 
                                f"Claim created with document, ID: {data['claim_id']}")
                    return True
                else:
                    self.log_test("Create Claim (With Document)", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Create Claim (With Document)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Claim (With Document)", False, f"Exception: {str(e)}")
            return False
    
    def test_get_all_claims(self):
        """Test retrieving all claims"""
        try:
            response = self.session.get(f"{API_URL}/claims")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check structure of first claim
                        first_claim = data[0]
                        required_fields = ['id', 'claim_data', 'status', 'created_at']
                        missing_fields = [field for field in required_fields if field not in first_claim]
                        
                        if not missing_fields:
                            self.log_test("Get All Claims", True, f"Retrieved {len(data)} claims")
                            return True
                        else:
                            self.log_test("Get All Claims", False, f"Missing fields in claim: {missing_fields}")
                            return False
                    else:
                        self.log_test("Get All Claims", True, "No claims found (empty list)")
                        return True
                else:
                    self.log_test("Get All Claims", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("Get All Claims", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get All Claims", False, f"Exception: {str(e)}")
            return False
    
    def test_get_specific_claim(self):
        """Test retrieving specific claim by ID"""
        if not self.created_claim_id:
            self.log_test("Get Specific Claim", False, "No claim ID available for testing")
            return False
            
        try:
            response = self.session.get(f"{API_URL}/claims/{self.created_claim_id}")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'claim_data', 'status', 'created_at']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    if data['id'] == self.created_claim_id:
                        self.log_test("Get Specific Claim", True, f"Retrieved claim: {data['id']}")
                        return True
                    else:
                        self.log_test("Get Specific Claim", False, f"ID mismatch: expected {self.created_claim_id}, got {data['id']}")
                        return False
                else:
                    self.log_test("Get Specific Claim", False, f"Missing fields: {missing_fields}")
                    return False
            elif response.status_code == 404:
                self.log_test("Get Specific Claim", False, "Claim not found (404)")
                return False
            else:
                self.log_test("Get Specific Claim", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get Specific Claim", False, f"Exception: {str(e)}")
            return False
    
    def test_map_data(self):
        """Test GIS map data endpoint"""
        try:
            response = self.session.get(f"{API_URL}/map-data")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['claims', 'waterbodies']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    claims = data.get('claims', [])
                    waterbodies = data.get('waterbodies', [])
                    
                    # Check waterbodies structure
                    if len(waterbodies) > 0:
                        wb = waterbodies[0]
                        wb_required = ['id', 'name', 'type', 'state', 'district', 'lat', 'lng']
                        wb_missing = [field for field in wb_required if field not in wb]
                        
                        if not wb_missing:
                            self.log_test("GIS Map Data", True, 
                                        f"Retrieved {len(claims)} claims and {len(waterbodies)} waterbodies")
                            return True
                        else:
                            self.log_test("GIS Map Data", False, f"Waterbody missing fields: {wb_missing}")
                            return False
                    else:
                        self.log_test("GIS Map Data", False, "No waterbodies found")
                        return False
                else:
                    self.log_test("GIS Map Data", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("GIS Map Data", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("GIS Map Data", False, f"Exception: {str(e)}")
            return False
    
    def test_recommendations(self):
        """Test Decision Support System recommendations"""
        if not self.created_claim_id:
            self.log_test("DSS Recommendations", False, "No claim ID available for testing")
            return False
            
        try:
            response = self.session.get(f"{API_URL}/recommendations/{self.created_claim_id}")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['claim_id', 'recommendations']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    recommendations = data.get('recommendations', [])
                    if len(recommendations) > 0:
                        # Check structure of first recommendation
                        rec = recommendations[0]
                        rec_required = ['scheme_name', 'description', 'eligibility', 'priority']
                        rec_missing = [field for field in rec_required if field not in rec]
                        
                        if not rec_missing:
                            # Check for expected schemes
                            scheme_names = [r.get('scheme_name', '') for r in recommendations]
                            expected_schemes = ['DAJGUA', 'Jal Shakti', 'Forest Rights Act', 'PM-JANMAN']
                            found_schemes = [scheme for scheme in expected_schemes 
                                           if any(scheme in name for name in scheme_names)]
                            
                            if len(found_schemes) >= 2:  # At least 2 expected schemes
                                self.log_test("DSS Recommendations", True, 
                                            f"Generated {len(recommendations)} recommendations, found schemes: {found_schemes}")
                                return True
                            else:
                                self.log_test("DSS Recommendations", False, 
                                            f"Expected schemes not found. Got: {scheme_names}")
                                return False
                        else:
                            self.log_test("DSS Recommendations", False, f"Recommendation missing fields: {rec_missing}")
                            return False
                    else:
                        self.log_test("DSS Recommendations", False, "No recommendations generated")
                        return False
                else:
                    self.log_test("DSS Recommendations", False, f"Missing fields: {missing_fields}")
                    return False
            elif response.status_code == 404:
                self.log_test("DSS Recommendations", False, "Claim not found for recommendations")
                return False
            else:
                self.log_test("DSS Recommendations", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("DSS Recommendations", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("FOREST RIGHTS ACT CLAIMS MANAGEMENT SYSTEM - BACKEND TESTS")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("Health Check", self.test_health_check),
            ("States-Districts Data", self.test_states_districts),
            ("Document Upload & Processing", lambda: self.test_document_upload()[0]),
            ("Create Claim (No Document)", self.test_create_claim_without_document),
            ("Get All Claims", self.test_get_all_claims),
            ("Get Specific Claim", self.test_get_specific_claim),
            ("GIS Map Data", self.test_map_data),
            ("DSS Recommendations", self.test_recommendations)
        ]
        
        # Special handling for document upload test
        upload_success, upload_data = self.test_document_upload()
        if upload_success:
            tests.append(("Create Claim (With Document)", lambda: self.test_create_claim_with_document(upload_data)))
        
        # Run remaining tests
        for test_name, test_func in tests[3:]:  # Skip already run tests
            test_func()
            time.sleep(0.5)  # Small delay between tests
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # List failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print("\nFAILED TESTS:")
            for test in failed_tests:
                print(f"❌ {test['test']}: {test['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = FRATestSuite()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        sys.exit(1)