export const block6ApplicationArchitect = {
  id: 'block-6',
  num: '06',
  title: 'APPLICATION ARCHITECT TRACK ($12K–$18K/MO): LDV DATA & SHARING INTERNALS',
  weeks: 'Months 10–18 (Data & Sharing Architect)',
  badgeColor: '#10b981',
  summary: 'Complete curriculum for the Salesforce Certified Data Architect and Sharing & Visibility Architect credentials: Query Plan Cost Optimizer, Index Selectivity (10%/5% rule), Skinny Tables, PK Chunking, the 3 Data Skews, Big Objects (__b), internal __Share & Group Maintenance tables, Implicit Sharing, Experience Cloud Sharing Sets, and Enterprise Whiteboard Defense.',
  lessons: [
    {
      id: '6-1',
      title: 'Large Data Volumes (LDV >50M Rows): Query Optimizer Cost & Index Selectivity Rules',
      duration: 'Architect Module 7',
      summary: 'How Salesforce\'s multi-tenant Query Optimizer calculates query cost, the exact 10% / 5% / 20% selectivity math, and using the Query Plan Tool.',
      interviewTrap: 'Data Architect Exam Math Question: "An object has 5,000,000 records. You run a SOQL query filtering on a single indexed field (External_Status__c = \'Open\'). What is the MAXIMUM number of matching rows allowed for the Salesforce Query Optimizer to consider that index selective?" Answer: 10% of the first 1,000,000 rows (100,000) + 5% of the remaining 4,000,000 rows (200,000) = 300,000 rows (capped at 333,333 max for a single filter)! If 350,000 rows match, the optimizer skips the index and performs a Full Table Scan!',
      concepts: [
        {
          title: '1. Why Traditional SQL Execution Plans Don\'t Work Directly in Multi-Tenant Salesforce',
          body: 'Recall from Block 00 that all custom records live inside <code>MT_Data</code> (with flex string columns <code>val0..val499</code>) while indexed fields are copied into <code>MT_Indexes</code>.<br>Because the underlying Oracle/PostgreSQL database statistics don\'t know your tenant\'s specific data distribution inside <code>MT_Data</code>, Salesforce runs its own <strong>Multi-Tenant Pre-Query Cost Optimizer</strong> (which refreshes tenant statistics nightly and caches them in memory).<br>When you run a SOQL query, the Optimizer calculates a <strong>Cost Score</strong> for every available index:<br>• <strong><code>Cost &lt; 1.0</code>:</strong> The index is <strong>Selective</strong>! Salesforce uses the index in <code>MT_Indexes</code> and returns results in milliseconds.<br>• <strong><code>Cost &gt;= 1.0</code>:</strong> The filter is <strong>Non-Selective</strong>! Salesforce abandons the index and falls back to a slow <code>TableScan</code> across <code>MT_Data</code> (or throws <code>Non-selective query against large object type (more than 200,000 rows)</code> inside an Apex Trigger!).'
        },
        {
          title: '2. The Exact Selectivity Threshold Math (Memorize for Data Architect Exam)',
          body: '1. <strong>Single Indexed Field Filter (`WHERE City__c = \'Bogota\'`):</strong><br>' +
            '&nbsp;&nbsp;• Must match <strong>&lt;= 10% of the first 1,000,000 records</strong> AND <strong>&lt;= 5% of all records above 1,000,000</strong>, up to an absolute ceiling of <strong>333,333 records</strong> (roughly 1/3 of total rows).<br>' +
            '2. <strong>AND Composite Filter (`WHERE IndexedFieldA = \'X\' AND IndexedFieldB = \'Y\'`):</strong><br>' +
            '&nbsp;&nbsp;• Each individual filter can match up to <strong>2x the single threshold</strong> (20% of first 1M + 10% of remaining, max 666,666), as long as the <strong>combined intersection</strong> matches less than the standard single threshold (10% / 5%, max 333,333)!<br>' +
            '3. <strong>OR Composite Filter (`WHERE IndexedFieldA = \'X\' OR IndexedFieldB = \'Y\'`):</strong><br>' +
            '&nbsp;&nbsp;• <strong>BOTH</strong> fields MUST be indexed, each must be individually selective, and the combined union must be below the 10% / 5% threshold! If even one field in an <code>OR</code> clause is unindexed, the entire query becomes a Full Table Scan!'
        },
        {
          title: '3. Operators That Immediately Destroy Index Selectivity',
          body: 'Never use these patterns on objects with >200,000 rows:<br>' +
            '• <strong>Negative Operators:</strong> <code>!=</code>, <code>NOT LIKE</code>, <code>EXCLUDES</code>.<br>' +
            '• <strong>Null Comparisons:</strong> <code>WHERE Custom_Field__c = null</code> (because standard indexes in <code>MT_Indexes</code> do NOT index <code>NULL</code> rows by default!).<br>' +
            '• <strong>Leading Wildcards:</strong> <code>WHERE Name LIKE \'%Farmatodo\'</code> or <code>LIKE \'%Farma%\'</code> (trailing wildcards like <code>LIKE \'Farma%\'</code> CAN use an index if selective).'
        }
      ],
      table: {
        headers: ['SOQL Filter Pattern on 5M-Row Table', 'Uses MT_Indexes?', 'Architect Remediation if Slow'],
        rows: [
          ['WHERE Core_Tenant_Id__c = :uuid', 'YES (Cost ~0.0001)', 'Optimal (External ID is indexed)'],
          ['WHERE Status__c != \'Archived\'', 'NO (Full Table Scan)', 'Rewrite as positive IN list: WHERE Status__c IN (\'Draft\', \'Active\')'],
          ['WHERE Synced_Date__c = null', 'NO (Nulls not in standard index)', 'Use a default value (e.g., Is_Synced__c = false) or request a Two-Column Custom Index'],
          ['WHERE Name LIKE \'%Store\'', 'NO (Leading % wildcard)', 'Use SOSL (FIND \'Store*\' IN NAME FIELDS) instead of SOQL']
        ]
      },
      steps: [
        {
          id: 's-6-1-1',
          label: 'Master the 10% (first 1M) + 5% (above 1M) Selectivity formula',
          detail: 'Practice calculating the selectivity ceiling for a 3,000,000-row table: 100,000 (10% of first 1M) + 100,000 (5% of remaining 2M) = 200,000 max matching rows.'
        }
      ]
    },
    {
      id: '6-2',
      title: 'Advanced Query Tuning: Two-Column Custom Indexes, Deterministic Formulas, Skinny Tables & PK Chunking',
      duration: 'Architect Module 8',
      summary: 'How to index null queries using Two-Column Custom Indexes, when Formula fields can be indexed, how Skinny Tables work physically, and extracting 100M rows with PK Chunking.',
      interviewTrap: 'Can Salesforce Support create a Custom Index on a Formula Field? Answer: YES, bit ONLY if the Formula Field is 100% DETERMINISTIC! A formula is non-deterministic (and CANNOT be indexed) if it: 1) References another object (cross-object formula like Account__r.Name), 2) Uses dynamic date/time functions (TODAY(), NOW()), 3) References Owner, autonomumber, or a Roll-Up Summary field, or 4) Uses CASE() on a dynamic picklist.',
      concepts: [
        {
          title: '1. Standard Indexes vs. Custom Indexes vs. Two-Column Custom Indexes',
          body: '• <strong>Indexed Out-of-the-Box:</strong> <code>Id</code>, <code>Name</code>, <code>OwnerId</code>, <code>CreatedDate</code>, <code>SystemModstamp</code>, <code>RecordTypeId</code>, all <code>Lookup</code> and <code>Master-Detail</code> fields, and all custom fields marked <code>External ID</code> or <code>Unique</code>.<br>' +
            '• <strong>Single-Column Custom Index (via Salesforce Support):</strong> If you frequently filter by a Picklist, Date, or deterministic Formula field that cannot be marked as an External ID, Salesforce Support can add a Custom Index on it.<br>' +
            '• <strong>Two-Column Custom Index (The Secret Weapon for <code>NULL</code> Queries):</strong> Standard indexes do not store <code>NULL</code> values. If an integration must query <code>WHERE Status__c = \'Ready\' AND Synced_At__c = null</code> on 20 million rows, Salesforce Support can create a <strong>Two-Column Custom Index</strong> (<code>Status__c</code> in Column 1, <code>Synced_At__c</code> in Column 2)—because Two-Column Indexes DO index <code>NULL</code> values in the second column as long as the first column is non-null!'
        },
        {
          title: '2. Skinny Tables: Physical Architecture & Constraints',
          body: 'Even when a query uses an index in <code>MT_Indexes</code> to find 50,000 matching <code>RecordIds</code>, Salesforce still has to join its internal Standard Field table and Custom Field table (<code>MT_Data</code>) to fetch the columns in your <code>SELECT</code> clause.<br>' +
            'A <strong>Skinny Table</strong> (enabled by Salesforce Support for tables with >10M rows) is a real, dedicated physical database table containing up to <strong>100 frequently queried standard + custom fields</strong> of a single object:<br>' +
            '• Contains <strong>NO soft-deleted rows</strong> (<code>IsDeleted = true</code> rows are excluded, making scans smaller and faster).<br>' +
            '• Kept 100% in sync automatically by the database kernel.<br>' +
            '• <strong>Strict Limitations (Exam Favorites):</strong> Maximum 100 columns; cannot contain fields from other objects (no cross-object joins); cannot contain Long Text Area or Blob fields; <strong>not copied to Sandboxes on refresh</strong> (except Full Sandboxes); and if you change a field\'s data type in Setup, the Skinny Table becomes invalid and must be rebuilt by Support!'
        },
        {
          title: '3. PK Chunking (Primary Key Chunking) for 100-Million-Row Data Extracts',
          body: 'When extracting 50 million records out of Salesforce via Bulk API, even an indexed query on <code>CreatedDate</code> can time out while scanning huge date ranges.<br>' +
            '<strong>PK Chunking</strong> solves this by adding a single HTTP header to your Bulk API query job:<br>' +
            '<code>Sforce-Enable-PKChunking: chunkSize=100000;</code><br>' +
            'Salesforce inspects the minimum and maximum 18-character <code>Id</code> (Primary Key) of the table and automatically splits the Bulk Query into parallel queries filtered by contiguous <code>Id</code> ranges (<code>WHERE Id &gt;= \'001...AAA\' AND Id &lt; \'001...BZZ\'</code>). Because <code>Id</code> is the physical primary key index, each 100,000-row chunk extracts in seconds with zero timeouts!'
        }
      ],
      table: {
        headers: ['LDV Optimization Technique', 'Who Enables It?', 'What Problem Does It Solve?'],
        rows: [
          ['External ID / Unique Checkbox', 'Developer / Admin directly', 'Creates immediate custom index in MT_Indexes for selective WHERE filters'],
          ['Two-Column Custom Index', 'Salesforce Support Case', 'Allows indexing NULL values in the 2nd column & optimizes composite WHERE filters'],
          ['Skinny Table (max 100 cols)', 'Salesforce Support Case', 'Eliminates internal Standard+Custom table JOINs and excludes soft-deleted rows'],
          ['PK Chunking Header', 'Developer in Bulk API Header', 'Splits 10M–100M row extracts into fast parallel Primary Key (Id) range chunks'],
          ['Division Partitioning', 'Salesforce Support Case', 'Partitions global data physically/logically by region (e.g., NA, EMEA, LATAM)']
        ]
      },
      steps: [
        {
          id: 's-6-2-1',
          label: 'Master Deterministic vs. Non-Deterministic Formulas and Skinny Table rules',
          detail: 'Verify you can list the 4 reasons a Formula cannot be indexed and the 5 limitations of a Skinny Table.'
        }
      ]
    },
    {
      id: '6-3',
      title: 'The 3 Data Skews in Depth (Account, Ownership & Lookup Skew) & Lock-Free Bulk Loads',
      duration: 'Architect Module 9',
      summary: 'Deep mechanical analysis of why UNABLE_TO_LOCK_ROW happens in Account Skew, Ownership Skew, and Lookup Skew, and how to architect lock-free high-concurrency ingestion.',
      interviewTrap: 'A B2C company stores 2,000,000 unassigned consumer Contacts under a single dummy Account named "B2C Unassigned Pool". Every night when an integration updates Contacts in parallel batches, hundreds of batches fail with UNABLE_TO_LOCK_ROW, and moving a single user in the Role Hierarchy takes 4 hours. Which TWO skews are happening, and how do you fix them? Answer: Account Data Skew (>10,000 children on 1 Account) and Ownership Skew. Fix: Split the dummy Account into a pool of 500 shard Accounts (max 4,000 Contacts per Account) using a Round-Robin trigger/middleware, or enable Person Accounts for B2C!',
      concepts: [
        {
          title: '1. Account Data Skew (>10,000 Child Records on One Account)',
          body: 'Why is <strong>10,000 children per Account</strong> the magic danger threshold in Salesforce?<br>' +
            '1. <strong>Parent Row Lock Contention (`UNABLE_TO_LOCK_ROW`):</strong> Whenever you insert, update, or delete a child record (<code>Contact</code>, <code>Opportunity</code>, <code>Case</code>, or a Master-Detail child like <code>Fulfillment_Center__c</code>), Salesforce places an internal database lock on the parent <code>Account</code> row to maintain referential integrity and Roll-Up Summaries. If 10 parallel Bulk API threads update Contacts pointing to the same Account simultaneously, threads waiting >10 seconds for the parent lock crash with <code>UNABLE_TO_LOCK_ROW</code>!<br>' +
            '2. <strong>Implicit Sharing Recalculation Storm:</strong> If the Owner of that Account changes, Salesforce must inspect and recalculate <code>Implicit Sharing</code> across all 50,000 child Opportunities, Contacts, and Cases in a single transaction.<br>' +
            '<strong>Architect Fix:</strong> Never use a single "Bucket / Unassigned Account". Implement <strong>Account Sharding</strong> (create 100–500 bucket accounts capped at &lt;5,000 children each) and sort all Bulk API CSV uploads by <code>AccountId</code> so all children of the same Account are processed in the same sequential batch rather than competing across parallel threads!'
        },
        {
          title: '2. Ownership Skew (>10,000 Records Owned by a Single User)',
          body: 'When an automated "Integration User" or "Default Lead Owner" owns 500,000 records, and that user is assigned a Role inside the Role Hierarchy, every record insert/update or role change forces Salesforce to update internal <code>Group Maintenance</code> sharing rows for every manager above that user in the hierarchy.<br>' +
            '<strong>Architect Fix (4 Mandatory Rules):</strong><br>' +
            '1. Remove the skewed owner user from the Role Hierarchy altogether (set <code>Role = None</code>).<br>' +
            '2. If they must have a Role (e.g., for Community/Experience Cloud rules), place them in a dedicated Role at the <strong>very top of the Role Hierarchy</strong> with zero parent roles above them.<br>' +
            '3. Do NOT make that user a member of Public Groups that are used as the source of Owner-Based Sharing Rules.<br>' +
            '4. Distribute ownership across a Queue or round-robin pool of users.'
        },
        {
          title: '3. Lookup Skew (>10,000 Records Pointing to the Same Lookup Target)',
          body: 'Even on a custom Lookup field (e.g., <code>Country__c</code> pointing to a custom <code>Country_Master__c</code> object where 500,000 Accounts point to the <code>Colombia</code> record), every insert/update on <code>Account</code> briefly locks the target <code>Country_Master__c</code> row to verify foreign key existence!<br>' +
            '<strong>Architect Fix:</strong> If a lookup table has static reference values (Countries, Currencies, Store Types), replace the Lookup object with a <strong>Global Picklist Value Set</strong> or <strong>Custom Metadata Type</strong> (which require zero foreign-key row locks during DML!).'
        }
      ],
      table: {
        headers: ['Type of Skew', 'Root Cause (>10,000 Rule)', 'Symptom in Production', 'Definitive Architect Fix'],
        rows: [
          ['Account Data Skew', '>10,000 Contacts/Opps/Cases/M-D children on 1 Account', 'UNABLE_TO_LOCK_ROW on child DML & slow owner changes', 'Shard into multiple parent Accounts (<5k children each) & ORDER BY AccountId in Bulk API'],
          ['Ownership Skew', '1 User owns >10,000 records while sitting in Role Hierarchy', 'Slow saves & multi-hour Role/Sharing recalculations', 'Set User Role = None (or top of hierarchy) & keep out of Public Groups'],
          ['Lookup Skew', '>10,000 records pointing to 1 target row in a Lookup field', 'UNABLE_TO_LOCK_ROW on target lookup record during concurrent inserts', 'Replace low-cardinality Lookup objects with Picklists or Custom Metadata']
        ]
      },
      steps: [
        {
          id: 's-6-3-1',
          label: 'Master all 3 Data Skews and why sorting Bulk API CSVs by ParentId prevents locks',
          detail: 'Verify you can explain why sorting a Bulk API upload by <code>AccountId</code> groups children of the same parent into the same worker batch instead of fighting across parallel threads.'
        }
      ]
    },
    {
      id: '6-4',
      title: 'Data Lifecycle & Archiving Architecture: Big Objects (__b), Composite Keys & GDPR',
      duration: 'Architect Module 10',
      summary: 'Designing Big Objects (__b) for 1 Billion+ rows, Composite Primary Key ordering rules, querying Big Objects via standard SOQL vs. Async SOQL, and Hard Delete.',
      interviewTrap: 'Big Object (__b) Index Trap: "You define a Big Object Ride_Archive__b with a 3-field Composite Index in this exact order: 1) Account__c, 2) Store_City__c, 3) Ride_Date__c (DESC). Which of the following SOQL queries will FAIL with a compilation/runtime error?" Query A: WHERE Account__c = \'001..\' AND Store_City__c = \'Bogota\' AND Ride_Date__c >= 2026-01-01. Query B: WHERE Account__c = \'001..\' AND Ride_Date__c >= 2026-01-01. Answer: Query B FAILS! In a Big Object SOQL query, you CANNOT skip any leading field in the Composite Index, and only the LAST field queried in the index can use a range operator (>, <, >=, <=); all preceding fields must use exact = or IN!',
      concepts: [
        {
          title: '1. Big Objects (__b) Architecture & Composite Index Rules',
          body: 'When your Org accumulates tens of millions of historical records (audit logs, completed delivery pings, old tasks, expired quotes) that consume expensive transactional data storage and slow down queries, you archive them into a <strong>Custom Big Object (<code>__b</code>)</strong>:<br>' +
            '• Built on distributed NoSQL storage (Apache HBase) capable of holding <strong>100 million to 1+ billion rows</strong> with consistent response times.<br>' +
            '• <strong>No Triggers, Flows, Validation Rules, or Sharing Rules:</strong> Big Objects are strictly non-transactional archive tables (visibility is controlled at the Object/Field level via Profile/Permission Set only).<br>' +
            '• <strong>Mandatory Composite Index (Primary Key):</strong> Every Big Object requires an index XML file defining <strong>1 to 5 fields</strong> (max 100 total characters across all indexed fields) in a strict hierarchical order.<br>' +
            '• <strong>Strict SOQL Query Rules on <code>__b</code>:</strong> When querying a Big Object synchronously with SOQL, you MUST filter by the indexed fields in <strong>exact sequential order starting from Position 1 with zero gaps</strong>. Fields 1..N-1 must use equality (<code>=</code> or <code>IN</code>), and only the final field included in your filter may use range comparisons (<code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>).'
        },
        {
          title: '2. Inserting & Deleting Big Objects: database.insertImmediate() & Idempotency',
          body: 'You cannot use standard DML (<code>insert archiveRecord;</code>) on a Big Object. Instead, you call <strong><code>Database.insertImmediate(archiveList)</code></strong> inside a Queueable or Batch Apex class!<br>' +
            '• <strong>Idempotent Upsert Behavior:</strong> Re-inserting a Big Object row with the exact same Composite Index values simply overwrites the non-indexed payload fields (acting as an automatic idempotent upsert!).<br>' +
            '• To delete rows from a Big Object (e.g., for GDPR Right-to-be-Forgotten compliance), call <code>Database.deleteImmediate(archiveList)</code> passing the exact Composite Index keys.'
        }
      ],
      code: {
        filename: 'Big Object Archiving Batch (Database.insertImmediate)',
        snippet: `public with sharing class ArchiveHistoricalLogsBatch implements Database.Batchable<SObject> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Account__c, City__c, CreatedDate, Provisioning_Status__c
            FROM Fulfillment_Center__c
            WHERE Provisioning_Status__c = 'Operational' AND CreatedDate < LAST_N_DAYS:365
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Fulfillment_Center__c> scope) {
        List<Provisioning_Archive__b> archives = new List<Provisioning_Archive__b>();
        for (Fulfillment_Center__c store : scope) {
            archives.add(new Provisioning_Archive__b(
                Account__c       = store.Account__c,      // Index Position 1
                City__c          = store.City__c,         // Index Position 2
                Archived_Date__c = store.CreatedDate,     // Index Position 3 (DESC)
                Store_Name__c    = store.Name
            ));
        }
        if (!Test.isRunningTest()) {
            Database.insertImmediate(archives);
        }
    }

    public void finish(Database.BatchableContext bc) {}
}`
      },
      steps: [
        {
          id: 's-6-4-1',
          label: 'Master the Big Object Composite Index query rule (No skipped fields, range only on last field)',
          detail: 'This rule appears on almost every Data Architect and PD1/PD2 exam. Review why Query B fails if Position 2 of the index is skipped.'
        }
      ]
    },
    {
      id: '6-5',
      title: 'Sharing Architecture Under the Hood: __Share Tables, Group Maintenance & Implicit Sharing',
      duration: 'Architect Module 11',
      summary: 'Deep dive into how Salesforce evaluates record visibility in SQL: ObjectShare tables, RowCause, Group & GroupMember tables, Parent/Child Implicit Sharing, and Deferred Sharing.',
      interviewTrap: 'Sharing Architect Exam Trap: "When a user is assigned a Role in the Role Hierarchy (e.g., VP of Sales), how does Salesforce grant them access to records owned by their subordinates without inserting millions of duplicate rows into AccountShare for every manager?" Answer: Salesforce creates internal system Group records for every Role ("Role" and "RoleAndSubordinates") in the Group Maintenance tables! A record shared with or owned by a subordinate is linked via Group hierarchy expansion rather than duplicating AccountShare rows for every manager up the chain!',
      concepts: [
        {
          title: '1. Inside the __Share Tables (AccountShare & CustomObject__Share)',
          body: 'Whenever an object\'s OWD is set to <code>Private</code> or <code>Public Read Only</code>, Salesforce maintains an internal Sharing Table (e.g., <code>AccountShare</code> for standard objects, or <code>Delivery_Route__Share</code> for custom objects with independent OWD).<br>' +
            'Every row in a <code>__Share</code> table grants a specific user or group access to a specific record:<br>' +
            '• <code>ParentId</code> (or <code>AccountId</code>): The record being shared.<br>' +
            '• <code>UserOrGroupId</code>: The 18-char ID of either a <code>User</code> (<code>005...</code>) or a <code>Group</code> (<code>00G...</code>).<br>' +
            '• <code>AccessLevel</code> (or <code>AccountAccessLevel</code>): <code>Read</code>, <code>Edit</code>, or <code>All</code> (Owner).<br>' +
            '• <code>RowCause</code>: Why this sharing row exists: <code>Owner</code>, <code>Rule</code> (Sharing Rule), <code>Manual</code> (Manual Share button), <code>Team</code> (Account/Sales Team), <code>ImplicitChild</code>, <code>ImplicitParent</code>, or a custom <strong>Apex Sharing Reason</strong> (<code>My_Custom_Reason__c</code>).'
        },
        {
          title: '2. Group Maintenance Tables (Group & GroupMember) & Role Hierarchy Internals',
          body: 'Why does changing the Role Hierarchy or moving a user between Roles trigger a background recalculation?<br>' +
            'Because under the hood, Roles, Queues, Territory nodes, and Public Groups are ALL stored as rows inside the unified <strong><code>Group</code></strong> table (prefix <code>00G</code>)!<br>' +
            'For every single Role you create in the Role Hierarchy, Salesforce automatically generates 3 internal system rows in the <code>Group</code> table:<br>' +
            '1. <code>Type = \'Role\'</code> (Users in that exact Role).<br>' +
            '2. <code>Type = \'RoleAndSubordinatesInternal\'</code> (Users in that Role + all internal subordinate Roles below it).<br>' +
            '3. <code>Type = \'RoleAndSubordinates\'</code> (Includes external Partner/Customer Portal subordinate roles).<br>' +
            'These groups are pre-flattened into <strong>Group Maintenance Tables</strong> so that at query time, checking if a VP can see a record is a fast indexed lookup!'
        },
        {
          title: '3. Implicit Sharing: Parent Implicit, Child Implicit & Portal Implicit Sharing',
          body: 'Memorize the 3 native Implicit Sharing behaviors built into Salesforce\'s core CRM objects:<br>' +
            '• <strong>Parent Implicit Sharing (`RowCause = ImplicitChild`):</strong> If a user has access to a child <code>Opportunity</code>, <code>Case</code>, or <code>Contact</code> (via Ownership, Sharing Rule, or Manual Share), Salesforce automatically inserts a read-only row in <code>AccountShare</code> so the user can see the parent <code>Account</code>!<br>' +
            '• <strong>Child Implicit Sharing (`RowCause = ImplicitParent`):</strong> Gives the owner of an <code>Account</code> (and users above the Account owner in the Role Hierarchy) automatic Read or Edit access to child <code>Opportunities</code>, <code>Cases</code>, and <code>Contacts</code> owned by other users, configured directly on the <code>UserRole</code> settings.<br>' +
            '• <strong>High-Volume Portal Implicit Sharing:</strong> Grants external Community users access to their own parent <code>Account</code> and <code>Contact</code>.'
        }
      ],
      table: {
        headers: ['RowCause Value in __Share', 'Created By', 'Survives Record OwnerId Change?'],
        rows: [
          ['Owner', 'System when record is created', 'Replaced by new Owner row'],
          ['Rule', 'Owner-Based or Criteria-Based Sharing Rule', 'Re-evaluated automatically'],
          ['Manual', 'User clicking "Sharing" button (or Apex setting RowCause=Manual)', 'NO! Automatically DELETED when OwnerId changes!'],
          ['Team', 'Account Team / Opportunity Team / Case Team', 'Configurable ( deleted unless kept during transfer)'],
          ['My_Reason__c (Apex Sharing Reason)', 'Apex Managed Sharing code (Custom Objects only)', 'YES! Survives OwnerId changes permanently!']
        ]
      },
      code: {
        filename: 'Inspecting Internal AccountShare & Group Rows via SOQL',
        snippet: `// 1. Inspect the exact sharing rows granting access to our Accounts
for (AccountShare shareRow : [
    SELECT Id, AccountId, Account.Name, UserOrGroupId, AccountAccessLevel, RowCause
    FROM AccountShare
    LIMIT 20
]) {
    System.debug(
        'Account: ' + shareRow.Account.Name +
        ' | Principal: ' + shareRow.UserOrGroupId +
        ' | Access: ' + shareRow.AccountAccessLevel +
        ' | Reason: ' + shareRow.RowCause
    );
}`
      },
      steps: [
        {
          id: 's-6-5-1',
          label: 'Run the AccountShare inspection query in scripts/apex/hello.apex',
          detail: 'Paste the query above into <code>scripts/apex/hello.apex</code> and run <code>sf apex run -f scripts/apex/hello.apex</code> to see the <code>Owner</code> and <code>Rule</code> rows generated by your Sharing Rule in Block 1!'
        }
      ]
    },
    {
      id: '6-6',
      title: 'Apex Managed Sharing, Experience Cloud Security (Sharing Sets vs. Share Groups) & CTA Cases',
      duration: 'Architect Module 12',
      summary: 'Writing programmatic Apex Managed Sharing, Experience Cloud licenses (Customer Community vs. Plus vs. Partner), Sharing Sets, and 3 complete Enterprise Architect Whiteboard Cases.',
      interviewTrap: 'Sharing Architect Exam Favorite: "A company launches an Experience Cloud portal for 500,000 B2C customers using the standard Customer Community license (High-Volume Customer Portal / HVCP). An admin tries to create a Criteria-Based Sharing Rule and Manual Share for these users, but the users do not appear. Why, and what tool MUST be used instead?" Answer: Standard Customer Community (HVCP) users DO NOT have Roles in the Role Hierarchy and do not use __Share tables (to avoid 500,000-user Group Maintenance overhead!). To grant HVCP users access to records linked to their Account or Contact, you MUST use a "Sharing Set" (which matches User:Account == Record:Account__c at login/query time)!',
      concepts: [
        {
          title: '1. Experience Cloud (Community) License Architecture & Sharing Sets',
          body: 'This table is worth 25% of the Sharing and Visibility Architect exam:<br>' +
            '• <strong>Customer Community (High-Volume / HVCP):</strong> Designed for millions of B2C/B2B external users. <strong>No Role</strong> assigned; cannot participate in Role Hierarchy, Public Groups, Manual Sharing, or Apex Sharing! Record access is granted via <strong>Sharing Sets</strong> (grants access when a lookup on the target record matches the logged-in user\'s <code>Contact.AccountId</code> or <code>ContactId</code>) and <strong>Share Groups</strong> (exposes records owned by HVCP users back to internal Salesforce users).<br>' +
            '• <strong>Customer Community Plus:</strong> Designed for B2B external customers who require individual Roles, Sharing Rules, Manual Sharing, Reports, and Apex Sharing (creates 1 Customer Portal Role per Account).<br>' +
            '• <strong>Partner Community:</strong> Same full sharing engine as Customer Community Plus (creates up to 3 Partner Roles per Account: <em>Executive, Manager, User</em>) plus full access to <code>Lead</code>, <code>Opportunity</code>, and <code>Campaign</code> objects for channel sales!'
        },
        {
          title: '2. Programmatic Apex Managed Sharing',
          body: 'When sharing logic is too dynamic for Owner-Based or Criteria-Based Sharing Rules (for example, automatically granting Read/Write access on an Account to whichever Field Engineer is assigned to a custom lookup <code>Lead_Engineer__c</code>):<br>' +
            '• On a Custom Object, create an <strong>Apex Sharing Reason</strong> in Setup (e.g., <code>Assigned_Engineer__c</code>) and insert a row into <code>Custom_Object__Share</code> with <code>RowCause = Schema.Custom_Object__Share.RowCause.Assigned_Engineer__c</code>.<br>' +
            '• Note that Apex code inserting into <code>__Share</code> tables must run in a class declared <code>without sharing</code> (or elevated privileges) so the trigger can modify sharing rows even when triggered by a non-admin user.'
        },
        {
          title: '3. Enterprise Architect Whiteboard Defense Blueprint (Slalom / US Tech Lead)',
          body: 'When presented with any complex business case in a US Architect interview, structure your whiteboard response into these 5 pillars:<br>' +
            '1. <strong>Actor &amp; License Mapping:</strong> Identify internal vs. external users, license types (Sales Cloud vs. Customer Community vs. Partner), and volume.<br>' +
            '2. <strong>Data Model &amp; LDV Mitigation:</strong> Standard vs. Custom vs. External (<code>__x</code>) vs. Big Objects (<code>__b</code>), Relationship type, External IDs for indexing, and preventing the 3 Data Skews.<br>' +
            '3. <strong>Security &amp; Visibility Architecture:</strong> Profile + Permission Set Groups (CRUD/FLS), OWD baseline, Role Hierarchy, Sharing Rules / Sharing Sets, or Apex Managed Sharing.<br>' +
            '4. <strong>Automation &amp; Integration Topology:</strong> Declarative Flow vs. Bulkified Apex Trigger + Queueable/Batch, Middleware vs. Point-to-Point, OAuth 2.0 JWT Bearer + Named Credentials, and Platform Events/CDC.<br>' +
            '5. <strong>DevOps, Governance &amp; Testing:</strong> Sandbox promotion pipeline (Dev → Partial Copy UAT → Full Staging → Prod), 200-record bulk <code>@IsTest</code> with <code>HttpCalloutMock</code> and <code>System.runAs</code>.'
        }
      ],
      table: {
        headers: ['Experience Cloud License', 'Has Role in Hierarchy?', 'Supports Sharing Rules & Apex Share?', 'Supports Lead & Opportunity?', 'Primary Sharing Mechanism'],
        rows: [
          ['Customer Community (HVCP)', 'NO (Role-less)', 'NO', 'No', 'Sharing Sets & Share Groups'],
          ['Customer Community Plus', 'YES (1–3 Roles per Account)', 'YES (Full __Share access)', 'No (Read-only Quotes/Orders)', 'Sharing Sets + Sharing Rules + Apex Share'],
          ['Partner Community', 'YES (1–3 Partner Roles)', 'YES (Full __Share access)', 'YES (Full CRM Pipeline)', 'Sharing Rules + Partner Super User + Apex Share']
        ]
      },
      code: {
        filename: 'Programmatic Apex Sharing on Account (AccountShare)',
        snippet: `public without sharing class AccountTeamSharingService {
    public static void grantEngineerAccess(Map<Id, Id> accountIdToEngineerUserId) {
        List<AccountShare> sharesToInsert = new List<AccountShare>();

        for (Id accId : accountIdToEngineerUserId.keySet()) {
            Id engineerUserId = accountIdToEngineerUserId.get(accId);
            if (engineerUserId != null) {
                sharesToInsert.add(new AccountShare(
                    AccountId          = accId,
                    UserOrGroupId      = engineerUserId,
                    AccountAccessLevel = 'Edit',
                    OpportunityAccessLevel = 'Read',
                    RowCause           = Schema.AccountShare.RowCause.Manual
                ));
            }
        }

        if (!sharesToInsert.isEmpty()) {
            Database.insert(sharesToInsert, false);
        }
    }
}`
      },
      steps: [
        {
          id: 's-6-6-1',
          label: 'Master the Experience Cloud License Matrix (Customer vs. Plus vs. Partner)',
          detail: 'Memorize why Customer Community (HVCP) uses <strong>Sharing Sets</strong> instead of Roles and Sharing Rules—this is the #1 differentiator in Sharing Architect interviews.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-6',
    title: 'Block 6 Exam: Data Architect & Sharing Architect Mastery',
    questions: [
      {
        q: 'An object has 5,000,000 records. What is the maximum number of matching rows a single indexed field filter (WHERE Status__c = "Pending") can return for the Salesforce Query Optimizer to consider the index selective?',
        options: [
          '50,000 rows',
          '300,000 rows (10% of the first 1,000,000 rows [100k] + 5% of the remaining 4,000,000 rows [200k])',
          '2,500,000 rows (50% of the table)',
          '10,000 rows'
        ],
        correct: 1,
        explanation: 'A single indexed filter is selective when it matches <=10% of the first million rows plus <=5% of rows above 1 million (capped at 333,333 total rows).'
      },
      {
        q: 'A B2C portal uses the standard "Customer Community" (High-Volume Customer Portal) license for 300,000 external shoppers. Each shopper must see all Fulfillment_Center__c records where Fulfillment_Center__c.Account__c matches the shopper\'s Contact.AccountId. Which tool MUST the Architect use?',
        options: [
          'Criteria-Based Sharing Rule',
          'Role Hierarchy',
          'A Sharing Set configured in Digital Experiences Settings (matching User:Contact.Account = Fulfillment_Center__c:Account__c)',
          'Manual Sharing'
        ],
        correct: 2,
        explanation: 'Customer Community (HVCP) licenses are role-less and cannot use standard Sharing Rules or Apex Sharing; they use Sharing Sets to match lookup paths against the logged-in user\'s Account/Contact.'
      },
      {
        q: 'You define a Custom Big Object (Delivery_Ping__b) with a 3-field Composite Index in order: 1) Account__c, 2) Store__c, 3) Ping_Timestamp__c (DESC). Why does the query [SELECT Ping_Timestamp__c FROM Delivery_Ping__b WHERE Account__c = :accId AND Ping_Timestamp__c > :startTime] fail?',
        options: [
          'Big Objects cannot be queried with SOQL at all',
          'Because Store__c (Position 2 in the Composite Index) was skipped! Big Object SOQL queries cannot skip any leading field in the Composite Index',
          'Because Account__c is an ID field',
          'Because DESC indexes are not allowed'
        ],
        correct: 1,
        explanation: 'When querying a Big Object via SOQL, you must specify contiguous leading fields of the Composite Index starting at Position 1 with no gaps, and only the last specified field can use a range operator.'
      },
      {
        q: 'What happens to a programmatic sharing row inserted with RowCause = "Manual" when the record\'s OwnerId is changed to a new owner?',
        options: [
          'It remains intact forever',
          'Salesforce automatically deletes all rows with RowCause = "Manual" whenever OwnerId changes (whereas custom Apex Sharing Reasons on Custom Objects survive owner changes)',
          'Salesforce throws a DmlException blocking the owner change',
          'The new owner is deleted'
        ],
        correct: 1,
        explanation: 'Manual shares are wiped whenever record ownership changes. To persist programmatic shares across owner changes on a Custom Object, define a custom Apex Sharing Reason.'
      }
    ]
  }
};
