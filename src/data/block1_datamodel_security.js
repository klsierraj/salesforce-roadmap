export const block1DataModelSecurity = {
  id: 'block-1',
  num: '01',
  title: 'B2B REVOPS FUNNEL, DATA MODEL & MULTI-LAYER SECURITY',
  weeks: 'Weeks 1–2',
  badgeColor: '#10b981',
  summary: 'Master the complete Sales Cloud revenue schema (Lead → Account/Contact/Opportunity → Product2/PricebookEntry/OpportunityLineItem/Quote), relational modeling (Lookup vs. Master-Detail, Junctions, Roll-Ups), formulas, Validation Rules, and the 3-layer security model (CRUD/FLS vs. OWD/Sharing).',
  lessons: [
    {
      id: '1-1',
      title: 'The Native Sales Cloud Schema: Lead Conversion, Catalog (PricebookEntry) & Activities',
      duration: 'Day 1–2',
      summary: 'Deep dive into standard Sales Cloud ERDs: Lead Conversion mechanics, how Product2, Pricebook2, PricebookEntry, OpportunityLineItem, and Quote connect, and polymorphic WhoId/WhatId fields.',
      interviewTrap: 'Classic ERD trap: "Can you insert an OpportunityLineItem (Opportunity Product) by linking OpportunityId directly to Product2Id?" Answer: NO! OpportunityLineItem requires a PricebookEntryId (the junction record between Product2 and Pricebook2), and before inserting a custom PricebookEntry you MUST first insert a Standard PricebookEntry for that Product2.',
      concepts: [
        {
          title: '1. Lead Lifecycle, Lead Conversion Mechanics & Lead Merging',
          body: '• <strong>What is a <code>Lead</code>?</strong> A flat table representing an unqualified prospect (person + company name on a single row).<br>• <strong>Lead Conversion Transaction:</strong> When an SDR qualifies a Lead and clicks <strong>Convert</strong> (or calls <code>Database.convertLead()</code> in Apex), Salesforce executes an atomic transaction:<br>&nbsp;&nbsp;1. Creates (or merges into an existing) <code>Account</code>.<br>&nbsp;&nbsp;2. Creates (or merges into an existing) <code>Contact</code> parented to that <code>Account</code>.<br>&nbsp;&nbsp;3. Optionally creates an <code>Opportunity</code> parented to that <code>Account</code> (and sets <code>ContactRole</code>).<br>&nbsp;&nbsp;4. Marks the Lead as <code>IsConverted = true</code> and populates <code>ConvertedAccountId</code>, <code>ConvertedContactId</code>, and <code>ConvertedOpportunityId</code>.<br>• <strong>Custom Lead Field Mapping:</strong> Custom fields on <code>Lead</code> only copy over during conversion if you explicitly map them in <em>Object Manager → Lead → Fields &amp; Relationships → Map Lead Fields</em>.<br>• <strong>Viewing/Editing Converted Leads &amp; Merging:</strong> Once converted, a Lead is hidden from standard searches unless the user has the <code>View and Edit Converted Leads</code> permission. When <strong>Merging</strong> duplicate Leads (up to 3 records), the chosen <em>Master</em> record retains its field values while absorbing all open/closed Activities and Campaign Members from the deleted duplicates.'
        },
        {
          title: '2. The Revenue Catalog ERD: Product2 → PricebookEntry ← Pricebook2 → OpportunityLineItem',
          body: 'Understanding how money is modeled on an Opportunity is mandatory for every RevOps and CPQ interview:<br>• <code>Product2</code>: The master catalog item (e.g., <em>"LastMile Enterprise License"</em>). Holds SKU (<code>ProductCode</code>), family, and description, but <strong>never holds a price directly</strong>.<br>• <code>Pricebook2</code>: A pricing book (e.g., <em>"Standard Price Book"</em>, <em>"LATAM USD Price Book"</em>, <em>"Enterprise Tier Price Book"</em>).<br>• <code>PricebookEntry</code>: The <strong>Junction Object</strong> between <code>Product2</code> and <code>Pricebook2</code>. Holds the actual <code>UnitPrice</code> (List Price) and <code>CurrencyIsoCode</code>. <em>Rule: A Product cannot be added to a Custom Pricebook until it has an active entry in the Standard Pricebook.</em><br>• <code>OpportunityLineItem</code>: The line item attached to an <code>Opportunity</code>. Links to <code>OpportunityId</code> and <code>PricebookEntryId</code>, storing <code>Quantity</code>, <code>UnitPrice</code> (Sales Price), <code>Discount</code>, and <code>TotalPrice</code>.<br>• <code>Quote</code> &amp; <code>QuoteLineItem</code>: An Opportunity can have multiple Quotes, but only <strong>one Quote can be marked as <code>IsSyncing = true</code></strong> at a time (which automatically syncs its line items back to <code>OpportunityLineItem</code>).'
        },
        {
          title: '3. Polymorphic Activities (Task & Event: WhoId vs. WhatId) & Audit Trail',
          body: '• <code>WhoId</code> (Label: <em>Name</em>): Polymorphic foreign key pointing exclusively to <code>Lead</code> (prefix <code>00Q</code>) or <code>Contact</code> (prefix <code>003</code>). If <em>Shared Activities</em> is enabled, a single Task/Event can link to up to <strong>50 Contacts</strong> plus 1 Lead.<br>• <code>WhatId</code> (Label: <em>Related To</em>): Polymorphic foreign key pointing to non-human entities (<code>Account</code>, <code>Opportunity</code>, <code>Case</code>, or any Custom Object with <em>Allow Activities</em> checked). <em>Trap: If WhoId points to a Lead, WhatId MUST be null!</em><br>• <strong>System Audit Fields:</strong> <code>CreatedById</code>, <code>CreatedDate</code>, <code>LastModifiedById</code>, <code>LastModifiedDate</code>, and <code>SystemModstamp</code>. To populate historical dates during a data migration, enable <em>User Interface → Enable "Set Audit Fields upon Record Creation"</em> and grant the permission via a Permission Set.'
        }
      ],
      table: {
        headers: ['Standard Object', '3-Char ID Prefix', 'Parent / Junction Role', 'Key Interview Rule'],
        rows: [
          ['Lead', '00Q', 'Standalone prospect record', 'Requires "View and Edit Converted Leads" perm to edit after conversion'],
          ['Account', '001', 'Root B2B Customer Company', 'Parent of Contact, Opportunity, Case, and Fulfillment_Center__c'],
          ['Contact', '003', 'Person working at an Account', 'Lookup to Account (behaves like Master-Detail for Cascade Delete)'],
          ['Opportunity', '006', 'Revenue Deal in the pipeline', 'StageName drives Probability (%) and ForecastCategoryName'],
          ['Product2 & Pricebook2', '01t / 01s', 'Catalog Item & Price List', 'Joined via PricebookEntry (01u) before adding OpportunityLineItem (00k)']
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
      title: 'Object Architecture & Relationship Internals: Lookup vs. Master-Detail, Junctions & Skew',
      duration: 'Day 3–4',
      summary: 'Deep comparison of Standard, Custom (__c), External (__x), and Big Objects (__b), Lookup deletion options (Clear vs. Don\'t allow vs. Cascade), Master-Detail re-parenting, Junction Object primary/secondary inheritance, and Hierarchical relationships.',
      interviewTrap: 'When you create a Junction Object (M:N) with two Master-Detail fields (Parent A created first, Parent B created second), who controls the Junction record\'s sharing/visibility, and what happens if either Parent A or Parent B is deleted? Answer: To view/edit the Junction record, a user needs access to BOTH parents (depending on Sharing Setting on each Master-Detail). Deleting EITHER Parent A or Parent B cascade-deletes the Junction record! Only if BOTH parents are deleted and then one is undeleted does the junction stay in the Recycle Bin until both exist.',
      concepts: [
        {
          title: '1. Lookup Relationship Internals & The 3 Deletion Options',
          body: 'A <strong>Lookup Relationship</strong> creates a loosely coupled <code>1:N</code> foreign key. Unlike Master-Detail, a Lookup child record has its own <code>OwnerId</code> column and its own Organization-Wide Default (OWD).<br>When configuring a Lookup field, Salesforce gives you options for <em>"What to do if the lookup record is deleted?"</em>:<br>1. <strong>Clear the value of this field (Default):</strong> Sets the foreign key to <code>null</code> on child records (only allowed if the Lookup is NOT marked as Required).<br>2. <strong>Don\'t allow deletion of the lookup record that\'s part of a lookup relationship:</strong> Blocks deleting the parent if any child record references it (similar to SQL <code>ON DELETE RESTRICT</code>).<br>3. <strong>Delete this record also (Cascade Delete):</strong> Available only on custom lookup relationships when requested/enabled via metadata API (<code>deleteConstraint = Cascade</code>).'
        },
        {
          title: '2. Master-Detail Relationship Internals & Re-Parenting',
          body: 'A <strong>Master-Detail Relationship</strong> creates a tightly coupled <code>1:N</code> composition:<br>• <strong>No <code>OwnerId</code> on the Detail Object:</strong> When you convert a Custom Object into the Detail side of a Master-Detail, Salesforce physically drops the <code>OwnerId</code> field from the child object! Security is permanently locked to <code>Controlled by Parent</code>.<br>• <strong>Allow Reparenting Checkbox:</strong> By default, once a Detail record is created, its Master parent field is locked and cannot be changed to another parent. Checking <strong>Allow Reparenting</strong> in the Master-Detail field definition allows users/Apex to update the parent ID later.<br>• <strong>Standard Object Restriction:</strong> Standard Objects (<code>Account</code>, <code>Opportunity</code>, <code>Case</code>, <code>Contact</code>) can NEVER be on the Detail side of a custom Master-Detail relationship.'
        },
        {
          title: '3. Junction Objects (Many-to-Many), Self-Relationships & Hierarchical Relationships',
          body: '• <strong>Junction Object (`M:N`):</strong> A Custom Object with <strong>2 Master-Detail fields</strong>:<br>&nbsp;&nbsp;– <strong>Primary Master (1st Master-Detail created):</strong> Controls the Junction Object\'s default page layout theme/color and primary report type category.<br>&nbsp;&nbsp;– <strong>Secondary Master (2nd Master-Detail created):</strong> Co-controls security and cascade delete.<br>&nbsp;&nbsp;– <em>Limit:</em> A Junction Object cannot itself be the Master of another detail object (no 3-level Master-Detail chains beyond 3 total levels).<br>• <strong>Self-Relationship:</strong> A Lookup pointing to the same object (e.g., <code>Account.ParentId</code>).<br>• <strong>Hierarchical Relationship:</strong> Available <strong>exclusively on the <code>User</code> object</strong>. Allows creating custom user-to-user chains (e.g., <code>Regional_Approver__c</code> on <code>User</code>) that can be referenced directly in Approval Processes.'
        }
      ],
      table: {
        headers: ['Feature / Constraint', 'Lookup Relationship', 'Master-Detail Relationship', 'Junction Object (2 M-D)'],
        rows: [
          ['Max per Object', 'Up to 40', 'Max 2 per Custom Object', 'Uses both M-D slots (can still add 38 Lookups)'],
          ['Child OwnerId Field', 'Present (independent owner)', 'Removed (Controlled by Parent)', 'Removed (Controlled by both Parents)'],
          ['Parent Required?', 'Optional (or Required checkbox)', 'Always Required (NOT NULL)', 'Both Parents Always Required'],
          ['Cascade Delete', 'False by default (Clear or Restrict)', 'Always True', 'Deleting EITHER parent deletes the Junction row'],
          ['Reparenting Allowed?', 'Always allowed', 'Only if "Allow Reparenting" is checked', 'Controlled per M-D field via "Allow Reparenting"']
        ]
      },
      code: {
        filename: 'force-app/main/default/objects/Fulfillment_Center__c/fields/Account__c.field-meta.xml',
        snippet: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Account__c</fullName>
    <label>Account</label>
    <referenceTo>Account</referenceTo>
    <relationshipLabel>Fulfillment Centers</relationshipLabel>
    <relationshipName>Fulfillment_Centers</relationshipName>
    <relationshipOrder>0</relationshipOrder>
    <reparentableMasterDetail>true</reparentableMasterDetail>
    <type>MasterDetail</type>
    <writeRequiresMasterRead>false</writeRequiresMasterRead>
</CustomField>`
      },
      steps: [
        {
          id: 's-1-2-1',
          label: 'Open Schema Builder in Setup and inspect the 4 objects',
          detail: 'Go to <strong>Setup (⚙️) → Schema Builder</strong>, click <strong>Clear All</strong>, select <code>Account</code>, <code>Contact</code>, <code>Opportunity</code>, and <code>Fulfillment Center</code>, and click <strong>Auto-Layout</strong>.'
        },
        {
          id: 's-1-2-2',
          label: 'Inspect Account__c.field-meta.xml in VS Code',
          detail: 'Open <code>force-app/main/default/objects/Fulfillment_Center__c/fields/Account__c.field-meta.xml</code> and notice the <code>&lt;type&gt;MasterDetail&lt;/type&gt;</code> and <code>&lt;writeRequiresMasterRead&gt;</code> tags.'
        }
      ]
    },
    {
      id: '1-3',
      title: 'Roll-Up Summaries, Relationship Conversions, 15/18 IDs, External IDs & Record Types',
      duration: 'Day 5–6',
      summary: 'The 4 Roll-Up functions and filter limitations, converting Lookup ↔ Master-Detail, 15 vs. 18-char IDs, External ID indexing, and how Record Types + Support/Sales Processes control Picklists and Page Layouts.',
      interviewTrap: 'Why would a formula field on a child object NOT show up as an option to aggregate inside a parent Roll-Up Summary field? Answer: A Roll-Up Summary field CANNOT aggregate a child Formula field if that child Formula references a cross-object field (e.g., Parent__r.Rate__c) or uses non-deterministic functions like TODAY() or NOW()!',
      concepts: [
        {
          title: '1. Roll-Up Summary Internals & Limitations',
          body: 'A <strong>Roll-Up Summary</strong> field on a Master object calculates aggregates over Detail records: <code>COUNT</code>, <code>SUM</code>, <code>MIN</code>, or <code>MAX</code> (note: there is <strong>no native <code>AVG</code></strong>; to get an average, create a <code>SUM</code> Roll-Up, a <code>COUNT</code> Roll-Up, and divide them in a Formula field!).<br>• <strong>Limit per Object:</strong> Maximum <strong>25 Roll-Up Summary fields</strong> per object by default (can be increased to 40 by Salesforce Support).<br>• <strong>Filter Criteria Rule:</strong> You can filter which child rows are included in the Roll-Up, but the filter criteria can only evaluate deterministic fields stored directly on the Detail object.<br>• <strong>The 4 Ways to Build a Roll-Up When Using a Lookup:</strong><br>&nbsp;&nbsp;1. Native Roll-Up Summary (only if you convert Lookup to Master-Detail).<br>&nbsp;&nbsp;2. Record-Triggered Flow (After-Save +After-Delete on child object).<br>&nbsp;&nbsp;3. Apex Trigger on child (`after insert, after update, after delete, after undelete`) using `SELECT Account__c, COUNT(Id) FROM Child__c WHERE Account__c IN :accIds GROUP BY Account__c`.<br>&nbsp;&nbsp;4. DLRS (Declarative Lookup Rollup Summaries package).'
        },
        {
          title: '2. Relationship Conversion Rules (Lookup ↔ Master-Detail)',
          body: '• <strong>Lookup → Master-Detail:</strong> Only allowed if <strong>100% of existing child rows in the database have the Lookup field populated</strong> (zero null values). If even 1 row has a null parent, Salesforce blocks the conversion.<br>• <strong>Master-Detail → Lookup:</strong> Only allowed if the Master object has <strong>zero Roll-Up Summary fields</strong> summarizing that Detail object (even deleted Roll-Up Summary fields sitting in the Deleted Fields list must be permanently erased first!).'
        },
        {
          title: '3. Record Types, Business Processes & Picklist Matrix',
          body: 'When an object represents two distinct business flavors (e.g., <em>"Enterprise Supermarket Account"</em> vs. <em>"Small Pharmacy Account"</em>), do NOT create two separate tables—create <strong>Record Types</strong> on <code>Account</code>:<br>• Each <strong>Record Type</strong> controls two things: <strong>1) Which Page Layout</strong> is displayed per Profile, and <strong>2) Which Picklist values</strong> are available in each dropdown field.<br>• <strong>Special Prerequisite on 4 Standard Objects:</strong> Before you can create a Record Type on <code>Opportunity</code>, <code>Lead</code>, <code>Case</code>, or <code>Solution</code>, Salesforce forces you to first create a <strong>Business Process</strong> that controls the main lifecycle picklist:<br>&nbsp;&nbsp;– <code>Opportunity</code> requires a <strong>Sales Process</strong> (controls <code>StageName</code>).<br>&nbsp;&nbsp;– <code>Lead</code> requires a <strong>Lead Process</strong> (controls <code>Status</code>).<br>&nbsp;&nbsp;– <code>Case</code> requires a <strong>Support Process</strong> (controls <code>Status</code>).'
        }
      ],
      table: {
        headers: ['Standard Object', 'Required Process Before Creating a Record Type', 'Picklist Controlled by Process'],
        rows: [
          ['Opportunity', 'Sales Process', 'Stage (StageName)'],
          ['Lead', 'Lead Process', 'Lead Status (Status)'],
          ['Case', 'Support Process', 'Case Status (Status)'],
          ['Solution', 'Solution Process', 'Solution Status'],
          ['Account / Custom Object (__c)', 'None required (create Record Type directly)', 'All standard & custom picklists directly']
        ]
      },
      code: {
        filename: 'force-app/main/default/objects/Account/fields/Total_Dark_Stores__c.field-meta.xml',
        snippet: `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Total_Dark_Stores__c</fullName>
    <label>Total Dark Stores</label>
    <summaryForeignKey>Fulfillment_Center__c.Account__c</summaryForeignKey>
    <summaryOperation>count</summaryOperation>
    <trackHistory>false</trackHistory>
    <type>Summary</type>
</CustomField>`
      },
      steps: [
        {
          id: 's-1-3-1',
          label: 'Inspect Total_Dark_Stores__c.field-meta.xml and Core_Tenant_Id__c.field-meta.xml',
          detail: 'Open both XML files inside <code>force-app/main/default/objects/Account/fields/</code> to see how a Roll-Up Summary (<code>&lt;type&gt;Summary&lt;/type&gt;</code>) and an indexed External ID (<code>&lt;externalId&gt;true&lt;/externalId&gt;</code>) are defined.'
        }
      ]
    },
    {
      id: '1-4',
      title: 'Formula Engine, Validation Rules (ISCHANGED, PRIORVALUE, REGEX) & Dynamic Forms',
      duration: 'Day 7–9',
      summary: 'How Cross-Object Formulas work at query time, global merge variables ($Profile, $Permission, $Setup), advanced Validation Rule patterns, and Page Layouts vs. Lightning Record Pages.',
      interviewTrap: 'Are Formula Fields stored in the database table (MT_Data)? Answer: NO! Formula Fields are virtual calculations evaluated at read/query time (like a SQL VIEW column). Because they are calculated on read, modifying a child record or waiting for TODAY() to change does NOT fire an Apex Trigger or Record-Triggered Flow on the object containing the Formula field!',
      concepts: [
        {
          title: '1. Cross-Object Formula Fields & Compile Size Limits',
          body: 'A Formula Field calculates its value dynamically whenever a user views a page or runs a SOQL query:<br>• Can traverse up to <strong>10 parent relationship levels</strong> upward (e.g., <code>Account__r.Parent.Owner.Manager.FirstName</code>), but can NEVER reference child records downward.<br>• Maximum length: <strong>3,900 characters</strong> of formula text, and <strong>5,000 bytes</strong> (or 15,000 bytes) of compiled SQL expression size.<br>• When handling Picklists inside formulas, you MUST wrap them in <code>ISPICKVAL(Status__c, "Active")</code> or convert them to a string using <code>TEXT(Status__c)</code>.'
        },
        {
          title: '2. Advanced Validation Rule Functions & Bypass Patterns',
          body: 'In a Validation Rule, the formula defines the <strong>error state</strong> (<code>TRUE = Block Save</code>). Every Senior Developer must know these 6 formula functions:<br>• <code>ISNEW()</code>: Returns <code>TRUE</code> only during record creation (<code>insert</code>).<br>• <code>ISCHANGED(field)</code>: Returns <code>TRUE</code> if the field\'s value differs from its prior saved value (only evaluates on <code>update</code>).<br>• <code>PRIORVALUE(field)</code>: Returns the previous database value of the field before the current edit (used to prevent backward status transitions!).<br>• <code>ISBLANK(field)</code>: Checks if a field is null or empty (always use <code>ISBLANK</code> instead of deprecated <code>ISNULL</code>).<br>• <code>REGEX(text, regex_pattern)</code>: Validates exact formatting (e.g., tax NIT, postal code, UUID).<br>• <strong>Enterprise Bypass Best Practice:</strong> Never hardcode Profile names or User IDs to bypass a Validation Rule for integrations! Instead, create a <strong>Custom Permission</strong> (e.g., <code>Bypass_Account_Validations</code>), assign it to your Integration User\'s Permission Set, and add <code>NOT($Permission.Bypass_Account_Validations)</code> inside the Validation Rule\'s <code>AND()</code> block.'
        },
        {
          title: '3. Page Layouts vs. Lightning Record Pages (Dynamic Forms & Dynamic Actions)',
          body: '• <strong>Page Layout (Classic Metadata):</strong> Defines baseline field placement inside the <em>Record Detail</em> block, read-only/required UI flags, and Related Lists.<br>• <strong>Lightning Record Page (FlexiPage XML):</strong> The modern component canvas in <em>Lightning App Builder</em>. By upgrading a Record Page to <strong>Dynamic Forms</strong>, you replace the monolithic <em>Record Detail</em> block with granular <code>Field Section</code> components that appear or disappear dynamically in the browser without page reloads based on filter rules.'
        }
      ],
      code: {
        filename: 'Enterprise Validation Rule Patterns (Formula Syntax)',
        snippet: `/* 1. Our Instaleap Rule: Block Ready_to_Provision if Total_Dark_Stores__c is 0 */
AND(
  NOT($Permission.Bypass_Account_Validations),
  ISPICKVAL(Onboarding_Status__c, "Ready_to_Provision"),
  Total_Dark_Stores__c = 0
)

/* 2. Prevent moving an Active Account backward to Prospect */
AND(
  ISCHANGED(Onboarding_Status__c),
  ISPICKVAL(PRIORVALUE(Onboarding_Status__c), "Active"),
  ISPICKVAL(Onboarding_Status__c, "Prospect")
)`
      },
      steps: [
        {
          id: 's-1-4-1',
          label: 'Create the "Instaleap Operations" Lightning App',
          detail: 'Go to <strong>Setup → App Manager → New Lightning App</strong>: Name it <code>Instaleap Operations</code>, choose <code>Standard navigation</code>, add <code>Home</code>, <code>Leads</code>, <code>Accounts</code>, <code>Contacts</code>, <code>Opportunities</code>, and <code>Fulfillment Centers</code>, and assign it to <code>System Administrator</code>.'
        },
        {
          id: 's-1-4-2',
          label: 'Add Onboarding Status to the Account Page Layout',
          detail: 'Go to <strong>Setup → Object Manager → Account → Page Layouts → Account Layout</strong>, drag <code>Onboarding Status</code> into the <em>Account Information</em> section, and click <strong>Save</strong>.'
        },
        {
          id: 's-1-4-3',
          label: 'Create the Require_Stores_Before_Provisioning Validation Rule on Account',
          detail: 'In <strong>Object Manager → Account → Validation Rules → New</strong>: Rule Name <code>Require_Stores_Before_Provisioning</code>, formula: <code>AND(ISPICKVAL(Onboarding_Status__c, "Ready_to_Provision"), Total_Dark_Stores__c = 0)</code>, Error Message: <code>Cannot move Account to Ready to Provision when Total Dark Stores is 0.</code> on field <code>Onboarding Status</code>.'
        },
        {
          id: 's-1-4-4',
          label: 'Test the rule live on Farmatodo and retrieve metadata into VS Code',
          detail: 'Open <code>Farmatodo</code> (0 stores), set <code>Onboarding Status</code> to <code>Ready to Provision</code>, and verify the red error blocks the save. Then run: <code>sf project retrieve start -m ValidationRule:Account.Require_Stores_Before_Provisioning -m CustomApplication:Instaleap_Operations</code>.'
        }
      ]
    },
    {
      id: '1-5',
      title: 'Object & Field Security (CRUD & FLS): Profiles, Permission Sets & Permission Set Groups',
      duration: 'Day 10–11',
      summary: 'How table-level (CRUD) and column-level (FLS) security is architected using minimum-access Profiles, modular Permission Sets, Permission Set Groups, and Muting Permission Sets.',
      interviewTrap: 'What do the "View All" and "Modify All" object permissions on a Profile/Permission Set do? Answer: They grant access to view or edit 100% of records on that specific object, COMPLETELY BYPASSING Organization-Wide Defaults (OWD) and Sharing Rules for that object! Therefore, follow the Principle of Least Privilege and avoid granting View All / Modify All to standard users.',
      concepts: [
        {
          title: '1. Modern Enterprise Pattern: Minimum-Access Profile + Functional Permission Sets',
          body: 'Historically, admins created dozens of Profiles (<em>Sales Rep Colombia, Sales Rep Mexico, Sales Ops</em>), which became impossible to maintain. Today, Salesforce\'s official architectural standard is:<br>• <strong>1 Baseline Profile (<code>Minimum Access - Salesforce</code>):</strong> Assigned to users solely to define their mandatory single settings (Login Hours, Login IP Ranges, Default Record Type, Page Layout assignment).<br>• <strong>Modular Permission Sets:</strong> Create feature-specific Permission Sets (like our <code>Instaleap_Operations.permissionset-meta.xml</code>) that grant <strong>Object Permissions (CRUD: Create, Read, Edit, Delete)</strong>, <strong>Field Permissions (FLS: Read, Edit)</strong>, Tab Settings, and Apex Class/Flow access.<br>• <strong>Master-Detail Permission Dependency:</strong> As we proved in our own project deployment, because <code>Fulfillment_Center__c</code> is a Detail child of <code>Account</code>, Salesforce will reject deploying a Permission Set granting Read on <code>Fulfillment_Center__c</code> unless that Permission Set also explicitly includes <code>&lt;allowRead&gt;true&lt;/allowRead&gt;</code> on <code>Account</code>!'
        },
        {
          title: '2. Permission Set Groups (PSG) & Muting Permission Sets',
          body: '• <strong>Permission Set Group:</strong> Bundles multiple individual Permission Sets into a single persona (e.g., <em>"Onboarding Specialist PSG"</em> = <code>Instaleap_Operations</code> + <code>CRM_Reporting</code> + <code>CPQ_Quoting</code>).<br>• <strong>Muting Permission Set:</strong> Every Permission Set Group can contain <strong>at most 1 Muting Permission Set</strong>. If <code>Instaleap_Operations</code> grants <code>Delete</code> on <code>Fulfillment_Center__c</code>, but you want Junior Onboarding reps in a group to have all permissions <em>except</em> Delete, you mute <code>Delete</code> inside the group\'s Muting Permission Set without touching the original <code>Instaleap_Operations</code> Permission Set.<br>• <strong>Session-Based Permission Sets:</strong> Permission Sets that only become active during a specific authenticated session (e.g., temporary 2-hour elevated access activated via a Flow).'
        }
      ],
      table: {
        headers: ['Permission Layer', 'Cardinality per User', 'Controls What?', 'Can Revoke/Mute Permissions?'],
        rows: [
          ['Profile', 'Exactly 1 (Mandatory)', 'Baseline CRUD/FLS, Login Hours/IPs, Page Layouts', 'Defines the floor'],
          ['Permission Set', '0 to Many', 'Additive CRUD, FLS, Apex, Flow & Custom Permissions', 'No (strictly additive)'],
          ['Permission Set Group', '0 to Many', 'Persona bundle of multiple Permission Sets', 'Via its Muting Permission Set'],
          ['Muting Permission Set', 'Max 1 per PSG', 'Silences specific CRUD/FLS inside its parent PSG', 'Yes (mutes within that PSG only)']
        ]
      },
      code: {
        filename: 'force-app/main/default/permissionsets/Instaleap_Operations.permissionset-meta.xml',
        snippet: `<?xml version="1.0" encoding="UTF-8"?>
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata">
    <hasActivationRequired>false</hasActivationRequired>
    <label>Instaleap Operations</label>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>false</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Account</object>
        <viewAllRecords>false</viewAllRecords>
    </objectPermissions>
    <objectPermissions>
        <allowCreate>true</allowCreate>
        <allowDelete>true</allowDelete>
        <allowEdit>true</allowEdit>
        <allowRead>true</allowRead>
        <modifyAllRecords>false</modifyAllRecords>
        <object>Fulfillment_Center__c</object>
        <viewAllRecords>false</viewAllRecords>
    </objectPermissions>
</PermissionSet>`
      },
      steps: [
        {
          id: 's-1-5-1',
          label: 'Inspect Instaleap_Operations.permissionset-meta.xml in VS Code',
          detail: 'Open <code>force-app/main/default/permissionsets/Instaleap_Operations.permissionset-meta.xml</code> and verify how <code>&lt;fieldPermissions&gt;</code>, <code>&lt;objectPermissions&gt;</code>, and <code>&lt;tabSettings&gt;</code> are structured.'
        }
      ]
    },
    {
      id: '1-6',
      title: 'Row-Level Security (OWD, Role Hierarchy, Sharing Rules, Queues) & Reports/Data Loader',
      duration: 'Day 12–14',
      summary: 'Complete record-level visibility architecture, Grant Access Using Hierarchies on Custom Objects, Queues vs. Public Groups, Report Types, Dynamic Dashboards, and Bulk API Hard Delete.',
      interviewTrap: 'On Standard Objects (Account, Opportunity, Case), the "Grant Access Using Hierarchies" checkbox in OWD Sharing Settings is permanently checked and grayed out (cannot be disabled). However, on Custom Objects (like Fulfillment_Center__c if it had a Lookup), you CAN uncheck "Grant Access Using Hierarchies" so managers in the Role Hierarchy do NOT automatically see their subordinates\' custom records!',
      concepts: [
        {
          title: '1. The 5 Layers of Row-Level Security (Record Visibility)',
          body: 'Once a user has table-level <code>Read</code> permission on <code>Account</code> via their Profile/Permission Set, Salesforce evaluates which specific rows they can see:<br>1. <strong>Organization-Wide Defaults (OWD):</strong> Sets the baseline access for records the user does not own: <code>Private</code> (only owner sees it), <code>Public Read Only</code> (everyone can view, only owner can edit), <code>Public Read/Write</code> (everyone can view and edit), or <code>Controlled by Parent</code>.<br>2. <strong>Role Hierarchy (Vertical Sharing):</strong> Users assigned to a higher <code>UserRole</code> automatically inherit access to records owned by users in subordinate roles (and records shared with those subordinates).<br>3. <strong>Sharing Rules (Lateral Automated Sharing):</strong><br>&nbsp;&nbsp;– <em>Owner-Based Sharing Rule:</em> "Records owned by Role/Group X are shared with Role/Group Y."<br>&nbsp;&nbsp;– <em>Criteria-Based Sharing Rule:</em> "Records matching field filter (e.g., <code>Onboarding_Status__c = \'Active\'</code>) are shared with Role/Group Y." <em>(Note: Maximum 50 Criteria-Based Sharing Rules per object; up to 300 total Sharing Rules per object).</em><br>4. <strong>Manual Sharing &amp; Teams (Account/Opportunity/Case Teams):</strong> Ad-hoc sharing of individual records by the record owner.<br>5. <strong>Apex Managed Sharing (<code>__Share</code>):</strong> Complex programmatic sharing managed by Apex triggers/batches.'
        },
        {
          title: '2. Reports, Dashboards & Bulk Data Operations',
          body: '• <strong>4 Report Formats:</strong> <em>Tabular</em> (flat table), <em>Summary</em> (1D row grouping), <em>Matrix</em> (2D row + column pivot), <em>Joined</em> (up to 5 report blocks across different Report Types).<br>• <strong>Cross Filters in Reports:</strong> Allow filtering a report using <code>WITH</code> or <code>WITHOUT</code> child records (e.g., <em>"Show me all Accounts WITHOUT Fulfillment Centers"</em>) without needing a custom Report Type!<br>• <strong>Data Loader Modes:</strong> Standard SOAP/REST mode processes batches of 200 records sequentially. Turning on <strong>Use Bulk API</strong> processes batches of up to 2,000–10,000 records in parallel and unlocks <strong>Hard Delete</strong> (bypassing the Recycle Bin).'
        }
      ],
      steps: [
        {
          id: 's-1-6-1',
          label: 'Set Account OWD to Private in Sharing Settings',
          detail: 'Go to <strong>Setup → Sharing Settings</strong>, verify that <code>Fulfillment Center</code> is <code>Controlled by Parent</code>, click <strong>Edit</strong>, change Default Internal Access for <code>Account and Contract</code> to <strong>Private</strong>, and click <strong>Save</strong>.'
        },
        {
          id: 's-1-6-2',
          label: 'Create the Share_Active_Accounts Criteria-Based Sharing Rule',
          detail: 'In <strong>Sharing Settings → Account Sharing Rules → New</strong>: Label <code>Share_Active_Accounts</code>, select <code>Based on criteria</code> (<code>Onboarding Status equals Active</code>), share with <code>Public Groups → All Internal Users</code> with <code>Read Only</code> access, and click <strong>Save</strong>.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-1',
    title: 'Block 1 Exam: Sales Cloud ERD, Relationships, Validation & Security',
    questions: [
      {
        q: 'Which records must exist in the database BEFORE you can insert an OpportunityLineItem (Opportunity Product) on an Opportunity?',
        options: [
          'Only a Product2 record',
          'A Product2 record, an active Standard PricebookEntry, and an active PricebookEntry in the Opportunity\'s assigned Pricebook2',
          'A Quote and a Contract',
          'A Lead and a Case'
        ],
        correct: 1,
        explanation: 'OpportunityLineItem links to PricebookEntryId (not Product2Id directly), and every Product2 must have a Standard PricebookEntry before it can be added to any custom Pricebook2.'
      },
      {
        q: 'Why can you NOT uncheck "Grant Access Using Hierarchies" on the Account or Opportunity object in OWD Sharing Settings?',
        options: [
          'Because OWD is set to Public Read/Write',
          'Because "Grant Access Using Hierarchies" is permanently locked to true on all Standard Objects and can only be unchecked on Custom Objects',
          'Because you need a Full Sandbox to uncheck it',
          'Because Account has a Roll-Up Summary field'
        ],
        correct: 1,
        explanation: 'Salesforce enforces role hierarchy inheritance on all Standard Objects; "Grant Access Using Hierarchies" is only configurable on Custom Objects.'
      },
      {
        q: 'What is the cleanest enterprise pattern to allow an automated Integration User to bypass a Validation Rule without hardcoding IDs or Profile names?',
        options: [
          'Hardcode $User.Id != "005..." inside the formula',
          'Create a Custom Permission, assign it to the Integration User\'s Permission Set, and add NOT($Permission.Bypass_Rule_Name) to the Validation Rule formula',
          'Deactivate the Validation Rule in Production before every API call',
          'Use @IsTest(SeeAllData=true)'
        ],
        correct: 1,
        explanation: 'Checking $Permission.Custom_Perm_Name inside the Validation Rule allows zero-code, metadata-deployable bypasses via Permission Sets.'
      },
      {
        q: 'When a Junction Object has two Master-Detail fields, what happens to the Junction record if ONLY the Secondary Master parent record is deleted?',
        options: [
          'Nothing happens; only deleting the Primary Master deletes the Junction record',
          'The Junction record is cascade-deleted and moved to the Recycle Bin',
          'The Secondary Master field is simply cleared to null',
          'Salesforce throws a Mixed DML exception'
        ],
        correct: 1,
        explanation: 'Deleting EITHER the Primary Master or the Secondary Master parent record cascade-deletes the child Junction record.'
      }
    ]
  }
};
