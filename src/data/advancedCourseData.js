export const blocksPart2 = [
  {
    id: 'block-4',
    num: '04',
    title: 'LWC FRONTEND, DEVOPS CI/CD & PD1 CERTIFICATION',
    weeks: 'Weeks 9–12',
    badgeColor: '#f59e0b',
    summary: 'Build enterprise Lightning Web Components connected to Apex (@wire + Imperative + LMS), automate deployments with GitHub Actions, and pass Platform Developer I (PD1).',
    lessons: [
      {
        id: '4-1',
        title: 'LWC Architecture, Decorators (@api, @track, @wire), Directives & Lifecycle Hooks',
        duration: 'Week 9',
        summary: 'How Salesforce Web Components work under the hood, Shadow DOM encapsulation, .js-meta.xml Design Attributes, and lifecycle hook execution order.',
        interviewTrap: 'Inside renderedCallback(), if you mutate a reactive property without a boolean guard (if (this.hasRendered) return;), you will trigger an infinite render loop because changing the property re-triggers another render.',
        concepts: [
          {
            title: 'The 4 Files of an LWC Bundle & Design Attributes (.js-meta.xml)',
            body: 'An LWC bundle inside <code>force-app/main/default/lwc/myComponent/</code> consists of:<br>• <code>.html</code>: Template wrapped in <code>&lt;template&gt;</code>.<br>• <code>.js</code>: Controller class extending <code>LightningElement</code>.<br>• <code>.css</code>: Styles automatically scoped via <strong>Shadow DOM</strong>.<br>• <code>.js-meta.xml</code>: Defines <code>&lt;isExposed&gt;true&lt;/isExposed&gt;</code>, allowed page targets (<code>lightning__RecordPage</code>, <code>lightning__AppPage</code>), and <strong>Design Attributes</strong> (<code>&lt;targetConfigs&gt;</code>) that expose <code>@api</code> properties as configurable inputs in the Lightning App Builder.'
          },
          {
            title: 'The 3 Official Decorators (@api, @track, @wire)',
            body: '1. <strong><code>@api</code>:</strong> Exposes a public property or method to a parent component. Referenced in parent HTML using <em>kebab-case</em> (<code>@api storeName</code> → <code>store-name="Chapinero"</code>). Declaring <code>@api recordId;</code> and <code>@api objectApiName;</code> on a Record Page automatically injects the current record ID and object name.<br>2. <strong><code>@track</code>:</strong> Primitive fields are reactive by default in modern LWC; <code>@track</code> is only needed when mutating nested object properties or calling <code>.push()</code> on an array in-place.<br>3. <strong><code>@wire</code>:</strong> Reactive read service connecting the component to Lightning Data Service or <code>@AuraEnabled(cacheable=true)</code> Apex methods.'
          },
          {
            title: 'Modern HTML Directives (lwc:if) & the 5 Lifecycle Hooks',
            body: '• Always use <code>&lt;template lwc:if={isLoaded}&gt;</code>, <code>&lt;template lwc:elseif={hasError}&gt;</code>, and <code>&lt;template lwc:else&gt;</code> (legacy <code>if:true</code> is deprecated).<br>• For lists, use <code>&lt;template for:each={stores} for:item="store"&gt;</code> and place a unique <code>key={store.Id}</code> on the first child element.<br>• <strong>Hook Order:</strong> 1. <code>constructor()</code> (Parent → Child) → 2. <code>connectedCallback()</code> (Parent → Child when inserted into DOM) → 3. <code>renderedCallback()</code> (Child → Parent after rendering finishes) → 4. <code>disconnectedCallback()</code> (cleanup listeners) → 5. <code>errorCallback(error, stack)</code> (error boundary for child components).'
          }
        ],
        table: {
          headers: ['Concept in React / Vue 3', 'Exact Equivalent in Salesforce LWC'],
          rows: [
            ['Input Props (props / defineProps)', '@api publicProperty; (passed in HTML as public-property={val})'],
            ['Local Reactive State (useState / ref)', 'Direct class field (or @track for in-place nested object/array mutations)'],
            ['Conditional Rendering ({cond && <div/>} / v-if)', '<template lwc:if={cond}> ... </template>'],
            ['List Iteration (.map() / v-for)', '<template for:each={items} for:item="it"><div key={it.Id}></div></template>'],
            ['Mount Effect (useEffect([],..) / onMounted)', 'connectedCallback()']
          ]
        },
        steps: [
          {
            id: 's-4-1-1',
            label: 'Generate the instaleapProvisioningPanel LWC bundle via CLI',
            detail: 'Run in your terminal: <code>sf lightning generate component --type lwc --name instaleapProvisioningPanel --output-dir force-app/main/default/lwc</code>.'
          }
        ]
      },
      {
        id: '4-2',
        title: 'LWC Data Access: Lightning Data Service (LDS), @wire + refreshApex vs. Imperative',
        duration: 'Week 10 (Part 1)',
        summary: 'Reading and mutating records without writing Apex via LDS, and when to use @wire vs. imperative async/await Apex calls.',
        interviewTrap: 'For refreshApex(this.wiredStoresResult) to work, you must NOT pass this.stores (the unpacked data array); you must pass the entire raw result object injected into the @wire function parameter.',
        concepts: [
          {
            title: 'Lightning Data Service (LDS): Frontend CRUD Without Writing Apex',
            body: 'Whenever you need to display or edit fields on a single record without custom cross-object business logic, use LDS: <code>lightning-record-form</code>, <code>lightning-record-view-form</code>, <code>lightning-record-edit-form</code>, or wire adapters from <code>lightning/uiRecordApi</code> (<code>getRecord</code>, <code>createRecord</code>, <code>updateRecord</code>). LDS shares a browser-wide cache and automatically enforces FLS and Sharing Rules.'
          },
          {
            title: '@wire vs. Imperative Apex Calls',
            body: '• <strong><code>@wire(getStores, { accountId: \'$recordId\' })</code>:</strong> The <code>$</code> prefix makes the parameter reactive. Requires <code>@AuraEnabled(cacheable=true)</code> on the Apex method and <strong>strictly prohibits DML</strong>. To force a cache refresh after a mutation, call <code>await refreshApex(this.wiredResult)</code>.<br>• <strong>Imperative Call (<code>await syncTenantNow({ accountId: this.recordId })</code>):</strong> Only requires <code>@AuraEnabled</code> (without <code>cacheable=true</code>). Mandatory whenever the Apex method <strong>performs DML (insert/update/delete)</strong> or when firing the call on a user button click.'
          }
        ],
        code: {
          filename: 'force-app/main/default/lwc/instaleapProvisioningPanel/instaleapProvisioningPanel.js',
          snippet: `import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getStoresByAccount from '@salesforce/apex/InstaleapPanelController.getStoresByAccount';
import syncTenantNow from '@salesforce/apex/InstaleapPanelController.syncTenantNow';

export default class InstaleapProvisioningPanel extends LightningElement {
    @api recordId;
    stores = [];
    wiredStoresResult;
    isSyncing = false;

    @wire(getStoresByAccount, { accountId: '$recordId' })
    wiredStores(result) {
        this.wiredStoresResult = result;
        if (result.data) {
            this.stores = result.data;
        }
    }

    async handleSyncClick() {
        this.isSyncing = true;
        try {
            await syncTenantNow({ accountId: this.recordId });
            await refreshApex(this.wiredStoresResult);
        } finally {
            this.isSyncing = false;
        }
    }
}`
        },
        steps: [
          {
            id: 's-4-2-1',
            label: 'Create InstaleapPanelController.cls and wire it to the LWC',
            detail: 'Create the Apex controller with both methods (cacheable <code>getStoresByAccount</code> and imperative <code>syncTenantNow</code>), deploy both, and place the component on the <code>Account</code> Record Page.'
          }
        ]
      },
      {
        id: '4-3',
        title: 'LWC Component Communication: @api, CustomEvent & Lightning Message Service (LMS)',
        duration: 'Week 10 (Part 2)',
        summary: 'Communicating Parent-to-Child, Child-to-Parent, and across unrelated sibling components on the page.',
        interviewTrap: 'In LWC, event names passed to new CustomEvent("storeselect") MUST be all lowercase with no spaces or hyphens. The parent listens by prefixing "on" (onstoreselect={handleSelect}).',
        concepts: [
          {
            title: 'The 3 Component Communication Patterns in LWC',
            body: '1. <strong>Parent → Child:</strong> Pass reactive <code>@api</code> properties in the HTML template or call a child\'s public <code>@api</code> method via <code>this.template.querySelector(\'c-child\').refreshData()</code>.<br>2. <strong>Child → Parent:</strong> The child dispatches a standard DOM <code>CustomEvent</code>: <code>this.dispatchEvent(new CustomEvent(\'storeselect\', { detail: { storeId: this.id }, bubbles: true, composed: false }))</code>.<br>3. <strong>Unrelated / Sibling Components (across LWC, Aura &amp; Visualforce):</strong> Use <strong>Lightning Message Service (LMS)</strong> by defining a <code>MessageChannel</code> XML in <code>force-app/main/default/messageChannels/</code> and calling <code>publish()</code>, <code>subscribe()</code>, and <code>unsubscribe()</code> from <code>lightning/messageService</code>.'
          }
        ],
        steps: [
          {
            id: 's-4-3-1',
            label: 'Dispatch a ShowToastEvent when syncing a Tenant from LWC',
            detail: 'Import <code>ShowToastEvent</code> from <code>lightning/platformShowToastEvent</code> in your LWC to display a green success toast whenever the Queueable job is enqueued.'
          }
        ]
      },
      {
        id: '4-4',
        title: 'Salesforce DevOps (sf CLI + GitHub Actions CI/CD) & PD1 Exam Strategy',
        duration: 'Weeks 11–12',
        summary: 'Modern Git-driven deployment pipeline, test execution levels (--test-level), 2GP Unlocked Packages, and final PD1 exam preparation.',
        interviewTrap: 'When deploying to Production without specifying a test level, which test level does Salesforce execute by default? Answer: RunLocalTests (runs all tests in your Org except those originating from installed managed packages).',
        concepts: [
          {
            title: 'The 4 Deployment Test Levels (--test-level)',
            body: '• <code>NoTestRun</code>: Runs zero unit tests (allowed only when deploying to Sandboxes, never Production).<br>• <code>RunSpecifiedTests</code>: Runs only the comma-separated test classes you specify; as long as those tests cover at least 75% of the deployed Apex components, Production validates and unlocks <em>Quick Deploy</em> in minutes.<br>• <code>RunLocalTests</code>: Production default; executes all customer tests in the Org excluding managed package tests.<br>• <code>RunAllTestsInOrg</code>: Executes every single test in the Org including managed packages.'
          },
          {
            title: 'Official Platform Developer I (PD1) Exam Breakdown',
            body: '• <strong>Format:</strong> 60 multiple-choice questions, 105 minutes, passing score: <strong>68% (41 correct answers)</strong>.<br>• <strong>Official Section Weights:</strong> Process Automation &amp; Logic (30%), User Interface / LWC (25%), Developer Fundamentals (23%), Testing, Debugging &amp; Deployment (22%).'
          }
        ],
        code: {
          filename: '.github/workflows/sfdc-ci.yml',
          snippet: `name: Salesforce CI Validation
on:
  pull_request:
    branches: [ main ]
jobs:
  validate-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli
      - name: Authenticate Org via SFDX Auth URL
        run: echo "\${{ secrets.SFDX_AUTH_URL }}" > authFile.txt && sf org login sfdx-url -f authFile.txt -a ci-org
      - name: Validate Deployment & Run Local Tests
        run: sf project deploy validate -d force-app -o ci-org --test-level RunLocalTests --wait 30`
        },
        steps: [
          {
            id: 's-4-4-1',
            label: 'Create the .github/workflows/sfdc-ci.yml pipeline in your project',
            detail: 'Add the CI workflow YAML file and document the End-to-End architecture in your root <code>README.md</code>.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-4',
      title: 'Block 4 Exam: LWC, Component Communication & DevOps',
      questions: [
        {
          q: 'When must you invoke an Apex method Imperatively instead of using @wire in an LWC?',
          options: [
            'Whenever you want to display a read-only list of records on page load',
            'When the Apex method performs DML (insert/update/delete) or must be triggered by a user button click',
            'When the method is annotated with @AuraEnabled(cacheable=true)',
            'When using Lightning Data Service'
          ],
          correct: 1,
          explanation: '@wire requires cacheable=true and prohibits any DML statements. Performing DML or firing on a button click requires an Imperative call.'
        },
        {
          q: 'Which mechanism should you use to communicate between two LWC components placed in separate regions of a Lightning Page with no parent-child relationship?',
          options: [
            '@api property',
            'Simple CustomEvent without bubbles',
            'Lightning Message Service (LMS) over a MessageChannel',
            'renderedCallback()'
          ],
          correct: 2,
          explanation: 'Lightning Message Service (LMS) provides decoupled pub/sub communication across LWC, Aura, and Visualforce components on the same page.'
        }
      ]
    }
  },
  {
    id: 'block-5',
    num: '05',
    title: 'INTEGRATION ARCHITECT PATH ($8K–$13K/MO): PATTERNS, EVENTS & OAUTH',
    weeks: 'Months 4–9 (Architect Track)',
    badgeColor: '#ff5722',
    summary: 'The track that separates you from 95% of developers: the 6 Official Integration Patterns, Event-Driven Architecture (Platform Events, CDC, Pub/Sub gRPC), Bulk API 2.0, and OAuth 2.0 / SSO.',
    lessons: [
      {
        id: '5-1',
        title: 'The 6 Official Salesforce Integration Patterns (Integration Architect)',
        duration: 'Months 4–5',
        summary: 'How to select the exact integration pattern in an architecture interview based on latency, data volume, coupling, and call direction.',
        interviewTrap: 'In the Integration Architect exam and Senior interviews, you will get this scenario: "Salesforce needs to notify 4 external systems (ERP, WMS, Billing, and BI) whenever an Account changes, without tightly coupling Apex to each endpoint." The answer is NEVER making 4 HTTP Callouts: it is the Fire & Forget pattern publishing a Platform Event (__e) or enabling Change Data Capture (CDC).',
        concepts: [
          {
            title: 'Master Map of the 6 Salesforce Integration Patterns',
            body: '1. <strong>Remote Process Invocation — Request and Reply (Synchronous):</strong> Salesforce requires an immediate response from an external system (e.g., live shipping rate calculation). Tools: <em>External Services</em> (declarative OpenAPI) or <em>Apex HTTP Callout + Continuation</em> (for long-running LWC callouts without blocking threads).<br>2. <strong>Remote Process Invocation — Fire and Forget (Asynchronous):</strong> Salesforce publishes an event and continues without waiting for an immediate reply. Tools: <em>Platform Events (<code>__e</code>)</em>, <em>Change Data Capture (CDC)</em>, <em>Outbound Messaging</em>, or <em>Queueable Callouts</em>.<br>3. <strong>Batch Data Synchronization:</strong> Scheduled bulk ETL synchronization of hundreds of thousands or millions of rows. Tools: <em>Bulk API 2.0</em> + Middleware (MuleSoft / Kafka).<br>4. <strong>Remote Call-In:</strong> An external system (like our Instaleap Node.js backend) calls into Salesforce to read or write records. Tools: <em>Standard REST API</em>, <em>Composite API / Composite Graph</em> (batches up to 25 or 500 sub-requests in a single network round-trip), or <em>Apex <code>@RestResource</code></em>.<br>5. <strong>UI Update Based on Data Changes:</strong> Pushing real-time server updates directly to the user\'s browser screen. Tools: <code>lightning/empApi</code> module in LWC subscribed to a Platform Event or CDC channel.<br>6. <strong>Data Virtualization:</strong> Viewing external records in real time without storing them in Salesforce. Tools: <em>Salesforce Connect (External Objects <code>__x</code>)</em> via OData 2.0/4.0.'
          }
        ],
        table: {
          headers: ['Integration Pattern', 'Direction & Timing', 'Best Salesforce Tool'],
          rows: [
            ['1. Request & Reply', 'Salesforce → External (Synchronous)', 'Named Credentials + External Services / Apex Callout / Continuation'],
            ['2. Fire & Forget', 'Salesforce → External (Asynchronous)', 'Platform Events (__e) / Change Data Capture (CDC) / Pub-Sub API'],
            ['3. Batch Data Sync', 'Bidirectional (Bulk Asynchronous)', 'Bulk API 2.0 (Ingest & Query) + External ID Upsert'],
            ['4. Remote Call-In', 'External → Salesforce (Synchronous)', 'Standard REST API / Composite API / Apex @RestResource'],
            ['5. UI Update on Changes', 'Server → LWC Browser (Push)', 'lightning/empApi subscribed to Platform Event or CDC'],
            ['6. Data Virtualization', 'Salesforce reads External on-demand', 'Salesforce Connect (External Objects __x)']
          ]
        },
        steps: [
          {
            id: 's-5-1-1',
            label: 'Map which integration patterns our Instaleap engine uses',
            detail: 'Verify how our project combines <strong>Fire &amp; Forget</strong> (Trigger → Queueable to Node.js) and <strong>Remote Call-In</strong> (Callback from Node.js into Salesforce).'
          }
        ]
      },
      {
        id: '5-2',
        title: 'Event-Driven Architecture: Platform Events (__e), CDC, Pub/Sub API (gRPC) & Bulk API 2.0',
        duration: 'Months 6–7',
        summary: 'Platform Events vs. Change Data Capture, Publish Behavior (Publish After Commit vs. Publish Immediately), and ingesting 10M rows via Bulk API 2.0.',
        interviewTrap: 'Critical distinction on a Platform Event: "Publish After Commit" only dispatches the event if the database transaction commits successfully. "Publish Immediately" dispatches the event right away even if the transaction fails and rolls back a millisecond later (ideal for publishing error log events that must survive a transaction rollback!).',
        concepts: [
          {
            title: 'Platform Events (__e) vs. Change Data Capture (CDC)',
            body: '• <strong>Platform Events (<code>__e</code>):</strong> Custom-schema business events defined by you (e.g., <code>Tenant_Provisioned__e</code>). Published via Flows, Apex (<code>EventBus.publish()</code>), or REST API. Event bus retention (ReplayId): <strong>72 hours</strong>.<br>• <strong>Change Data Capture (CDC):</strong> Enabled declaratively with a single checkbox on Standard or Custom Objects (<code>AccountChangeEvent</code>) with zero code; automatically streams every <code>CREATE, UPDATE, DELETE, UNDELETE</code> with changed field diffs. Retention: <strong>72 hours</strong>.<br>• <strong>Pub/Sub API:</strong> Salesforce\'s modern <strong>gRPC + HTTP/2 + Apache Avro</strong> API allowing Node.js, Go, or Python microservices to subscribe and publish Platform Events and CDC streams at high throughput.'
          },
          {
            title: 'Bulk API 2.0: Loading or Querying Tens of Millions of Records',
            body: 'Unlike standard REST API (which processes up to 200 records per request), <strong>Bulk API 2.0</strong> accepts CSV uploads up to 150 MB per job, automatically chunks them into 2,000-record batches on the server, and processes them asynchronously in parallel.'
          }
        ],
        steps: [
          {
            id: 's-5-2-1',
            label: 'Inspect Change Data Capture in Setup',
            detail: 'Go to <strong>Setup → Quick Find → Change Data Capture</strong> and see how you can enable real-time CDC streams on <code>Account</code> and <code>Fulfillment_Center__c</code> with one click.'
          }
        ]
      },
      {
        id: '5-3',
        title: 'Identity & Access Management (IAM Architect): OAuth 2.0 Flows & SAML SSO',
        duration: 'Months 8–9',
        summary: 'Selecting the right OAuth 2.0 flow (Web Server, JWT Bearer, User-Agent, Device, Asset Token) and designing Single Sign-On (SP-Initiated vs. IdP-Initiated).',
        interviewTrap: 'Guaranteed Architect exam question: "A headless Node.js backend microservice must authenticate into Salesforce every night with zero human interaction or browser. Which OAuth 2.0 flow must you use?" Answer: OAuth 2.0 JWT Bearer Token Flow (uses an X.509 digital certificate pre-authorized in the External Client App / Connected App; never use the deprecated Username-Password flow).',
        concepts: [
          {
            title: 'The 4 OAuth 2.0 Flows Every Architect Must Know Cold',
            body: '1. <strong>Web Server Flow (Authorization Code Flow with PKCE):</strong> For web apps with a secure backend where a human user logs in interactively. Returns both an <code>access_token</code> and a <code>refresh_token</code>.<br>2. <strong>JWT Bearer Token Flow:</strong> For <strong>Server-to-Server (headless / no human)</strong> integrations. The external server signs a JWT payload with its RSA private key, and Salesforce verifies it against the uploaded X.509 public certificate to issue an <code>access_token</code> (it never returns a <code>refresh_token</code> because the server simply signs a new JWT when expired).<br>3. <strong>Device Flow:</strong> For smart TVs, CLI tools, or appliances with limited input capabilities.<br>4. <strong>Asset Token Flow:</strong> For connected IoT devices.'
          }
        ],
        table: {
          headers: ['Integration Scenario', 'Correct OAuth 2.0 Flow', 'Issues Refresh Token?'],
          rows: [
            ['Headless Node.js Microservice / Cron Job (No Human User)', 'JWT Bearer Token Flow (with X.509 Certificate)', 'No (signs a new JWT when expired)'],
            ['Web App with Backend where a user logs in interactively', 'Web Server Flow (Authorization Code + PKCE)', 'Yes'],
            ['Desktop CLI or Limited-Input Device', 'Web Server Flow with PKCE / Device Flow', 'Yes'],
            ['Enterprise Single Sign-On with Okta / Microsoft Entra ID', 'SAML 2.0 SSO or OpenID Connect Auth. Provider', 'Managed by IdP']
          ]
        },
        steps: [
          {
            id: 's-5-3-1',
            label: 'Master the distinction between Web Server Flow and JWT Bearer Flow',
            detail: 'Verify you can explain why JWT Bearer Flow is the enterprise standard for headless backend-to-backend integrations.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-5',
      title: 'Block 5 Exam: Integration & IAM Architect',
      questions: [
        {
          q: 'A headless Node.js backend microservice needs to authenticate with Salesforce Server-to-Server without any human user interaction. Which OAuth 2.0 flow does Salesforce recommend?',
          options: [
            'OAuth 2.0 User-Agent Flow',
            'OAuth 2.0 JWT Bearer Token Flow using an X.509 digital certificate',
            'OAuth 2.0 Device Flow',
            'Passing username and password in plain text query parameters'
          ],
          correct: 1,
          explanation: 'The JWT Bearer Token Flow authenticates headless Server-to-Server integrations by validating an RSA cryptographic signature against an X.509 certificate.'
        },
        {
          q: 'What is the difference between "Publish After Commit" and "Publish Immediately" on a Platform Event (__e)?',
          options: [
            'There is no difference',
            'Publish After Commit only dispatches the event if the database transaction commits successfully; Publish Immediately dispatches it even if the transaction rolls back',
            'Publish Immediately only works in Flows and not in Apex',
            'Publish After Commit does not count against governor limits'
          ],
          correct: 1,
          explanation: 'Publish Immediately bypasses the database transaction boundary (ideal for error logging events that must be sent even when an exception causes a rollback).'
        }
      ]
    }
  },
  {
    id: 'block-6',
    num: '06',
    title: 'APPLICATION ARCHITECT PATH ($12K–$18K/MO): LDV DATA & SHARING',
    weeks: 'Months 10–18 (Architect Track)',
    badgeColor: '#10b981',
    summary: 'Complete the Application Architect pyramid: architecting tables with 50M+ rows (Large Data Volumes), optimizing the Query Plan, and mastering internal __Share tables.',
    lessons: [
      {
        id: '6-1',
        title: 'Data Architect: Large Data Volumes (LDV >50M Rows), Indexes & Eliminating Data Skew',
        duration: 'Months 10–12',
        summary: 'Making SOQL queries over 50 million rows return in 100ms: Index Selectivity thresholds, Skinny Tables, and the 3 types of Data Skew.',
        interviewTrap: 'Which operators in a SOQL WHERE clause prevent the query optimizer from using an index and force a Full Table Scan across millions of rows? Answer: Negative operators (!=, NOT LIKE), comparing against null (WHERE Status__c = null), leading wildcards (LIKE "%text"), or filtering on non-deterministic Formula fields.',
        concepts: [
          {
            title: 'SOQL Query Selectivity & Standard/Custom Indexes (Query Plan Tool)',
            body: 'When an object exceeds 1 million records, a Full Table Scan times out or fails. Salesforce uses an index only when the <code>WHERE</code> filter is <strong>selective</strong> (matches less than <strong>10% of the first million rows</strong> and less than <strong>5% of additional rows</strong>).<br>• <strong>Automatically Indexed Fields:</strong> <code>Id</code>, <code>Name</code>, <code>OwnerId</code>, <code>CreatedDate</code>, <code>SystemModstamp</code>, <code>Lookup / Master-Detail</code> fields, and any custom field marked as <strong><code>External ID</code></strong> or <strong><code>Unique</code></strong>.'
          },
          {
            title: 'The 3 Types of Data Skew & How an Architect Prevents Them',
            body: '1. <strong>Account Data Skew:</strong> More than 10,000 child records (e.g., Contacts or Fulfillment Centers) parented to a single Account. Causes <code>UNABLE_TO_LOCK_ROW</code> during concurrent child updates and slow sharing recalculations.<br>2. <strong>Ownership Skew:</strong> A single generic user ("Integration User") owns (<code>OwnerId</code>) hundreds of thousands of records. If that user sits inside the Role Hierarchy, every change recalculates visibility up their entire management chain. <strong>Fix:</strong> Keep that user out of the Role Hierarchy (<code>Role = None</code>) or place them at the very top with no superiors.<br>3. <strong>Lookup Skew:</strong> Tens of thousands of records pointing to the same target record via a Lookup field. <strong>Fix:</strong> Sort Bulk API batches by the parent ID (<code>ORDER BY AccountId</code>) to minimize lock contention.'
          },
          {
            title: 'Skinny Tables & Data Archiving Strategies (Big Objects)',
            body: '• <strong>Skinny Table:</strong> A specialized table enabled by Salesforce Support that combines frequently queried standard and custom fields into a single physical database table, eliminating the internal SQL JOIN between standard and custom storage tables.<br>• <strong>High-Speed LDV Migration:</strong> When migrating 20M records via Bulk API 2.0, sort the CSV by <code>ParentId</code>, temporarily bypass Triggers/Flows/Sharing Rules, and run <em>Deferred Sharing Calculation</em> after the load finishes.'
          }
        ],
        steps: [
          {
            id: 's-6-1-1',
            label: 'Memorize the 3 rules for resolving Ownership Skew in interviews',
            detail: 'Verify you can explain why an Integration User owning >10,000 records must never be placed at the bottom of the Role Hierarchy.'
          }
        ]
      },
      {
        id: '6-2',
        title: 'Sharing & Visibility Architect: Internal __Share Tables & Implicit Sharing',
        duration: 'Months 13–15',
        summary: 'How AccountShare and CustomObject__Share tables work under the hood, Implicit Sharing (Parent/Child), and Apex Managed Sharing.',
        interviewTrap: 'What happens to a programmatically inserted __Share row with RowCause = "Manual" when the main record\'s OwnerId changes? Salesforce automatically DELETES it. To make programmatic sharing survive owner changes on a Custom Object, define an Apex Sharing Reason and set RowCause = Schema.MyObject__Share.RowCause.My_Reason__c.',
        concepts: [
          {
            title: 'Anatomy of a Sharing Table (AccountShare / Fulfillment_Center__Share)',
            body: 'Every object whose OWD is <code>Private</code> or <code>Public Read Only</code> has an accompanying Share table with 4 core columns:<br>• <code>ParentId</code>: ID of the record being shared.<br>• <code>UserOrGroupId</code>: ID of the <code>User</code> or <code>Group</code> (Public Group / Role) receiving access.<br>• <code>AccessLevel</code>: Access level granted (<code>Read</code>, <code>Edit</code>, <code>All</code>).<br>• <code>RowCause</code>: Why the row exists (<code>Owner</code>, <code>Rule</code>, <code>Manual</code>, <code>Team</code>, or a custom <em>Apex Sharing Reason</em>).'
          },
          {
            title: 'Implicit Sharing (Native Built-in Visibility Between Account and Its Children)',
            body: 'Even when OWD is Private, Salesforce enforces two native implicit sharing behaviors on standard CRM objects:<br>• <strong>Parent Implicit Sharing (Child → Parent):</strong> If a user gains access to a child <code>Contact</code>, <code>Opportunity</code>, or <code>Case</code>, Salesforce automatically grants implicit <code>Read Only</code> access to the parent <code>Account</code>.<br>• <strong>Child Implicit Sharing (Parent → Children):</strong> On the <code>Role</code> definition, you configure whether an <code>Account</code> owner automatically gains View or Edit access to child Opportunities and Cases owned by other users.'
          }
        ],
        steps: [
          {
            id: 's-6-2-1',
            label: 'Query the AccountShare table via SOQL in hello.apex',
            detail: 'Run <code>SELECT Id, AccountId, UserOrGroupId, AccountAccessLevel, RowCause FROM AccountShare</code> inside <code>scripts/apex/hello.apex</code> to inspect the rows generated by your Sharing Rule.'
          }
        ]
      },
      {
        id: '6-3',
        title: 'Enterprise Solution Design Whiteboard Cases (Slalom / US Architect Interviews)',
        duration: 'Months 16–18',
        summary: 'Live architectural whiteboard walkthroughs applying all 6 blocks to real US enterprise consulting scenarios.',
        interviewTrap: 'In a Solution or Application Architect interview, never start your answer with "I would write a Trigger". Always start with 3 discovery questions: 1) What is the expected data volume (LDV)? 2) Does the integration require synchronous UI feedback or can it run asynchronously? 3) What is the OWD and security model of the objects involved?',
        concepts: [
          {
            title: 'Whiteboard Case #1: Syncing 5 Million Daily Orders from an External ERP into Salesforce',
            body: '<strong>Architect Solution Blueprint:</strong><br>1. <strong>Data Model &amp; Storage:</strong> Do not store 5 million daily historical orders in standard custom objects if they are only viewed for reference (prevents storage exhaustion and Account Data Skew). Use <strong>Salesforce Connect (External Objects <code>__x</code>)</strong> for on-demand viewing or archive orders older than 90 days into a <strong>Big Object (<code>Order_History__b</code>)</strong>.<br>2. <strong>Active Order Ingestion:</strong> Use <strong>Bulk API 2.0</strong> with an <code>External_Order_Id__c</code> field (Unique + External ID) performing an <code>upsert</code> sorted by <code>AccountId</code> to prevent <code>UNABLE_TO_LOCK_ROW</code>.<br>3. <strong>Security:</strong> Authenticate Server-to-Server via <strong>OAuth 2.0 JWT Bearer Flow</strong> using a dedicated Integration User removed from the Role Hierarchy (preventing Ownership Skew).'
          }
        ],
        steps: [
          {
            id: 's-6-3-1',
            label: 'Practice defending Whiteboard Case #1 out loud in English',
            detail: 'Present the solution in 3 minutes covering Data Model, LDV/Skew mitigation, Integration Pattern, and OAuth Security.'
          }
        ]
      }
    ],
    exam: {
      id: 'exam-6',
      title: 'Block 6 Exam: Data & Sharing Architect',
      questions: [
        {
          q: 'A client has an "Integration User" that owns (OwnerId) 800,000 Accounts. Whenever Accounts are updated in bulk, slow sharing recalculation locks occur. What is the root cause and architectural fix?',
          options: [
            'Cause: Insufficient Heap memory. Fix: Use @future',
            'Cause: Ownership Data Skew because the Integration User sits inside the Role Hierarchy. Fix: Remove the Integration User from the Role Hierarchy (or place at the very top) and distribute ownership',
            'Cause: OWD is Public Read/Write. Fix: Change OWD to Private',
            'Cause: Too many custom fields. Fix: Delete fields'
          ],
          correct: 1,
          explanation: 'When a single user owns >10,000 records and has managers in the Role Hierarchy, Salesforce must recalculate Group Maintenance tables up the entire chain. Removing them from the role tree eliminates that overhead.'
        },
        {
          q: 'Which operators in a SOQL WHERE clause prevent the Salesforce query optimizer from using an index and cause a Full Table Scan on multi-million-row tables?',
          options: [
            'WHERE External_Id__c = :val',
            'WHERE CreatedDate = TODAY',
            'Negative operators (!=, NOT LIKE), leading wildcards (LIKE "%abc"), or comparing against null',
            'WHERE Id IN :idSet'
          ],
          correct: 2,
          explanation: 'Negative comparisons (!=), leading % wildcards, and null filters are non-selective and cannot use standard indexes in Large Data Volume (LDV) tables.'
        }
      ]
    }
  }
];
