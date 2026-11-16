export const block0Foundations = {
  id: 'block-0',
  num: '00',
  title: 'FOUNDATIONS: CRM ARCHITECTURE, MULTI-TENANT KERNEL & ECOSYSTEM',
  weeks: 'Day 0 (Start Here)',
  badgeColor: '#38bdf8',
  summary: 'Before touching a single button: understand what a CRM actually solves, how Salesforce\'s multi-tenant database kernel (MT_Data / MT_Indexes) works under the hood, why enterprises pay millions for it, and how SFDX source-driven development operates.',
  lessons: [
    {
      id: '0-1',
      title: 'What is a CRM & How Enterprise B2B Revenue Engines Actually Work',
      duration: '30 min read',
      summary: 'The commercial problem behind Customer Relationship Management, the Lead-to-Cash lifecycle, internal enterprise personas, and the 3 types of companies hiring Salesforce Engineers (SI, ISV, End-Customer).',
      interviewTrap: 'When an interviewer asks "Why shouldn\'t we build this requirement in custom Apex/LWC?", remember why companies buy Salesforce: maintainability and speed. Our #1 architectural rule is "Declarative First (Clicks Before Code)" — use native Validation Rules, Roll-Up Summaries, and Flows first; drop into Apex/LWC only when hitting Governor Limits, complex multi-object transactions, or custom UI requirements.',
      concepts: [
        {
          title: '1. The Business Problem: Why Enterprises Collapse Without a Unified CRM',
          body: 'In a B2B company selling high-value software or logistics services (like <em>Instaleap</em>), a single enterprise deal takes weeks or months to close and involves dozens of touchpoints:<br>• <strong>Marketing</strong> runs campaigns and captures inbound prospects.<br>• <strong>SDRs (Sales Development Reps)</strong> cold-call and qualify whether the prospect has budget, authority, need, and timeline (BANT).<br>• <strong>Account Executives (AEs)</strong> run product demos, negotiate pricing tiers, generate legal quotes, and close the contract.<br>• <strong>Operations &amp; Onboarding</strong> provision the customer\'s production infrastructure (dark stores, API keys, webhooks).<br>• <strong>Customer Success &amp; Support</strong> handle technical tickets (Cases), SLA compliance, and annual contract renewals.<br>Without a centralized <strong>CRM (Customer Relationship Management)</strong> system of record, these 5 departments operate in disconnected silos, losing millions in leaked pipeline and broken handoffs.'
        },
        {
          title: '2. Why Fortune 500 Companies Buy Salesforce Instead of Coding a Custom Node/React App',
          body: 'As a Full-Stack Engineer, creating 4 PostgreSQL tables (<code>leads</code>, <code>accounts</code>, <code>contacts</code>, <code>opportunities</code>) and a React frontend takes two weeks. Why do companies pay Salesforce hundreds of thousands of dollars per year instead?<br>Because the database tables are only 2% of an enterprise CRM. The other 98% that takes 50 engineers 5+ years to build and maintain is:<br>• <strong>Granular Row &amp; Column Security:</strong> Dynamic role hierarchies, territory sharing, field-level masking, and compliance auditing.<br>• <strong>Self-Service Reporting &amp; Forecasting:</strong> Allowing non-technical VPs of Sales to build custom joined reports and real-time dashboards without asking an engineer to write SQL.<br>• <strong>Declarative Workflow Engine:</strong> Allowing RevOps analysts to modify approval chains and field validations in minutes.<br>• <strong>Zero-Downtime Upgrades &amp; Compliance:</strong> SOC2, HIPAA, GDPR, SSO/MFA, and 3 automatic platform releases per year.'
        },
        {
          title: '3. The 3 Employer Archetypes in the Salesforce Ecosystem (Where the Money Is)',
          body: '1. <strong>SI Partners (System Integrators / Consultancies):</strong> Firms like <em>Slalom, Deloitte Digital, Accenture, PwC, Coastal Cloud, Globant</em>. Clients hire them to architect and deliver complex Salesforce implementations, data migrations, and ERP integrations. Highest variety of projects and fastest path to Tech Lead.<br>2. <strong>End-Customers (In-House Engineering / RevOps Teams):</strong> Tech and enterprise companies like <em>Stripe, Snowflake, Databricks, Uber, Toast, Instaleap</em> that run their commercial engine on Salesforce. You own a single Org deeply, integrating it with internal microservices (Node.js, Go, Kafka, Postgres).<br>3. <strong>ISV Partners (Independent Software Vendors):</strong> Product companies like <em>DocuSign, Copado, nCino, Vlocity, Conga</em> that build commercial software packages (<em>2GP Managed Packages</em>) distributed on the <strong>AppExchange</strong>. Requires hardcore, hyper-bulkified Apex and LWC engineering.'
        }
      ],
      table: {
        headers: ['Employer Type', 'Real-World Examples', 'Primary Engineering Focus', 'US / Remote Senior Comp Range'],
        rows: [
          ['US Boutique SI Consultancy', 'Slalom, Silverline, Coastal Cloud', 'Solution architecture, greenfield builds, multi-system integrations', '$95,000 – $195,000+ USD/yr'],
          ['In-House Tech End-Customer', 'Stripe, Databricks, HubSpot, Snowflake', 'Internal Quote-to-Cash, CPQ, Kafka/REST microservices sync', '$110,000 – $220,000+ USD/yr'],
          ['ISV AppExchange Product Vendor', 'Copado, nCino, OwnCompany, Conga', 'Managed package architecture, namespace isolation, extreme LDV scale', '$120,000 – $240,000+ USD/yr']
        ]
      },
      steps: [
        {
          id: 's-0-1-1',
          label: 'Master the "Declarative First (Clicks Before Code)" architectural principle',
          detail: 'Verify you can articulate to an interviewer why a Senior Salesforce Engineer always checks if a requirement can be solved via Validation Rules, Roll-Up Summaries, or Flows before writing custom Apex.'
        }
      ]
    },
    {
      id: '0-2',
      title: 'Multi-Tenant Kernel Internals: How Salesforce Stores Tables Without Creating SQL Tables',
      duration: '35 min read',
      summary: 'How Salesforce\'s Universal Data Dictionary (UDD), MT_Objects, MT_Data (Flex Columns value0..value500), and MT_Indexes work under the hood, plus Apex Hammer.',
      interviewTrap: 'When you create a Custom Object (Fulfillment_Center__c) in Setup, does Salesforce run "CREATE TABLE Fulfillment_Center__c" in its underlying database? Answer: NO! In a multi-tenant kernel hosting thousands of Orgs per instance, running DDL (CREATE/ALTER TABLE) would lock the database. Instead, Salesforce stores your table definition as a row in MT_Objects, your columns in MT_Fields, and your actual records inside a giant shared data table (MT_Data) using string flex columns (val0..val500) mapped on the fly by the Universal Data Dictionary (UDD).',
      concepts: [
        {
          title: '1. The Multi-Tenant Kernel & Universal Data Dictionary (UDD)',
          body: 'In traditional software, each customer gets their own database schema, or when you add a column you run <code>ALTER TABLE ADD COLUMN</code>. In Salesforce, thousands of customer Orgs share the same physical database cluster.<br>To let any customer create custom tables (<code>__c</code>) and custom columns in 1 second without locking the database, Salesforce uses a <strong>Metadata-Driven Kernel</strong>:<br>• <strong><code>MT_Objects</code> (Metadata Table for Objects):</strong> Stores one row per custom object you create, tagged with your <code>OrgId</code>.<br>• <strong><code>MT_Fields</code> (Metadata Table for Columns):</strong> Stores one row per custom field, its data type (Text, Number, Date, Picklist), and which physical flex column (e.g., <code>val14</code>) it maps to.<br>• <strong><code>MT_Data</code> (The Giant Shared Heap Table):</strong> Stores the actual runtime records across all objects and Orgs! Every row starts with <code>OrgId</code>, <code>ObjectId</code>, <code>RecordId</code>, and 500 generic string columns (<code>val0</code> through <code>val499</code>). When you query <code>SELECT City__c FROM Fulfillment_Center__c</code>, the <strong>UDD</strong> translates your SOQL query into a native SQL query against <code>MT_Data</code> filtered by your <code>OrgId</code> and casting <code>val14</code> to your field type.'
        },
        {
          title: '2. Why MT_Indexes Exists (And Why Non-Indexed SOQL Queries Fail at Scale)',
          body: 'Because all columns inside <code>MT_Data</code> are stored as generic strings (<code>VARCHAR</code>) so different tenants can store dates, numbers, or text in the same physical column, the underlying database cannot put native typed B-Tree indexes directly on <code>val0..val499</code>!<br>Instead, whenever a field is marked as <strong>Indexed</strong> (<code>Id</code>, <code>Name</code>, <code>OwnerId</code>, <code>CreatedDate</code>, <code>SystemModstamp</code>, <code>Lookup/Master-Detail</code>, or <strong><code>External ID</code> / <code>Unique</code></strong>), Salesforce synchronously copies that field\'s typed value into a separate physical index table called <strong><code>MT_Indexes</code></strong> (which has real typed columns for <code>StringValue</code>, <code>NumberValue</code>, <code>DateValue</code>).<br><strong>Architect Takeaway:</strong> This is why marking integration keys as <code>External ID</code> is mandatory in Salesforce—it registers the field inside <code>MT_Indexes</code> so queries over 10 million rows execute in 20ms instead of scanning <code>MT_Data</code>!'
        },
        {
          title: '3. The 3 Annual Releases & Apex Hammer Regression Testing',
          body: 'Salesforce upgrades the entire multi-tenant fleet 3 times a year (<em>Spring, Summer, Winter</em>). Your code compiles against a specific <strong>API Version</strong> (e.g., <code>v62.0</code>) stored in each file\'s <code>-meta.xml</code> so new releases never break existing behavior. Before pushing a release to production instances, Salesforce runs <strong>Apex Hammer</strong>: it executes over 60 million customer unit tests on both the current release and the new release candidate, comparing pass/fail and governor limit metrics.'
        }
      ],
      table: {
        headers: ['Internal Kernel Table', 'What It Stores', 'Why Architects Care About It'],
        rows: [
          ['MT_Objects & MT_Fields', 'Schema metadata definitions per OrgId', 'Cached in memory via the UDD (Schema.getGlobalDescribe())'],
          ['MT_Data', 'All customer record rows across flex columns (val0..val499)', 'Explains why Skinny Tables and selective filters matter on >5M rows'],
          ['MT_Indexes', 'Typed B-Tree index copies of indexed fields (External ID, Lookups)', 'Queries filtering on fields in MT_Indexes avoid Full Table Scans'],
          ['MT_Clobs', 'Long Text Area & Rich Text Area fields (>255 chars)', 'Explains why Long Text Area fields CANNOT be indexed or used in SOQL WHERE filters!']
        ]
      },
      steps: [
        {
          id: 's-0-2-1',
          label: 'Understand why Long Text Area fields cannot be filtered in SOQL WHERE',
          detail: 'Check this off once you understand that Long Text Area fields live in <code>MT_Clobs</code> outside <code>MT_Indexes</code>, which is why Salesforce prohibits filtering by them in SOQL <code>WHERE</code> clauses.'
        }
      ]
    },
    {
      id: '0-3',
      title: 'The Complete Salesforce Clouds Map: Sales, Service, CPQ, Data Cloud & MuleSoft',
      duration: '25 min read',
      summary: 'A technical tour of every major Salesforce product ("Cloud"), what standard objects each unlocks, and how they share the core Lightning Platform.',
      interviewTrap: 'Do not think Sales Cloud and Service Cloud are separate software installations. They are simply license-enabled object and feature sets running inside the exact same Salesforce Org, sharing the same Account/Contact tables, the same Apex runtime, and the same LWC framework.',
      concepts: [
        {
          title: '1. Core CRM Clouds: Sales Cloud, Service Cloud & Experience Cloud',
          body: '• <strong>Sales Cloud (B2B/B2C Revenue Pipeline):</strong> Provides <code>Lead</code>, <code>Account</code>, <code>Contact</code>, <code>Opportunity</code>, <code>Product2</code>, <code>Pricebook2</code>, <code>Quote</code>, <code>Campaign</code>, Territory Management, and Collaborative Forecasting.<br>• <strong>Service Cloud (Customer Support &amp; Contact Center):</strong> Provides <code>Case</code>, <code>CaseComment</code>, <code>Solution</code>, <code>Knowledge__kav</code> (Knowledge Base), <code>Entitlement</code> &amp; <code>Milestone</code> (SLA timers), and <strong>Omni-Channel</strong> (real-time queue/skill-based work routing to support agents).<br>• <strong>Experience Cloud (External Portals):</strong> Allows building authenticated LWC web portals for external customers, partners, or franchises directly on top of your Org\'s data using specialized external licenses (<em>Customer Community</em>, <em>Customer Community Plus</em>, <em>Partner Community</em>).'
        },
        {
          title: '2. Revenue Cloud / Salesforce CPQ (Configure, Price, Quote)',
          body: 'Standard Opportunities and Quotes work fine for simple product lists. When a B2B enterprise sells complex bundles (e.g., Hardware + SaaS Seat Licenses + Implementation Hours + Ramp Deals + Co-termed Add-ons), they install <strong>Salesforce CPQ</strong> (<code>SBQQ__</code> namespace) or <strong>Revenue Lifecycle Management (RLM)</strong>.<br>Core CPQ objects every developer encounters: <code>SBQQ__Quote__c</code>, <code>SBQQ__QuoteLine__c</code>, <code>SBQQ__ProductOption__c</code>, <code>SBQQ__ProductRule__c</code>, <code>SBQQ__PriceRule__c</code>, and <code>SBQQ__Subscription__c</code>.'
        },
        {
          title: '3. Hyperscale Data, AI & Enterprise Integration: Data Cloud, Agentforce & MuleSoft',
          body: '• <strong>Data Cloud:</strong> Ingests high-volume external telemetry and data lakes (Snowflake, BigQuery, AWS S3, Kafka) into <em>Data Lake Objects (DLOs)</em> mapped to standard <em>Data Model Objects (DMOs)</em> with identity resolution.<br>• <strong>Agentforce:</strong> Salesforce\'s reasoning engine (Atlas) that orchestrates Topics, Prompt Templates, and Actions (invoking your <code>Flow</code> or <code>@InvocableMethod</code> Apex classes) with strict Einstein Trust Layer PII masking.<br>• <strong>MuleSoft Anypoint Platform:</strong> Enterprise integration layer organizing APIs into 3 tiers: <strong>System APIs</strong> (unlocking SAP/ERP/Postgres), <strong>Process APIs</strong> (business orchestration), and <strong>Experience APIs</strong> (tailored payloads for Salesforce/Mobile).'
        }
      ],
      table: {
        headers: ['Cloud / Product', 'Key Technical Artifacts', 'When You Will Touch It as an Engineer'],
        rows: [
          ['Sales Cloud', 'Lead, Account, Contact, Opportunity, OpportunityLineItem', 'Every B2B project (like our Instaleap engine)'],
          ['Service Cloud', 'Case, Email-to-Case, Web-to-Case, Omni-Channel, Milestones', 'Support automation, SLA escalations, agent console LWCs'],
          ['CPQ / Revenue Cloud', 'SBQQ__Quote__c, Price Rules, QCP (Quote Calculator Plugin in JS)', 'High-paid Quote-to-Cash & billing integration roles'],
          ['Experience Cloud', 'LWC Digital Experiences, Sharing Sets, Partner Roles', 'Building self-service B2B client or vendor portals'],
          ['MuleSoft / API Layer', 'System / Process / Experience APIs, RAML / OpenAPI', 'Enterprise Integration Architect projects']
        ]
      },
      steps: [
        {
          id: 's-0-3-1',
          label: 'Inspect Sales and Service apps inside your Org',
          detail: 'Open your Org, click the App Launcher (<code>⋮⋮⋮</code>), and switch between <strong>Sales</strong> and <strong>Service</strong> to see how both share the exact same <code>Accounts</code> and <code>Contacts</code> tables.'
        }
      ]
    },
    {
      id: '0-4',
      title: 'Environment Architecture: Production vs. The 4 Sandbox Types vs. Scratch Orgs',
      duration: '30 min read',
      summary: 'Complete breakdown of Developer, Developer Pro, Partial Copy, and Full Sandboxes, Sandbox Templates, and ephemeral Git-driven Scratch Orgs.',
      interviewTrap: 'Exam favorite: "A company wants a QA environment refreshed every week containing all metadata plus up to 10,000 records per object from Production without paying for a Full Sandbox. Which Sandbox type and feature must they use?" Answer: A Partial Copy Sandbox (5-day refresh interval, 5 GB storage) paired with a mandatory Sandbox Template.',
      concepts: [
        {
          title: '1. Production vs. Sandboxes (test.salesforce.com)',
          body: 'You NEVER write Apex code directly in a Production Org (in fact, Salesforce disables creating or editing Apex classes directly in the Production UI!). All development happens in isolated environments:<br>1. <strong>Developer Sandbox:</strong> 200 MB data / 200 MB file storage, <strong>1-day</strong> refresh interval. Copies 100% of Production Metadata and <strong>0 records</strong>.<br>2. <strong>Developer Pro Sandbox:</strong> 1 GB data / 1 GB file storage, <strong>1-day</strong> refresh interval. Copies 100% Metadata and <strong>0 records</strong>. Used for integration environments or larger test data loads.<br>3. <strong>Partial Copy Sandbox:</strong> 5 GB data / 5 GB file storage, <strong>5-day</strong> refresh interval. Copies 100% Metadata + a sample of Production data (up to <strong>10,000 records per selected object</strong>) governed by a <strong>Sandbox Template</strong>.<br>4. <strong>Full Sandbox:</strong> Identical storage capacity to Production, <strong>29-day</strong> refresh interval. Copies 100% Metadata and 100% of Production data (can also use a Sandbox Template to exclude unneeded historical objects and speed up refresh). Required for load testing, performance tuning, and final staging.'
        },
        {
          title: '2. Scratch Orgs vs. Sandboxes (Source-Driven Development)',
          body: 'While a Sandbox is a clone of your Production Org, a <strong>Scratch Org</strong> is a brand-new, empty, disposable Salesforce environment spun up from the command line via the <strong>Dev Hub</strong>.<br>• <strong>Lifespan:</strong> 1 to 30 days (default 7 days), after which it automatically self-destructs.<br>• <strong>Configuration:</strong> Defined by a JSON file (<code>config/project-scratch-def.json</code>) that specifies which Salesforce edition (<code>Developer</code>, <code>Enterprise</code>) and features/settings to enable.<br>• <strong>Why CI/CD loves Scratch Orgs:</strong> Your Git repository is the single source of truth. In a GitHub Action, you spin up a fresh Scratch Org, push your Git branch into it, run all Apex and LWC tests, and destroy the Scratch Org.'
        }
      ],
      table: {
        headers: ['Environment', 'Source of Truth', 'Data Included', 'Refresh / Lifespan', 'Login Endpoint'],
        rows: [
          ['Developer Sandbox', 'Cloned from Production', '0 records (Metadata only, 200 MB max)', 'Refresh every 1 day', 'test.salesforce.com'],
          ['Developer Pro Sandbox', 'Cloned from Production', '0 records (Metadata only, 1 GB max)', 'Refresh every 1 day', 'test.salesforce.com'],
          ['Partial Copy Sandbox', 'Cloned from Production + Template', 'Up to 10k rows/object (5 GB max)', 'Refresh every 5 days', 'test.salesforce.com'],
          ['Full Sandbox', 'Cloned from Production', '100% of Production data', 'Refresh every 29 days', 'test.salesforce.com'],
          ['Scratch Org', 'Built from Git (project-scratch-def.json)', '0 records (seeded via scripts)', 'Expires in 1–30 days', 'test.salesforce.com / CLI']
        ]
      },
      code: {
        filename: 'config/project-scratch-def.json',
        snippet: `{
  "orgName": "Instaleap B2B Engine Scratch Org",
  "edition": "Developer",
  "features": ["EnableSetPasswordInApi"],
  "settings": {
    "lightningExperienceSettings": {
      "enableS1DesktopEnabled": true
    },
    "securitySettings": {
      "passwordPolicies": {
        "enableSetPasswordInApi": true
      }
    }
  }
}`
      },
      steps: [
        {
          id: 's-0-4-1',
          label: 'Inspect config/project-scratch-def.json in your local VS Code workspace',
          detail: 'Open <code>config/project-scratch-def.json</code> in your project to see how Scratch Org editions and settings are declared in JSON.'
        }
      ]
    },
    {
      id: '0-5',
      title: 'SFDX Project Anatomy, Metadata XML & Essential sf CLI Commands',
      duration: '25 min read',
      summary: 'How sfdx-project.json, force-app/main/default, and *-meta.xml files work, and the exact sf CLI commands you will use every single day.',
      interviewTrap: 'When you create a field or Flow inside the browser Setup UI, does it automatically appear in your local VS Code Git repository? NO! You must run "sf project retrieve start" to pull remote Org metadata into your local XML files, and "sf project deploy start" to push local XML/Apex/LWC changes up to the Org.',
      concepts: [
        {
          title: '1. Inside an SFDX Project (force-app/main/default)',
          body: 'Every modern Salesforce DX repository is governed by <code>sfdx-project.json</code> (which defines the <code>packageDirectories</code> path and the <code>sourceApiVersion</code>):<br>• <code>objects/</code>: Folder per object (<code>Account/</code>, <code>Fulfillment_Center__c/</code>) containing sub-folders for <code>fields/</code>, <code>validationRules/</code>, <code>listViews/</code>, and <code>recordTypes/</code>.<br>• <code>classes/</code>: Every Apex class has two files: <code>MyClass.cls</code> (the code) and <code>MyClass.cls-meta.xml</code> (API version and status).<br>• <code>triggers/</code>: Apex triggers (<code>AccountTrigger.trigger</code> + <code>.trigger-meta.xml</code>).<br>• <code>lwc/</code>: Lightning Web Component bundles (<code>.html</code>, <code>.js</code>, <code>.css</code>, <code>.js-meta.xml</code>).<br>• <code>flows/</code>: Declarative Flows serialized as XML (<code>*.flow-meta.xml</code>).<br>• <code>permissionsets/</code> &amp; <code>profiles/</code>: Security XML definitions.'
        },
        {
          title: '2. Essential Daily Salesforce CLI (sf v2) Command Reference',
          body: 'Memorize these 6 terminal commands—they are your daily bread as a Salesforce Developer:'
        }
      ],
      code: {
        filename: 'Daily sf CLI Cheatsheet',
        snippet: `# 1. Authenticate & set default Org alias
sf org login web --alias sfdc-dev --set-default

# 2. Open your Org in the browser
sf org open -o sfdc-dev

# 3. Deploy local code/metadata to the Org
sf project deploy start -d force-app/main/default
sf project deploy start -m ApexClass:AccountTriggerHandler -m ApexTrigger:AccountTrigger

# 4. Retrieve point-and-click Setup changes from the Org into VS Code
sf project retrieve start -m CustomObject:Fulfillment_Center__c
sf project retrieve start -m ValidationRule:Account.Require_Stores_Before_Provisioning

# 5. Execute an Anonymous Apex script
sf apex run -f scripts/apex/hello.apex

# 6. Run Apex Unit Tests with code coverage
sf apex run test -n TenantProvisioningTest -r human --code-coverage`
      },
      steps: [
        {
          id: 's-0-5-1',
          label: 'Inspect sfdx-project.json and force-app/main/default in VS Code',
          detail: 'Check your project tree in VS Code and verify how <code>objects/</code>, <code>classes/</code>, <code>triggers/</code>, and <code>permissionsets/</code> are organized.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-0',
    title: 'Block 0 Exam: CRM Foundations, Multi-Tenant Kernel & SFDX',
    questions: [
      {
        q: 'When an Administrator creates a Custom Object (Fulfillment_Center__c) in Setup, what does Salesforce\'s multi-tenant kernel do in the underlying database?',
        options: [
          'Executes a physical SQL CREATE TABLE statement and restarts the database service',
          'Inserts metadata rows into MT_Objects and MT_Fields, and stores runtime records inside the shared MT_Data table mapped by the Universal Data Dictionary (UDD)',
          'Creates a separate PostgreSQL container per custom object',
          'Stores the object only in the browser\'s localStorage'
        ],
        correct: 1,
        explanation: 'To prevent DDL locks across thousands of shared tenants, Salesforce stores schema definitions as metadata rows (MT_Objects/MT_Fields) and stores records inside the shared MT_Data heap table.'
      },
      {
        q: 'Which Sandbox type has a 5-day refresh interval, 5 GB of storage, and requires a Sandbox Template to copy up to 10,000 records per object from Production?',
        options: [
          'Developer Sandbox',
          'Developer Pro Sandbox',
          'Partial Copy Sandbox',
          'Full Sandbox'
        ],
        correct: 2,
        explanation: 'Partial Copy Sandboxes offer 5 GB of data storage, refresh every 5 days, and require a Sandbox Template to pull a sample of Production records.'
      },
      {
        q: 'Why can you NOT filter by a Long Text Area field inside the WHERE clause of a SOQL query?',
        options: [
          'Because SOQL only supports numbers',
          'Because Long Text Area fields (>255 chars) are stored in the separate MT_Clobs table and cannot be indexed in MT_Indexes',
          'Because Long Text Area fields are encrypted',
          'You actually can filter by Long Text Area fields in WHERE'
        ],
        correct: 1,
        explanation: 'Long Text Area and Rich Text Area values reside in MT_Clobs and are never indexed in MT_Indexes; filtering by them in SOQL WHERE is prohibited (you must use SOSL instead).'
      }
    ]
  }
};
