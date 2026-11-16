export const block2FlowsExecution = {
  id: 'block-2',
  num: '02',
  title: 'DECLARATIVE AUTOMATION (FLOWS), BULKIFICATION & ORDER OF EXECUTION',
  weeks: 'Weeks 3–4',
  badgeColor: '#06b6d4',
  summary: 'Master Salesforce Flow Builder at an Architect level: how Flow Interviews batch 200 records under the hood, Before-Save vs. After-Save, reactive Screen Flows, Fault Paths, @InvocableMethod Apex bridges, and the complete 20-step Save Order of Execution.',
  lessons: [
    {
      id: '2-1',
      title: 'Flow Engine Architecture & The 5 Core Flow Types',
      duration: 'Day 15–16',
      summary: 'Why Workflow Rules and Process Builder were retired, how a Flow Interview executes in memory, the 2,000-element limit, and the 5 Flow types.',
      interviewTrap: 'What is the maximum number of Flow elements a single Flow Interview can execute at runtime before failing with "LIMIT_EXCEEDED: Number of iterations exceeded"? Answer: 2,000 executed elements per Flow Interview! That is why looping over 500 records with 4 elements inside the loop (500 x 4 = 2,000) crashes a Flow, and why large loops belong in Apex or must use the Flow Transform element.',
      concepts: [
        {
          title: '1. Why Salesforce Retired Workflow Rules & Process Builder in Favor of Flow',
          body: 'Historically, Salesforce had 3 declarative tools: <em>Workflow Rules</em>, <em>Process Builder</em>, and <em>Flows</em>. Workflow Rules and Process Builder ran late in the Save Order of Execution (after Apex After Triggers) and caused massive performance degradation because every field update triggered a brand-new database save cycle.<br>Today, <strong>Flow Builder</strong> is Salesforce\'s single unified declarative automation engine. Flows compile into optimized metadata XML (<code>*.flow-meta.xml</code>) and execute as runtime instances called <strong>Flow Interviews</strong>.'
        },
        {
          title: '2. The 5 Core Types of Flows & Their Triggering Mechanisms',
          body: '1. <strong>Record-Triggered Flow:</strong> Fires automatically inside the database transaction when a record is created, updated, created/updated, or deleted. Supports synchronous paths (<em>Before-Save</em> and <em>After-Save</em>) and asynchronous paths (<em>Run Asynchronously</em> post-commit for external HTTP callouts).<br>2. <strong>Screen Flow:</strong> Renders interactive UI wizards inside Lightning Pages, Quick Actions, Utility Bars, or Experience Cloud portals. Always runs in user context by default (can be elevated to System Context in Advanced properties).<br>3. <strong>Schedule-Triggered Flow:</strong> Runs in background batches at a specified time and frequency (Once, Daily, Weekly). Queries records matching its Start filter and spawns 1 Flow Interview per record, grouped into chunks of 200.<br>4. <strong>Platform Event-Triggered Flow:</strong> Subscribes to a custom <em>Platform Event (<code>__e</code>)</em> channel and executes in background as Automated Process user when event messages arrive.<br>5. <strong>Autolaunched Flow (No Trigger):</strong> Reusable headless logic module invoked as a <strong>Subflow</strong> from another Flow, called from Apex (<code>Flow.Interview.MyFlow</code>), or triggered via REST API.'
        },
        {
          title: '3. Flow Execution Context: User Context vs. System Context',
          body: '• <strong>Record-Triggered Flows</strong> always run in <strong>System Context Without Sharing</strong> (they can read and update all fields and related records regardless of the triggering user\'s FLS or Sharing Rules).<br>• <strong>Screen Flows</strong> run in <strong>User Context</strong> by default (enforcing the logged-in user\'s Object CRUD, FLS, and Sharing Rules), unless an Architect explicitly overrides <em>"How to Run the Flow"</em> in Advanced Settings to <code>System Context with Sharing</code> or <code>System Context without Sharing</code>.'
        }
      ],
      table: {
        headers: ['Flow Type', 'Supports Screens?', 'Default Execution Context', 'Supports HTTP Callouts?'],
        rows: [
          ['Record-Triggered (Before-Save)', 'No', 'System Context Without Sharing', 'No (runs inside open DB save before commit)'],
          ['Record-Triggered (After-Save)', 'No', 'System Context Without Sharing', 'Only via an Asynchronous Path or Async Apex'],
          ['Screen Flow', 'Yes', 'User Context (configurable to System)', 'Yes (between Screen transactions)'],
          ['Schedule-Triggered Flow', 'No', 'System Context Without Sharing', 'Only via @InvocableMethod with @future/Queueable'],
          ['Autolaunched Flow (Subflow)', 'No', 'Inherits caller context (configurable)', 'Yes (if not called from an active DB trigger)']
        ]
      },
      steps: [
        {
          id: 's-2-1-1',
          label: 'Explore Flow Builder in Setup',
          detail: 'Go to <strong>Setup (⚙️) → Quick Find → Flows → New Flow</strong> and inspect the 5 core templates available.'
        }
      ]
    },
    {
      id: '2-2',
      title: 'Record-Triggered Flows: Before-Save (Fast Field Updates) vs. After-Save & Entry Criteria',
      duration: 'Day 17–18',
      summary: 'Deep performance comparison between Fast Field Updates and Actions & Related Records, $Record vs. $Record__Prior, and entry condition optimization.',
      interviewTrap: 'What is the difference between the two radio options for "When to Run the Flow for Updated Records": (A) "Every time a record is updated and meets the condition requirements" vs. (B) "Only when a record is updated to meet the condition requirements"? Answer: Option A runs on EVERY subsequent edit as long as Status == "Active". Option B only runs on the exact state transition when Status changes FROM something else TO "Active" (equivalent to ISCHANGED() in Apex!).',
      concepts: [
        {
          title: '1. Before-Save Flows (Fast Field Updates) Internals',
          body: 'When you select <strong>Optimize the Flow for: Fast Field Updates</strong>:<br>• <strong>Execution Timing:</strong> Runs at Step 3 of the Save Order of Execution—<em>before</em> Apex Before Triggers, <em>before</em> Validation Rules, and <em>before</em> the record is written to the database.<br>• <strong>Zero DML Overhead:</strong> Updating <code>{!$Record.Provisioning_Status__c} = \'Draft\'</code> mutates the in-memory buffer directly. It consumes <strong>0 DML statements</strong> out of your 150 limit and takes ~1ms.<br>• <strong>Strict Restrictions:</strong> Because the record has not been saved yet, <code>{!$Record.Id}</code> is null on <code>create</code>. You can ONLY read records (<code>Get Records</code>), make decisions, assign values to <code>$Record</code>, or display a <code>Custom Error</code>. You CANNOT create, update, or delete any other records, send emails, or callSubflows/Apex.'
        },
        {
          title: '2. After-Save Flows (Actions and Related Records) Internals',
          body: 'When you select <strong>Optimize the Flow for: Actions and Related Records</strong>:<br>• <strong>Execution Timing:</strong> Runs at Step 10 of the Save Order of Execution—<em>after</em> the record has been saved to the database (so <code>{!$Record.Id}</code> is populated) and <em>after</em> Apex After Triggers.<br>• <strong>Full Capabilities:</strong> Can execute <code>Create Records</code>, <code>Update Records</code> (on child or parent objects), <code>Delete Records</code>, invoke <code>Subflows</code>, send emails/Slack notifications, publish Platform Events, and invoke <code>@InvocableMethod</code> Apex classes.<br>• <strong>Global Variables Available:</strong> <code>{!$Record}</code> (new field values) and <code>{!$Record__Prior}</code> (previous field values before the update, equivalent to <code>Trigger.old</code>).'
        }
      ],
      steps: [
        {
          id: 's-2-2-1',
          label: 'Build and activate Fulfillment_Center_Before_Create (Fast Field Updates)',
          detail: 'In <strong>Setup → Flows → New Flow → Record-Triggered Flow</strong>: Object <code>Fulfillment Center</code>, trigger when <code>A record is created</code>, Condition: <code>Provisioning_Status__c Is Null {!$GlobalConstant.True}</code>, Optimize for <strong>Fast Field Updates</strong>. Add <code>Update Triggering Record</code> setting <code>Provisioning_Status__c = Draft</code>. Save as <code>Fulfillment_Center_Before_Create</code> and click <strong>Activate</strong>.'
        },
        {
          id: 's-2-2-2',
          label: 'Build and activate Opportunity_After_Closed_Won (Actions & Related Records)',
          detail: 'Create a <strong>Record-Triggered Flow</strong> on <code>Opportunity</code> when <code>A record is created or updated</code>, Condition: <code>StageName Equals Closed Won</code>, select <strong>Only when a record is updated to meet the condition requirements</strong>, Optimize for <strong>Actions and Related Records</strong>. Add <code>Create Records</code> for Object <code>Task</code> with <code>Subject = Configure Dark Stores for Closed Won Deal</code>, <code>WhatId = {!$Record.AccountId}</code>, <code>OwnerId = {!$Record.OwnerId}</code>, and <code>ActivityDate = {!$Flow.CurrentDate}</code>. Save as <code>Opportunity_After_Closed_Won</code> and click <strong>Activate</strong>.'
        },
        {
          id: 's-2-2-3',
          label: 'Test closing Farmatodo- and retrieve both Flows into VS Code',
          detail: 'Set Opportunity <code>Farmatodo-</code> to <code>Closed Won</code>, verify the Task appears on the <code>Farmatodo</code> Account, and run: <code>sf project retrieve start -m Flow:Fulfillment_Center_Before_Create -m Flow:Opportunity_After_Closed_Won</code>.'
        }
      ]
    },
    {
      id: '2-3',
      title: 'Flow Bulkification Internals: How 200 Flow Interviews Batch DML & SOQL Under the Hood',
      duration: 'Day 19–20',
      summary: 'How the Flow engine pauses and batches 200 parallel Flow Interviews at pink Data elements, the Loop anti-pattern, the "In" operator, and the Transform element.',
      interviewTrap: 'If Data Loader inserts 200 Opportunities at once, and Opportunity_After_Closed_Won has a "Create Records" element to insert a Task, does Salesforce execute 200 separate DML insert statements (exceeding the 150 DML limit)? Answer: NO! Salesforce spawns 200 Flow Interviews, pauses each one when it reaches the pink "Create Records" element, batches all 200 Tasks together, and executes 1 single bulk DML insert statement for all 200 interviews!',
      concepts: [
        {
          title: '1. How Automatic Cross-Interview Bulkification Works',
          body: 'Many developers misunderstand how Flows handle bulk operations. When 200 records are updated in a single transaction:<br>1. Salesforce creates up to <strong>200 Flow Interviews</strong> (one per record).<br>2. Each Interview executes its non-database elements (Decisions, Assignments, Formulas) in memory until it hits a bulkifiable pink Data element (<code>Get Records</code>, <code>Create Records</code>, <code>Update Records</code>, <code>Delete Records</code>) or an <code>@InvocableMethod</code>.<br>3. The Flow engine <strong>pauses that Interview and waits</strong> until all 200 Interviews reach that same element, then executes <strong>1 single batched SOQL query or 1 single batched DML statement</strong> across all 200 Interviews!'
        },
        {
          title: '2. Within-Interview Bulkification: Why Pink Elements Inside a Loop Still Crash',
          body: 'Cross-interview bulkification saves you when 200 parent records trigger a Flow, but what happens when <strong>1 single Flow Interview loops over 151 child records</strong> and you put an <code>Update Records</code> element <em>inside</em> the <code>Loop</code>?<br>That single Interview hits the pink element 151 separate times sequentially, consuming <strong>151 DML statements</strong> and crashing at #151 with <code>Too many DML statements: 151</code>!<br><strong>The Mandatory Pattern:</strong><br>• Before the Loop: Query child records with a single <code>Get Records</code> (or filter using the <strong><code>In</code></strong> operator against a collection of IDs).<br>• Inside the Loop: Use 1 or 2 orange <code>Assignment</code> elements to modify fields on the <code>Current Item from Loop</code> and add it (`Add` operator) to a new <code>Record Collection Variable</code> (e.g., <code>storesToUpdate</code>).<br>• After the Loop (`After Last` path): Place 1 single pink <code>Update Records</code> element passing the <code>storesToUpdate</code> collection!'
        },
        {
          title: '3. The Modern "Transform" Element (Replacing Loops for Data Mapping)',
          body: 'Salesforce introduced the <strong>Transform</strong> element in Flow Builder to map and transform fields from a Source Collection to a Target Collection (or aggregate sums/counts) visually in a single step—consuming only <strong>1 element</strong> toward the 2,000-element limit instead of 3 elements per loop iteration!'
        }
      ],
      table: {
        headers: ['Anti-Pattern in Flow', 'Governor Limit Violated', 'Architect-Grade Solution'],
        rows: [
          ['Get Records inside a Loop', '100 SOQL Queries per transaction', 'Collect IDs in a Text Collection inside the loop, then run 1 Get Records using the "In" operator outside the loop'],
          ['Create / Update Records inside a Loop', '150 DML Statements per transaction', 'Assign modified records to a Record Collection Variable inside the loop, then run 1 DML element on "After Last"'],
          ['Looping over 800+ records with 3 Assignments', '2,000 Executed Elements per Flow Interview', 'Use the Flow "Transform" element or delegate the loop to an @InvocableMethod Apex class']
        ]
      },
      steps: [
        {
          id: 's-2-3-1',
          label: 'Inspect the retrieved XML of Opportunity_After_Closed_Won.flow-meta.xml',
          detail: 'Open <code>force-app/main/default/flows/Opportunity_After_Closed_Won.flow-meta.xml</code> in VS Code to see how Flow elements are represented in XML.'
        }
      ]
    },
    {
      id: '2-4',
      title: 'Screen Flows, Reactive Components, Fault Paths & Custom Error Elements',
      duration: 'Day 21–23',
      summary: 'How to pass recordId or full SObjects into Screen Flows, Reactive Screen Components, Roll Back Records, Fault Paths, and inline Custom Error elements.',
      interviewTrap: 'What happens if a Screen Flow executes a "Create Records" element before Screen 1, and then a second "Create Records" element after Screen 1 fails with a DML error? Answer: Because each Screen boundary commits the previous database transaction, the first record is ALREADY committed to the database unless you place a "Roll Back Records" element on the Fault Path within the same screen transaction!',
      concepts: [
        {
          title: '1. Injecting Context into Screen Flows: recordId (Text vs. Record) & ids (List View)',
          body: '• <strong>Single Record Page (`recordId` as `Text`):</strong> Create a Text variable named <code>recordId</code> marked <strong>Available for input</strong>. Receives the 18-character ID.<br>• <strong>Single Record Page (`recordId` as `Record`):</strong> Create a Record variable named <code>recordId</code> for that Object marked <strong>Available for input</strong>. Receives the entire record without needing a <code>Get Records</code> element.<br>• <strong>List View Button (`ids` as `Text Collection`):</strong> When launching a Screen Flow from a List View button where the user checks multiple rows, create a Text Collection variable (<code>Allow multiple values</code>) named <strong>exactly <code>ids</code></strong> marked <strong>Available for input</strong>—Salesforce passes all selected record IDs into it!'
        },
        {
          title: '2. Error Handling in Flows: Fault Paths, $Flow.FaultMessage & Custom Error',
          body: 'Never leave a pink Data element or Action without error handling:<br>• <strong>Fault Path:</strong> Click any pink Data element → click <strong>Add Fault Path</strong>. If a DML or SOQL error occurs, instead of showing the user an ugly unhandled exception email, execution follows the red dashed Fault Path where you can show a clean error Screen displaying <code>{!$Flow.FaultMessage}</code>, log the error to an <code>Error_Log__c</code> object, or run <strong>Roll Back Records</strong>.<br>• <strong>Custom Error Element (Record-Triggered Flows):</strong> Available inside Before-Save and After-Save Flows. Stops the save transaction, rolls back all changes, and displays your custom error banner at the top of the record page or directly under a specific field.'
        }
      ],
      steps: [
        {
          id: 's-2-4-1',
          label: 'Build and activate the Quick_Create_Dark_Store Screen Flow',
          detail: 'In <strong>Setup → Flows → New Flow → Screen Flow</strong>: Create Resource Variable <code>recordId</code> (Type: <code>Text</code>, ✅ <strong>Available for input</strong>). Add a <code>Screen</code> with required Text inputs <code>Store_Name</code> and <code>Store_City</code>. Below it, add <code>Create Records</code> for <code>Fulfillment_Center__c</code> setting <code>Name = {!Store_Name}</code>, <code>City__c = {!Store_City}</code>, <code>Account__c = {!recordId}</code>, and <code>Provisioning_Status__c = Draft</code>. Save as <code>Quick_Create_Dark_Store</code> and click <strong>Activate</strong>.'
        },
        {
          id: 's-2-4-2',
          label: 'Embed Quick_Create_Dark_Store on the Account Page and create a store',
          detail: 'Open the <code>Farmatodo</code> Account, click ⚙️ → <strong>Edit Page</strong>, drag the <strong>Flow</strong> component onto the right column, choose <code>Quick_Create_Dark_Store</code>, check ✅ <strong>Pass record ID into this variable</strong>, click <strong>Save → Activate → Assign as Org Default</strong>, return to <code>Farmatodo</code>, and create store <code>Farmatodo Chapinero</code> in <code>Bogota</code>.'
        },
        {
          id: 's-2-4-3',
          label: 'Retrieve Quick_Create_Dark_Store into VS Code',
          detail: 'Run in your terminal: <code>sf project retrieve start -m Flow:Quick_Create_Dark_Store</code>.'
        }
      ]
    },
    {
      id: '2-5',
      title: 'Asynchronous Flow Paths, Schedule Flows & Calling Apex via @InvocableMethod',
      duration: 'Day 24–25',
      summary: 'How "Run Asynchronously" paths work on Record-Triggered Flows, and how to write bulkified @InvocableMethod Apex actions that Flows (and Agentforce) can call.',
      interviewTrap: 'What is the mandatory signature rule for an Apex method annotated with @InvocableMethod so it can be called from a Flow? Answer: 1) Only ONE @InvocableMethod is allowed per Apex class, 2) It must be public or global static, and 3) Its input parameter and return type MUST be a List<T> (e.g., List<Request> in, List<Result> out) so Salesforce can bulkify 200 Flow Interviews into a single call!',
      concepts: [
        {
          title: '1. Synchronous vs. "Run Asynchronously" Paths in Record-Triggered Flows',
          body: 'On a Record-Triggered Flow (configured with <em>"Only when a record is updated to meet the condition requirements"</em> or on create), you can check <strong>"Include a Run Asynchronously path to access an external system after the original transaction for the triggering record is successfully committed"</strong>.<br>• The <em>Run Immediately</em> path runs inside the database transaction.<br>• The <em>Run Asynchronously</em> path runs in a separate background transaction <strong>after database commit</strong>, allowing declarative HTTP Callouts without locking database rows!'
        },
        {
          title: '2. Bridging Flows and Apex: @InvocableMethod & @InvocableVariable',
          body: 'Whenever a Flow needs complex sorting, regex parsing, cryptographic hashing, or multi-map queries that would exceed the 2,000-element limit, you keep the orchestration in Flow and delegate the heavy lifting to an <code>@InvocableMethod</code> Apex class:<br>• Because Salesforce batches up to 200 Flow Interviews into a single call to your Apex method, your method receives a <code>List&lt;InputWrapper&gt;</code> (where <code>requests.size()</code> equals the number of Interviews, e.g., 200) and must return a <code>List&lt;OutputWrapper&gt;</code> of the <strong>exact same size and order</strong>!'
        }
      ],
      code: {
        filename: 'Bulkified @InvocableMethod Pattern for Flows & Agentforce',
        snippet: `public with sharing class StoreCapacityCalculatorAction {
    public class Request {
        @InvocableVariable(label='Account ID' required=true)
        public Id accountId;
    }

    public class Result {
        @InvocableVariable(label='Operational Store Count')
        public Integer operationalCount;
    }

    @InvocableMethod(label='Calculate Operational Stores' category='Instaleap Operations')
    public static List<Result> calculate(List<Request> requests) {
        Set<Id> accountIds = new Set<Id>();
        for (Request req : requests) {
            accountIds.add(req.accountId);
        }

        Map<Id, Integer> countsByAccount = new Map<Id, Integer>();
        for (AggregateResult ar : [
            SELECT Account__c accId, COUNT(Id) total
            FROM Fulfillment_Center__c
            WHERE Account__c IN :accountIds AND Provisioning_Status__c = 'Operational'
            GROUP BY Account__c
        ]) {
            countsByAccount.put((Id) ar.get('accId'), (Integer) ar.get('total'));
        }

        // Return List<Result> matching exact size & order of List<Request>
        List<Result> results = new List<Result>();
        for (Request req : requests) {
            Result res = new Result();
            res.operationalCount = countsByAccount.containsKey(req.accountId)
                ? countsByAccount.get(req.accountId) : 0;
            results.add(res);
        }
        return results;
    }
}`
      },
      steps: [
        {
          id: 's-2-5-1',
          label: 'Understand why @InvocableMethod always takes a List<T> and returns a List<R>',
          detail: 'Check this step once you can explain how Salesforce batches 200 Flow Interviews into 1 single call to <code>calculate(List&lt;Request&gt;)</code>.'
        }
      ]
    },
    {
      id: '2-6',
      title: 'The Complete 20-Step Save Order of Execution (Uncut) & Architect Decision Matrix',
      duration: 'Day 26–28',
      summary: 'Every single step of Salesforce\'s database save lifecycle from initial load to post-commit, recursive behavior of Workflow/After-Flow updates, and the Flow vs. Apex matrix.',
      interviewTrap: 'Deep Order of Execution trap: "If an After-Save Flow or After Trigger updates a field on the record (or a Legacy Workflow Field Update fires), do Custom Validation Rules run a second time?" Answer: When a Legacy Workflow Rule Field Update fires, System Validation, Before Triggers, and After Triggers run again (1 more time), but Custom Validation Rules, Duplicate Rules, and Escalation Rules are SKIPPED! However, if an After Trigger or After-Save Flow executes an explicit DML update, the entire Save Order of Execution (including Custom Validation Rules!) runs from Step 1.',
      concepts: [
        {
          title: '1. The Complete 20-Step Save Order of Execution (Architect Reference)',
          body: 'When a user clicks Save, a Flow executes DML, or an API call inserts/updates a record, Salesforce executes these exact 20 steps:<br>' +
            '<strong>1. Load Original Record:</strong> Loads original record from DB (or initializes defaults for <code>insert</code>).<br>' +
            '<strong>2. Overwrite New Values &amp; System Validation (Pass 1):</strong> Copies new field values into memory and checks field formats, data types, maximum text lengths, required layout/field flags, and valid foreign keys.<br>' +
            '<strong>3. Before-Save Record-Triggered Flows (Fast Field Updates):</strong> Mutates <code>$Record</code> in memory.<br>' +
            '<strong>4. Apex <code>before</code> Triggers:</strong> Runs all <code>before insert</code> / <code>before update</code> triggers.<br>' +
            '<strong>5. System Validation (Pass 2) &amp; Custom Validation Rules:</strong> Re-verifies required fields (<code>NOT NULL</code>) and executes all active <strong>Custom Validation Rules</strong>. <em>(Key insight: fields populated in Step 3 or Step 4 pass validation here!)</em><br>' +
            '<strong>6. Duplicate Rules:</strong> Executes active Duplicate Matching Rules (blocks or alerts).<br>' +
            '<strong>7. Preliminary Database Save (No Commit Yet):</strong> Writes record to DB buffer and generates the 18-character <code>Id</code> (for <code>insert</code>), <code>CreatedDate</code>, and <code>LastModifiedDate</code>.<br>' +
            '<strong>8. Apex <code>after</code> Triggers:</strong> Runs all <code>after insert</code> / <code>after update</code> triggers (<code>Trigger.new</code> is now read-only; <code>Trigger.newMap</code> is populated).<br>' +
            '<strong>9. Assignment Rules:</strong> Evaluates Lead or Case Assignment Rules.<br>' +
            '<strong>10. Auto-Response Rules:</strong> Evaluates Lead or Case Auto-Response Rules.<br>' +
            '<strong>11. Workflow Rules (Legacy):</strong> If a Workflow Field Update fires, updates the record and re-runs System Validation, <code>before</code> Triggers, and <code>after</code> Triggers 1 more time (skipping Custom Validation Rules).<br>' +
            '<strong>12. Escalation Rules:</strong> Evaluates Case Escalation Rules.<br>' +
            '<strong>13. Process Builder / Flow Launching (Legacy):</strong> Runs legacy Processes.<br>' +
            '<strong>14. After-Save Record-Triggered Flows (Actions and Related Records):</strong> Executes synchronous After-Save Flows.<br>' +
            '<strong>15. Entitlement Rules:</strong> Evaluates Service Cloud SLA Entitlements.<br>' +
            '<strong>16. Parent Roll-Up Summary Calculation:</strong> If the record is the Detail child of a Master-Detail with a Roll-Up Summary (or cross-object workflow), calculates the parent\'s Roll-Up field and <strong>puts the Parent record through its own complete Save Order of Execution!</strong><br>' +
            '<strong>17. Grandparent Roll-Up Summary Calculation:</strong> If the Parent itself rolls up to a Grandparent, runs the Grandparent save cycle.<br>' +
            '<strong>18. Criteria-Based Sharing Evaluation:</strong> Recalculates Criteria-Based Sharing Rules if relevant fields changed.<br>' +
            '<strong>19. Database Commit:</strong> Commits all DML changes permanently to the database.<br>' +
            '<strong>20. Post-Commit Logic:</strong> Sends outbound emails, dispatches <em>Publish After Commit</em> Platform Events, and executes enqueued Asynchronous Apex (<code>Queueable</code>, <code>@future</code>) and Asynchronous Flow paths.'
        }
      ],
      table: {
        headers: ['Requirement Type', 'Best Architectural Tool', 'Why Not the Alternative?'],
        rows: [
          ['Block saving when field conditions are invalid', 'Validation Rule (or Custom Error in Before Flow)', 'Zero code, runs at Step 5, displays native inline field errors'],
          ['Set default values or calculate fields on the same record', 'Before-Save Flow (Fast Field Updates)', 'Runs at Step 3, zero DML cost, 10x faster than After-Save'],
          ['Create a simple related Task or update parent on Closed Won', 'After-Save Flow', 'Declarative, auto-bulkifies across 200 records without Apex maintenance'],
          ['Multi-object orchestration with complex Set/Map filtering, custom Savepoints, or >2,000 loop iterations', 'Apex Trigger Handler + Service Class', 'Avoids Flow 2,000-element limit, full unit test harness, modular OOP'],
          ['Outbound REST API callout when a record transitions status', 'Apex Trigger → Queueable (or Flow Async Path)', 'Synchronous callouts inside DB transactions are prohibited']
        ]
      },
      steps: [
        {
          id: 's-2-6-1',
          label: 'Master the 20-step Order of Execution for PD1 and Architect interviews',
          detail: 'Verify you can explain why Step 3 (Before Flow) and Step 4 (Before Trigger) run before Step 5 (Validation Rules), and what happens at Step 16 when a Roll-Up Summary recalculates.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-2',
    title: 'Block 2 Exam: Flow Architecture, Bulkification & Order of Execution',
    questions: [
      {
        q: 'What is the maximum number of executed elements a single Flow Interview can run before crashing with an uncatchable limit error?',
        options: [
          '100 elements',
          '150 elements',
          '2,000 executed elements',
          '50,000 elements'
        ],
        correct: 2,
        explanation: 'Every Flow Interview has a hard limit of 2,000 executed elements at runtime.'
      },
      {
        q: 'When 200 records are inserted in a single batch via Data Loader and trigger an After-Save Flow containing 1 "Create Records" element (outside any loop), how many DML statements are consumed?',
        options: [
          '200 DML statements (causing a LimitException)',
          '1 single batched DML statement because Salesforce pauses all 200 Flow Interviews at the Create Records element and executes them in bulk',
          '0 DML statements',
          '150 DML statements'
        ],
        correct: 1,
        explanation: 'Salesforce automatically bulkifies pink Data elements across parallel Flow Interviews in the same transaction.'
      },
      {
        q: 'What happens at Step 16 of the Save Order of Execution when inserting a Detail child record causes a Master parent\'s Roll-Up Summary field to change?',
        options: [
          'The parent field updates silently without firing any parent automation',
          'The parent record undergoes its own full Save Order of Execution (firing parent Before/After Triggers, parent Validation Rules, and parent After Flows)',
          'The parent Roll-Up only updates at midnight via a Batch job',
          'Parent Validation Rules are skipped'
        ],
        correct: 1,
        explanation: 'Recalculating a Roll-Up Summary field on the Master record triggers the full save lifecycle on the parent record.'
      },
      {
        q: 'What is the mandatory parameter and return type structure of an @InvocableMethod in Apex?',
        options: [
          'Must accept a single SObject and return void',
          'Must accept a List<T> (or List<List<T>>) and return a List<R> of the exact same size and order so 200 Flow Interviews are processed in a single bulk call',
          'Must accept a Map<Id, SObject>',
          'Can only accept String primitives'
        ],
        correct: 1,
        explanation: '@InvocableMethod must accept and return a List so the Flow engine can batch up to 200 Flow Interviews into one invocation.'
      }
    ]
  }
};
