export const block3ApexBackend = {
  id: 'block-3',
  num: '03',
  title: 'SALESFORCE BACKEND: APEX FROM ZERO TO SENIOR ARCHITECT',
  weeks: 'Weeks 5–8',
  badgeColor: '#a855f7',
  summary: 'Complete mastery of Salesforce backend engineering: SObject reflection, nested Maps, Custom Metadata (__mdt), advanced SOQL/SOSL, partial DML & Savepoints, Governor Limits, Trigger Frameworks, Async Apex (@future, Queueable + Finalizers, Batch, Scheduled), REST/SOAP APIs, and >90% Unit Testing.',
  lessons: [
    {
      id: '3-1',
      title: 'Apex Type System, Generic SObjects, Schema Describe & Nested Collections',
      duration: 'Days 29–31',
      summary: 'Primitives (Decimal vs. Double), generic SObject dynamic field access, zero-SOQL RecordType lookups via Schema Describe, and grouping children with Map<Id, List<SObject>>.',
      interviewTrap: 'Why should you NEVER use Double for currency or financial calculations in Apex, and always use Decimal? Answer: Double is a 64-bit IEEE 754 floating-point number prone to binary rounding errors, whereas Decimal is an arbitrary-precision decimal number with built-in scale/rounding modes (e.g., setScale(2, RoundingMode.HALF_UP)), and all Currency/Percent fields in Salesforce return Decimal.',
      concepts: [
        {
          title: '1. Apex Primitives, Pass-by-Value Semantics & Null-Safe Operator (?.)',
          body: '• <strong>Key Primitives:</strong> <code>Integer</code> (32-bit), <code>Long</code> (64-bit), <code>Decimal</code> (exact financial/currency decimals), <code>Double</code>, <code>String</code> (always single-quoted <code>\'text\'</code>), <code>Boolean</code> (<code>true</code>, <code>false</code>, or <code>null</code>!), <code>Date</code>, <code>Datetime</code>, <code>Time</code>, <code>Id</code> (auto-validates 15/18-char Salesforce IDs and converts 15→18 on assignment), and <code>Blob</code> (binary data).<br>• <strong>Safe Navigation Operator (<code>?.</code>) &amp; Null Coalescing Operator (<code>??</code>):</strong> Modern Apex supports <code>String city = acc?.BillingCity ?? \'Bogota\';</code>—preventing <code>System.NullPointerException</code> when chaining parent relationships or map lookups!'
        },
        {
          title: '2. Generic SObject Reflection & Cached Schema Describe',
          body: 'Every standard and custom object (<code>Account</code>, <code>Fulfillment_Center__c</code>) extends the abstract base class <code>SObject</code>. This enables dynamic metadata-driven programming:<br>• <strong>Dynamic Field Read/Write:</strong> <code>Object val = record.get(\'Onboarding_Status__c\');</code> and <code>record.put(\'Onboarding_Status__c\', \'Active\');</code>.<br>• <strong>Dynamic Parent Navigation:</strong> <code>SObject parentAcc = storeRecord.getSObject(\'Account__r\');</code>.<br>• <strong>Zero-SOQL RecordType Lookup:</strong> Never run <code>[SELECT Id FROM RecordType WHERE DeveloperName = \'Enterprise\']</code> (wastes 1 SOQL query!). Instead, use the in-memory Schema cache:<br><code>Id rtId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get(\'Enterprise\').getRecordTypeId();</code>'
        },
        {
          title: '3. The #1 Senior Apex Pattern: Grouping Child Records into Map<Id, List<SObject>>',
          body: 'In 90% of technical interviews and real-world triggers, you will need to group child records (e.g., <code>Fulfillment_Center__c</code>) by their parent ID (<code>Account__c</code>) in memory with <code>O(N)</code> time complexity and 0 nested loops:'
        }
      ],
      table: {
        headers: ['Collection Type', 'Key Characteristics', 'Most Important Methods to Memorize'],
        rows: [
          ['List<T>', 'Ordered, index-based (0..N), allows duplicates', 'add(e), addAll(listOrSet), get(i), size(), isEmpty(), clear(), sort()'],
          ['Set<T>', 'Unordered, unique elements only, O(1) hash lookup', 'add(e), addAll(listOrSet), contains(e), remove(e), retainAll(c), size()'],
          ['Map<K, V>', 'Key-Value hash table, unique keys, O(1) lookup', 'put(k, v), get(k), containsKey(k), keySet() [returns Set<K>], values() [returns List<V>]']
        ]
      },
      code: {
        filename: 'scripts/apex/hello.apex — Grouping Children by Parent ID (O(N) Pattern)',
        snippet: `// 1. One-line Map<Id, Account> initialization directly from SOQL
Map<Id, Account> accountsById = new Map<Id, Account>([
    SELECT Id, Name, Onboarding_Status__c FROM Account LIMIT 50
]);

// 2. Group child Fulfillment_Center__c records by Parent Account__c in Map<Id, List<Fulfillment_Center__c>>
Map<Id, List<Fulfillment_Center__c>> storesByAccountId = new Map<Id, List<Fulfillment_Center__c>>();

for (Fulfillment_Center__c store : [
    SELECT Id, Name, City__c, Account__c
    FROM Fulfillment_Center__c
    WHERE Account__c IN :accountsById.keySet()
]) {
    if (!storesByAccountId.containsKey(store.Account__c)) {
        storesByAccountId.put(store.Account__c, new List<Fulfillment_Center__c>());
    }
    storesByAccountId.get(store.Account__c).add(store);
}

for (Id accId : storesByAccountId.keySet()) {
    System.debug('Account ' + accountsById.get(accId)?.Name + ' has ' + storesByAccountId.get(accId).size() + ' stores');
}`
      },
      steps: [
        {
          id: 's-3-1-1',
          label: 'Run the Map<Id, List<Fulfillment_Center__c>> grouping script in hello.apex',
          detail: 'Paste the code above into <code>scripts/apex/hello.apex</code> and execute <code>sf apex run -f scripts/apex/hello.apex</code> in your terminal.'
        }
      ]
    },
    {
      id: '3-2',
      title: 'Custom Metadata Types (__mdt) vs. Custom Settings (List vs. Hierarchy)',
      duration: 'Days 32–33',
      summary: 'How to build zero-SOQL feature flags, trigger bypass switches, and environment configuration without hardcoding values in Apex.',
      interviewTrap: 'When you refresh a Sandbox or deploy a package, what is the critical difference between Custom Settings records and Custom Metadata Type (__mdt) records? Answer: Custom Settings rows are treated as DATA (so they are NOT deployed via metadata packages and are wiped in a Developer Sandbox refresh!). Custom Metadata Type (__mdt) rows are METADATA (they live as XML files in Git and deploy automatically with sf project deploy!).',
      concepts: [
        {
          title: '1. Custom Metadata Types (__mdt): The Modern Enterprise Standard',
          body: 'Whenever your Apex code or Flows need environment configurations, API route mappings, SLA thresholds, or trigger feature flags, create a <strong>Custom Metadata Type</strong> (e.g., <code>Trigger_Configuration__mdt</code>):<br>• <strong>Records Are Deployable Metadata:</strong> Every row you create inside a <code>__mdt</code> table is stored as an XML file inside <code>force-app/main/default/customMetadata/</code> and tracked in Git.<br>• <strong>Zero SOQL Limit Cost:</strong> Calling <code>Trigger_Configuration__mdt.getInstance(\'Account_Trigger\')</code> or <code>Trigger_Configuration__mdt.getAll()</code> reads directly from the application server memory cache and consumes <strong>0 SOQL queries</strong> out of your 100 limit! Even standard SOQL queries on <code>__mdt</code> (unless they include Long Text Area fields) do not count toward the 100 SOQL governor limit.'
        },
        {
          title: '2. Custom Settings: List vs. Hierarchy Custom Settings',
          body: 'Before <code>__mdt</code> existed, Salesforce used <strong>Custom Settings</strong> (which also read from memory cache with 0 SOQL cost, but store their records as non-deployable Data):<br>• <strong>List Custom Settings:</strong> Key-value table shared org-wide (now 100% replaced by Custom Metadata Types). <em>(Note: Hidden by default in modern Orgs unless "Manage List Custom Settings Type" is enabled in Schema Settings).</em><br>• <strong>Hierarchy Custom Settings (Still Useful Today!):</strong> The only configuration object with built-in <strong>3-tier inheritance (Org Default → Profile Override → Specific User Override)</strong>! Calling <code>Bypass_Settings__c.getInstance(UserInfo.getUserId())</code> automatically returns the most specific setting for the running user, their Profile, or the Org default.'
        }
      ],
      table: {
        headers: ['Feature', 'Custom Metadata Type (__mdt)', 'Hierarchy Custom Setting (__c)', 'List Custom Setting (__c)'],
        rows: [
          ['Records Deployable via Git/CLI?', 'YES (stored as XML metadata)', 'NO (stored as runtime Data)', 'NO (stored as runtime Data)'],
          ['Copied to Developer Sandbox?', 'YES (100% copied with metadata)', 'NO (must be re-inserted)', 'NO (must be re-inserted)'],
          ['Consumes SOQL Query Limit?', '0 SOQL (getInstance / getAll)', '0 SOQL (getInstance)', '0 SOQL (getAll)'],
          ['Supports Profile/User Inheritance?', 'No', 'YES (Org → Profile → User)', 'No'],
          ['Can Be Referenced in Validation Rules?', 'Yes ($CustomMetadata)', 'Yes ($Setup)', 'No']
        ]
      },
      code: {
        filename: 'Zero-SOQL Feature Flag Pattern with Custom Metadata (__mdt)',
        snippet: `// Reading a Custom Metadata record in 0ms with 0 SOQL queries consumed:
Instaleap_Config__mdt config = Instaleap_Config__mdt.getInstance('Production_Defaults');
Boolean isSyncEnabled = config?.Enable_Realtime_Provisioning__c ?? true;
Integer maxRetries    = Integer.valueOf(config?.Max_HTTP_Retries__c ?? 3);`
      },
      steps: [
        {
          id: 's-3-2-1',
          label: 'Master when to choose __mdt vs. Hierarchy Custom Settings',
          detail: 'Verify you can explain why <code>__mdt</code> is used for deployable configuration while Hierarchy Custom Settings are used when values must vary by User or Profile.'
        }
      ]
    },
    {
      id: '3-3',
      title: 'Advanced SOQL & SOSL: Relationships (__r), AggregateResult, Polymorphic TYPEOF & Dynamic SOQL',
      duration: 'Days 34–36',
      summary: 'Child-to-Parent (5 levels), Parent-to-Child subqueries, GROUP BY / HAVING AggregateResult, polymorphic TYPEOF queries, Date Literals, and preventing SOQL Injection.',
      interviewTrap: 'When you run a Parent-to-Child subquery like [SELECT Id, Name, (SELECT Id FROM Fulfillment_Centers__r) FROM Account], what happens if an Account has 300 child Fulfillment Centers and you access acc.Fulfillment_Centers__r directly as a List? Answer: Salesforce throws "Aggregate query has too many rows for direct assignment, use FOR loop"! Always iterate child subqueries using a nested for (Fulfillment_Center__c s : acc.Fulfillment_Centers__r) loop.',
      concepts: [
        {
          title: '1. Relationship Queries: Child-to-Parent vs. Parent-to-Child Subqueries',
          body: '• <strong>Child-to-Parent (Dot Notation — up to 5 levels upward):</strong> For standard lookups, drop <code>Id</code> (<code>Contact.Account.Owner.Name</code>). For custom lookups/master-detail, replace <code>__c</code> with <code>__r</code> (<code>Fulfillment_Center__c.Account__r.Name</code>).<br>• <strong>Parent-to-Child (Subquery in SELECT — 1 level downward, or up to 5 levels in API v58.0+):</strong> Use the plural <em>Child Relationship Name</em> (<code>Account.Opportunities</code> for standard, or <code>Account.Fulfillment_Centers__r</code> for custom).'
        },
        {
          title: '2. Aggregate SOQL (GROUP BY, HAVING, GROUP BY ROLLUP) & Date Literals',
          body: '• Any SOQL query using <code>COUNT(Id)</code>, <code>COUNT_DISTINCT(City__c)</code>, <code>SUM()</code>, <code>AVG()</code>, <code>MIN()</code>, or <code>MAX()</code> with a <code>GROUP BY</code> clause returns <code>List&lt;AggregateResult&gt;</code>. You extract aliased columns via <code>ar.get(\'aliasName\')</code> and cast them.<br>• <strong>SOQL Date Literals:</strong> Never calculate date ranges manually in Apex when you can use native SOQL Date Literals: <code>TODAY</code>, <code>YESTERDAY</code>, <code>THIS_MONTH</code>, <code>LAST_N_DAYS:30</code>, <code>NEXT_N_DAYS:7</code>, <code>THIS_FISCAL_QUARTER</code>.'
        },
        {
          title: '3. Polymorphic SOQL (TYPEOF), SOSL & Dynamic SOQL Injection Defense',
          body: '• <strong>Polymorphic <code>TYPEOF</code>:</strong> When querying a polymorphic field like <code>Task.What</code> or <code>Lead.Owner</code> (which could be a <code>User</code> or a <code>Group/Queue</code>), use <code>TYPEOF What WHEN Account THEN Name, Onboarding_Status__c WHEN Opportunity THEN Amount END</code>.<br>• <strong>SOSL (`FIND ... IN ALL FIELDS RETURNING ...`):</strong> Searches text indexes across multiple unrelated objects in a single call, returning <code>List&lt;List&lt;SObject&gt;&gt;</code>.<br>• <strong>Dynamic SOQL Injection Prevention:</strong> When building dynamic query strings passed to <code>Database.query(queryString)</code> or <code>Database.queryWithBinds(queryString, bindMap, AccessLevel.USER_MODE)</code>, prefer bind maps or wrap string inputs in <code>String.escapeSingleQuotes(untrustedInput)</code>.'
        }
      ],
      code: {
        filename: 'Advanced SOQL & SOSL Patterns (AggregateResult, TYPEOF & queryWithBinds)',
        snippet: `// 1. Aggregate SOQL with GROUP BY and HAVING
for (AggregateResult ar : [
    SELECT Account__c accId, City__c city, COUNT(Id) storeCount
    FROM Fulfillment_Center__c
    WHERE CreatedDate = LAST_N_DAYS:90
    GROUP BY Account__c, City__c
    HAVING COUNT(Id) >= 1
]) {
    Id accId       = (Id) ar.get('accId');
    String city    = (String) ar.get('city');
    Integer count  = (Integer) ar.get('storeCount');
    System.debug('Account ' + accId + ' in ' + city + ' has ' + count + ' stores');
}

// 2. Safe Dynamic SOQL with Database.queryWithBinds in USER_MODE
Map<String, Object> binds = new Map<String, Object>{ 'targetStatus' => 'Active' };
List<Account> activeAccs = Database.queryWithBinds(
    'SELECT Id, Name FROM Account WHERE Onboarding_Status__c = :targetStatus',
    binds,
    AccessLevel.USER_MODE
);`
      },
      steps: [
        {
          id: 's-3-3-1',
          label: 'Run the AggregateResult & queryWithBinds snippet in hello.apex',
          detail: 'Paste the code above into <code>scripts/apex/hello.apex</code> and run <code>sf apex run -f scripts/apex/hello.apex</code>.'
        }
      ]
    },
    {
      id: '3-4',
      title: 'DML Internals, Partial Success (SaveResult), FOR UPDATE Locks, Savepoints & User Mode Security',
      duration: 'Days 37–39',
      summary: 'All 6 DML operations, Database.insert(list, false) error harvesting, External ID upserts, FOR UPDATE pessimistic locking, Savepoint/Rollback, and WITH USER_MODE vs. stripInaccessible.',
      interviewTrap: 'What happens to Governor Limits consumed inside a try block AFTER you call Database.rollback(sp) inside the catch block? Answer: Database.rollback(sp) rolls back the database changes to the Savepoint, but it DOES NOT reset or refund the SOQL queries, DML statements, or CPU time already consumed! Moreover, creating a Savepoint itself counts as 1 DML statement toward the 150 DML limit!',
      concepts: [
        {
          title: '1. The 6 DML Operations & External ID Upserts',
          body: 'Apex supports 6 DML operations: <code>insert</code>, <code>update</code>, <code>upsert</code>, <code>delete</code>, <code>undelete</code> (restores from Recycle Bin), and <code>merge</code> (merges up to 3 Leads, Accounts, Contacts, or Cases).<br>• <strong>Idempotent <code>upsert</code> with External ID:</strong> Instead of querying whether an external record exists and splitting into insert/update lists, run:<br><code>upsert accountsToSync Account.Core_Tenant_Id__c;</code><br>Salesforce uses the custom index on <code>Core_Tenant_Id__c</code> to insert new rows and update existing rows in a single atomic DML statement!'
        },
        {
          title: '2. All-or-None DML vs. Partial Success (Database.insert(list, false))',
          body: '• <code>insert stores;</code> is shorthand for <code>Database.insert(stores, true);</code>. If 1 record out of 200 fails validation, a <code>DmlException</code> is thrown and all 200 records roll back.<br>• <code>List&lt;Database.SaveResult&gt; results = Database.insert(stores, false, AccessLevel.USER_MODE);</code> commits all valid records and never throws a <code>DmlException</code>. You iterate <code>results</code> checking <code>if (!sr.isSuccess())</code> and read <code>sr.getErrors()</code> to log exact field/status errors per failed record.'
        },
        {
          title: '3. Pessimistic Row Locking (FOR UPDATE) & Savepoints',
          body: '• <strong><code>FOR UPDATE</code> in SOQL:</strong> Appending <code>FOR UPDATE</code> to the end of a SOQL query (<code>[SELECT Id, Total_Dark_Stores__c FROM Account WHERE Id = :accId FOR UPDATE]</code>) places an exclusive database lock on those rows until the transaction commits, preventing race conditions when two concurrent threads update the same Account.<br>• <strong>Transaction Control (`Savepoint` &amp; `Database.rollback`):</strong> When orchestrating multi-table DML where failure on table B requires undoing table A without letting an unhandled exception crash the caller, create a <code>Savepoint sp = Database.setSavepoint();</code> and call <code>Database.rollback(sp);</code> inside your <code>catch</code> block.'
        },
        {
          title: '4. Enforcing Security in Apex: Sharing Keywords vs. CRUD/FLS (USER_MODE & stripInaccessible)',
          body: 'Memorize the exact distinction between Row Security and Object/Field Security in Apex:<br>• <strong>Row Security (Class Declaration):</strong><br>&nbsp;&nbsp;– <code>public with sharing class X</code>: Enforces the running user\'s OWD and Sharing Rules.<br>&nbsp;&nbsp;– <code>public without sharing class X</code>: Ignores OWD and Sharing Rules (sees all rows).<br>&nbsp;&nbsp;– <code>public inherited sharing class X</code>: Inherits the sharing mode of the calling class (defaults to <code>with sharing</code> if called directly from LWC/Flow).<br>• <strong>Object CRUD &amp; Field FLS (Queries &amp; DML):</strong><br>&nbsp;&nbsp;– Modern standard: Use <code>WITH USER_MODE</code> in SOQL and <code>Database.insert(list, true, AccessLevel.USER_MODE)</code> (or <code>insert as user list;</code>).<br>&nbsp;&nbsp;– Sanitizing inaccessible fields without throwing an exception: Use <code>SObjectAccessDecision dec = Security.stripInaccessible(AccessType.READABLE, records);</code> and retrieve the stripped records via <code>dec.getRecords()</code>.'
        }
      ],
      code: {
        filename: 'Partial DML Error Harvesting & Savepoint Rollback Pattern',
        snippet: `Savepoint sp = Database.setSavepoint();
try {
    List<Database.SaveResult> saveResults = Database.insert(storesToInsert, false, AccessLevel.USER_MODE);
    for (Integer i = 0; i < saveResults.size(); i++) {
        if (!saveResults[i].isSuccess()) {
            for (Database.Error err : saveResults[i].getErrors()) {
                System.debug('Failed Store [' + storesToInsert[i].Name + ']: ' + err.getStatusCode() + ' - ' + err.getMessage());
            }
        }
    }
} catch (Exception ex) {
    Database.rollback(sp);
    throw ex;
}`
      },
      steps: [
        {
          id: 's-3-4-1',
          label: 'Master the difference between with sharing, WITH USER_MODE, and stripInaccessible',
          detail: 'Verify you can explain why <code>with sharing</code> alone does NOT check Field-Level Security (FLS), and how <code>WITH USER_MODE</code> and <code>Security.stripInaccessible()</code> solve it.'
        }
      ]
    },
    {
      id: '3-5',
      title: 'Governor Limits Deep Dive: Sync vs. Async Quotas, SOQL For Loops (Heap) & Limits Class',
      duration: 'Days 40–41',
      summary: 'Complete Governor Limits table, how SOQL For Loops prevent 6 MB Heap Limit crashes by streaming 200-record chunks, and proactive limit monitoring.',
      interviewTrap: 'If a query returns 45,000 Account records with 20 fields each, assigning List<Account> allAccs = [SELECT ... FROM Account]; will immediately crash with "Apex heap size too large: 6000001" (exceeding the 6 MB synchronous Heap limit). How do you process 45,000 rows in synchronous Apex without exceeding the 6 MB Heap limit? Answer: Use a SOQL For Loop: for (List<Account> batch : [SELECT ... FROM Account]) { ... } — Salesforce streams the result set from the database cursor in chunks of 200 records at a time and garbage-collects each chunk!',
      concepts: [
        {
          title: '1. Why SOQL For Loops Are Mandatory for Heap Management',
          body: 'Never assign a large SOQL query directly to a <code>List&lt;SObject&gt;</code> variable in memory if it can return thousands of rows. Instead, use the chunked <strong>SOQL For Loop</strong> syntax:<br><code>for (List&lt;Fulfillment_Center__c&gt; chunk : [SELECT Id, Name FROM Fulfillment_Center__c WHERE Account__c IN :accIds]) { ... }</code><br>Under the hood, Salesforce opens a server-side query cursor and feeds your loop <strong>200 records at a time</strong>, keeping your Heap memory footprint under 200 KB even when iterating 50,000 rows!'
        },
        {
          title: '2. Proactive Inspection with the System.Limits Class',
          body: 'Before starting an expensive operation or deciding whether to offload work to a Queueable job, inspect remaining transaction capacity using the <code>Limits</code> class:<br>• <code>Limits.getQueries()</code> / <code>Limits.getLimitQueries()</code> (e.g., <code>14 / 100</code>)<br>• <code>Limits.getDmlStatements()</code> / <code>Limits.getLimitDmlStatements()</code> (e.g., <code>3 / 150</code>)<br>• <code>Limits.getCpuTime()</code> / <code>Limits.getLimitCpuTime()</code> (e.g., <code>1250 / 10000</code> ms)<br>• <code>Limits.getHeapSize()</code> / <code>Limits.getLimitHeapSize()</code> (e.g., <code>450000 / 6000000</code> bytes)<br>• <code>Limits.getQueueableJobs()</code> / <code>Limits.getLimitQueueableJobs()</code> (<code>50</code> in Sync, <code>1</code> inside an Async job!)'
        }
      ],
      table: {
        headers: ['Per-Transaction Governor Limit', 'Synchronous Limit', 'Asynchronous Limit (Batch/Queueable/@future)'],
        rows: [
          ['Total SOQL Queries Issued', '100', '200'],
          ['Total Records Retrieved by SOQL', '50,000', '50,000 (50M in Batch start QueryLocator)'],
          ['Total SOSL Queries Issued', '20 (2,000 rows)', '20 (2,000 rows)'],
          ['Total DML Statements Issued', '150', '150'],
          ['Total Records Processed by DML', '10,000', '10,000'],
          ['Total HTTP Callouts', '100 (max 120s timeout)', '100 (max 120s timeout)'],
          ['Max Jobs Enqueued via System.enqueueJob', '50', '1 (from inside a Queueable/Batch)'],
          ['Max @future Invocations', '50', '0 (cannot call @future from @future/Batch)'],
          ['Max Heap Size (Memory)', '6 MB', '12 MB'],
          ['Max CPU Time', '10,000 ms (10s)', '60,000 ms (60s)']
        ]
      },
      steps: [
        {
          id: 's-3-5-1',
          label: 'Memorize the 10 rows of the Sync vs. Async Governor Limits table',
          detail: 'Notice especially that inside an Async job (Queueable/Batch), you can only call <code>System.enqueueJob()</code> <strong>1 time</strong> (50 in Sync) and <code>@future</code> <strong>0 times</strong>!'
        }
      ]
    },
    {
      id: '3-6',
      title: 'Enterprise Trigger Architecture: Context Matrix, Handler Framework & Recursion Guards',
      duration: 'Days 42–45',
      summary: 'Complete Trigger context variable availability matrix across all 7 events, deploying AccountTrigger + AccountTriggerHandler, and why static boolean flags break on >200-record batches.',
      interviewTrap: 'Senior Trigger Trap: "A developer prevents trigger recursion using public static Boolean hasRun = false; if (hasRun) return; hasRun = true;. What happens when Data Loader inserts 400 Accounts in a single Bulk API batch?" Answer: Salesforce splits the 400 Accounts into 2 chunks of 200 records that share the SAME static transaction memory! Chunk 1 (records 1–200) sets hasRun = true, and Chunk 2 (records 201–400) is silently SKIPPED! Always use a static Set<Id> processedIds instead of a boolean flag!',
      concepts: [
        {
          title: '1. Complete Trigger Context Variable Availability Matrix',
          body: 'You will be tested on this exact matrix in both PD1 and technical interviews:<br>• <code>Trigger.isExecuting</code>: Returns <code>true</code> if the current Apex code was invoked by a Trigger (vs. a Visualforce controller, LWC, or Batch).<br>• <code>Trigger.operationType</code>: Enum returning <code>BEFORE_INSERT</code>, <code>BEFORE_UPDATE</code>, <code>BEFORE_DELETE</code>, <code>AFTER_INSERT</code>, <code>AFTER_UPDATE</code>, <code>AFTER_DELETE</code>, or <code>AFTER_UNDELETE</code>.<br>• <code>Trigger.size</code>: Total number of records in the current trigger chunk (1 to 200).'
        },
        {
          title: '2. Why Static Boolean Flags Are a Bug (Use Static Set<Id> Instead)',
          body: 'When 1,000 records are updated in a single API call or parent-child cascade, Salesforce executes your Trigger 5 times in chunks of 200 records within the <strong>same Apex transaction</strong> (meaning <code>static</code> variables are NOT reset between the 5 chunks!).<br>If you use a naive <code>static Boolean isFirstRun = true;</code>, only the first 200 records are processed and the remaining 800 records never fire your trigger logic! Instead, track <code>private static Set&lt;Id&gt; processedRecordIds = new Set&lt;Id&gt;();</code> and combine it with state-transition checking (comparing <code>newRecord.Field__c != oldMap.get(newRecord.Id).Field__c</code>).'
        }
      ],
      table: {
        headers: ['Trigger Event', 'Trigger.new', 'Trigger.newMap', 'Trigger.old', 'Trigger.oldMap', 'Can Mutate Trigger.new Without DML?'],
        rows: [
          ['before insert', 'Yes (List)', 'NO (Null — no Id yet)', 'NO (Null)', 'NO (Null)', 'YES (mutates record before save)'],
          ['after insert', 'Yes (Read-Only)', 'Yes (Map<Id, SObject>)', 'NO (Null)', 'NO (Null)', 'NO (FinalException if mutated)'],
          ['before update', 'Yes (List)', 'Yes (Map<Id, SObject>)', 'Yes (List)', 'Yes (Map<Id, SObject>)', 'YES (mutates record before save)'],
          ['after update', 'Yes (Read-Only)', 'Yes (Map<Id, SObject>)', 'Yes (List)', 'Yes (Map<Id, SObject>)', 'NO (FinalException if mutated)'],
          ['before delete', 'NO (Null)', 'NO (Null)', 'Yes (List)', 'Yes (Map<Id, SObject>)', 'N/A (use Trigger.old.addError())'],
          ['after delete', 'NO (Null)', 'NO (Null)', 'Yes (List)', 'Yes (Map<Id, SObject>)', 'N/A'],
          ['after undelete', 'Yes (Read-Only)', 'Yes (Map<Id, SObject>)', 'NO (Null)', 'NO (Null)', 'NO']
        ]
      },
      code: {
        filename: 'force-app/main/default/triggers/AccountTrigger.trigger & AccountTriggerHandler.cls',
        snippet: `// AccountTrigger.trigger
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    switch on Trigger.operationType {
        when AFTER_UPDATE {
            AccountTriggerHandler.afterUpdate(Trigger.new, Trigger.oldMap);
        }
    }
}

// AccountTriggerHandler.cls
public with sharing class AccountTriggerHandler {
    private static Set<Id> provisionedInTx = new Set<Id>();

    public static void afterUpdate(List<Account> newAccounts, Map<Id, Account> oldAccountMap) {
        Set<Id> accountIdsToProvision = new Set<Id>();
        for (Account acc : newAccounts) {
            Account oldAcc = oldAccountMap.get(acc.Id);
            if (acc.Onboarding_Status__c == 'Ready_to_Provision' &&
                oldAcc.Onboarding_Status__c != 'Ready_to_Provision' &&
                !provisionedInTx.contains(acc.Id)) {
                accountIdsToProvision.add(acc.Id);
                provisionedInTx.add(acc.Id);
            }
        }
        if (!accountIdsToProvision.isEmpty()) {
            System.enqueueJob(new TenantProvisioningQueueable(accountIdsToProvision));
        }
    }
}`
      },
      steps: [
        {
          id: 's-3-6-1',
          label: 'Deploy AccountTrigger, AccountTriggerHandler & TenantProvisioningQueueable',
          detail: 'Run in your terminal: <code>sf project deploy start -m ApexClass:TenantProvisioningQueueable -m ApexClass:AccountTriggerHandler -m ApexTrigger:AccountTrigger</code>.'
        },
        {
          id: 's-3-6-2',
          label: 'Test the live Trigger by moving Farmatodo to Ready to Provision',
          detail: 'Ensure your Node.js API (port 4000) and Cloudflare tunnel are running, open <code>Farmatodo</code> in Salesforce, set <code>Onboarding Status</code> to <code>Ready to Provision</code>, and watch it provision live on your React dashboard!'
        }
      ]
    },
    {
      id: '3-7',
      title: 'Asynchronous Apex Mastery: @future, Queueable (+Finalizers), Batch (50M) & Scheduled',
      duration: 'Days 46–50',
      summary: 'Deep dive into Queueable chaining, System.Finalizer recovery from uncatchable LimitExceptions, Batch Apex QueryLocator vs. Iterable, Database.Stateful, and Mixed DML.',
      interviewTrap: 'Earlier we learned that System.LimitException (like hitting 101 SOQL queries or 10,000ms CPU time) CANNOT be caught by a try/catch block. So how can an Architect log the error or retry a Queueable job if it crashes with an uncatchable System.LimitException? Answer: Implement System.Finalizer and attach it inside the Queueable via System.attachFinalizer(finalizer)! The Finalizer\'s execute(FinalizerContext ctx) method runs in a brand-new post-transaction context even after an unhandled LimitException!',
      concepts: [
        {
          title: '1. Queueable Apex + Transaction Finalizers (System.Finalizer)',
          body: '<code>Queueable</code> is the workhorse of modern asynchronous Apex:<br>• Accepts non-primitive state (<code>Set&lt;Id&gt;</code>, <code>List&lt;SObject&gt;</code>, custom DTOs) via its class constructor.<br>• Supports chaining up to 5 levels deep in Developer Edition (unlimited depth in Enterprise/Production, though max 1 child <code>System.enqueueJob</code> call per execution).<br>• Supports <strong><code>System.Finalizer</code></strong>: By implementing both <code>Queueable</code> and <code>System.Finalizer</code>, if your Queueable crashes due to an uncatchable Governor Limit (<code>ctx.getResult() == ParentJobResult.UNHANDLED_EXCEPTION</code>), your Finalizer executes immediately afterwards with a fresh set of limits so you can update the Account\'s <code>Onboarding_Status__c = \'Error\'</code> or re-enqueue the job!'
        },
        {
          title: '2. Batch Apex Internals: Database.getQueryLocator (50M) vs. Iterable & Database.Stateful',
          body: 'When processing more than 10,000 records, implement <code>Database.Batchable&lt;SObject&gt;</code>:<br>• <strong><code>start(Database.BatchableContext bc)</code>:</strong> Returns either a <code>Database.QueryLocator</code> (bypasses the 50,000 SOQL row limit and retrieves up to <strong>50,000,000 rows</strong>!) or an <code>Iterable&lt;T&gt;</code> (for custom in-memory lists or external API pagination, subject to the 50,000 SOQL row limit).<br>• <strong><code>execute(Database.BatchableContext bc, List&lt;SObject&gt; scope)</code>:</strong> Runs once per chunk (default 200 records, configurable from 1 to 2,000 via <code>Database.executeBatch(new MyBatch(), 200)</code>). Each <code>execute</code> chunk gets its own brand-new Governor Limits!<br>• <strong><code>Database.Stateful</code>:</strong> By default, Batch Apex is stateless (instance variables reset to null between <code>execute</code> chunks). Implementing <code>Database.Stateful</code> serializes and preserves instance variables across all chunks so you can read total counters inside <code>finish()</code>.<br>• <strong>Governor Limit:</strong> Only <strong>5 Batch jobs</strong> can be in <code>Processing</code> or <code>Queued</code> status simultaneously (up to 100 in the <strong>Batch Flex Queue</strong> in <code>Holding</code> status).'
        }
      ],
      code: {
        filename: 'Queueable with System.Finalizer & Stateful Batch Apex',
        snippet: `// 1. Queueable with Transaction Finalizer (recovers even from uncatchable Governor Limit crashes!)
public with sharing class ResilientProvisioningJob implements Queueable, Database.AllowsCallouts, System.Finalizer {
    private Set<Id> accountIds;
    public ResilientProvisioningJob(Set<Id> accountIds) { this.accountIds = accountIds; }

    public void execute(QueueableContext ctx) {
        System.attachFinalizer(this); // Attach Finalizer
        // Perform HTTP Callout & DML here...
    }

    public void execute(FinalizerContext ctx) {
        if (ctx.getResult() == ParentJobResult.UNHANDLED_EXCEPTION) {
            Exception ex = ctx.getException();
            List<Account> failed = new List<Account>();
            for (Id accId : this.accountIds) {
                failed.add(new Account(Id = accId, Onboarding_Status__c = 'Error'));
            }
            update as system failed;
        }
    }
}

// 2. Stateful Batch Apex processing up to 50 Million records
public with sharing class StaleProvisioningBatch implements Database.Batchable<SObject>, Database.Stateful {
    public Integer totalMarkedError = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Provisioning_Status__c
            FROM Fulfillment_Center__c
            WHERE Provisioning_Status__c = 'Provisioning' AND LastModifiedDate < YESTERDAY
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Fulfillment_Center__c> scope) {
        for (Fulfillment_Center__c store : scope) {
            store.Provisioning_Status__c = 'Error';
            totalMarkedError++;
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Batch complete. Total stale stores marked Error: ' + totalMarkedError);
    }
}`
      },
      steps: [
        {
          id: 's-3-7-1',
          label: 'Master System.Finalizer and Batch Flex Queue (5 active / 100 holding)',
          detail: 'Verify you can explain how <code>System.Finalizer</code> catches unhandled <code>LimitException</code> failures in Queueables and how <code>Database.Stateful</code> preserves state across Batch chunks.'
        }
      ]
    },
    {
      id: '3-8',
      title: 'Inbound/Outbound REST (@RestResource), SOAP WSDLs & Enterprise Unit Testing (>90% Coverage)',
      duration: 'Days 51–56',
      summary: 'Building custom @RestResource endpoints, Enterprise vs. Partner WSDL, @TestSetup rollback mechanics, HttpCalloutMock, MultiStaticResourceCalloutMock, Test.loadData, and 200-record bulk testing.',
      interviewTrap: 'When writing an inbound custom REST API in Apex using @RestResource(urlMapping=\'/v1/tenants/*\'), what visibility modifier MUST the class and its @HttpPost/@HttpPatch methods have? Answer: Both the class and the HTTP methods MUST be declared "global" (and the methods must be "global static")!',
      concepts: [
        {
          title: '1. Inbound Custom REST APIs (@RestResource, RestContext.request & response)',
          body: 'While Salesforce provides standard REST APIs (<code>/services/data/v62.0/sobjects/Account</code>), you can build custom transactional endpoints at <code>/services/apexrest/v1/tenants/callback</code> by annotating a <code>global with sharing</code> class with <code>@RestResource(urlMapping=\'/v1/tenants/callback/*\')</code>:<br>• Annotations: <code>@HttpGet</code>, <code>@HttpPost</code>, <code>@HttpPut</code>, <code>@HttpPatch</code>, <code>@HttpDelete</code>.<br>• Access raw request headers, query params, and JSON body via <code>RestContext.request</code> and set custom HTTP status codes via <code>RestContext.response.statusCode = 200;</code>.'
        },
        {
          title: '2. SOAP Integrations: Enterprise WSDL vs. Partner WSDL & WebServiceMock',
          body: '• <strong>Enterprise WSDL:</strong> Strongly typed XML contract generated specifically for your Org\'s exact schema. If a field is deleted or modified in Setup, the Enterprise WSDL breaks and must be regenerated.<br>• <strong>Partner WSDL:</strong> Loosely typed generic key-value SObject contract that works across any Salesforce Org without regenerating when custom fields change.<br>• When testing code generated by <code>WSDL2Apex</code>, use <code>Test.setMock(WebServiceMock.class, new MySoapMock())</code>.'
        },
        {
          title: '3. Architect-Grade Unit Testing (@TestSetup, HttpCalloutMock, StubProvider & Bulk 200)',
          body: 'To pass PD1 and impress Senior interviewers, your <code>@IsTest</code> classes must cover 4 scenarios:<br>1. <strong>Positive Single &amp; Bulk (200 Records):</strong> Insert 200 Accounts + 200 Stores, update all 200 in 1 DML statement between <code>Test.startTest()</code> and <code>Test.stopTest()</code>, and assert all 200 succeeded without hitting Governor Limits.<br>2. <strong>Negative / Validation Exception Test:</strong> Try setting an Account with 0 stores to <code>Ready_to_Provision</code> inside a <code>try/catch (DmlException ex)</code> block and call <code>Assert.isTrue(ex.getMessage().contains(\'Total Dark Stores\'))</code>.<br>3. <strong>HTTP Callout Mocking:</strong> Register <code>Test.setMock(HttpCalloutMock.class, new InstaleapCalloutMock())</code> before calling <code>Test.stopTest()</code>.<br>4. <strong>User Permissions Test (`System.runAs`):</strong> Verify that a standard user with the <code>Instaleap_Operations</code> Permission Set can execute the flow cleanly.'
        }
      ],
      code: {
        filename: 'Inbound @RestResource Endpoint & Full Bulk 200 @IsTest Suite',
        snippet: `// 1. Inbound @RestResource Callback Endpoint
@RestResource(urlMapping='/v1/tenants/callback/*')
global with sharing class InstaleapCallbackEndpoint {
    global class CallbackPayload {
        public String sfdcAccountId;
        public String coreTenantId;
        public String status; // 'Active' or 'Error'
    }

    @HttpPatch
    global static Map<String, String> updateProvisioningStatus() {
        String rawBody = RestContext.request.requestBody.toString();
        CallbackPayload payload = (CallbackPayload) JSON.deserialize(rawBody, CallbackPayload.class);

        Account acc = new Account(
            Id = (Id) payload.sfdcAccountId,
            Core_Tenant_Id__c = payload.coreTenantId,
            Onboarding_Status__c = payload.status
        );
        update as user acc;

        RestContext.response.statusCode = 200;
        return new Map<String, String>{ 'status' => 'UPDATED', 'accountId' => acc.Id };
    }
}`
      },
      steps: [
        {
          id: 's-3-8-1',
          label: 'Create and run TenantProvisioningTest.cls in your Org',
          detail: 'Run <code>sf apex run test -n TenantProvisioningTest -r human --code-coverage</code> in your terminal and verify >90% coverage across your Trigger, Handler, and Queueable.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-3',
    title: 'Block 3 Exam: Advanced Apex, SOQL, Triggers, Async & Testing',
    questions: [
      {
        q: 'Why does using a static boolean variable (public static Boolean hasRun = false;) to prevent trigger recursion fail when 400 records are updated in a single Bulk API batch?',
        options: [
          'Static variables are not allowed in Apex classes',
          'Salesforce splits the 400 records into 2 trigger chunks of 200 records within the SAME transaction; Chunk 1 sets hasRun = true, causing Chunk 2 (records 201–400) to be completely skipped',
          'Boolean variables reset to false on every loop iteration',
          'Bulk API only processes 10 records at a time'
        ],
        correct: 1,
        explanation: 'Static variables persist across all 200-record chunks within the same transaction. Always use a static Set<Id> plus state-transition checks (new != old) instead of a naive boolean.'
      },
      {
        q: 'How can a Queueable Apex job catch and recover from an uncatchable System.LimitException (such as exceeding 100 SOQL queries or 10,000ms CPU time)?',
        options: [
          'Wrap the code in try { ... } catch (System.LimitException e) { ... }',
          'Implement System.Finalizer and attach it via System.attachFinalizer(this) inside the Queueable execute method',
          'Use @IsTest(SeeAllData=true)',
          'Use a Before-Save Flow'
        ],
        correct: 1,
        explanation: 'System.Finalizer executes in a separate post-transaction context after the Queueable finishes, even when the Queueable terminated due to an uncatchable Governor Limit exception.'
      },
      {
        q: 'What is the critical difference between Custom Metadata Types (__mdt) and Custom Settings (__c) during deployments?',
        options: [
          'Custom Settings records are deployable XML metadata, whereas __mdt records are not',
          'Custom Metadata Type (__mdt) records ARE deployable metadata tracked in Git, whereas Custom Settings records are treated as runtime Data and are not deployed via metadata packages',
          'Querying __mdt always consumes 10 SOQL queries',
          'Hierarchy Custom Settings cannot vary by Profile'
        ],
        correct: 1,
        explanation: 'Custom Metadata Type records are metadata (deployable via sf project deploy and copied to Developer Sandboxes), while Custom Settings records are data.'
      },
      {
        q: 'How do you iterate over 45,000 records returned by a SOQL query in synchronous Apex without exceeding the 6 MB Heap Size governor limit?',
        options: [
          'Assign the query to a static List<SObject> variable',
          'Use a SOQL For Loop: for (List<Account> chunk : [SELECT Id, Name FROM Account]) { ... } so Salesforce streams 200 records at a time from the query cursor',
          'Use without sharing on the class',
          'Call Database.setSavepoint() before the query'
        ],
        correct: 1,
        explanation: 'A SOQL For Loop processes records in 200-record chunks from a server cursor without loading all 45,000 rows into Heap memory at once.'
      }
    ]
  }
};
