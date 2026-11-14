export const masterInterviewBank = [
  // ADMIN & ARCHITECTURE
  {
    id: 'q-1',
    category: 'Admin & Architecture',
    q: 'What is Multi-Tenancy, how often does Salesforce release updates, and what is Apex Hammer?',
    a: 'Multi-Tenancy means multiple customer organizations share the same physical infrastructure, OS, and database engine with strict logical isolation enforced by OrgId. Salesforce delivers 3 mandatory major releases per year (Spring, Summer, and Winter). Prior to each release, Salesforce runs Apex Hammer: executing all customer unit tests across both the current and upcoming release versions to guarantee zero platform regressions.'
  },
  {
    id: 'q-2',
    category: 'Admin & Architecture',
    q: 'What are the 4 types of Sandboxes, their storage limits, refresh intervals, and login URL?',
    a: 'You always log into any Sandbox via test.salesforce.com. The 4 types are: 1) Developer (200 MB, 1-day refresh, Metadata only), 2) Developer Pro (1 GB, 1-day refresh, Metadata only), 3) Partial Copy (5 GB, 5-day refresh, Metadata + up to 10,000 sample rows per object via a Sandbox Template), and 4) Full Sandbox (100% same capacity as Production, 29-day refresh, copies 100% of Metadata and Production data).'
  },
  {
    id: 'q-3',
    category: 'Admin & Architecture',
    q: 'What happens during Lead Conversion, how do you edit converted Leads, and what happens during Lead Merging?',
    a: 'Converting a Lead atomically creates 3 linked records: Account, Contact, and (optionally) Opportunity. Viewing or editing an already-converted Lead requires the "View and Edit Converted Leads" permission. When merging up to 3 duplicate Leads, the chosen Master record retains its field values and absorbs all related activities (Tasks/Events) and campaign history from the deleted duplicates.'
  },
  {
    id: 'q-4',
    category: 'Admin & Architecture',
    q: 'What is the difference between WhoId and WhatId on Task and Event records?',
    a: 'Both are polymorphic Lookup fields: WhoId (Name) points exclusively to human records (Lead or Contact; up to 50 Contacts when Shared Activities is enabled). WhatId (Related To) points to non-human entities such as Account, Opportunity, Case, or any Custom Object with "Allow Activities" enabled.'
  },
  {
    id: 'q-5',
    category: 'Admin & Architecture',
    q: 'What are the key differences between Data Import Wizard and Data Loader?',
    a: 'Data Import Wizard runs in the browser inside Setup, supports up to 50,000 records, does NOT support all objects (e.g., Opportunity and Case are excluded), and cannot export or delete. Data Loader is a client/CLI tool supporting up to 5,000,000 records across all Standard and Custom Objects, supports Export/Export All (including Recycle Bin records), and supports Hard Delete when Bulk API is enabled.'
  },

  // DATA MODEL
  {
    id: 'q-6',
    category: 'Data Model',
    q: 'Explain the complete architectural differences between a Lookup Relationship and a Master-Detail Relationship',
    a: 'In a Lookup, the parent is optional by default, the child has its own OwnerId and independent OWD, there is no cascade delete by default, and native Roll-Up Summary fields are not supported. In a Master-Detail, the parent is required, the child has no OwnerId (visibility is Controlled by Parent), Cascade Delete is enforced automatically, and native Roll-Up Summary fields are unlocked on the parent. Additionally, a Standard Object can NEVER be on the Detail (child) side of a Master-Detail.'
  },
  {
    id: 'q-7',
    category: 'Data Model',
    q: 'How many relationships can an object have, and what are the rules for converting between Lookup and Master-Detail?',
    a: 'An object supports a maximum of 40 total relationship fields (up to 2 Master-Detail and 38 Lookups). Converting a Lookup to Master-Detail is only allowed if 100% of existing child records in the database have the parent field populated (no nulls). Converting a Master-Detail to Lookup is only allowed if the parent object has zero Roll-Up Summary fields summarizing that child object.'
  },
  {
    id: 'q-8',
    category: 'Data Model',
    q: 'What are the 4 ways to build a Roll-Up calculation in Salesforce?',
    a: '1) Native Roll-Up Summary field (requires Master-Detail, plus specific standard relationships like Opportunity → OpportunityLineItem and Account → Opportunity), 2) Record-Triggered Flow (After-Save) on the child object (works on Lookup), 3) Apex Trigger on the child using Aggregate SOQL with GROUP BY (works on Lookup), and 4) Open-source DLRS (Declarative Lookup Rollup Summaries).'
  },
  {
    id: 'q-9',
    category: 'Data Model',
    q: 'What is a Junction Object, a Self-Relationship, and a Hierarchical Relationship?',
    a: 'A Junction Object is a Custom Object with 2 Master-Detail fields used to model Many-to-Many relationships (the first Master-Detail created becomes the Primary Master). A Self-Relationship is a Lookup from an object to itself (e.g., Parent Account). A Hierarchical Relationship is a special lookup available exclusively on the User object to point a user to another user (e.g., Manager).'
  },
  {
    id: 'q-10',
    category: 'Data Model',
    q: 'What is the difference between a 15-character and an 18-character ID, and what does the External ID attribute do?',
    a: 'A 15-character ID is Case-Sensitive, whereas an 18-character ID is Case-Safe (appends a 3-character checksum based on the capitalization of the first 15 characters; generated via CASESAFEID(Id)). Marking a field as External ID automatically creates a custom database index to optimize SOQL queries and enables idempotent upsert operations without querying the internal Salesforce Id first.'
  },

  // SECURITY
  {
    id: 'q-11',
    category: 'Security (OWD & Profiles)',
    q: 'Explain the exact difference between a Profile, Permission Set, Permission Set Group, Muting Permission Set, and Role',
    a: 'A Profile (1 mandatory per user) and Permission Sets (0 to N per user) control TABLE and COLUMN access (Object CRUD and Field-Level Security). A Permission Set Group bundles multiple Permission Sets by job function, and a Muting Permission Set silences specific permissions inside that group without altering the underlying Permission Sets. Conversely, a Role (Role Hierarchy) controls ROW (record-level) visibility, opening vertical access to managers above record owners.'
  },
  {
    id: 'q-12',
    category: 'Security (OWD & Profiles)',
    q: 'How do OWD, Role Hierarchy, Sharing Rules, Manual Sharing, and Apex Sharing interact?',
    a: 'Organization-Wide Defaults (OWD) define the most restrictive baseline level of record access (Private, Public Read Only, Public Read/Write, Controlled by Parent). OWD is the ONLY mechanism that restricts row visibility. Every other layer (Role Hierarchy, Owner/Criteria Sharing Rules, Manual Sharing, and Apex Sharing) can only open record access wider, never restrict it below OWD.'
  },
  {
    id: 'q-13',
    category: 'Security (OWD & Profiles)',
    q: 'What is the difference between a Public Group and a Queue, and which objects CANNOT use a Queue?',
    a: 'A Public Group is an administrative collection of users/roles used for Sharing Rules or folder access. A Queue acts as the actual record owner (OwnerId) for unassigned records waiting to be claimed by a team. Queues support Lead, Case, Task, and all Custom Objects, but NEVER support Account or Opportunity.'
  },

  // FLOWS & ORDER OF EXECUTION
  {
    id: 'q-14',
    category: 'Flows & Order of Execution',
    q: 'In what exact order do Before-Save Flows, Before Triggers, Validation Rules, After Triggers, Roll-Up Summaries, and After-Save Flows run?',
    a: 'The exact order is: 1) Before-Save Flows (Fast Field Updates) → 2) Before Triggers (Apex) → 3) Validation Rules (System and Custom) → 4) Preliminary Database Save (Id is generated) → 5) After Triggers (Apex) → 6) Assignment/Auto-Response/Workflow/Escalation Rules → 7) After-Save Flows → 8) Parent Roll-Up Summary Calculations → 9) Database Commit → 10) Post-Commit Logic (Queueable, @future, outbound emails).'
  },
  {
    id: 'q-15',
    category: 'Flows & Order of Execution',
    q: 'How do you pass the current record ID (or the entire record) from a Lightning Record Page into a Screen Flow?',
    a: 'Create a variable inside the Flow named exactly "recordId" (case-sensitive) and check the "Available for input" checkbox. If defined as type Text, it receives the 18-character ID; if defined as type Record, it receives all fields of the entire record.'
  },

  // APEX, SOQL & TRIGGERS
  {
    id: 'q-16',
    category: 'Apex, SOQL & Triggers',
    q: 'What are the most critical Per-Transaction Governor Limits in Apex?',
    a: 'SOQL Queries: 100 (Sync) / 200 (Async). Total Rows Retrieved by SOQL: 50,000. SOSL Searches: 20. DML Statements: 150. Total Rows Processed by DML: 10,000. HTTP Callouts: 100 (max 120s cumulative timeout). Heap Size: 6 MB (Sync) / 12 MB (Async). CPU Time: 10,000 ms (Sync) / 60,000 ms (Async). System.LimitException cannot be caught by a try/catch block.'
  },
  {
    id: 'q-17',
    category: 'Apex, SOQL & Triggers',
    q: 'Difference between "insert list" and "Database.insert(list, false)", and between "with sharing" and "WITH USER_MODE"',
    a: '"insert list" is All-or-None (if 1 out of 200 records fails, throws DmlException and rolls back all 200). "Database.insert(list, false)" enables partial success (commits the 199 valid rows and returns errors in Database.SaveResult). Meanwhile, "with sharing" on a class only enforces OWD and Sharing Rules (row visibility), whereas "WITH USER_MODE" in SOQL and "insert as user" enforce Object CRUD + Field-Level Security (FLS) + Sharing Rules simultaneously.'
  },
  {
    id: 'q-18',
    category: 'Apex, SOQL & Triggers',
    q: 'Why is Trigger.newMap null in "before insert", and how do you prevent Trigger recursion?',
    a: 'Trigger.newMap is a Map<Id, SObject>; because records in "before insert" have not been written to the database yet, their Id is still null, so Salesforce cannot construct the map. To prevent recursion and unnecessary firing, always check that the specific field transitioned compared to Trigger.oldMap, and track already-processed IDs inside a static Set<Id> in your TriggerHandler.'
  },

  // ASYNC APEX, REST & TESTING
  {
    id: 'q-19',
    category: 'Async Apex, REST & Testing',
    q: 'What are the differences between @future, Queueable, Batch Apex, and Scheduled Apex?',
    a: '@future only accepts primitives, returns no JobId, and cannot be chained. Queueable accepts SObjects and complex types in its constructor, returns a JobId, supports chaining jobs, and supports Transaction Finalizers. Batch Apex processes up to 50 million records in chunks of 200 (use Database.Stateful to retain member variable state across chunks). Scheduled Apex triggers classes on a Cron schedule.'
  },
  {
    id: 'q-20',
    category: 'Async Apex, REST & Testing',
    q: 'What causes "MIXED_DML_OPERATION" and "You have uncommitted work pending", and how do you fix each?',
    a: 'MIXED_DML_OPERATION occurs when performing DML on a Setup Object (like User or PermissionSetAssignment) and a Non-Setup Object (like Account) in the same transaction; fix it by moving one DML into a @future/Queueable job (or wrapping Setup DML in System.runAs in unit tests). "Uncommitted work pending" occurs if you make an HTTP Callout after executing DML in the same transaction; fix it by making all Callouts prior to any DML or moving the Callout to Queueable/@future.'
  },

  // LWC & ARCHITECTURE
  {
    id: 'q-21',
    category: 'LWC & Architecture',
    q: 'When should you use LDS, when should you use @wire, and when should you use an Imperative Apex call in LWC?',
    a: 'Use Lightning Data Service (LDS) when operating on a single record without complex custom business logic. Use @wire when you need reactive, cached read access from Apex (@AuraEnabled(cacheable=true), no DML allowed). Use an Imperative call (async/await) whenever the Apex method performs DML or must execute strictly on a button click.'
  },
  {
    id: 'q-22',
    category: 'LWC & Architecture',
    q: 'How do you design a secure headless Server-to-Server integration and prevent Data Skew on 20-million-row tables?',
    a: 'For headless Server-to-Server authentication, use OAuth 2.0 JWT Bearer Token Flow with an X.509 digital certificate. To prevent Data Skew and UNABLE_TO_LOCK_ROW errors on Large Data Volumes (LDV): 1) Never allow a single Account to exceed 10,000 child records, 2) Remove the Integration User from the Role Hierarchy to prevent Ownership Skew, 3) Sort Bulk API 2.0 batches by ParentId (ORDER BY AccountId), and 4) Filter SOQL queries exclusively on indexed fields (External ID, SystemModstamp).'
  }
];

export const codeTranslatorSnippets = [
  {
    id: 'tr-1',
    title: '1. Filtering, Mapping & Grouping by ID in Memory',
    tsTitle: 'TypeScript / Node.js',
    tsCode: `const accountIds = new Set<string>();
for (const acc of newAccounts) {
  const oldAcc = oldMap.get(acc.id);
  if (acc.status === 'Ready' && oldAcc?.status !== 'Ready') {
    accountIds.add(acc.id);
  }
}`,
    apexTitle: 'Salesforce Apex (Bulkified)',
    apexCode: `Set<Id> accountIds = new Set<Id>();
for (Account acc : newAccounts) {
    Account oldAcc = oldMap.get(acc.Id);
    if (acc.Onboarding_Status__c == 'Ready_to_Provision' &&
        oldAcc.Onboarding_Status__c != 'Ready_to_Provision') {
        accountIds.add(acc.Id);
    }
}`
  },
  {
    id: 'tr-2',
    title: '2. Relational Parent + Children Query (JOIN / Subquery)',
    tsTitle: 'SQL / Backend Query',
    tsCode: `SELECT a.id, a.name, s.id, s.name, s.city
FROM accounts a
LEFT JOIN fulfillment_centers s ON s.account_id = a.id
WHERE a.total_dark_stores > 0;`,
    apexTitle: 'Salesforce SOQL (Parent-to-Child Subquery)',
    apexCode: `List<Account> accounts = [
    SELECT Id, Name,
        (SELECT Id, Name, City__c FROM Fulfillment_Centers__r)
    FROM Account
    WHERE Total_Dark_Stores__c > 0
    WITH USER_MODE
];`
  },
  {
    id: 'tr-3',
    title: '3. Asynchronous HTTP POST Callout with Typed JSON',
    tsTitle: 'TypeScript (fetch async/await)',
    tsCode: `const res = await fetch('https://api.instaleap.io/v1/tenants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
if (res.status === 201) {
  const data = await res.json();
}`,
    apexTitle: 'Salesforce Apex (Queueable + Named Credential)',
    apexCode: `HttpRequest req = new HttpRequest();
req.setEndpoint('callout:Instaleap_Core_API/api/v1/tenants/provision');
req.setMethod('POST');
req.setHeader('Content-Type', 'application/json');
req.setBody(JSON.serialize(payload));

HttpResponse res = new Http().send(req);
if (res.getStatusCode() == 201) {
    Map<String, Object> body = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
}`
  },
  {
    id: 'tr-4',
    title: '4. Frontend Component with State, Props & Child-to-Parent Event',
    tsTitle: 'React / Vue 3',
    tsCode: `// React
function StoreCard({ recordId, onStoreSelect }) {
  const [loading, setLoading] = useState(false);
  const handleClick = () => onStoreSelect(recordId);
  return <button onClick={handleClick}>Select Store</button>;
}`,
    apexTitle: 'Salesforce LWC (Lightning Web Component)',
    apexCode: `import { LightningElement, api } from 'lwc';

export default class StoreCard extends LightningElement {
    @api recordId;
    loading = false;

    handleClick() {
        this.dispatchEvent(new CustomEvent('storeselect', {
            detail: { id: this.recordId }
        }));
    }
}`
  }
];

export const architectPyramidStages = [
  {
    phase: 'Phase 1 · Months 1 to 3 (Nov → Feb)',
    role: 'Salesforce Developer / RevOps & Integration Engineer',
    comp: '$4,500 – $6,000 USD/month',
    certs: ['Platform Developer I (PD1)'],
    focus: 'Master Blocks 01 to 04: Data Model, OWD/Sharing Security, Flows, Order of Execution, Bulkified Apex, Queueable REST, and LWC.'
  },
  {
    phase: 'Phase 2 · Months 4 to 9',
    role: 'Senior Salesforce Developer / Integration Tech Lead',
    comp: '$6,500 – $9,500 USD/month',
    certs: ['Integration Architect', 'Identity & Access Management (IAM) Architect', 'Platform App Builder'],
    focus: 'Master Block 05: The 6 Integration Patterns, Platform Events (__e), CDC, Pub/Sub gRPC, Bulk API 2.0, and OAuth 2.0 JWT Bearer Flow.'
  },
  {
    phase: 'Phase 3 · Months 10 to 18',
    role: 'Salesforce Application & Integration Architect (B2B)',
    comp: '$10,000 – $16,000+ USD/month ($120k–$195k+/year)',
    certs: ['Data Architect', 'Sharing & Visibility Architect', '🏆 Official Credential: Certified Application Architect'],
    focus: 'Master Block 06: Large Data Volumes (>50M rows), eliminating Data Skew, Query Plan optimization, and internal __Share table architecture.'
  }
];


export const masterGlossary = [
  // BUSINESS & CRM
  {
    term: 'CRM (Customer Relationship Management)',
    category: 'Business & CRM',
    devEquivalent: 'Core B2B Commercial System of Record',
    definition: 'Centralized platform where a company tracks every prospect, customer company, contact person, revenue deal, quote, and support ticket across Marketing, Sales, Operations, and Support.'
  },
  {
    term: 'Org (Organization)',
    category: 'Business & CRM',
    devEquivalent: 'Isolated Tenant / Dedicated Postgres Instance',
    definition: 'A logically isolated deployment of Salesforce belonging to a customer (identified by a unique 18-char OrgId) containing its own users, metadata, and data.'
  },
  {
    term: 'Lead vs. Account / Contact / Opportunity',
    category: 'Business & CRM',
    devEquivalent: 'Prospect Funnel → Normalized Customer Entities',
    definition: 'A Lead is an unqualified prospect. Once qualified, Lead Conversion splits it into 3 linked records: Account (the company), Contact (the person), and Opportunity (the revenue deal in the pipeline).'
  },
  {
    term: 'RevOps (Revenue Operations)',
    category: 'Business & CRM',
    devEquivalent: 'Commercial Systems & Funnel Engineering',
    definition: 'The discipline that aligns Marketing, Sales, and Finance processes inside the CRM (lead routing, territory assignment, quoting, pipeline automation, and forecasting).'
  },
  {
    term: 'CPQ (Configure, Price, Quote) / Revenue Cloud',
    category: 'Business & CRM',
    devEquivalent: 'Pricing & Subscription Rules Engine (SBQQ__)',
    definition: 'Salesforce solution that automates complex B2B product bundles, tiered discounting, contract renewals, and quote PDF generation.'
  },
  {
    term: 'SI (System Integrator) vs. ISV Partner',
    category: 'Business & CRM',
    devEquivalent: 'Tech Consultancy vs. SaaS Product Vendor',
    definition: 'SI Partners (e.g., Slalom, Deloitte, Globant) implement and customize Salesforce for client companies. ISV Partners (e.g., DocuSign, Copado) build commercial software packages sold on the AppExchange.'
  },
  {
    term: 'AppExchange',
    category: 'Business & CRM',
    devEquivalent: 'Enterprise App Store / npm Registry for Salesforce',
    definition: 'Salesforce\'s official marketplace where admins and architects install Managed and Unmanaged Packages into their Org.'
  },

  // DATA & SCHEMA
  {
    term: 'Data vs. Metadata',
    category: 'Data & Schema',
    devEquivalent: 'Table Rows vs. Database Schema & Source Code',
    definition: 'Data means business records created by users (e.g., the Farmatodo Account row). Metadata means the structural configuration and code (Objects, Fields, Flows, Validation Rules, Apex, LWC) tracked in Git.'
  },
  {
    term: 'SObject (Standard, __c, __x, __b, __mdt, __e)',
    category: 'Data & Schema',
    devEquivalent: 'Base Database Entity / Table Type',
    definition: 'Base class for all Salesforce objects. Standard (Account), Custom Object (__c), External Object (__x), Big Object (__b), Custom Metadata Type (__mdt), and Platform Event (__e).'
  },
  {
    term: 'Lookup vs. Master-Detail Relationship',
    category: 'Data & Schema',
    devEquivalent: 'Nullable Foreign Key vs. NOT NULL ON DELETE CASCADE FK',
    definition: 'Lookup is a loosely coupled 1:N link where the child has its own OwnerId. Master-Detail is a tightly coupled 1:N link where the parent is required, child security is controlled by the parent, Cascade Delete applies, and Roll-Up Summary fields are unlocked.'
  },
  {
    term: 'Junction Object',
    category: 'Data & Schema',
    devEquivalent: 'Many-to-Many (M:N) Join Table',
    definition: 'A Custom Object containing 2 Master-Detail relationship fields to connect two parent objects in a Many-to-Many relationship.'
  },
  {
    term: 'Roll-Up Summary Field',
    category: 'Data & Schema',
    devEquivalent: 'Materialized Aggregate Column (COUNT/SUM/MIN/MAX)',
    definition: 'A read-only field on a Master object that automatically calculates COUNT, SUM, MIN, or MAX across its Detail child records.'
  },
  {
    term: 'External ID',
    category: 'Data & Schema',
    devEquivalent: 'Indexed External Unique Key for Upserts',
    definition: 'A flag on Text/Number/Email fields that creates a custom database index and enables idempotent upsert operations using an external database UUID/key.'
  },
  {
    term: 'Data Skew (Account / Ownership / Lookup Skew)',
    category: 'Data & Schema',
    devEquivalent: 'Database Hot-Row Lock Contention',
    definition: 'Performance bottleneck caused when >10,000 child records point to a single parent record or a single user owns >10,000 records, triggering UNABLE_TO_LOCK_ROW errors.'
  },

  // SECURITY
  {
    term: 'CRUD & FLS (Field-Level Security)',
    category: 'Security',
    devEquivalent: 'Table-Level & Column-Level Permissions',
    definition: 'CRUD controls whether a user can Create, Read, Edit, or Delete an Object (table). FLS controls whether a user can view or edit specific Fields (columns). Controlled via Profiles and Permission Sets.'
  },
  {
    term: 'Profile vs. Permission Set',
    category: 'Security',
    devEquivalent: 'Base IAM Role vs. Additive IAM Policies',
    definition: 'Every user has exactly 1 Profile defining baseline permissions, and 0 to N Permission Sets that grant additional permissions on top of the Profile.'
  },
  {
    term: 'OWD (Organization-Wide Defaults)',
    category: 'Security',
    devEquivalent: 'Baseline Row-Level Security (RLS) Policy',
    definition: 'Defines the baseline visibility of records a user does NOT own (Private, Public Read Only, Public Read/Write, Controlled by Parent). The ONLY mechanism that restricts row access.'
  },
  {
    term: 'Role Hierarchy & Sharing Rules',
    category: 'Security',
    devEquivalent: 'Vertical & Lateral Row-Access Grants',
    definition: 'Role Hierarchy opens record access vertically to managers above owners. Sharing Rules open record access laterally to Public Groups or Roles based on owner or field criteria.'
  },

  // AUTOMATION & CODE
  {
    term: 'Declarative vs. Programmatic ("Clicks vs. Code")',
    category: 'Automation & Code',
    devEquivalent: 'No-Code/Low-Code Config vs. Custom Backend/Frontend Code',
    definition: 'Declarative tools (Validation Rules, Flows, Page Layouts, Formula Fields) require zero code. Programmatic tools (Apex, Triggers, LWC) provide full software engineering power.'
  },
  {
    term: 'Flow (Before-Save, After-Save, Screen Flow)',
    category: 'Automation & Code',
    devEquivalent: 'Visual Workflow & State Machine Engine',
    definition: 'Salesforce\'s primary declarative automation engine. Before-Save Flows update the triggering record before DB save; After-Save Flows update related records; Screen Flows render interactive UI wizards.'
  },
  {
    term: 'Save Order of Execution',
    category: 'Automation & Code',
    devEquivalent: 'Database Transaction Lifecycle Pipeline',
    definition: 'The strict 14-step sequence Salesforce executes on every DML save: Before Flows → Before Triggers → Validation Rules → Preliminary DB Save → After Triggers → After Flows → Roll-Up Summary → Commit → Post-Commit Async.'
  },
  {
    term: 'Apex',
    category: 'Automation & Code',
    devEquivalent: 'Strongly-Typed Backend Language (Java / C# / TS style)',
    definition: 'Salesforce\'s proprietary, strongly typed, object-oriented backend programming language that executes directly on the multi-tenant server runtime.'
  },
  {
    term: 'Governor Limits & Bulkification',
    category: 'Automation & Code',
    devEquivalent: 'Strict Per-Request Resource Quotas (100 SOQL / 150 DML)',
    definition: 'Runtime limits enforced per transaction to protect multi-tenant resources. Bulkification is the practice of writing code using Sets, Maps, and Lists outside loops so it handles 1 or 200 records with the same query/DML count.'
  },
  {
    term: 'SOQL vs. SOSL',
    category: 'Automation & Code',
    devEquivalent: 'Relational SQL Query vs. Elasticsearch Multi-Table Search',
    definition: 'SOQL queries a single object and its related objects (__r). SOSL performs full-text indexed searches across multiple unrelated objects simultaneously.'
  },
  {
    term: 'Queueable, @future, Batch & Scheduled Apex',
    category: 'Automation & Code',
    devEquivalent: 'Background Worker Queues & Cron Jobs',
    definition: 'Asynchronous Apex tools that run in the background with higher Governor Limits (200 SOQL, 60s CPU, 12MB Heap) and allow outbound HTTP Callouts from Trigger transactions.'
  },
  {
    term: 'LWC (Lightning Web Components) & LDS',
    category: 'Automation & Code',
    devEquivalent: 'Modern Web Components (React/Vue equivalent) + Client Cache',
    definition: 'Salesforce\'s standards-based frontend framework built on native Web Components and Shadow DOM. Lightning Data Service (LDS) provides cached client-side CRUD without writing Apex.'
  },

  // ARCHITECTURE & DEVOPS
  {
    term: 'Sandbox vs. Scratch Org',
    category: 'Architecture & DevOps',
    devEquivalent: 'Staging Environment vs. Ephemeral Docker Dev Container',
    definition: 'A Sandbox is a persistent copy of your Production Org (Developer, Dev Pro, Partial Copy, Full). A Scratch Org is an ephemeral, disposable source-driven environment spun up from Git for up to 30 days.'
  },
  {
    term: 'Named Credential',
    category: 'Architecture & DevOps',
    devEquivalent: 'Managed Vault + HTTP Client Endpoint Config',
    definition: 'Declarative configuration that stores an external API\'s base URL and authentication protocol (OAuth 2.0, JWT, API Key) so secrets are never hardcoded in Apex.'
  },
  {
    term: 'Platform Events (__e) & Change Data Capture (CDC)',
    category: 'Architecture & DevOps',
    devEquivalent: 'Kafka / RabbitMQ Pub-Sub Event Bus',
    definition: 'Real-time event streaming buses inside Salesforce. Platform Events broadcast custom event payloads; CDC automatically streams database row changes (Create/Update/Delete) for subscribed objects.'
  }
];
