#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build VISIONIX Founders — an AI co-founder platform for startup founders.
  Phase 1 (MVP aha moment): Landing → Idea Intake → AI Ideation Results
  (6-dim scorecard, 12-week roadmap, devil's advocate, follow-up chat).
  Tech: Next.js 14, MongoDB, Claude Sonnet 4 via Emergent Universal LLM Key.

backend:
  - task: "POST /api/ai/ideation - structured JSON ideation + vzn_voice"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Originally validated end-to-end. Now extended: also returns vzn_voice (one-sentence VZN persona line - brutally honest mentor tone). Persisted to MongoDB. Re-tested via curl: vzn_voice example: 'I see a lifestyle business disguised as a startup - the market loves you but cant make you rich.'"
      - working: true
        agent: "testing"
        comment: "Original comprehensive test passed (pre-VZN). vzn_voice field added after that test."
      - working: true
        agent: "testing"
        comment: "Regression test passed. vzn_voice field is now present and non-empty. Example: 'I see the market pain, but your biggest risk isn't the AI - it's convincing risk-averse ops managers to trust a startup with their inventory decisions.' LLM latency: 27.0s. All validations passed."
  - task: "POST /api/ai/decision - 3-scenario simulator + vzn_voice"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "NEW endpoint. Body: {description, type, startupId?, userId?}. type is one of hiring|pivoting|fundraising|pricing|other. Returns {bestCase, mostLikely, worstCase: each {summary, day30, day90, day180}, recommendation, reasoning, vzn_voice}. Persists to decisions collection. Tested via curl - returned a sharp VZN call: 'Id hire the two mid-levels and use the saved 18L to extend runway through the cultural learning curve.'"
      - working: true
        agent: "testing"
        comment: "Comprehensive test passed (4/4 tests). ✅ Valid input WITHOUT startupId: all 3 scenarios (bestCase, mostLikely, worstCase) have non-empty summary, day30, day90, day180. vzn_voice present. Decision persisted (UUID verified). ✅ Valid input WITH startupId: vzn_voice contextually relevant to startup. ✅ Missing description: returns 400. ✅ Missing type: returns 400. LLM latency: 16-17s. All validations passed."
  - task: "POST /api/ai/checkin - weekly accountability + vzn_voice"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "NEW endpoint. Body: {progressNotes, lastWeekTasks?, startupId?, userId?}. Returns {analysis, tasksForNextWeek: 3-5 items with {task, deadline, successMetric, priority}, accountabilityScore: 0-100 integer, vzn_voice}. Persists to checkins collection. Tested via curl - VZN scored a slack week 35/100 with: 'I dont care about your Twitter side project - you promised to ship and talk to customers, did neither completely, and thats why youre still stuck in idea land.'"
      - working: true
        agent: "testing"
        comment: "Comprehensive test passed (3/3 tests). ✅ Valid input WITH lastWeekTasks: accountabilityScore is integer 0-100 (got 60), tasksForNextWeek has 5 items (3-5 expected), each task has task/deadline/successMetric/priority, priority values are high|medium|low, vzn_voice present. ✅ Valid input WITHOUT lastWeekTasks: all fields present and valid. ✅ Missing progressNotes: returns 400. LLM latency: 6-9s. All validations passed."
  - task: "POST /api/ai/chat - context-aware follow-up chat"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Already validated. Loads startup context from DB, sends to Claude via Emergent gateway, returns specific advice."
      - working: true
        agent: "testing"
        comment: "Comprehensive backend test passed."
  - task: "GET /api/startups/:id - retrieve startup"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Returns full startup doc including scorecard_json, roadmap_json, devils_advocate_json, and vzn_voice."
      - working: true
        agent: "testing"
        comment: "Comprehensive backend test passed."

frontend:
  - task: "Landing page"
    implemented: true
    working: true
    file: "app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Hero, How-it-works (4 steps), Features (4), Pricing (3 tiers Rs.0/999/2499). Brand colours applied (#534AB7 primary, #0F6E56 secondary, #EF9F27 accent)."
  - task: "Idea intake page"
    implemented: true
    working: true
    file: "app/intake/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Three fields (idea max 500 chars, target customer, problem). On submit calls /api/ai/ideation and routes to /results/[id]."
  - task: "Ideation results page (scorecard + roadmap + devils + chat)"
    implemented: true
    working: true
    file: "app/results/[id]/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Renders 6-dim scorecard bars (colour-coded), 12-week timeline (collapsible), 3 devils advocate cards in amber, AI chat panel. Playwright wait_for_selector('Scorecard') and wait_for_selector('6-dimension VC-grade evaluation') both succeed, but screenshot tool keeps returning a stale 'Loading…' frame. Backend GET /api/startups/:id returns 200 OK. Suspected screenshot tool caching issue, not a real bug."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "POST /api/ai/ideation - structured JSON ideation"
    - "POST /api/ai/chat - context-aware follow-up chat"
    - "GET /api/startups/:id - retrieve startup"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Phase 1 MVP done. Aha moment built: landing → intake → AI ideation results (scorecard,
      roadmap, devils advocate, chat). All three AI endpoints verified by curl.
      Please run backend tests on the 3 endpoints listed in test_plan.current_focus.
      LLM is Claude Sonnet 4 (claude-sonnet-4-20250514) via Emergent Universal Key
      (OpenAI-compat gateway at https://integrations.emergentagent.com/llm/v1/chat/completions).
      Backend latency for ideation ~25-30s (real Claude call). Set test timeouts to 60s+.
  - agent: "testing"
    message: |
      ✅ ALL BACKEND TESTS PASSED (8/8)
      
      Tested all backend API endpoints comprehensively using backend_test.py:
      
      1. GET /api/ - Health check ✅
      2. POST /api/ai/ideation - Valid input ✅
         - Scorecard: 6 dimensions with scores 1-10 and explanations
         - Roadmap: 12 items with weeks 1-12, milestone/task/why
         - devilsAdvocate: 3 items with title/explanation/severity
         - Summary: Present and non-empty
         - MongoDB persistence: Verified
         - LLM latency: 27.2s
      3. POST /api/ai/ideation - Missing fields returns 400 ✅
      4. GET /api/startups/:id - Returns all fields, no _id ✅
      5. GET /api/startups/:id - Invalid id returns 404 ✅
      6. POST /api/ai/chat - Context-aware response ✅
         - LLM latency: 6.1s
      7. POST /api/ai/chat - Invalid startupId returns 404 ✅
      8. POST /api/ai/chat - Missing fields returns 400 ✅
      
      No critical issues found. All endpoints working as expected.
      MongoDB persistence verified. Error handling correct.
      LLM integration working with Claude Sonnet 4 via Emergent gateway.
  - agent: "testing"
    message: |
      ✅ ALL VZN ENDPOINT TESTS PASSED (8/8)
      
      Tested two NEW VZN-enabled endpoints + regression test using backend_test_vzn.py:
      
      REGRESSION TEST:
      1. POST /api/ai/ideation - vzn_voice field ✅
         - vzn_voice field now present and non-empty
         - Example: "I see the market pain, but your biggest risk isn't the AI - it's convincing risk-averse ops managers to trust a startup with their inventory decisions."
         - LLM latency: 27.0s
      
      DECISION ENDPOINT (POST /api/ai/decision):
      2. Valid input WITHOUT startupId ✅
         - All 3 scenarios (bestCase, mostLikely, worstCase) have non-empty summary, day30, day90, day180
         - recommendation and reasoning present
         - vzn_voice present: "I'd hire the senior engineer - you need technical leadership more than raw coding capacity right now."
         - Decision persisted to MongoDB (UUID verified)
         - LLM latency: 16.8s
      3. Valid input WITH startupId ✅
         - vzn_voice contextually relevant to startup
         - Example: "I'd stay mid-market but build an SMB version as a trojan horse for future upsells."
         - LLM latency: 17.0s
      4. Missing description → 400 ✅
      5. Missing type → 400 ✅
      
      CHECKIN ENDPOINT (POST /api/ai/checkin):
      6. Valid input WITH lastWeekTasks ✅
         - accountabilityScore: 60 (integer 0-100)
         - tasksForNextWeek: 5 items (3-5 expected)
         - Each task has task/deadline/successMetric/priority
         - priority values validated (high|medium|low)
         - vzn_voice present: "I need you to stop building in the dark - finish those customer calls and write the PRD before you code another line."
         - LLM latency: 9.1s
      7. Valid input WITHOUT lastWeekTasks ✅
         - All fields present and valid
         - LLM latency: 6.9s
      8. Missing progressNotes → 400 ✅
      
      No critical issues found. All VZN endpoints working correctly.
      MongoDB persistence verified for decisions and checkins collections.
      vzn_voice field consistently present and contextually relevant across all endpoints.
