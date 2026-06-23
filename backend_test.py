#!/usr/bin/env python3
"""
Backend API Tests for VISIONIX Founders
Tests all backend endpoints with proper timeouts for LLM calls
"""

import requests
import json
import sys
import time

# Base URL from .env
BASE_URL = "https://founder-launchpad-11.preview.emergentagent.com/api"

# Test data - realistic startup idea
TEST_IDEA = "A B2B SaaS platform that helps mid-sized e-commerce companies optimize their inventory management using AI-powered demand forecasting. The platform integrates with existing ERP systems and provides real-time recommendations to reduce stockouts and overstock situations."
TEST_CUSTOMER = "E-commerce operations managers at mid-sized online retailers (10-100M annual revenue) who struggle with inventory planning and face frequent stockouts or excess inventory costs."
TEST_PROBLEM = "Mid-sized e-commerce companies lose 15-20% of potential revenue due to stockouts and tie up 30-40% of working capital in excess inventory. Current solutions are either too expensive (enterprise tools) or too basic (spreadsheets), leaving a gap for smart, affordable AI-powered forecasting."
TEST_USER_ID = "test_founder_2024"

def print_test_header(test_name):
    """Print a formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def test_health_check():
    """Test GET /api/ endpoint"""
    print_test_header("GET /api/ - Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if data.get("app") != "VISIONIX Founders":
            print_result(False, f"Expected app='VISIONIX Founders', got {data.get('app')}")
            return False
        
        if data.get("ok") != True:
            print_result(False, f"Expected ok=true, got {data.get('ok')}")
            return False
        
        print_result(True, "Health check passed")
        print(f"Response: {json.dumps(data, indent=2)}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_ideation_valid():
    """Test POST /api/ai/ideation with valid input"""
    print_test_header("POST /api/ai/ideation - Valid Input")
    
    try:
        payload = {
            "idea": TEST_IDEA,
            "targetCustomer": TEST_CUSTOMER,
            "problem": TEST_PROBLEM,
            "userId": TEST_USER_ID
        }
        
        print(f"Sending request (this will take ~25-35s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/ideation",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90  # Generous timeout for LLM
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return None
        
        data = response.json()
        
        # Validate response structure
        if "id" not in data:
            print_result(False, "Missing 'id' in response")
            return None
        
        startup_id = data["id"]
        print(f"Created startup with id: {startup_id}")
        
        # Validate scorecard
        if "scorecard" not in data:
            print_result(False, "Missing 'scorecard' in response")
            return None
        
        scorecard = data["scorecard"]
        required_dims = ["market", "moat", "timing", "founderFit", "monetisation", "risk"]
        
        for dim in required_dims:
            if dim not in scorecard:
                print_result(False, f"Missing dimension '{dim}' in scorecard")
                return None
            
            if "score" not in scorecard[dim]:
                print_result(False, f"Missing 'score' in scorecard.{dim}")
                return None
            
            score = scorecard[dim]["score"]
            if not isinstance(score, (int, float)) or score < 1 or score > 10:
                print_result(False, f"Invalid score {score} in scorecard.{dim} (must be 1-10)")
                return None
            
            if "explanation" not in scorecard[dim]:
                print_result(False, f"Missing 'explanation' in scorecard.{dim}")
                return None
        
        print_result(True, f"Scorecard has all 6 dimensions with valid scores")
        
        # Validate roadmap
        if "roadmap" not in data:
            print_result(False, "Missing 'roadmap' in response")
            return None
        
        roadmap = data["roadmap"]
        
        if not isinstance(roadmap, list):
            print_result(False, f"Roadmap must be an array, got {type(roadmap)}")
            return None
        
        if len(roadmap) != 12:
            print_result(False, f"Roadmap must have exactly 12 items, got {len(roadmap)}")
            return None
        
        # Validate roadmap items
        for i, item in enumerate(roadmap):
            expected_week = i + 1
            if item.get("week") != expected_week:
                print_result(False, f"Roadmap item {i} has week={item.get('week')}, expected {expected_week}")
                return None
            
            if "milestone" not in item or not item["milestone"]:
                print_result(False, f"Roadmap item {i} missing 'milestone'")
                return None
            
            if "task" not in item or not item["task"]:
                print_result(False, f"Roadmap item {i} missing 'task'")
                return None
            
            if "why" not in item or not item["why"]:
                print_result(False, f"Roadmap item {i} missing 'why'")
                return None
        
        print_result(True, f"Roadmap has 12 items with weeks 1-12, all with milestone/task/why")
        
        # Validate devilsAdvocate
        if "devilsAdvocate" not in data:
            print_result(False, "Missing 'devilsAdvocate' in response")
            return None
        
        devils = data["devilsAdvocate"]
        
        if not isinstance(devils, list):
            print_result(False, f"devilsAdvocate must be an array, got {type(devils)}")
            return None
        
        if len(devils) != 3:
            print_result(False, f"devilsAdvocate must have exactly 3 items, got {len(devils)}")
            return None
        
        for i, item in enumerate(devils):
            if "title" not in item or not item["title"]:
                print_result(False, f"devilsAdvocate item {i} missing 'title'")
                return None
            
            if "explanation" not in item or not item["explanation"]:
                print_result(False, f"devilsAdvocate item {i} missing 'explanation'")
                return None
            
            if "severity" not in item or item["severity"] not in ["high", "medium"]:
                print_result(False, f"devilsAdvocate item {i} has invalid severity: {item.get('severity')}")
                return None
        
        print_result(True, f"devilsAdvocate has 3 items with title/explanation/severity")
        
        # Validate summary
        if "summary" not in data or not data["summary"]:
            print_result(False, "Missing or empty 'summary' in response")
            return None
        
        print_result(True, f"Summary present: {data['summary'][:100]}...")
        
        print_result(True, "All validations passed for ideation endpoint")
        return startup_id
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return None
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_ideation_missing_fields():
    """Test POST /api/ai/ideation with missing fields"""
    print_test_header("POST /api/ai/ideation - Missing Fields")
    
    try:
        payload = {
            "idea": TEST_IDEA
            # Missing targetCustomer and problem
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/ideation",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        
        if "error" not in data:
            print_result(False, "Expected 'error' field in response")
            return False
        
        print_result(True, f"Correctly returned 400 with error: {data['error']}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_get_startup(startup_id):
    """Test GET /api/startups/:id"""
    print_test_header(f"GET /api/startups/{startup_id} - Retrieve Startup")
    
    try:
        response = requests.get(f"{BASE_URL}/startups/{startup_id}", timeout=10)
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        # Validate no MongoDB _id field
        if "_id" in data:
            print_result(False, "Response should not contain MongoDB '_id' field")
            return False
        
        # Validate expected fields
        required_fields = ["id", "idea_text", "target_customer", "problem", 
                          "scorecard_json", "roadmap_json", "devils_advocate_json", "summary"]
        
        for field in required_fields:
            if field not in data:
                print_result(False, f"Missing required field: {field}")
                return False
        
        # Validate the id matches
        if data["id"] != startup_id:
            print_result(False, f"Expected id={startup_id}, got {data['id']}")
            return False
        
        # Validate scorecard_json structure
        scorecard = data["scorecard_json"]
        if not isinstance(scorecard, dict) or len(scorecard) != 6:
            print_result(False, f"scorecard_json should have 6 dimensions, got {len(scorecard)}")
            return False
        
        # Validate roadmap_json structure
        roadmap = data["roadmap_json"]
        if not isinstance(roadmap, list) or len(roadmap) != 12:
            print_result(False, f"roadmap_json should have 12 items, got {len(roadmap)}")
            return False
        
        # Validate devils_advocate_json structure
        devils = data["devils_advocate_json"]
        if not isinstance(devils, list) or len(devils) != 3:
            print_result(False, f"devils_advocate_json should have 3 items, got {len(devils)}")
            return False
        
        print_result(True, "Successfully retrieved startup with all expected fields")
        print(f"Startup idea: {data['idea_text'][:100]}...")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_get_startup_invalid_id():
    """Test GET /api/startups/:id with invalid id"""
    print_test_header("GET /api/startups/invalid-id - Invalid ID")
    
    try:
        invalid_id = "00000000-0000-0000-0000-000000000000"
        response = requests.get(f"{BASE_URL}/startups/{invalid_id}", timeout=10)
        
        if response.status_code != 404:
            print_result(False, f"Expected status 404, got {response.status_code}")
            return False
        
        data = response.json()
        
        if "error" not in data:
            print_result(False, "Expected 'error' field in response")
            return False
        
        print_result(True, f"Correctly returned 404 with error: {data['error']}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_chat_valid(startup_id):
    """Test POST /api/ai/chat with valid input"""
    print_test_header(f"POST /api/ai/chat - Valid Input (startup_id={startup_id})")
    
    try:
        payload = {
            "startupId": startup_id,
            "userId": TEST_USER_ID,
            "messages": [
                {
                    "role": "user",
                    "content": "What should be my first priority in week 1 of the roadmap?"
                }
            ]
        }
        
        print(f"Sending chat request (this will take ~25-35s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90  # Generous timeout for LLM
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        if "text" not in data:
            print_result(False, "Missing 'text' in response")
            return False
        
        if not data["text"] or not isinstance(data["text"], str):
            print_result(False, f"Expected non-empty string in 'text', got: {type(data['text'])}")
            return False
        
        print_result(True, "Chat response received successfully")
        print(f"Response text: {data['text'][:200]}...")
        return True
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_chat_invalid_startup_id():
    """Test POST /api/ai/chat with invalid startupId"""
    print_test_header("POST /api/ai/chat - Invalid Startup ID")
    
    try:
        payload = {
            "startupId": "00000000-0000-0000-0000-000000000000",
            "userId": TEST_USER_ID,
            "messages": [
                {
                    "role": "user",
                    "content": "Test message"
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 404:
            print_result(False, f"Expected status 404, got {response.status_code}")
            return False
        
        data = response.json()
        
        if "error" not in data:
            print_result(False, "Expected 'error' field in response")
            return False
        
        print_result(True, f"Correctly returned 404 with error: {data['error']}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_chat_missing_fields():
    """Test POST /api/ai/chat with missing fields"""
    print_test_header("POST /api/ai/chat - Missing Fields")
    
    try:
        payload = {
            "startupId": "some-id"
            # Missing messages array
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        
        if "error" not in data:
            print_result(False, "Expected 'error' field in response")
            return False
        
        print_result(True, f"Correctly returned 400 with error: {data['error']}")
        return True
        
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("VISIONIX Founders - Backend API Test Suite")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Note: LLM calls will take ~25-35s each")
    print("="*80)
    
    results = {}
    startup_id = None
    
    # Test 1: Health check
    results["health_check"] = test_health_check()
    
    # Test 2: Ideation with valid input (creates a startup)
    startup_id = test_ideation_valid()
    results["ideation_valid"] = startup_id is not None
    
    # Test 3: Ideation with missing fields
    results["ideation_missing_fields"] = test_ideation_missing_fields()
    
    # Only run remaining tests if we have a valid startup_id
    if startup_id:
        # Test 4: Get startup by id
        results["get_startup"] = test_get_startup(startup_id)
        
        # Test 5: Get startup with invalid id
        results["get_startup_invalid"] = test_get_startup_invalid_id()
        
        # Test 6: Chat with valid input
        results["chat_valid"] = test_chat_valid(startup_id)
        
        # Test 7: Chat with invalid startup id
        results["chat_invalid_startup"] = test_chat_invalid_startup_id()
        
        # Test 8: Chat with missing fields
        results["chat_missing_fields"] = test_chat_missing_fields()
    else:
        print("\n⚠️  Skipping remaining tests because ideation failed to create a startup")
        results["get_startup"] = False
        results["get_startup_invalid"] = False
        results["chat_valid"] = False
        results["chat_invalid_startup"] = False
        results["chat_missing_fields"] = False
    
    # Print summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("="*80)
    print(f"TOTAL: {passed}/{total} tests passed")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
