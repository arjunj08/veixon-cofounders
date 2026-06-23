#!/usr/bin/env python3
"""
Backend API Tests for NEW VZN-enabled endpoints
Tests POST /api/ai/decision, POST /api/ai/checkin, and regression test for POST /api/ai/ideation
"""

import requests
import json
import sys
import time
import re

# Base URL from .env
BASE_URL = "https://founder-launchpad-11.preview.emergentagent.com/api"

# Test data - realistic startup idea
TEST_IDEA = "A B2B SaaS platform that helps mid-sized e-commerce companies optimize their inventory management using AI-powered demand forecasting. The platform integrates with existing ERP systems and provides real-time recommendations to reduce stockouts and overstock situations."
TEST_CUSTOMER = "E-commerce operations managers at mid-sized online retailers (10-100M annual revenue) who struggle with inventory planning and face frequent stockouts or excess inventory costs."
TEST_PROBLEM = "Mid-sized e-commerce companies lose 15-20% of potential revenue due to stockouts and tie up 30-40% of working capital in excess inventory. Current solutions are either too expensive (enterprise tools) or too basic (spreadsheets), leaving a gap for smart, affordable AI-powered forecasting."
TEST_USER_ID = "test_founder_vzn_2024"

def print_test_header(test_name):
    """Print a formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def is_uuid(value):
    """Check if a string is a valid UUID"""
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
    return bool(uuid_pattern.match(str(value)))

# ============================================================================
# REGRESSION TEST: POST /api/ai/ideation - verify vzn_voice field
# ============================================================================

def test_ideation_vzn_voice():
    """Regression test: POST /api/ai/ideation should now include vzn_voice field"""
    print_test_header("REGRESSION: POST /api/ai/ideation - Verify vzn_voice field")
    
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
            timeout=90
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return None
        
        data = response.json()
        
        # Check for vzn_voice field
        if "vzn_voice" not in data:
            print_result(False, "Missing 'vzn_voice' field in response")
            return None
        
        vzn_voice = data["vzn_voice"]
        
        if not vzn_voice or not isinstance(vzn_voice, str):
            print_result(False, f"vzn_voice must be a non-empty string, got: {type(vzn_voice)}")
            return None
        
        if len(vzn_voice.strip()) == 0:
            print_result(False, "vzn_voice is empty or whitespace only")
            return None
        
        print_result(True, f"vzn_voice field present and non-empty")
        print(f"vzn_voice: '{vzn_voice}'")
        
        # Return startup_id for use in decision test
        return data.get("id")
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return None
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

# ============================================================================
# POST /api/ai/decision tests
# ============================================================================

def test_decision_without_startup_id():
    """Test POST /api/ai/decision without startupId"""
    print_test_header("POST /api/ai/decision - Valid input WITHOUT startupId")
    
    try:
        payload = {
            "description": "Should I hire one senior engineer at 30L or two mid-level engineers at 18L each? We need to ship our MVP in 3 months and I'm the only technical co-founder right now.",
            "type": "hiring",
            "userId": TEST_USER_ID
        }
        
        print(f"Sending request (this will take ~10-30s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/decision",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        # Validate id field
        if "id" not in data:
            print_result(False, "Missing 'id' in response")
            return False
        
        if not is_uuid(data["id"]):
            print_result(False, f"id must be a valid UUID, got: {data['id']}")
            return False
        
        print_result(True, f"Decision persisted with id: {data['id']}")
        
        # Validate all three scenarios
        scenarios = ["bestCase", "mostLikely", "worstCase"]
        for scenario in scenarios:
            if scenario not in data:
                print_result(False, f"Missing '{scenario}' in response")
                return False
            
            scenario_data = data[scenario]
            
            # Check for all required keys
            required_keys = ["summary", "day30", "day90", "day180"]
            for key in required_keys:
                if key not in scenario_data:
                    print_result(False, f"Missing '{key}' in {scenario}")
                    return False
                
                if not scenario_data[key] or not isinstance(scenario_data[key], str):
                    print_result(False, f"{scenario}.{key} must be a non-empty string")
                    return False
        
        print_result(True, "All 3 scenarios have non-empty summary, day30, day90, day180")
        
        # Validate recommendation
        if "recommendation" not in data or not data["recommendation"]:
            print_result(False, "Missing or empty 'recommendation' in response")
            return False
        
        print_result(True, f"Recommendation present: {data['recommendation'][:100]}...")
        
        # Validate reasoning
        if "reasoning" not in data or not data["reasoning"]:
            print_result(False, "Missing or empty 'reasoning' in response")
            return False
        
        print_result(True, f"Reasoning present: {data['reasoning'][:100]}...")
        
        # Validate vzn_voice
        if "vzn_voice" not in data or not data["vzn_voice"]:
            print_result(False, "Missing or empty 'vzn_voice' in response")
            return False
        
        vzn_voice = data["vzn_voice"]
        
        # Check it's a single sentence (roughly)
        if not isinstance(vzn_voice, str) or len(vzn_voice.strip()) == 0:
            print_result(False, "vzn_voice must be a non-empty string")
            return False
        
        print_result(True, f"vzn_voice present: '{vzn_voice}'")
        
        print_result(True, "All validations passed for decision endpoint (without startupId)")
        return True
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_decision_with_startup_id(startup_id):
    """Test POST /api/ai/decision with a real startupId"""
    print_test_header(f"POST /api/ai/decision - Valid input WITH startupId={startup_id}")
    
    if not startup_id:
        print_result(False, "No startup_id provided, skipping test")
        return False
    
    try:
        payload = {
            "description": "Should I pivot to focus on small businesses instead of mid-sized companies? I'm getting more inbound interest from SMBs but they have lower budgets.",
            "type": "pivoting",
            "startupId": startup_id,
            "userId": TEST_USER_ID
        }
        
        print(f"Sending request (this will take ~10-30s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/decision",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        # Validate id field
        if "id" not in data or not is_uuid(data["id"]):
            print_result(False, "Missing or invalid 'id' in response")
            return False
        
        print_result(True, f"Decision persisted with id: {data['id']}")
        
        # Validate vzn_voice is relevant to startup context
        if "vzn_voice" not in data or not data["vzn_voice"]:
            print_result(False, "Missing or empty 'vzn_voice' in response")
            return False
        
        vzn_voice = data["vzn_voice"]
        print_result(True, f"vzn_voice present: '{vzn_voice}'")
        
        # Check that the response seems contextually aware
        # (We can't verify exact content, but we can check it's not generic)
        if len(vzn_voice) < 20:
            print_result(False, f"vzn_voice seems too short to be meaningful: '{vzn_voice}'")
            return False
        
        print_result(True, "vzn_voice appears to be contextually relevant to startup")
        
        print_result(True, "All validations passed for decision endpoint (with startupId)")
        return True
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_decision_missing_description():
    """Test POST /api/ai/decision with missing description"""
    print_test_header("POST /api/ai/decision - Missing description")
    
    try:
        payload = {
            "type": "hiring"
            # Missing description
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/decision",
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

def test_decision_missing_type():
    """Test POST /api/ai/decision with missing type"""
    print_test_header("POST /api/ai/decision - Missing type")
    
    try:
        payload = {
            "description": "Should I hire someone?"
            # Missing type
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/decision",
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

# ============================================================================
# POST /api/ai/checkin tests
# ============================================================================

def test_checkin_with_tasks():
    """Test POST /api/ai/checkin with lastWeekTasks (mix of done/not done)"""
    print_test_header("POST /api/ai/checkin - Valid input with lastWeekTasks")
    
    try:
        payload = {
            "progressNotes": "This week I completed the MVP wireframes and started building the frontend. I also had 3 customer discovery calls with potential users. One of them expressed strong interest and wants to be a beta tester. I'm feeling good about the progress but worried about the timeline.",
            "lastWeekTasks": [
                {"task": "Complete MVP wireframes", "done": True},
                {"task": "Talk to 5 potential customers", "done": False},
                {"task": "Set up development environment", "done": True},
                {"task": "Write product requirements doc", "done": False}
            ],
            "userId": TEST_USER_ID
        }
        
        print(f"Sending request (this will take ~10-30s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/checkin",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        # Validate id field
        if "id" not in data:
            print_result(False, "Missing 'id' in response")
            return False
        
        if not is_uuid(data["id"]):
            print_result(False, f"id must be a valid UUID, got: {data['id']}")
            return False
        
        print_result(True, f"Check-in persisted with id: {data['id']}")
        
        # Validate analysis
        if "analysis" not in data or not data["analysis"]:
            print_result(False, "Missing or empty 'analysis' in response")
            return False
        
        print_result(True, f"Analysis present: {data['analysis'][:100]}...")
        
        # Validate tasksForNextWeek
        if "tasksForNextWeek" not in data:
            print_result(False, "Missing 'tasksForNextWeek' in response")
            return False
        
        tasks = data["tasksForNextWeek"]
        
        if not isinstance(tasks, list):
            print_result(False, f"tasksForNextWeek must be an array, got {type(tasks)}")
            return False
        
        if len(tasks) < 3 or len(tasks) > 5:
            print_result(False, f"tasksForNextWeek must have 3-5 items, got {len(tasks)}")
            return False
        
        print_result(True, f"tasksForNextWeek has {len(tasks)} items (3-5 expected)")
        
        # Validate each task
        for i, task in enumerate(tasks):
            required_keys = ["task", "deadline", "successMetric", "priority"]
            for key in required_keys:
                if key not in task:
                    print_result(False, f"Task {i} missing '{key}'")
                    return False
                
                if not task[key] or not isinstance(task[key], str):
                    print_result(False, f"Task {i}.{key} must be a non-empty string")
                    return False
            
            # Validate priority is one of high|medium|low
            if task["priority"] not in ["high", "medium", "low"]:
                print_result(False, f"Task {i} has invalid priority: {task['priority']} (must be high|medium|low)")
                return False
        
        print_result(True, "All tasks have task/deadline/successMetric/priority with valid values")
        
        # Validate accountabilityScore
        if "accountabilityScore" not in data:
            print_result(False, "Missing 'accountabilityScore' in response")
            return False
        
        score = data["accountabilityScore"]
        
        if not isinstance(score, int):
            print_result(False, f"accountabilityScore must be an integer, got {type(score)}")
            return False
        
        if score < 0 or score > 100:
            print_result(False, f"accountabilityScore must be 0-100, got {score}")
            return False
        
        print_result(True, f"accountabilityScore is valid: {score}")
        
        # Validate vzn_voice
        if "vzn_voice" not in data or not data["vzn_voice"]:
            print_result(False, "Missing or empty 'vzn_voice' in response")
            return False
        
        vzn_voice = data["vzn_voice"]
        
        if not isinstance(vzn_voice, str) or len(vzn_voice.strip()) == 0:
            print_result(False, "vzn_voice must be a non-empty string")
            return False
        
        print_result(True, f"vzn_voice present: '{vzn_voice}'")
        
        print_result(True, "All validations passed for checkin endpoint (with tasks)")
        return True
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_checkin_without_tasks():
    """Test POST /api/ai/checkin without lastWeekTasks"""
    print_test_header("POST /api/ai/checkin - Valid input without lastWeekTasks")
    
    try:
        payload = {
            "progressNotes": "First week working on the startup. I've been doing market research and talking to potential customers. No code written yet but I have a clear picture of the problem space now.",
            "userId": TEST_USER_ID
        }
        
        print(f"Sending request (this will take ~10-30s due to LLM processing)...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/ai/checkin",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=90
        )
        
        elapsed = time.time() - start_time
        print(f"Response received in {elapsed:.1f}s")
        
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        # Basic validations
        if "id" not in data or not is_uuid(data["id"]):
            print_result(False, "Missing or invalid 'id' in response")
            return False
        
        if "analysis" not in data or not data["analysis"]:
            print_result(False, "Missing or empty 'analysis' in response")
            return False
        
        if "tasksForNextWeek" not in data or not isinstance(data["tasksForNextWeek"], list):
            print_result(False, "Missing or invalid 'tasksForNextWeek' in response")
            return False
        
        if "accountabilityScore" not in data or not isinstance(data["accountabilityScore"], int):
            print_result(False, "Missing or invalid 'accountabilityScore' in response")
            return False
        
        if "vzn_voice" not in data or not data["vzn_voice"]:
            print_result(False, "Missing or empty 'vzn_voice' in response")
            return False
        
        print_result(True, "All validations passed for checkin endpoint (without tasks)")
        return True
        
    except requests.Timeout:
        print_result(False, "Request timed out after 90s")
        return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_checkin_missing_progress_notes():
    """Test POST /api/ai/checkin with missing progressNotes"""
    print_test_header("POST /api/ai/checkin - Missing progressNotes")
    
    try:
        payload = {
            "lastWeekTasks": [
                {"task": "Do something", "done": True}
            ]
            # Missing progressNotes
        }
        
        response = requests.post(
            f"{BASE_URL}/ai/checkin",
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

# ============================================================================
# Main test runner
# ============================================================================

def main():
    """Run all VZN endpoint tests"""
    print("\n" + "="*80)
    print("VISIONIX Founders - VZN Endpoints Test Suite")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing: POST /api/ai/decision, POST /api/ai/checkin")
    print(f"Regression: POST /api/ai/ideation (vzn_voice field)")
    print(f"Note: LLM calls will take ~10-30s each")
    print("="*80)
    
    results = {}
    startup_id = None
    
    # ========== REGRESSION TEST ==========
    print("\n" + "="*80)
    print("REGRESSION TEST: POST /api/ai/ideation")
    print("="*80)
    
    startup_id = test_ideation_vzn_voice()
    results["ideation_vzn_voice"] = startup_id is not None
    
    # ========== DECISION ENDPOINT TESTS ==========
    print("\n" + "="*80)
    print("DECISION ENDPOINT TESTS: POST /api/ai/decision")
    print("="*80)
    
    results["decision_without_startup"] = test_decision_without_startup_id()
    results["decision_with_startup"] = test_decision_with_startup_id(startup_id)
    results["decision_missing_description"] = test_decision_missing_description()
    results["decision_missing_type"] = test_decision_missing_type()
    
    # ========== CHECKIN ENDPOINT TESTS ==========
    print("\n" + "="*80)
    print("CHECKIN ENDPOINT TESTS: POST /api/ai/checkin")
    print("="*80)
    
    results["checkin_with_tasks"] = test_checkin_with_tasks()
    results["checkin_without_tasks"] = test_checkin_without_tasks()
    results["checkin_missing_progress"] = test_checkin_missing_progress_notes()
    
    # ========== SUMMARY ==========
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print("\nREGRESSION:")
    print(f"  {'✅ PASS' if results['ideation_vzn_voice'] else '❌ FAIL'}: ideation_vzn_voice")
    
    print("\nDECISION ENDPOINT:")
    print(f"  {'✅ PASS' if results['decision_without_startup'] else '❌ FAIL'}: decision_without_startup")
    print(f"  {'✅ PASS' if results['decision_with_startup'] else '❌ FAIL'}: decision_with_startup")
    print(f"  {'✅ PASS' if results['decision_missing_description'] else '❌ FAIL'}: decision_missing_description")
    print(f"  {'✅ PASS' if results['decision_missing_type'] else '❌ FAIL'}: decision_missing_type")
    
    print("\nCHECKIN ENDPOINT:")
    print(f"  {'✅ PASS' if results['checkin_with_tasks'] else '❌ FAIL'}: checkin_with_tasks")
    print(f"  {'✅ PASS' if results['checkin_without_tasks'] else '❌ FAIL'}: checkin_without_tasks")
    print(f"  {'✅ PASS' if results['checkin_missing_progress'] else '❌ FAIL'}: checkin_missing_progress")
    
    print("\n" + "="*80)
    print(f"TOTAL: {passed}/{total} tests passed")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
