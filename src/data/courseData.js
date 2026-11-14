export const blocksPart1 = [
  {
    id: 'block-0',
    num: '00',
    title: 'FOUNDATIONS: WHAT IS A CRM, THE SALESFORCE WORLD & GLOSSARY',
    weeks: 'Day 0 (Start Here)',
    badgeColor: '#38bdf8',
    summary: 'Before touching a single button: understand what a CRM actually solves, why Fortune 500 companies pay millions for Salesforce instead of building custom CRUD apps, how the ecosystem is divided (SI vs. ISV vs. Customer), and what each Cloud does.',
    lessons: [
      {
        id: '0-1',
        title: 'What is a CRM & Why Companies Pay Millions for Salesforce?',
        duration: '20 min read',
        summary: 'The business problem behind Customer Relationship Management (CRM), the B2B revenue engine (Marketing → SDR → Account Executive → Onboarding → Renewal), and the 3 types of companies that hire Salesforce Engineers.',
        interviewTrap: 'When an interviewer asks "Why shouldn\'t we build this in custom Apex/LWC?", remember why companies buy Salesforce in the first place: speed to market and low maintenance. In Salesforce, our #1 philosophy is "Clicks Before Code" (use native declarative tools first; write Apex/LWC only when declarative tools hit scale or complexity limits).',
        concepts: [
          {
            title: 'What is a CRM (Customer Relationship Management) Really?',
            body: 'At its core, a <strong>CRM</strong> is the single system of record for every interaction a company has with its prospects and paying customers. Without a CRM, a company\'s sales reps track deals in messy spreadsheets, support agents have no idea what the customer bought, and finance doesn\'t know which contracts are up for renewal.<br><strong>Salesforce</strong> is the #1 Enterprise CRM on the planet (holding >21% global market share, more than Microsoft, Oracle, SAP, and ServiceNow combined) because it is not just a static app—it is a programmable cloud platform where companies run their entire commercial operations.'
          },
          {
            title: 'Why Don\'t Companies Just Build Their Own CRM in Node.js + React + PostgreSQL?',
            body: 'As a Full-Stack Developer, you might think: <em>"A CRM is just tables for Leads, Accounts, and Deals—I could code that in NestJS and React in a month!"</em><br>Here is why enterprises don\'t do that: building the tables takes 1 month, but building <strong>enterprise row-level security, audit trails, dynamic report builders, mobile apps, SSO, territory hierarchies, email/calendar sync, approval engines, and zero-downtime upgrades</strong> takes 50 engineers 5 years. Salesforce gives companies all of that out-of-the-box on Day 1, and hires <strong>Salesforce Developers &amp; Architects</strong> to customize it and integrate it with their core product backends.'
          },
          {
            title: 'Who Uses Salesforce Inside a Company? (The Personas You Build For)',
            body: '1. <strong>Marketing Team:</strong> Captures website visitors and event attendees as <code>Leads</code>.<br>2. <strong>SDR / BDR (Sales Development Rep):</strong> Calls and qualifies those <code>Leads</code>. If the prospect has budget and need, the SDR <strong>converts</strong> the Lead.<br>3. <strong>AE (Account Executive):</strong> Works the <code>Opportunity</code> (the deal in dollars), sends quotes (<code>Quote / CPQ</code>), negotiates contracts, and moves the deal to <code>Closed Won</code>.<br>4. <strong>Operations / Onboarding Team:</strong> Provisions the customer\'s stores or software tenant (just like our <em>Instaleap Operations</em> team!).<br>5. <strong>Customer Success &amp; Support Agents:</strong> Handle support tickets (<code>Cases</code>) and renewals.<br>6. <strong>RevOps (Revenue Operations) &amp; Executives:</strong> Live inside <code>Reports &amp; Dashboards</code> to forecast revenue and measure pipeline conversion.'
          },
          {
            title: 'The 3 Types of Employers in the Salesforce Job Market',
            body: '1. <strong>SI Partners (System Integrators / Consultancies):</strong> Companies like <em>Slalom, Deloitte, Accenture, PwC, Globant, OSF Digital</em>. Clients hire them to design and implement Salesforce projects. Fast-paced, highest exposure to multiple architectures.<br>2. <strong>End-Customers (In-House Tech &amp; Enterprise Teams):</strong> Companies like <em>Stripe, Uber, Airbnb, Snowflake, Nubank, Instaleap</em> that use Salesforce internally to run their own sales and operations. You own and evolve one single Org.<br>3. <strong>ISV Partners (Independent Software Vendors):</strong> Product companies like <em>DocuSign, Copado, nCino</em> that build software packages (<em>Managed Packages</em>) sold on the <strong>AppExchange</strong> (Salesforce\'s app store).'
          }
        ],
        table: {
          headers: ['Employer Type', 'Examples', 'Daily Work Style', 'Typical Comp Range (Senior / Architect)'],
          rows: [
            ['US Boutique SI Consultancy', 'Slalom, Coastal Cloud, Silverline', 'Designing solutions & integrations for US enterprise clients', '$90k – $190k+ USD/yr'],
            ['Product / Tech End-Customer', 'Stripe, Databricks, HubSpot,Toast', 'Owning internal RevOps, CPQ, and backend ERP/DB integrations', '$100k – $210k+ USD/yr'],
            ['ISV AppExchange Vendor', 'Copado, OwnCompany, nCino, Conga', 'Writing heavy, hyper-optimized Apex/LWC inside Managed Packages', '$110k – $220k+ USD/yr']
          ]
        },
        steps: [
          {
            id: 's-0-1-1',
            label: 'Understand the "Clicks Before Code" golden rule',
            detail: 'Check this step once you can explain why a Senior Salesforce Engineer always evaluates native declarative features before writing custom Apex.'
          }
        ]
      },
      {
        id: '0-2',
        title: 'The Salesforce Ecosystem Map: What Are the Different "Clouds"?',
        duration: '20 min read',
        summary: 'Sales Cloud, Service Cloud, Revenue Cloud (CPQ), Experience Cloud, Data Cloud, Agentforce, and MuleSoft explained in plain English.',
        interviewTrap: 'You do NOT need to know all 15 Salesforce Clouds to land a $5k–$15k/month role. 85% of all high-paying Salesforce Developer & Integration Architect jobs revolve around the Core Platform (Sales Cloud + Service Cloud + Custom Apex/LWC/Flows + REST/Event Integrations).',
        concepts: [
          {
            title: 'The Core Platform Clouds (All Share the Same Database, Apex & LWC)',
            body: '• <strong>Sales Cloud:</strong> Everything related to selling: <code>Lead</code>, <code>Account</code>, <code>Contact</code>, <code>Opportunity</code>, <code>Product2</code>, <code>Pricebook2</code>, <code>Quote</code>, and sales forecasting.<br>• <strong>Service Cloud:</strong> Everything related to customer support and contact centers: <code>Case</code> (tickets), <em>Omni-Channel</em> (routing tickets to agents), <em>Knowledge</em> (help articles), and <em>SLAs / Entitlements</em>.<br>• <strong>Revenue Cloud / CPQ (Configure, Price, Quote):</strong> Advanced quoting engine for complex B2B product bundles, subscription tiers, automated renewals, and billing.<br>• <strong>Experience Cloud (formerly Community Cloud):</strong> Builds external web portals for customers or partners (e.g., a self-service portal where clients log in to view their invoices or open support Cases) using LWC.'
          },
          {
            title: 'The Data, AI & Integration Clouds (High-Paid Architect Territory)',
            body: '• <strong>Data Cloud:</strong> Salesforce\'s hyperscale real-time data lakehouse that ingests hundreds of millions of external customer events (web clicks, mobile app usage, Postgres/Snowflake tables) and unifies them into a single customer profile.<br>• <strong>Agentforce:</strong> Salesforce\'s autonomous AI agent platform that connects LLMs directly to your Org\'s Flows, Apex classes, and Data Cloud to execute actions autonomously.<br>• <strong>MuleSoft:</strong> Enterprise API &amp; ESB integration platform owned by Salesforce used by huge corporations to orchestrate APIs between SAP, Oracle, NetSuite, and Salesforce.'
          }
        ],
        table: {
          headers: ['Salesforce Cloud', 'Core Objects / Tech', 'What Business Team Uses It?'],
          rows: [
            ['Sales Cloud', 'Lead, Account, Contact, Opportunity, Quote', 'Sales Reps (SDRs, Account Executives, Sales Ops)'],
            ['Service Cloud', 'Case, Entitlement, Knowledge__kav, Omni-Channel', 'Customer Support Agents & Field Service Techs'],
            ['Revenue Cloud / CPQ', 'SBQQ__Quote__c, QuoteLine, PriceRule, ProductRule', 'Deal Desk, RevOps & Finance Teams'],
            ['Experience Cloud', 'LWC Portals + External Customer/Partner Users', 'External Customers, Partners, Dealers & Vendors'],
            ['Data Cloud & Agentforce', 'Data Streams, DLOs/DMOs, Prompt Builder, Apex Actions', 'AI Engineers, Data Architects & Enterprise Ops']
          ]
        },
        steps: [
          {
            id: 's-0-2-1',
            label: 'Switch between Sales and Service apps in your Org',
            detail: 'In your Salesforce Org, click the <strong>App Launcher (<code>⋮⋮⋮</code> top left)</strong> and notice how both <strong>Sales</strong> and <strong>Service</strong> exist inside the exact same Org.'
          }
        ]
      },
      {
        id: '0-3',
        title: 'Mental Model for Full-Stack Devs: Navigating Your Org & Metadata vs. Data',
        duration: '20 min read',
        summary: 'How Salesforce concepts map 1-to-1 to PostgreSQL, Node.js, and React, and how the Salesforce UI is split between the User Workspace and Setup.',
        interviewTrap: 'Never confuse "Data" with "Metadata". In Salesforce: "Data" means the business rows inside tables (like the Farmatodo Account record). "Metadata" means the structure and code of your Org (Custom Objects, Fields, Flows, Validation Rules, Apex Classes, LWCs) stored as XML/code in your Git repository.',
        concepts: [
          {
            title: 'Full-Stack Web Engineering → Salesforce Architecture Dictionary',
            body: 'Because you already know Full-Stack development, here is the exact mental translation:<br>• <strong>PostgreSQL Database Instance</strong> → Your Salesforce <strong>Org</strong>.<br>• <strong>Database Table</strong> → Salesforce <strong>Object</strong> (Standard like <code>Account</code> or Custom like <code>Fulfillment_Center__c</code>).<br>• <strong>Table Column</strong> → Salesforce <strong>Field</strong> (Standard like <code>Name</code> or Custom like <code>City__c</code>).<br>• <strong>Table Row / Tuple</strong> → Salesforce <strong>Record</strong> (identified by an 18-character <code>Id</code>).<br>• <strong>SQL Query</strong> → <strong>SOQL</strong> (Salesforce Object Query Language).<br>• <strong>Node.js / NestJS Backend Service</strong> → <strong>Apex Classes &amp; Triggers</strong> (or declarative <strong>Flows</strong>).<br>• <strong>React / Vue Component</strong> → <strong>LWC</strong> (Lightning Web Component).'
          },
          {
            title: 'The Two Halves of the Salesforce Screen: User Workspace vs. Setup (⚙️)',
            body: 'When you log into Salesforce, there are two completely separate worlds:<br>1. <strong>The Front-Office User Workspace (App Launcher <code>⋮⋮⋮</code>):</strong> What salespeople and operations users see every day (Apps like <em>Sales</em> or <em>Instaleap Operations</em> with tabs for Leads, Accounts, Opportunities, and Reports).Here you create and edit <strong>Data (records)</strong>.<br>2. <strong>The Developer/Admin Control Plane (Gear Icon ⚙️ top right → Setup):</strong> Where you build the system. Inside Setup, the <em>Object Manager</em> lets you create tables, fields, and validation rules, while the <em>Quick Find</em> sidebar gives you access to Flows, Sharing Settings, Permission Sets, and Apex.'
          }
        ],
        table: {
          headers: ['Full-Stack Concept', 'Salesforce Equivalent', 'Where It Lives'],
          rows: [
            ['Database Table', 'Object (Account, Fulfillment_Center__c)', 'Setup → Object Manager / force-app/main/default/objects'],
            ['Table Column', 'Field (Name, Onboarding_Status__c)', 'Setup → Object Manager → Fields & Relationships'],
            ['Database Row', 'Record (e.g., Farmatodo)', 'App Launcher (⋮⋮⋮) → Accounts Tab'],
            ['Backend Controller / Service', 'Apex Class (.cls) & Trigger (.trigger)', 'force-app/main/default/classes & triggers'],
            ['Frontend UI Component', 'Lightning Web Component (LWC)', 'force-app/main/default/lwc'],
            ['SQL / ORM Migration Files', 'Metadata XML Files (*-meta.xml)', 'Deployed & retrieved via sf project deploy / retrieve']
          ]
        },
        steps: [
          {
            id: 's-0-3-1',
            label: 'Explore the 2 halves of your Org (App Launcher vs. Setup)',
            detail: 'Click the <strong>Gear icon (⚙️ top right) → Setup</strong>, click the <strong>Object Manager</strong> tab next to Home, find <code>Fulfillment Center</code>, and inspect its <strong>Fields &amp; Relationships</strong>.'
          },
          {
            id: 's-0-3-2',
            label: 'Open the Master Glossary tab in the top navigation bar',
            detail: 'Click the <strong>📖 Glossary (A–Z)</strong> tab at the top of this web app and bookmark it for quick reference whenever you see a new acronym.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-0',
      title: 'Block 0 Exam: CRM Foundations & Ecosystem',
      questions: [
        {
          q: 'What is the fundamental difference between "Data" and "Metadata" in Salesforce?',
          options: [
            'They are the exact same thing',
            'Data refers to the actual business records (rows like Farmatodo), whereas Metadata refers to the configuration and code that define your Org (Objects, Fields, Flows, Apex, LWC)',
            'Metadata is only for Standard Objects and Data is only for Custom Objects',
            'Data is stored in Git and Metadata is stored in CSV files'
          ],
          correct: 1,
          explanation: 'Data is the runtime customer records inside tables; Metadata is the schema, declarative rules, and code versioned in Git and deployed via the Metadata API (sf CLI).'
        },
        {
          q: 'What is the difference between an SI Partner (like Slalom) and an ISV Partner (like DocuSign or Copado)?',
          options: [
            'SI Partners only hire Admins and ISVs only hire Developers',
            'SI Partners are consulting firms that implement and customize Salesforce for client companies, whereas ISV Partners build software products packaged and sold on the AppExchange',
            'SI Partners do not use Apex',
            'ISV Partners only work with Marketing Cloud'
          ],
          correct: 1,
          explanation: 'System Integrators (SIs) deliver consulting and custom implementations for clients, while Independent Software Vendors (ISVs) build commercial Managed Packages listed on the AppExchange.'
        }
      ]
    }
  },
  {
    id: 'block-1',
    num: '01',
    title: 'B2B REVOPS FUNNEL, DATA MODEL & SECURITY',
    weeks: 'Weeks 1–2',
    badgeColor: '#10b981',
    summary: 'Business and declarative architecture foundations: how revenue flows through Sales Cloud, how to design relational schemas without Data Skew, and how to secure every column and row.',
    lessons: [
      {
        id: '1-1',
        title: 'Multi-Tenant Architecture, Sandboxes & the B2B Revenue Funnel (RevOps)',
        duration: 'Days 1–3',
        summary: 'How Salesforce works under the hood (Multi-tenancy, Metadata-driven kernel, Apex Hammer), the 4 Sandbox types, and the native Lead → Account + Contact + Opportunity → Quote/CPQ lifecycle.',
        interviewTrap: 'Classic interview question: "What URL do you use to log into any Sandbox, and what is the refresh interval for each of the 4 Sandbox types?" Answer: Always test.salesforce.com. Developer (200 MB, 1 day), Developer Pro (1 GB, 1 day), Partial Copy (5 GB + up to 10k rows/object via Sandbox Template, 5 days), and Full (100% Production data, 29 days).',
        concepts: [
          {
            title: 'Multi-Tenant Architecture & Apex Hammer (3 Releases per Year)',
            body: 'All Salesforce customers share the same physical infrastructure and database engine, with strict logical isolation enforced by each organization\'s unique <code>OrgId</code>. Salesforce delivers 3 automatic major releases per year (<em>Spring, Summer, Winter</em>). Prior to every release, Salesforce runs <strong>Apex Hammer</strong>: it executes all customer unit tests across the entire globe against both the current and upcoming release versions to guarantee zero regressions.'
          },
          {
            title: 'SaaS vs. PaaS in the Salesforce Ecosystem',
            body: '<strong>SaaS (Software as a Service):</strong> Out-of-the-box CRM applications such as <em>Sales Cloud</em> (sales pipeline), <em>Service Cloud</em> (customer support/cases), and <em>Revenue Cloud</em>.<br><strong>PaaS (Platform as a Service):</strong> The <em>Lightning Platform</em> inside <em>Setup</em> where we build custom database tables (<code>__c</code>), declarative automation (<code>Flow</code>), backend logic (<code>Apex</code>), and custom frontend components (<code>LWC</code>).'
          },
          {
            title: 'The B2B Commercial Funnel (Lead Conversion) & Special Permissions',
            body: '1. <code>Lead</code>: An unqualified prospect or initial inquiry.<br>2. <strong>Lead Conversion:</strong> Once qualified, clicking <strong>Convert</strong> executes an atomic transaction that creates 3 linked records: <code>Account</code> (the customer company, e.g., <em>Farmatodo</em>), <code>Contact</code> (the person, e.g., <em>Carlos Gómez</em>), and <code>Opportunity</code> (the revenue deal with stages and close probability).<br>3. <strong>Lead Interview Rules:</strong> Viewing or editing an already-converted Lead requires the <code>View and Edit Converted Leads</code> permission. When <strong>Merging</strong> duplicate Leads (up to 3 at a time), the selected <em>Master</em> record retains its field values and absorbs all related activities and campaign history from the deleted duplicates.'
          },
          {
            title: 'Product Catalog, Pricebooks & CPQ (Quote-to-Cash)',
            body: 'Attaching products to an <code>Opportunity</code> involves: <code>Product2</code> (the global catalog of products/services), <code>Pricebook2</code> (pricing books per currency or tier), <code>PricebookEntry</code> (junction linking a product to a pricebook with a unit price), and <code>OpportunityLineItem</code> (the specific product line added to a deal). For complex product bundles, tiered discounting, and subscription billing, enterprises use <strong>Salesforce CPQ</strong> (whose managed package objects are prefixed with <code>SBQQ__</code>).'
          },
          {
            title: 'Polymorphic Activities (WhoId vs. WhatId) & Audit Fields',
            body: 'The <code>Task</code> and <code>Event</code> tables rely on two critical polymorphic foreign keys:<br>• <code>WhoId</code> (Name): Points exclusively to humans (<code>Lead</code> or <code>Contact</code>).<br>• <code>WhatId</code> (Related To): Points to non-human entities (<code>Account</code>, <code>Opportunity</code>, <code>Case</code>, or any Custom Object with <em>Allow Activities</em> enabled).<br>• <strong>Audit Fields:</strong> <code>CreatedById</code>, <code>CreatedDate</code>, <code>LastModifiedById</code>, <code>LastModifiedDate</code>, and <code>SystemModstamp</code> are read-only except during data migrations when the <code>Set Audit Fields upon Record Creation</code> permission is granted. The <strong>Setup Audit Trail</strong> tracks the last 180 days (6 months) of metadata/configuration changes made by Admins and Developers.'
          }
        ],
        table: {
          headers: ['Sandbox Type', 'Storage (Data / File)', 'Refresh Interval', 'What It Copies & Primary Use Case'],
          rows: [
            ['Developer', '200 MB / 200 MB', 'Every 1 day', 'Metadata only (0 records). Individual daily coding and unit testing.'],
            ['Developer Pro', '1 GB / 1 GB', 'Every 1 day', 'Metadata only (0 records). Team integration and medium test datasets.'],
            ['Partial Copy', '5 GB / 5 GB', 'Every 5 days', 'Metadata + sample Production data (up to 10,000 records per object defined via a Sandbox Template). Ideal for QA and UAT.'],
            ['Full Sandbox', '100% match to Production', 'Every 29 days', 'Metadata + 100% of Production records. Used for final Staging, performance/load testing, and cutover rehearsals.']
          ]
        },
        steps: [
          {
            id: 's-1-1-1',
            label: 'Open your Salesforce Org from the DX terminal',
            detail: 'In your terminal inside <code>instaleap-sdfc</code>, run <code>sf org open</code> and open the <strong>Sales</strong> app from the App Launcher (<code>⋮⋮⋮</code> top left).'
          },
          {
            id: 's-1-1-2',
            label: 'Create the Farmatodo commercial Lead',
            detail: 'Go to the <strong>Leads</strong> tab → click <strong>New</strong> and enter: First Name: <code>Carlos</code>, Last Name: <code>Gómez</code>, Company: <code>Farmatodo</code>, Lead Status: <code>Working - Contacted</code> → click <strong>Save</strong>.'
          },
          {
            id: 's-1-1-3',
            label: 'Convert the Lead into Account + Contact + Opportunity',
            detail: 'Inside Carlos Gómez\'s Lead record, click <strong>Convert</strong> (top right), inspect the 3 records about to be created (<code>Farmatodo</code>, <code>Carlos Gómez</code>, <code>Farmatodo-</code>), and confirm by clicking <strong>Convert</strong>.'
          },
          {
            id: 's-1-1-4',
            label: 'Set the deal value on the Opportunity (Amount: $50,000)',
            detail: 'Open the newly created Opportunity (<code>Farmatodo-</code>), click <strong>Edit</strong>, set <code>Amount: 50000</code>, change <code>Stage</code> to <code>Negotiation/Review</code>, and click <strong>Save</strong>.'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Objects, Relationships (Lookup vs. Master-Detail), IDs & Data Skew',
        duration: 'Days 4–6',
        summary: 'The 4 table types in Salesforce, deep architectural differences between Lookup and Master-Detail, Junction Objects, Roll-Up Summaries, 15 vs. 18-char IDs, and Data Skew locks.',
        interviewTrap: 'Classic interview question: "How do you build a Roll-Up Summary if the relationship between child and parent is a Lookup instead of Master-Detail?" Answer: Because native Roll-Up Summary fields require a Master-Detail relationship, you have 3 alternatives on a Lookup: 1) Record-Triggered Flow (After-Save), 2) Apex Trigger using Aggregate SOQL (GROUP BY), or 3) Declarative Lookup Rollup Summaries (DLRS).',
        concepts: [
          {
            title: 'The 4 Object Types by API Suffix',
            body: '1. <strong>Standard Objects (no suffix):</strong> <code>Account</code>, <code>Contact</code>, <code>Opportunity</code>, <code>Lead</code>, <code>Case</code>.<br>2. <strong>Custom Objects (<code>__c</code>):</strong> Custom database tables created for domain-specific business data (e.g., <code>Fulfillment_Center__c</code>).<br>3. <strong>External Objects (<code>__x</code>):</strong> Virtual tables that query external systems in real time via OData (<em>Salesforce Connect</em>) without storing rows inside Salesforce.<br>4. <strong>Big Objects (<code>__b</code>):</strong> Non-transactional tables built on Apache HBase designed to archive hundreds of millions or billions of historical records.'
          },
          {
            title: 'Lookup Relationship vs. Master-Detail Relationship',
            body: '• <strong>Lookup (1:N loosely coupled):</strong> Parent is optional by default, the child record has its own <code>OwnerId</code> and independent sharing rules, and deleting the parent does NOT delete the child by default.<br>• <strong>Master-Detail (1:N tightly coupled):</strong> Parent is strictly required (<code>NOT NULL</code>), the child has NO <code>OwnerId</code> (its visibility is <code>Controlled by Parent</code>), enforces <strong>Cascade Delete</strong> (deleting the parent moves children to the Recycle Bin, and undeleting the parent restores them), and unlocks native <strong>Roll-Up Summary</strong> fields on the parent.<br>• <strong>Ironclad Rule:</strong> A <em>Standard Object</em> can NEVER be on the Detail (child) side of a Master-Detail relationship.'
          },
          {
            title: 'Junction Object (M:N), Self-Relationship & Hierarchical Relationship',
            body: '• <strong>Junction Object:</strong> A Custom Object with <strong>2 Master-Detail fields</strong> used to model Many-to-Many relationships. The first Master-Detail created becomes the <em>Primary Master</em> (controlling primary look & feel and ownership inheritance).<br>• <strong>Self-Relationship:</strong> A Lookup from an object to itself (e.g., <code>ParentId</code> on <code>Account</code>; Salesforce prevents direct circular references like <code>A1 ↔ A2</code>).<br>• <strong>Hierarchical Relationship:</strong> A special relationship type available <strong>exclusively on the <code>User</code> object</strong> to link a user to another user.'
          },
          {
            title: 'Relationship Limits & Conversion Rules',
            body: 'Each object supports a maximum of <strong>40 total relationship fields</strong> (up to <strong>2 Master-Detail</strong> + 38 Lookups, or 40 Lookups).<br>• <strong>Converting Lookup → Master-Detail:</strong> Only allowed if <strong>100% of existing child records in the database have the parent field populated</strong>.<br>• <strong>Converting Master-Detail → Lookup:</strong> Only allowed if the parent object has <strong>zero Roll-Up Summary fields</strong> summarizing that child object.'
          },
          {
            title: '15- vs. 18-Character IDs, External ID & Data Skew (UNABLE_TO_LOCK_ROW)',
            body: '• <strong>15-character ID:</strong> Case-Sensitive. <strong>18-character ID:</strong> Case-Safe (appends a 3-character checksum suffix; generated in formulas via <code>CASESAFEID(Id)</code>).<br>• <strong>External ID:</strong> Marking a Text/Number/Email field as an <code>External ID</code> (up to 25 per object) creates a <strong>custom database index</strong> (preventing Full Table Scans on millions of rows) and allows idempotent <code>upsert</code> calls without querying the Salesforce <code>Id</code> first.<br>• <strong>Data Skew:</strong> Occurs when more than <strong>10,000 child records point to the exact same parent record</strong> (or a single user owns >10,000 records). Concurrent updates lock the parent and throw <code>UNABLE_TO_LOCK_ROW</code>.'
          }
        ],
        table: {
          headers: ['Technical Dimension', 'Lookup Relationship', 'Master-Detail Relationship'],
          rows: [
            ['Parent Requirement', 'Optional (unless marked Required)', 'Always required at the database level'],
            ['Security & OwnerId', 'Child has its own OwnerId and independent OWD', 'No OwnerId; inherits parent access (Controlled by Parent)'],
            ['Cascade Delete', 'Does not delete children by default (clears field)', 'Yes: automatic Cascade Delete'],
            ['Native Roll-Up Summary', 'Not supported natively (requires Flow or Apex)', 'Supports COUNT, SUM, MIN, MAX natively'],
            ['Max per Object', 'Up to 40 (if 0 Master-Detail exist)', 'Maximum 2 per Custom Object']
          ]
        },
        steps: [
          {
            id: 's-1-2-1',
            label: 'Open Schema Builder in Setup',
            detail: 'Go to <strong>Setup (⚙️)</strong> → type <code>Schema Builder</code> in the left Quick Find box and open it.'
          },
          {
            id: 's-1-2-2',
            label: 'Select the 4 core objects of our B2B engine',
            detail: 'In the left sidebar click <strong>Clear All</strong>, check only <code>Account</code>, <code>Contact</code>, <code>Opportunity</code>, and <code>Fulfillment Center</code>, and click <strong>Auto-Layout</strong>.'
          },
          {
            id: 's-1-2-3',
            label: 'Visually verify Master-Detail vs. Lookup lines',
            detail: 'Notice the red line (<code>Master-Detail</code>) connecting <code>Account</code> and <code>Fulfillment_Center__c</code> and confirm that <code>Total_Dark_Stores__c</code> on Account is a <code>Summary (COUNT)</code> field.'
          }
        ]
      },
      {
        id: '1-3',
        title: 'Declarative UI (Apps, Layouts, Dynamic Forms), Formulas & Validation Rules',
        duration: 'Days 7–10',
        summary: 'Structuring Lightning Apps, Page Layouts vs. Lightning Record Pages, formula functions, Validation Rules, and Field Dependencies.',
        interviewTrap: 'Edge-case interview question: "A field has a Default Value configured, but it is NOT placed on the Page Layout. If a user clones a record via the UI, what value does that field get on the newly cloned record?" Answer: It receives the Default Value instead of copying the original record\'s field value.',
        concepts: [
          {
            title: 'Lightning Apps (Standard vs. Console Navigation)',
            body: 'A Lightning App is a branded container of navigation tabs assigned to specific Profiles or Permission Sets. It supports <strong>Standard Navigation</strong> (traditional top horizontal tabs) or <strong>Console Navigation</strong> (multi-tab workspace designed for high-velocity operations or support teams viewing multiple subtabs under an Account).'
          },
          {
            title: 'Page Layouts vs. Lightning Record Pages (Dynamic Forms)',
            body: '• <strong>Page Layout:</strong> Controls which fields appear inside the <em>Details</em> section, which action buttons appear in the header, and which child tables appear in <em>Related Lists</em>.<br>• <strong>Lightning Record Page:</strong> The full canvas edited in the <em>Lightning App Builder</em>. Using <strong>Dynamic Forms</strong>, you can conditionally show or hide individual fields and sections based on real-time field criteria (e.g., only show <code>Core_Tenant_Id__c</code> when <code>Onboarding_Status__c == Active</code>).'
          },
          {
            title: 'Field Dependencies (Controlling vs. Dependent Picklist)',
            body: 'Filters the available options in a child picklist based on the value selected in a parent field.<br>• <strong>Controlling Field (Parent):</strong> Can be a Standard Picklist, Custom Picklist, or Checkbox (<strong>never</strong> a Multi-Select Picklist).<br>• <strong>Dependent Field (Child):</strong> Can be a Custom Picklist or Multi-Select Picklist (<strong>never</strong> a Standard Picklist).'
          },
          {
            title: 'Validation Rules: Writing the Error Condition Formula',
            body: 'In a Validation Rule, you write the formula that defines the <strong>invalid state</strong>: when the formula evaluates to <code>TRUE</code>, Salesforce blocks the save and returns the error message in the UI or throws <code>FIELD_CUSTOM_VALIDATION_EXCEPTION</code> in Apex/API.<br>• Essential functions: <code>AND()</code>, <code>OR()</code>, <code>NOT()</code>, <code>ISBLANK()</code>, <code>ISPICKVAL(field, "literal")</code>, <code>ISCHANGED(field)</code>, <code>PRIORVALUE(field)</code>, <code>ISNEW()</code>, and global contexts like <code>$Profile.Name</code> or <code>$Permission.Bypass_Validations</code>.'
          }
        ],
        code: {
          filename: 'force-app/main/default/objects/Account/validationRules/Require_Stores_Before_Provisioning.validationRule-meta.xml',
          snippet: `AND(
  ISPICKVAL(Onboarding_Status__c, "Ready_to_Provision"),
  Total_Dark_Stores__c = 0
)`
        },
        steps: [
          {
            id: 's-1-3-1',
            label: 'Create the "Instaleap Operations" Lightning App',
            detail: 'Go to <strong>Setup → App Manager → New Lightning App</strong>: Name it <code>Instaleap Operations</code>, select <code>Standard navigation</code>, add <code>Home</code>, <code>Leads</code>, <code>Accounts</code>, <code>Contacts</code>, <code>Opportunities</code>, and <code>Fulfillment Centers</code>, and assign it to the <code>System Administrator</code> profile.'
          },
          {
            id: 's-1-3-2',
            label: 'Add Onboarding Status to the Account Page Layout',
            detail: 'Go to <strong>Setup → Object Manager → Account → Page Layouts → Account Layout</strong>, drag <code>Onboarding Status</code> into the <em>Account Information</em> section, and click <strong>Save</strong>.'
          },
          {
            id: 's-1-3-3',
            label: 'Create the Require_Stores_Before_Provisioning Validation Rule',
            detail: 'In <strong>Object Manager → Account → Validation Rules → New</strong>: Rule Name <code>Require_Stores_Before_Provisioning</code>, paste the formula above, set Error Message to <code>Cannot move Account to Ready to Provision when Total Dark Stores is 0.</code> placed on the <code>Onboarding Status</code> field, and click <strong>Save</strong>.'
          },
          {
            id: 's-1-3-4',
            label: 'Test the Validation Rule on Farmatodo and retrieve metadata to VS Code',
            detail: 'Open the <code>Farmatodo</code> Account (which currently has 0 stores), try changing <code>Onboarding Status</code> to <code>Ready to Provision</code>, and verify the red error blocks the save. Then run in your terminal: <code>sf project retrieve start -m ValidationRule:Account.Require_Stores_Before_Provisioning -m CustomApplication:Instaleap_Operations</code>.'
          }
        ]
      },
      {
        id: '1-4',
        title: 'The Complete Security Model: Columns (CRUD/FLS) vs. Rows (OWD/Sharing)',
        duration: 'Days 11–12',
        summary: 'How Profiles, Permission Sets, Permission Set Groups, Muting Permission Sets, OWD, Role Hierarchy, Sharing Rules, Manual Sharing, and Queues work together.',
        interviewTrap: 'Guaranteed interview question: "A user has Read and Edit permissions on the Account object in their Profile, yet they cannot see the Farmatodo Account record. Why, and how do you fix it?" Answer: Because a Profile only grants table-level (CRUD) and column-level (FLS) access. Row-level visibility is governed by OWD. If Account OWD is Private and they do not own the row, access must be opened via Role Hierarchy, a Sharing Rule, or Manual Sharing.',
        concepts: [
          {
            title: 'Layer 1 (Org) & Layer 2 (Objects and Fields: Columns)',
            body: '• <strong>Layer 1 (Org Access):</strong> Login Hours (if hours expire mid-session, the user can view their current page, but any click terminates the session), Login IP Ranges, and MFA.<br>• <strong>Layer 2 (Tables & Columns — CRUD & FLS):</strong> Every user has <strong>exactly 1 base Profile</strong> and <strong>0 to N additive Permission Sets</strong>. To bundle permissions by job persona, use a <strong>Permission Set Group</strong>; to silence specific permissions inside that group without modifying the underlying Permission Sets, use a <strong>Muting Permission Set</strong>.'
          },
          {
            title: 'Layer 3 (Records: Rows) — The Record Visibility Pyramid',
            body: '1. <strong>OWD (Organization-Wide Defaults):</strong> The <strong>only</strong> setting that restricts which rows a non-owner can see (<code>Private</code>, <code>Public Read Only</code>, <code>Public Read/Write</code>, <code>Controlled by Parent</code>).<br>2. <strong>Role Hierarchy:</strong> Opens vertical access; managers automatically inherit visibility into records owned by users below them in the role tree.<br>3. <strong>Sharing Rules:</strong> Open lateral access to a <em>Public Group</em> or <em>Role</em> based on record owner (<em>Owner-based</em>) or field values (<em>Criteria-based</em>).<br>4. <strong>Manual Sharing:</strong> Allows the owner to share an individual record (if the record\'s <code>OwnerId</code> changes, Manual Sharing rows are automatically deleted).<br>5. <strong>Apex Managed Sharing (<code>__Share</code>):</strong> Programmatic row sharing written in Apex.'
          },
          {
            title: 'Public Groups vs. Queues',
            body: '• <strong>Public Group:</strong> An administrative grouping of users, roles, or subgroups used in Sharing Rules or report folders.<br>• <strong>Queue:</strong> Acts as a shared record owner (<code>OwnerId</code>) for unassigned workload records. Supports <code>Lead</code>, <code>Case</code>, <code>Task</code>, and all <code>Custom Objects</code>, but <strong>never supports <code>Account</code> or <code>Opportunity</code></strong>.'
          }
        ],
        table: {
          headers: ['Security Tool', 'What It Controls', 'Restricts or Opens Access?'],
          rows: [
            ['Profile (1 per user)', 'Baseline Object (CRUD), Field (FLS), Apps & Page Layouts', 'Sets minimum baseline for tables/columns'],
            ['Permission Set (0..N)', 'Grants additional CRUD, FLS, and system permissions', 'Only opens additional table/column permissions'],
            ['Muting Permission Set', 'Silences specific permissions inside a Permission Set Group', 'Restricts only within its Permission Set Group'],
            ['OWD (Org-Wide Defaults)', 'Baseline visibility of ROWS not owned by the user', 'The ONLY layer that restricts row access'],
            ['Role Hierarchy & Sharing Rules', 'Extend which specific rows a user can view or edit', 'Only open row access wider (never restrict OWD)']
          ]
        },
        steps: [
          {
            id: 's-1-4-1',
            label: 'Set Account OWD to Private in Sharing Settings',
            detail: 'Go to <strong>Setup → Sharing Settings</strong>, verify that <code>Fulfillment Center</code> is set to <code>Controlled by Parent</code>, click <strong>Edit</strong>, change Default Internal Access for <code>Account and Contract</code> to <strong>Private</strong>, and click <strong>Save</strong>.'
          },
          {
            id: 's-1-4-2',
            label: 'Create the Share_Active_Accounts Criteria-Based Sharing Rule',
            detail: 'Scroll down to <strong>Account Sharing Rules → New</strong>: Label <code>Share_Active_Accounts</code>, Rule Type: <code>Based on criteria</code> (<code>Onboarding Status equals Active</code>), share with <code>Public Groups → All Internal Users</code> with <code>Read Only</code> access, and click <strong>Save</strong>.'
          }
        ]
      },
      {
        id: '1-5',
        title: 'Reports, Dashboards & Data Tools (Data Loader vs. Import Wizard)',
        duration: 'Days 13–14',
        summary: 'The 4 report formats, Report Types (INNER vs. LEFT JOIN), Bucket Fields, Dynamic Dashboards, and bulk data operations.',
        interviewTrap: 'Classic question: "You just created a Custom Object, but it does not appear when users try to build a report. What did you forget to check?" Answer: The "Allow Reports" checkbox inside the Custom Object definition in Object Manager.',
        concepts: [
          {
            title: 'Report Types & the 4 Report Formats',
            body: '• <strong>Report Type:</strong> Defines the SQL JOIN between objects: <em>"Primary Object with Related Object"</em> acts as an <code>INNER JOIN</code>; <em>"with or without Related Object"</em> acts as a <code>LEFT JOIN</code>.<br>• <strong>The 4 Formats:</strong> 1. <strong>Tabular</strong> (flat list; cannot feed dashboard charts unless a Row Limit is set), 2. <strong>Summary</strong> (groups by rows with subtotals), 3. <strong>Matrix</strong> (2D grid grouping by both rows and columns), 4. <strong>Joined Report</strong> (combines up to 5 blocks across different Report Types).'
          },
          {
            title: 'Bucket Fields & Dynamic Dashboards',
            body: '• <strong>Bucket Field:</strong> Categorizes report values on the fly (e.g., grouping deal sizes into <em>Small, Mid, Enterprise</em>) inside the Report Builder without creating a custom Formula field on the object.<br>• <strong>Static vs. Dynamic Dashboard:</strong> A Static Dashboard runs under a single fixed user; a <strong>Dynamic Dashboard</strong> is configured to <em>"Run as logged-in user"</em> so each rep or manager only sees metrics for records their security allows.'
          },
          {
            title: 'Data Import Wizard vs. Data Loader',
            body: '• <strong>Data Import Wizard:</strong> Browser-based inside Setup, supports up to <strong>50,000 records</strong>, allows bypassing workflows during import, but <strong>does NOT support all objects</strong> (cannot load <code>Opportunity</code> or <code>Case</code>) and cannot export or delete.<br>• <strong>Data Loader:</strong> Desktop/CLI tool supporting up to <strong>5,000,000 records</strong> across <strong>all Standard and Custom Objects</strong>, supporting <code>Insert, Update, Upsert, Delete, Hard Delete, Export, and Export All</code> (<code>Export All</code> includes soft-deleted Recycle Bin records).'
          }
        ],
        steps: [
          {
            id: 's-1-5-1',
            label: 'Create a Summary Report for Accounts with Fulfillment Centers',
            detail: 'In the <code>Instaleap Operations</code> app, open <strong>Reports</strong>, create a new report using <strong>Accounts with Fulfillment Centers</strong>, and group rows by <code>Account Name</code>.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-1',
      title: 'Block 1 Exam: Architecture, Data Model & Security',
      questions: [
        {
          q: 'Which 3 records does Salesforce automatically create when converting a qualified Lead?',
          options: [
            'Account, Contact, and Case',
            'Account, Contact, and Opportunity',
            'Account, Quote, and Order',
            'Contact, Opportunity, and Task'
          ],
          correct: 1,
          explanation: 'Lead Conversion atomically creates an Account (Company), Contact (Person), and Opportunity (Deal in the pipeline).'
        },
        {
          q: 'Why would the "Change Field Type" button block converting a Master-Detail relationship into a Lookup?',
          options: [
            'Because child records already exist in the database',
            'Because the parent object contains Roll-Up Summary fields summarizing that child object',
            'Because Organization-Wide Defaults are set to Private',
            'Because the child is a Custom Object'
          ],
          correct: 1,
          explanation: 'Salesforce blocks converting Master-Detail to Lookup as long as any Roll-Up Summary fields on the Master object reference that child relationship.'
        },
        {
          q: 'Which is the ONLY record-level (row) security mechanism that RESTRICTS baseline visibility?',
          options: [
            'Role Hierarchy',
            'Sharing Rules',
            'Organization-Wide Defaults (OWD)',
            'Permission Set Groups'
          ],
          correct: 2,
          explanation: 'OWD sets the baseline restriction (e.g., Private). Role Hierarchy, Sharing Rules, and Manual Sharing can only open access wider, never restrict it.'
        },
        {
          q: 'Which standard objects CANNOT be assigned to a Queue as their OwnerId?',
          options: [
            'Lead and Case',
            'Custom Objects (__c)',
            'Account and Opportunity',
            'Task and ServiceContract'
          ],
          correct: 2,
          explanation: 'Queues support Lead, Case, Task, and all Custom Objects, but never support Account or Opportunity.'
        }
      ]
    }
  },
  {
    id: 'block-2',
    num: '02',
    title: 'VISUAL AUTOMATION (FLOWS) & ORDER OF EXECUTION',
    weeks: 'Weeks 3–4',
    badgeColor: '#06b6d4',
    summary: 'Master Flow Builder at a Senior level: Before-Save vs. After-Save, Screen Flows with recordId, Fault Paths, the complete 14-step Save Order of Execution, and the Flow vs. Apex decision matrix.',
    lessons: [
      {
        id: '2-1',
        title: 'The 5 Flow Types & Record-Triggered Flows (Before-Save vs. After-Save)',
        duration: 'Week 3',
        summary: 'Performance differences between Fast Field Updates and Actions & Related Records, and how to bulkify Flows without hitting DML limits.',
        interviewTrap: 'Never use an "Update Records" element in an After-Save Flow just to update a field on the same record that triggered the Flow. Always use a Before-Save Flow (Fast Field Updates): it runs before hitting the database and consumes zero DML statements out of your 150 limit.',
        concepts: [
          {
            title: 'The 5 Types of Flows in Salesforce',
            body: '1. <strong>Record-Triggered Flow:</strong> Fires automatically on record <code>Create</code>, <code>Update</code>, or <code>Delete</code>.<br>2. <strong>Screen Flow:</strong> Interactive UI wizard for users.<br>3. <strong>Schedule-Triggered Flow:</strong> Runs in the background at a scheduled time (daily, weekly, or once) across a batch of records.<br>4. <strong>Platform Event-Triggered Flow:</strong> Fires when a <em>Platform Event (<code>__e</code>)</em> message arrives on the event bus.<br>5. <strong>Autolaunched Flow (No Trigger):</strong> Reusable background subflow invoked by another Flow, Apex, or REST API.'
          },
          {
            title: 'Before-Save (Fast Field Updates) vs. After-Save (Actions & Related Records)',
            body: '• <strong>Fast Field Updates (Before-Save):</strong> Executes <em>before</em> the record is written to the database and <em>before</em> Validation Rules. Can only update fields on the <strong>triggering record itself (`$Record`)</strong>. Up to 10x faster because it mutates the record in memory without consuming DML.<br>• <strong>Actions and Related Records (After-Save):</strong> Executes <em>after</em> the record is saved to the database (when <code>$Record.Id</code> is populated). Used to create/update related records, send emails, publish events, or call <code>@InvocableMethod</code> Apex.'
          },
          {
            title: 'Flow Bulkification, Fault Paths & Custom Error Element',
            body: '• <strong>Never put pink Data elements inside a Loop:</strong> Never place <code>Get Records</code>, <code>Create Records</code>, <code>Update Records</code>, or <code>Delete Records</code> inside a <code>Loop</code>. Inside the loop, use an <code>Assignment</code> element to add records to a <code>Record Collection Variable</code>, and execute a single DML element outside the loop.<br>• <strong>Custom Error Element:</strong> Throws an inline blocking validation error message on the screen or a specific field from a Record-Triggered Flow (the declarative equivalent of <code>.addError()</code> in Apex).'
          }
        ],
        steps: [
          {
            id: 's-2-1-1',
            label: 'Build the Before-Save Flow on Fulfillment_Center__c',
            detail: 'Go to <strong>Setup → Flows → New Flow → Record-Triggered Flow</strong>: Object <code>Fulfillment Center</code>, trigger on create when <code>Provisioning_Status__c Is Null True</code>, optimized for <strong>Fast Field Updates</strong>. Add an <code>Update Triggering Record</code> element setting <code>Provisioning_Status__c = Draft</code>. Save as <code>Fulfillment_Center_Before_Create</code> and click <strong>Activate</strong>.'
          },
          {
            id: 's-2-1-2',
            label: 'Build the After-Save Flow on Opportunity (Closed Won)',
            detail: 'Create a <strong>Record-Triggered Flow</strong> on <code>Opportunity</code> when <code>StageName Equals Closed Won</code> (select <em>Only when a record is updated to meet the condition requirements</em> and optimize for <strong>Actions and Related Records</strong>). Add a <code>Create Records</code> element inserting a <code>Task</code> with <code>Subject = Configure Dark Stores for Closed Won Deal</code>, <code>WhatId = {!$Record.AccountId}</code>, and <code>OwnerId = {!$Record.OwnerId}</code>. Activate as <code>Opportunity_After_Closed_Won</code>.'
          },
          {
            id: 's-2-1-3',
            label: 'Test by closing Farmatodo- and retrieve both Flows to VS Code',
            detail: 'Open the <code>Farmatodo-</code> Opportunity, set Stage to <code>Closed Won</code>, and verify the Task was created under the <code>Farmatodo</code> Account. Then run in your terminal: <code>sf project retrieve start -m Flow:Fulfillment_Center_Before_Create -m Flow:Opportunity_After_Closed_Won</code>.'
          }
        ]
      },
      {
        id: '2-2',
        title: 'Screen Flows & Automatic recordId Injection on Lightning Pages',
        duration: 'Week 4 (Part 1)',
        summary: 'Building guided UI wizards, capturing the current page ID or full record, and embedding Flows inside the Lightning App Builder.',
        interviewTrap: 'Question #36 from your interview bank: "How do you pass the entire record (not just the ID) from a Lightning Record Page into a Screen Flow?" Answer: Create a variable of type "Record" named exactly "recordId" (case-sensitive) for that object and check "Available for input".',
        concepts: [
          {
            title: 'The Magic recordId Variable Convention',
            body: 'When you embed a Screen Flow on a Lightning Record Page or launch it via an Object-Specific Quick Action, Salesforce looks for an input variable named <strong>exactly <code>recordId</code></strong> (case-sensitive) with <strong>Available for input</strong> checked:<br>• If defined as type <code>Text</code>, it receives the 18-character ID string.<br>• If defined as type <code>Record</code>, it receives the entire record in memory without needing a <code>Get Records</code> query.'
          }
        ],
        steps: [
          {
            id: 's-2-2-1',
            label: 'Build the Quick_Create_Dark_Store Screen Flow',
            detail: 'In <strong>Setup → Flows → New Flow → Screen Flow</strong>: Open the left <em>Toolbox</em> → <strong>New Resource</strong> → Variable <code>recordId</code> (Data Type: <code>Text</code>, check ✅ <strong>Available for input</strong>). Add a <code>Screen</code> with two required Text inputs (<code>Store_Name</code> and <code>Store_City</code>), followed by a <code>Create Records</code> element inserting a <code>Fulfillment_Center__c</code> with <code>Name = {!Store_Name}</code>, <code>City__c = {!Store_City}</code>, and <code>Account__c = {!recordId}</code>. Save as <code>Quick_Create_Dark_Store</code> and activate.'
          },
          {
            id: 's-2-2-2',
            label: 'Embed the Screen Flow on the Account Page and create your first store',
            detail: 'Open the <code>Farmatodo</code> Account, click ⚙️ → <strong>Edit Page</strong>, drag the <strong>Flow</strong> component onto the right column, select <code>Quick_Create_Dark_Store</code>, check ✅ <strong>Pass record ID into this variable</strong>, click <strong>Save → Activate → Assign as Org Default</strong>, return to the Account, and create store <code>Farmatodo Chapinero</code> in <code>Bogota</code>.'
          },
          {
            id: 's-2-2-3',
            label: 'Retrieve the Screen Flow into VS Code',
            detail: 'Run in your terminal: <code>sf project retrieve start -m Flow:Quick_Create_Dark_Store</code>.'
          }
        ]
      },
      {
        id: '2-3',
        title: 'The Complete Save Order of Execution & Decision Matrix (Flow vs. Apex)',
        duration: 'Week 4 (Part 2)',
        summary: 'What happens millisecond by millisecond when Salesforce saves a record, and how to justify as a Tech Lead when to choose Flow vs. Apex.',
        interviewTrap: 'If a parent object has a Roll-Up Summary field AND its own Trigger or Validation Rule, remember: when a child record is inserted or updated, during step 11 (Roll-Up Summary calculation) the PARENT record goes through its own full Save Order of Execution (firing parent Triggers and parent Validation Rules!).',
        concepts: [
          {
            title: 'Exact 14-Step Save Order of Execution Sequence (Memorize)',
            body: '1. Load original record from database.<br>2. Overwrite new field values and run system-level format/length checks.<br>3. <strong>Before-Save Flows (Fast Field Updates)</strong>.<br>4. <strong>Before Triggers (Apex)</strong>.<br>5. <strong>System &amp; Custom Validation Rules</strong> <em>(Because they run at step 5, any required field populated in step 3 or 4 passes validation!)</em>.<br>6. <strong>Duplicate Rules</strong>.<br>7. <strong>Save record to Database (not yet committed)</strong> — record <code>Id</code> is generated here.<br>8. <strong>After Triggers (Apex)</strong>.<br>9. <strong>Assignment Rules → Auto-Response Rules → Workflow Rules → Escalation Rules</strong>.<br>10. <strong>After-Save Flows (Actions and Related Records)</strong>.<br>11. <strong>Parent Roll-Up Summary Calculations</strong> (causes the parent record to run through its own save cycle).<br>12. <strong>Criteria-Based Sharing Evaluation</strong>.<br>13. <strong>Database Commit</strong>.<br>14. <strong>Post-Commit Logic:</strong> Outbound emails, async jobs (<code>Queueable</code>, <code>@future</code>), and asynchronous Flow paths.'
          }
        ],
        table: {
          headers: ['Architectural Scenario', 'Recommended Tool', 'Tech Lead Justification in Interviews'],
          rows: [
            ['Defaulting or updating a field on the same record being saved', 'Before-Save Flow', 'Consumes zero DML, declarative, and executes before Validation Rules.'],
            ['Multi-step guided data entry wizard', 'Screen Flow (or LWC if 100% custom UX is required)', 'Screen Flow handles navigation, validation, and state in minutes with low maintenance.'],
            ['Complex transactional logic across 4+ objects with nested Maps and >2,000 rows', 'Apex Trigger Handler / Batch Apex', 'Flow loops quickly hit the 10,000ms CPU limit and the 2,000 executed-elements limit.'],
            ['REST integration requiring typed DTOs, Savepoint/Rollback, or custom retry handling', 'Apex (Queueable + Named Credentials)', 'Apex provides full exception handling, typed JSON serialization, and transaction control.']
          ]
        },
        steps: [
          {
            id: 's-2-3-1',
            label: 'Recite the Save Order of Execution out loud without looking',
            detail: 'Verify you can explain why a Validation Rule passes when a field is populated by a Before-Save Flow or Before Trigger, and when Roll-Up Summaries are calculated.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-2',
      title: 'Block 2 Exam: Flows & Order of Execution',
      questions: [
        {
          q: 'In what exact sequence do these 3 elements run during a record save in Salesforce?',
          options: [
            'Validation Rules → Before-Save Flow → Before Trigger',
            'Before-Save Flow → Before Trigger → Validation Rules',
            'Before Trigger → Validation Rules → Before-Save Flow',
            'After-Save Flow → Validation Rules → After Trigger'
          ],
          correct: 1,
          explanation: 'Before-Save Flows run first, followed by Before Triggers, and then System & Custom Validation Rules.'
        },
        {
          q: 'How must you configure a variable inside a Screen Flow to automatically receive the ENTIRE record from a Lightning Record Page?',
          options: [
            'Name: currentRecord, Type: Text, Private',
            'Name: recordId (case-sensitive), Type: Record, Available for input checked',
            'Name: $Record, Type: SObject, Available for output checked',
            'You cannot pass the full record; you must always query it with Get Records'
          ],
          correct: 1,
          explanation: 'Creating a Record variable named exactly recordId with "Available for input" checked injects the entire record automatically.'
        },
        {
          q: 'When is a new record\'s Id generated during the Save Order of Execution?',
          options: [
            'Before Before-Save Flows run',
            'Between Before Triggers and Validation Rules',
            'When the record is preliminarily saved to the DB (after Validation Rules and right before After Triggers)',
            'Only after the final Database Commit'
          ],
          correct: 2,
          explanation: 'The Id is generated during the preliminary database save right before After Triggers execute (which is why Trigger.newMap is null in before insert but populated in after insert).'
        }
      ]
    }
  },
  {
    id: 'block-3',
    num: '03',
    title: 'SALESFORCE BACKEND: APEX FROM ZERO TO SENIOR',
    weeks: 'Weeks 5–8',
    badgeColor: '#a855f7',
    summary: 'Master Salesforce backend engineering: collections (List, Set, Map), relational SOQL/SOSL, partial DML, Governor Limits, Bulkified Triggers, Async Apex, REST, and Unit Testing (>90% coverage).',
    lessons: [
      {
        id: '3-1',
        title: 'Apex Syntax for JS/TS Devs, Collections (List, Set, Map) & Custom Metadata',
        duration: 'Week 5 (Part 1)',
        summary: 'Static typing, the one-line Map<Id, SObject>([SELECT...]) constructor, generic SObjects, and configuration via __mdt.',
        interviewTrap: 'Never hardcode RecordType IDs, endpoint URLs, or trigger bypass flags in Apex. Use Custom Metadata Types (__mdt): their records are deployable metadata in Git, and querying them via getAll() or simple SOQL does NOT count against the 100 SOQL query limit.',
        concepts: [
          {
            title: 'From TypeScript/Java to Apex: Key Nuances',
            body: '• Apex is <strong>Case-Insensitive</strong> (<code>accountName</code> and <code>ACCOUNTNAME</code> refer to the same variable) and uses single quotes <code>\'text\'</code> for Strings.<br>• Every database table inherits from the base <code>SObject</code> class, enabling dynamic field access via <code>sobj.get(\'Name\')</code> and <code>sobj.put(\'City__c\', \'Bogota\')</code>.<br>• To retrieve a <code>RecordTypeId</code> without spending a SOQL query, use cached Schema Describe: <code>Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get(\'Enterprise\').getRecordTypeId()</code>.'
          },
          {
            title: 'The 3 Core Collections (List, Set & Map)',
            body: '• <code>List&lt;T&gt;</code>: Ordered array that allows duplicates. Returned by SOQL queries and accepted by DML statements.<br>• <code>Set&lt;T&gt;</code>: Unordered collection of unique elements with <code>O(1)</code> lookup (<code>contains()</code>). Essential for collecting foreign key IDs before running a bulk SOQL query.<br>• <code>Map&lt;K, V&gt;</code>: In-memory key-value dictionary. Senior Trick: pass a SOQL query directly into the Map constructor (<code>new Map&lt;Id, Account&gt;([SELECT Id, Name FROM Account])</code>) and Apex automatically populates every <code>Id</code> as the key and the <code>Account</code> record as the value.'
          }
        ],
        table: {
          headers: ['Operation', 'In TypeScript / Node.js', 'In Salesforce Apex'],
          rows: [
            ['Ordered List', "const list: string[] = ['A', 'B']; list.push('C');", "List<String> list = new List<String>{'A', 'B'}; list.add('C');"],
            ['Unique Set', "const ids = new Set<string>(); ids.add(id);", 'Set<Id> ids = new Set<Id>(); ids.add(acc.Id);'],
            ['Key → Value Map', 'const map = new Map(); map.set(id, acc);', 'Map<Id, Account> map = new Map<Id, Account>(); map.put(acc.Id, acc);'],
            ['Populate Map from Query', 'const map = new Map(rows.map(r => [r.id, r]));', 'Map<Id, Account> map = new Map<Id, Account>([SELECT Id, Name FROM Account]);'],
            ['JSON Serialize / Parse', 'JSON.stringify(obj) / JSON.parse(str)', 'JSON.serialize(obj) / (MyDto) JSON.deserialize(str, MyDto.class)']
          ]
        },
        code: {
          filename: 'scripts/apex/hello.apex',
          snippet: `// 1. Deduplicate cities using Set<String>
List<String> rawCities = new List<String>{'Bogota', 'Medellin', 'Bogota', 'Cali'};
Set<String> uniqueCities = new Set<String>(rawCities);
System.debug('Unique cities (' + uniqueCities.size() + '): ' + uniqueCities);

// 2. Populate Map<Id, Account> directly from SOQL in 1 line
Map<Id, Account> accountsById = new Map<Id, Account>([
    SELECT Id, Name, Onboarding_Status__c, Total_Dark_Stores__c
    FROM Account
]);

for (Id accId : accountsById.keySet()) {
    Account acc = accountsById.get(accId);
    System.debug('Account [' + accId + ']: ' + acc.Name + ' | Stores: ' + acc.Total_Dark_Stores__c);
}`
        },
        steps: [
          {
            id: 's-3-1-1',
            label: 'Execute the Collections kata in your Org',
            detail: 'Paste the code above into <code>scripts/apex/hello.apex</code> and run it in your terminal with: <code>sf apex run -f scripts/apex/hello.apex</code>.'
          }
        ]
      },
      {
        id: '3-2',
        title: 'Database in Code: Relational SOQL, SOSL, DML, Security & Governor Limits',
        duration: 'Week 5 (Part 2)',
        summary: 'Parent-to-Child and Child-to-Parent queries (__r), AggregateResult, insert vs. Database.insert, Savepoints, WITH USER_MODE, and official Governor Limits.',
        interviewTrap: 'PD1 trap question: "Can you wrap a query in a try/catch block to catch System.LimitException if you exceed 100 SOQL queries?" Answer: NO. System.LimitException cannot be caught by try/catch; it immediately terminates the entire transaction.',
        concepts: [
          {
            title: 'Relational SOQL: __c (Field) vs. __r (Relationship)',
            body: '• <strong>Child-to-Parent (up to 5 levels up):</strong> Replace <code>__c</code> with <code>__r</code> using dot notation: <code>SELECT Id, Name, Account__r.Name, Account__r.Onboarding_Status__c FROM Fulfillment_Center__c</code>.<br>• <strong>Parent-to-Child (Subquery):</strong> Use the plural <em>Child Relationship Name</em> ending in <code>__r</code>: <code>SELECT Id, Name, (SELECT Id, Name, City__c FROM Fulfillment_Centers__r) FROM Account</code>.<br>• <strong>Aggregate SOQL:</strong> Uses <code>COUNT()</code>, <code>SUM()</code>, <code>AVG()</code>, <code>MIN()</code>, <code>MAX()</code> with <code>GROUP BY</code> and <code>HAVING</code>, returning <code>List&lt;AggregateResult&gt;</code>.'
          },
          {
            title: 'SOQL vs. SOSL & Preventing SOQL Injection',
            body: '• <strong>SOQL:</strong> Structured query targeting a single object and its related objects.<br>• <strong>SOSL:</strong> Full-text indexed search across multiple unrelated objects simultaneously: <code>List&lt;List&lt;SObject&gt;&gt; res = [FIND \'Farmatodo*\' IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, Name)];</code>.<br>• <strong>SOQL Injection:</strong> Always use bind variables (<code>WHERE Name = :userInput</code>). When building Dynamic SOQL strings for <code>Database.query()</code>, always sanitize user input with <code>String.escapeSingleQuotes(userInput)</code>.'
          },
          {
            title: 'DML Statements vs. Database.* Methods & Transaction Control',
            body: '• <code>insert stores;</code> → <strong>All-or-None:</strong> If 1 out of 200 records fails, throws <code>DmlException</code> and rolls back all 200 records.<br>• <code>Database.insert(stores, false);</code> → <strong>Partial Success:</strong> Commits the 199 valid records and returns <code>List&lt;Database.SaveResult&gt;</code> with error details for the failed record without throwing an exception.<br>• <code>Savepoint sp = Database.setSavepoint();</code> and <code>Database.rollback(sp);</code> allow manual transaction rollback.'
          },
          {
            title: 'Apex Security: with sharing vs. WITH USER_MODE',
            body: 'By default, Apex executes in <em>System Mode</em>. Declaring <code>with sharing</code> on a class enforces OWD and Sharing Rules (row-level visibility), but <strong>does NOT enforce Object CRUD or Field-Level Security (FLS)</strong>. To enforce CRUD + FLS + Sharing together, append <code>WITH USER_MODE</code> to SOQL queries and use <code>insert as user records;</code> for DML.'
          }
        ],
        table: {
          headers: ['Governor Limit (Per Transaction)', 'Synchronous', 'Asynchronous', 'How to Avoid Hitting It'],
          rows: [
            ['Total SOQL Queries', '100', '200', 'Zero SOQL inside loops; use Set<Id> and Map<Id, SObject>'],
            ['Total Rows Retrieved by SOQL', '50,000', '50,000', 'Use selective indexed filters or Batch Apex (50M)'],
            ['Total SOSL Searches', '20 (2,000 rows)', '20 (2,000 rows)', 'Search multiple objects in a single RETURNING clause'],
            ['DML Statements Executed', '150', '150', 'Accumulate records in List<SObject> and execute 1 DML outside the loop'],
            ['Total Rows Processed by DML', '10,000', '10,000', 'Chunk large workloads via Batch Apex or Queueable'],
            ['Outbound HTTP Callouts', '100 (120s total)', '100 (120s total)', 'Batch records into a single bulk HTTP payload'],
            ['Heap Size (RAM)', '6 MB', '12 MB', 'Use SOQL For Loops: for (List<Account> batch : [SELECT...])'],
            ['Maximum CPU Time', '10,000 ms', '60,000 ms', 'Avoid nested O(N²) loops; use Map<Id, SObject> O(1) lookups']
          ]
        },
        code: {
          filename: 'scripts/apex/hello.apex',
          snippet: `List<Account> accountsWithStores = [
    SELECT Id, Name, Onboarding_Status__c,
        (SELECT Id, Name, City__c, Provisioning_Status__c FROM Fulfillment_Centers__r)
    FROM Account
    WHERE Total_Dark_Stores__c > 0
    WITH USER_MODE
];

for (Account acc : accountsWithStores) {
    System.debug('=== Customer: ' + acc.Name + ' (' + acc.Fulfillment_Centers__r.size() + ' stores) ===');
    for (Fulfillment_Center__c store : acc.Fulfillment_Centers__r) {
        System.debug('  -> Dark Store: ' + store.Name + ' | City: ' + store.City__c);
    }
}
System.debug('SOQL Queries used: ' + Limits.getQueries() + '/' + Limits.getLimitQueries());`
        },
        steps: [
          {
            id: 's-3-2-1',
            label: 'Run the Parent-to-Child Subquery and inspect Limits.getQueries()',
            detail: 'Paste the snippet into <code>scripts/apex/hello.apex</code> and run <code>sf apex run -f scripts/apex/hello.apex</code> to inspect <code>Cencosud</code> and <code>Farmatodo</code> with their stores.'
          }
        ]
      },
      {
        id: '3-3',
        title: 'Apex Triggers, Context Variables, Bulkification & Recursion Prevention',
        duration: 'Week 6',
        summary: 'before vs. after events, Trigger.new vs. Trigger.oldMap, Trigger Handler Pattern, and deploying our live AccountTrigger.',
        interviewTrap: 'In a "before insert" trigger, can you use Trigger.newMap? Answer: NO, Trigger.newMap is NULL in before insert because the records have not been written to the database yet and do not have an Id.',
        concepts: [
          {
            title: 'The 7 Trigger Events & When to Use Before vs. After',
            body: 'Events: <code>before insert</code>, <code>before update</code>, <code>before delete</code>, <code>after insert</code>, <code>after update</code>, <code>after delete</code>, <code>after undelete</code>.<br>• <strong>Use <code>before</code>:</strong> To modify fields on the <em>same record being saved</em> (no extra DML statement needed) or to block saving via <code>record.addError(\'Message\')</code>.<br>• <strong>Use <code>after</code>:</strong> When you need the database-generated <code>Id</code>, need to insert/update records on <em>other objects</em>, or need to enqueue async jobs (<code>System.enqueueJob</code>).'
          },
          {
            title: 'Trigger Context Variable Availability Matrix (Trigger.*)',
            body: '• <code>Trigger.new</code>: List of new record versions (available in <code>insert</code>, <code>update</code>, and <code>undelete</code>; read-only in <code>after</code> triggers).<br>• <code>Trigger.newMap</code>: Map of <code>Id → new SObject</code> (available in <code>after insert</code>, <code>before/after update</code>, and <code>after undelete</code>; <strong>NULL in <code>before insert</code></strong>).<br>• <code>Trigger.old</code> &amp; <code>Trigger.oldMap</code>: Prior record versions before the update/delete (available only in <code>update</code> and <code>delete</code>).'
          },
          {
            title: 'Enterprise Architecture: One Trigger Per Object + Handler + State Transition Check',
            body: '1. <strong>One Trigger Per Object:</strong> Multiple triggers on the same object have no guaranteed execution order.<br>2. <strong>Logic-less Trigger:</strong> The <code>.trigger</code> file only checks <code>Trigger.operationType</code> and delegates to <code>AccountTriggerHandler</code>.<br>3. <strong>State Transition Filter:</strong> Always compare the new field value against <code>oldMap.get(acc.Id)</code> so logic only fires when the field actually transitions (and guard with a static <code>Set&lt;Id&gt;</code> to prevent recursion).'
          }
        ],
        code: {
          filename: 'force-app/main/default/classes/AccountTriggerHandler.cls',
          snippet: `public with sharing class AccountTriggerHandler {
    private static Set<Id> processedAccountIds = new Set<Id>();

    public static void afterUpdate(List<Account> newAccounts, Map<Id, Account> oldAccountMap) {
        Set<Id> accountIdsToProvision = new Set<Id>();

        for (Account acc : newAccounts) {
            Account oldAcc = oldAccountMap.get(acc.Id);
            Boolean transitionedToReady = (
                acc.Onboarding_Status__c == 'Ready_to_Provision' &&
                oldAcc.Onboarding_Status__c != 'Ready_to_Provision'
            );

            if (transitionedToReady && !processedAccountIds.contains(acc.Id)) {
                accountIdsToProvision.add(acc.Id);
                processedAccountIds.add(acc.Id);
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
            id: 's-3-3-1',
            label: 'Deploy AccountTrigger and AccountTriggerHandler to your Org',
            detail: 'Run in your terminal: <code>sf project deploy start -m ApexClass:TenantProvisioningQueueable -m ApexClass:AccountTriggerHandler -m ApexTrigger:AccountTrigger</code>.'
          },
          {
            id: 's-3-3-2',
            label: 'Test the live Trigger by provisioning Farmatodo into PostgreSQL',
            detail: 'With your Node backend (port 4000) and Cloudflare tunnel running, open the <code>Farmatodo</code> Account in Salesforce, change <code>Onboarding Status</code> to <code>Ready to Provision</code>, and click <strong>Save</strong>. Watch it appear in real time on your React console and in PostgreSQL.'
          }
        ]
      },
      {
        id: '3-4',
        title: 'Async Apex (@future, Queueable, Batch, Scheduled), Mixed DML & REST Integrations',
        duration: 'Week 7',
        summary: 'Choosing the right async tool, resolving Mixed DML and Uncommitted Work Pending, and exposing custom REST APIs (@RestResource).',
        interviewTrap: 'Why can a Trigger NEVER make a synchronous HTTP Callout directly? Because a Trigger executes inside an open database transaction; holding a database lock while waiting for an external server to respond would stall the multi-tenant database. Every Callout from a Trigger must run asynchronously via @future(callout=true) or Queueable with Database.AllowsCallouts.',
        concepts: [
          {
            title: 'Master Comparison of the 4 Asynchronous Apex Tools',
            body: '1. <strong><code>@future(callout=true)</code>:</strong> Static <code>void</code> method that <strong>only accepts primitive types or collections of primitives</strong> (never SObjects, because the record data could change before the async method executes). Returns no Job ID and cannot be chained.<br>2. <strong><code>Queueable</code>:</strong> Class implementing <code>Queueable</code> (and <code>Database.AllowsCallouts</code>). Accepts SObjects and custom types via constructor, returns an <code>AsyncApexJob Id</code>, supports chaining another job from <code>execute()</code>, and supports attaching a <code>System.Finalizer</code> for error recovery.<br>3. <strong><code>Batch Apex</code>:</strong> Implements <code>Database.Batchable&lt;SObject&gt;</code> with 3 methods (<code>start</code>, <code>execute</code>, <code>finish</code>). Processes up to <strong>50 million records</strong> via <code>Database.getQueryLocator</code> in chunks of 200 (max 2,000). Stateless by default; implement <code>Database.Stateful</code> to preserve member variable state across chunks.<br>4. <strong><code>Scheduled Apex</code>:</strong> Implements <code>Schedulable</code> to execute on a Cron schedule (<code>System.schedule</code>).'
          },
          {
            title: 'Mixed DML Operation & Uncommitted Work Pending',
            body: '• <strong><code>MIXED_DML_OPERATION</code>:</strong> Occurs if you perform DML on a <em>Setup Object</em> (<code>User</code>, <code>Group</code>, <code>PermissionSetAssignment</code>) and a <em>Non-Setup Object</em> (<code>Account</code>) in the same transaction. Fix: separate one of the DML operations into a <code>@future</code> or <code>Queueable</code> method.<br>• <strong><code>You have uncommitted work pending</code>:</strong> Salesforce blocks outbound HTTP Callouts if you have already executed a DML statement (<code>insert/update</code>) or enqueued a job in the same transaction. Fix: execute all HTTP Callouts first, then run DML afterwards.'
          },
          {
            title: 'Outbound (HttpRequest) & Inbound (@RestResource) REST APIs',
            body: '• <strong>Outbound REST:</strong> Uses <code>Http</code>, <code>HttpRequest</code>, and <code>HttpResponse</code> pointing to a <strong>Named Credential</strong> (<code>req.setEndpoint(\'callout:Instaleap_API/v1/tenants\')</code>) so URLs and credentials are never hardcoded.<br>• <strong>Inbound REST:</strong> Expose custom REST endpoints in Salesforce by creating a <code>global with sharing</code> class annotated with <code>@RestResource(urlMapping=\'/v1/tenants/callback/*\')</code> and methods annotated with <code>@HttpGet</code>, <code>@HttpPost</code>, <code>@HttpPatch</code>.'
          }
        ],
        table: {
          headers: ['Technical Capability', '@future', 'Queueable Apex', 'Batch Apex', 'Scheduled Apex'],
          rows: [
            ['Accepts SObjects / Custom Classes?', 'No (primitives only)', 'Yes', 'Yes', 'Yes'],
            ['Returns Monitorable JobId?', 'No (returns void)', 'Yes (AsyncApexJob Id)', 'Yes', 'Yes (CronTrigger Id)'],
            ['Supports Job Chaining?', 'No', 'Yes (System.enqueueJob)', 'Yes (in finish method)', 'Yes (typically starts a Batch)'],
            ['Max Records per Run', '10,000 DML rows', '10,000 DML rows', 'Up to 50,000,000 rows', '10,000 rows (or 50M via Batch)'],
            ['Supports HTTP Callouts?', 'With @future(callout=true)', 'With Database.AllowsCallouts', 'With Database.AllowsCallouts', 'Not directly (must call Queueable/@future)']
          ]
        },
        steps: [
          {
            id: 's-3-4-1',
            label: 'Inspect TenantProvisioningQueueable.cls and verify Callout → DML order',
            detail: 'Open <code>force-app/main/default/classes/TenantProvisioningQueueable.cls</code> and verify how <code>http.send(req)</code> runs before updating Account and Fulfillment_Center__c.'
          }
        ]
      },
      {
        id: '3-5',
        title: 'Enterprise Apex Unit Testing (@IsTest, @TestSetup, HttpCalloutMock & Bulk 200)',
        duration: 'Week 8',
        summary: 'Writing isolated unit tests with >90% coverage verifying positive, negative, permission (System.runAs), and 200-record bulk scenarios.',
        interviewTrap: 'If production code makes an HTTP Callout and you run an @IsTest method without registering Test.setMock(HttpCalloutMock.class, ...), what happens? The test immediately fails with "Methods defined as TestMethod do not support Web service callouts".',
        concepts: [
          {
            title: 'Anatomy of an Architect-Grade @IsTest Suite',
            body: '1. <strong>Zero Org Data Dependency:</strong> Never use <code>@IsTest(SeeAllData=true)</code>.<br>2. <strong><code>@TestSetup</code>:</strong> Static method that inserts baseline test records once; Salesforce automatically rolls back changes after each <code>@IsTest</code> method so tests run fast and isolated.<br>3. <strong><code>Test.startTest()</code> &amp; <code>Test.stopTest()</code>:</strong> Grant a fresh set of Governor Limits for the code under test and <strong>force any asynchronous Queueable, @future, or Batch job to execute synchronously as soon as <code>Test.stopTest()</code> is reached</strong>.<br>4. <strong><code>HttpCalloutMock</code>:</strong> Simulates the HTTP response from our Node.js backend by returning a fake <code>HttpResponse</code> with status 201.<br>5. <strong><code>System.runAs(user)</code>:</strong> Tests how code behaves under a specific user\'s profile and sharing rules (and avoids <code>Mixed DML</code> errors inside unit tests).'
          }
        ],
        code: {
          filename: 'force-app/main/default/classes/TenantProvisioningTest.cls',
          snippet: `@IsTest
private class TenantProvisioningTest {
    private class InstaleapCalloutMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(201);
            res.setBody('{"status":"PROVISIONING","tenantId":"mock-uuid-999"}');
            return res;
        }
    }

    @TestSetup
    static void setupData() {
        Account acc = new Account(Name = 'Test Enterprise', Onboarding_Status__c = 'Prospect');
        insert acc;
        insert new Fulfillment_Center__c(Name = 'Store North', City__c = 'Bogota', Account__c = acc.Id);
    }

    @IsTest
    static void shouldProvisionTenantWhenStatusBecomesReady() {
        Account acc = [SELECT Id, Onboarding_Status__c FROM Account LIMIT 1];
        Test.setMock(HttpCalloutMock.class, new InstaleapCalloutMock());

        Test.startTest();
        acc.Onboarding_Status__c = 'Ready_to_Provision';
        update acc;
        Test.stopTest(); // Executes the Queueable synchronously right here

        Account updated = [SELECT Onboarding_Status__c, Core_Tenant_Id__c FROM Account WHERE Id = :acc.Id];
        Assert.areEqual('Provisioning', updated.Onboarding_Status__c);
        Assert.areEqual('mock-uuid-999', updated.Core_Tenant_Id__c);
    }
}`
        },
        steps: [
          {
            id: 's-3-5-1',
            label: 'Create and run TenantProvisioningTest.cls in your Org',
            detail: 'Create the test class and execute it in your terminal with: <code>sf apex run test -n TenantProvisioningTest -r human --code-coverage</code> verifying >90% coverage.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-3',
      title: 'Block 3 Exam: Apex, Triggers, Limits & Testing',
      questions: [
        {
          q: 'What happens if you execute Database.insert(accountsList, false) with 200 Accounts and 1 fails a Validation Rule?',
          options: [
            'Throws a DmlException and rolls back all 200 Accounts',
            'Inserts the 199 valid Accounts and returns the failure details inside Database.SaveResult without throwing an exception',
            'Bypasses Validation Rules because Apex runs in System Mode',
            'Inserts records up to the failed index and aborts the remaining records'
          ],
          correct: 1,
          explanation: 'Setting allOrNone = false enables partial success and returns a List<Database.SaveResult>.'
        },
        {
          q: 'Why can a @future method NOT accept List<Account> as a parameter?',
          options: [
            'Due to Heap memory limits',
            'Because the SObject record could change in the database between the time the job is enqueued and the time it actually executes',
            'Because @future methods have no database access',
            'Because @future only works in before insert triggers'
          ],
          correct: 1,
          explanation: '@future only accepts primitive types (or collections of primitives like Set<Id>) to avoid overwriting database state with stale SObject data.'
        },
        {
          q: 'What critical effect does Test.stopTest() have on a Queueable job enqueued inside a unit test?',
          options: [
            'Cancels the async job to save test execution time',
            'Forces the enqueued asynchronous job to execute immediately and synchronously before moving to the next line of code',
            'Commits the test records permanently to the Org database',
            'Disables Validation Rules'
          ],
          correct: 1,
          explanation: 'Test.stopTest() flushes the async queue synchronously so you can immediately run Assert statements on the results.'
        }
      ]
    }
  }
];
