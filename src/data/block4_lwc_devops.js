export const block4LwcDevops = {
  id: 'block-4',
  num: '04',
  title: 'LWC FRONTEND ARCHITECTURE, JEST TESTING & ENTERPRISE DEVOPS',
  weeks: 'Weeks 9–12',
  badgeColor: '#f59e0b',
  summary: 'Master Lightning Web Components (LWC) under the hood: Shadow DOM vs. Light DOM, Lifecycle Hooks, Lightning Data Service (LDS), @wire + refreshApex vs. Imperative Apex, CustomEvents (bubbles/composed), LMS, Jest unit testing, 2GP Unlocked Packages, and GitHub Actions CI/CD.',
  lessons: [
    {
      id: '4-1',
      title: 'LWC Runtime Architecture: Shadow DOM vs. Light DOM, Decorators & Directives',
      duration: 'Days 57–59',
      summary: 'How the LWC compiler works, Synthetic/Native Shadow DOM vs. Light DOM, .js-meta.xml targetConfigs, @api/@track/@wire, and lwc:if / for:each / iterator.',
      interviewTrap: 'When a parent component passes an object or array to a child component via an @api property, can the child component mutate properties inside that object directly (e.g., this.store.city = "Cali")? Answer: NO! @api properties enforce one-way data binding and are wrapped in a read-only membrane; mutating an @api object inside the child throws a runtime error! The child must either clone the object locally or fire a CustomEvent asking the parent to update it.',
      concepts: [
        {
          title: '1. Shadow DOM Encapsulation vs. Light DOM & SLDS Styling Hooks',
          body: 'By default, every LWC renders inside a <strong>Shadow DOM</strong> boundary (<code>#shadow-root</code>):<br>• <strong>CSS Isolation:</strong> Styles written in <code>parent.css</code> DO NOT bleed into <code>c-child</code>, and global styles cannot accidentally break your component.<br>• <strong>Query Isolation:</strong> Calling <code>document.querySelector()</code> cannot reach inside an LWC\'s Shadow DOM; inside the component you must use <code>this.template.querySelector()</code> (or modern <code>this.refs.myRef</code> with <code>lwc:ref="myRef"</code>).<br>• <strong>Customizing Base Components (SLDS Styling Hooks):</strong> Because you cannot write CSS selectors targeting inside <code>&lt;lightning-button&gt;</code>\'s shadow root, Salesforce provides CSS Custom Properties (Styling Hooks like <code>--slds-c-button-brand-color-background: #ff5722;</code>) which pierce the Shadow DOM boundary!<br>• <strong>Light DOM (<code>static renderMode = \'light\';</code>):</strong> Used when third-party analytics/SEO tools or global CSS frameworks need direct DOM access without a shadow boundary.'
        },
        {
          title: '2. Deep Reactivity Rules: Primitives vs. @track vs. @api',
          body: '• <strong>Unannotated Class Fields:</strong> Any primitive field (<code>isLoading = false;</code>) is automatically reactive when reassigned. For objects or arrays, LWC tracks <em>shallow reference reassignment</em> (<code>this.stores = [...this.stores, newStore];</code> triggers a re-render without <code>@track</code>!).<br>• <strong><code>@track</code> Decorator:</strong> Only required when you mutate a property inside an object in-place (<code>this.filter.city = \'Medellin\'</code>) or call <code>this.stores.push(item)</code> without reassigning the top-level variable reference.<br>• <strong><code>@api</code> Decorator:</strong> Marks a property or method as public for parent components. Always read-only inside the child.'
        },
        {
          title: '3. Metadata Configuration (.js-meta.xml): Targets & Design Attributes',
          body: 'To make an LWC draggable in the Lightning App Builder, Screen Flows, or Experience Cloud, configure its <code>.js-meta.xml</code>:'
        }
      ],
      code: {
        filename: 'instaleapProvisioningPanel.js-meta.xml (Targets & Design Attributes)',
        snippet: `<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>62.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Instaleap Provisioning Panel</masterLabel>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__FlowScreen</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects>
                <object>Account</object>
            </objects>
            <property name="panelTitle" type="String" default="Real-Time Dark Store Provisioning" label="Panel Header Title"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>`
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
      title: 'Complete LWC Lifecycle Hooks, Template Refs (lwc:ref) & Third-Party JS Libraries',
      duration: 'Days 60–61',
      summary: 'Exact execution order of constructor, connectedCallback, renderedCallback, disconnectedCallback, and errorCallback, plus loading Static Resources (Chart.js/D3) with loadScript.',
      interviewTrap: 'In constructor(), can you access this.template.querySelector() or read @api properties passed by the parent? Answer: NO! In constructor(), the component has not been inserted into the DOM yet and public @api properties have not been set yet! Wait until connectedCallback() to read @api properties, and wait until renderedCallback() to access child DOM elements.',
      concepts: [
        {
          title: '1. The 5 Lifecycle Hooks in Exact Execution Order',
          body: '1. <strong><code>constructor()</code> (Parent → Child):</strong> Must call <code>super()</code> on the first line. Component is not in the DOM yet; do NOT access child elements or dispatch events here.<br>2. <strong><code>connectedCallback()</code> (Parent → Child):</strong> Fires when the component is inserted into the DOM. <code>@api</code> properties are now populated! Ideal place to subscribe to <em>Lightning Message Service (LMS)</em>, register window listeners, or trigger initial imperative data fetches. <em>(Note: Can fire more than once if the component is removed and re-inserted into the DOM).</em><br>3. <strong><code>renderedCallback()</code> (Child → Parent):</strong> Fires after every render cycle completes. Because mutating reactive state inside <code>renderedCallback()</code> triggers another render, you MUST guard one-time initialization (such as initializing a third-party chart library via <code>platformResourceLoader</code>) with a boolean property: <code>if (this.isChartInitialized) return; this.isChartInitialized = true;</code>.<br>4. <strong><code>disconnectedCallback()</code> (Parent → Child):</strong> Fires when the component is removed from the DOM. Mandatory place to unsubscribe from LMS channels, clear <code>setInterval</code> timers, and remove window event listeners to prevent memory leaks.<br>5. <strong><code>errorCallback(error, stack)</code>:</strong> Acts like a React Error Boundary—catches errors thrown in lifecycle hooks or event handlers of any descendant child component.'
        },
        {
          title: '2. Direct DOM Access via lwc:ref (Replacing querySelector)',
          body: 'Instead of writing brittle CSS selectors in <code>this.template.querySelector(\'.my-input\')</code>, add <code>lwc:ref="storeSearchInput"</code> to any HTML element in your template and access it directly in JS via <code>this.refs.storeSearchInput</code>!'
        }
      ],
      table: {
        headers: ['Lifecycle Hook', 'Direction', 'Are @api Props Ready?', 'Are Child DOM Elements Rendered?', 'Primary Use Case'],
        rows: [
          ['constructor()', 'Parent → Child', 'No', 'No', 'Call super(); basic internal state init'],
          ['connectedCallback()', 'Parent → Child', 'Yes', 'No (Host is in DOM, children not yet)', 'Subscribe to LMS, fetch initial data, read @api'],
          ['renderedCallback()', 'Child → Parent', 'Yes', 'Yes (this.refs / querySelector ready)', 'Measure DOM, initialize 3rd-party JS libraries (with guard flag)'],
          ['disconnectedCallback()', 'Parent → Child', 'Yes', 'N/A', 'Unsubscribe LMS, clear intervals & window listeners'],
          ['errorCallback(err, stack)', 'Captures Child Errors', 'Yes', 'Yes', 'Error boundary UI fallback & logging']
        ]
      },
      steps: [
        {
          id: 's-4-2-1',
          label: 'Memorize the Parent→Child vs. Child→Parent flow of LWC hooks',
          detail: 'Verify you can explain why <code>constructor</code> and <code>connectedCallback</code> run Parent → Child, whereas <code>renderedCallback</code> runs Child → Parent.'
        }
      ]
    },
    {
      id: '4-3',
      title: 'Lightning Data Service (LDS): Base Record Forms & lightning/uiRecordApi Wire Adapters',
      duration: 'Days 62–64',
      summary: 'How to perform single-record CRUD in LWC with zero Apex code using lightning-record-form, lightning-record-edit-form, getRecord, createRecord, and updateRecord.',
      interviewTrap: 'When an interviewer asks: "A user wants a custom LWC card on the Account page to edit 4 Account fields. Should you write an Apex controller with an @AuraEnabled update method?", the answer is NO! Always use Lightning Data Service (lightning-record-edit-form or updateRecord from lightning/uiRecordApi). It requires zero Apex classes, zero Apex unit tests, automatically respects FLS/Sharing, and automatically refreshes all other components on the page viewing that Account!',
      concepts: [
        {
          title: '1. The 3 Base LDS Form Components (Fastest Declarative-to-Code Bridge)',
          body: '• <strong><code>&lt;lightning-record-form&gt;</code>:</strong> Highest-level component. Accepts <code>record-id={recordId}</code>, <code>object-api-name="Account"</code>, and either <code>layout-type="Full"</code> or <code>fields={fieldsArray}</code>. Automatically switches between View and Edit modes with zero JS code.<br>• <strong><code>&lt;lightning-record-view-form&gt;</code> + <code>&lt;lightning-output-field&gt;</code>:</strong> Custom read-only layout where you control exact HTML grid placement of individual fields.<br>• <strong><code>&lt;lightning-record-edit-form&gt;</code> + <code>&lt;lightning-input-field&gt;</code>:</strong> Custom edit/create form allowing you to intercept <code>onsubmit</code> (to override values before save) and <code>onsuccess</code> (to show a toast).'
        },
        {
          title: '2. Programmatic LDS via lightning/uiRecordApi & Schema Imports',
          body: 'When building a completely custom UI (not standard inputs), use the <code>lightning/uiRecordApi</code> module:<br>• Always import field references statically from <code>@salesforce/schema/Account.Onboarding_Status__c</code> instead of passing raw strings! Why? Because static schema imports enforce <strong>compile-time referential integrity</strong> (Salesforce blocks anyone from deleting that field in Setup while your LWC references it!).<br>• Use <code>@wire(getRecord, { recordId: \'$recordId\', fields: [STATUS_FIELD] })</code> to read, and call <code>await updateRecord({ fields: { Id: this.recordId, Onboarding_Status__c: \'Ready_to_Provision\' } })</code> to mutate.'
        }
      ],
      code: {
        filename: 'Programmatic LDS Read & Update Without Apex (lightning/uiRecordApi)',
        snippet: `import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import STATUS_FIELD from '@salesforce/schema/Account.Onboarding_Status__c';

const FIELDS = [NAME_FIELD, STATUS_FIELD];

export default class AccountQuickStatus extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    get accountName() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    async markReadyToProvision() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STATUS_FIELD.fieldApiName] = 'Ready_to_Provision';
        await updateRecord({ fields });
    }
}`
      },
      steps: [
        {
          id: 's-4-3-1',
          label: 'Understand why importing from @salesforce/schema/* is mandatory',
          detail: 'Check this off once you can explain how <code>import STATUS_FIELD from \'@salesforce/schema/Account.Onboarding_Status__c\'</code> prevents admins from accidentally deleting fields used by your LWC.'
        }
      ]
    },
    {
      id: '4-4',
      title: 'Calling Apex from LWC: @wire + refreshApex vs. Imperative Calls & Datatable Pagination',
      duration: 'Days 65–68',
      summary: 'Complete implementation of InstaleapPanelController.cls and instaleapProvisioningPanel LWC combining reactive @wire reads, imperative DML actions, refreshApex(), and notifyRecordUpdateAvailable().',
      interviewTrap: 'When an imperative Apex method updates fields on the current Account record in the database, how do you tell Lightning Data Service (LDS) to refresh the standard Account Highlights Panel and Details tab on the page without reloading the browser? Answer: Import { notifyRecordUpdateAvailable } from "lightning/uiRecordApi" and call await notifyRecordUpdateAvailable([{ recordId: this.recordId }])!',
      concepts: [
        {
          title: '1. @wire(apexMethod) vs. Imperative Apex Calls',
          body: '• <strong><code>@wire(getStoresByAccount, { accountId: \'$recordId\' })</code>:</strong><br>&nbsp;&nbsp;– Requires <code>@AuraEnabled(cacheable=true)</code> on the Apex method.<br>&nbsp;&nbsp;– <strong>Read-Only:</strong> Executing any DML inside a <code>cacheable=true</code> method throws a runtime <code>LimitException: Too many DML statements: 1</code> (because the DML limit inside a cacheable method is literally <strong>0</strong>!).<br>&nbsp;&nbsp;– To invalidate the client cache and re-fetch fresh data from the server, pass the raw wired result object into <code>await refreshApex(this.wiredStoresResult);</code>.<br>• <strong>Imperative Call (`await syncTenantNow({ accountId: this.recordId })`):</strong><br>&nbsp;&nbsp;– Annotated with <code>@AuraEnabled</code> (without <code>cacheable=true</code>).<br>&nbsp;&nbsp;– Used whenever the method performs DML, enqueues a Queueable job, or must run only when the user clicks a button.'
        },
        {
          title: '2. Error Handling in Apex for LWC (AuraHandledException)',
          body: 'Inside any <code>@AuraEnabled</code> Apex method, if you catch an exception and want LWC\'s <code>catch (error)</code> block to receive a clean, user-friendly message in <code>error.body.message</code>, throw a <code>new AuraHandledException(\'Custom error message\')</code>.'
        }
      ],
      code: {
        filename: 'InstaleapPanelController.cls & instaleapProvisioningPanel.js',
        snippet: `// 1. InstaleapPanelController.cls
public with sharing class InstaleapPanelController {
    @AuraEnabled(cacheable=true)
    public static List<Fulfillment_Center__c> getStoresByAccount(Id accountId) {
        return [
            SELECT Id, Name, City__c, Provisioning_Status__c
            FROM Fulfillment_Center__c
            WHERE Account__c = :accountId
            WITH USER_MODE
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void triggerManualProvisioning(Id accountId) {
        try {
            Account acc = new Account(Id = accountId, Onboarding_Status__c = 'Ready_to_Provision');
            update as user acc;
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}

// 2. instaleapProvisioningPanel.js
import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getStoresByAccount from '@salesforce/apex/InstaleapPanelController.getStoresByAccount';
import triggerManualProvisioning from '@salesforce/apex/InstaleapPanelController.triggerManualProvisioning';

export default class InstaleapProvisioningPanel extends LightningElement {
    @api recordId;
    @api panelTitle = 'Instaleap Dark Stores';
    stores = [];
    wiredStoresResult;
    isWorking = false;

    @wire(getStoresByAccount, { accountId: '$recordId' })
    wiredStores(result) {
        this.wiredStoresResult = result;
        if (result.data) this.stores = result.data;
    }

    async handleProvisionClick() {
        this.isWorking = true;
        try {
            await triggerManualProvisioning({ accountId: this.recordId });
            await refreshApex(this.wiredStoresResult);
            await notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Provisioning Enqueued',
                message: 'Tenant payload sent to Instaleap Core API.',
                variant: 'success'
            }));
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Provisioning Blocked',
                message: error?.body?.message || 'Unknown error',
                variant: 'error'
            }));
        } finally {
            this.isWorking = false;
        }
    }
}`
      },
      steps: [
        {
          id: 's-4-4-1',
          label: 'Deploy InstaleapPanelController and instaleapProvisioningPanel to your Org',
          detail: 'Create the controller and LWC files, run <code>sf project deploy start</code>, and drag <code>Instaleap Provisioning Panel</code> onto the <code>Account</code> Record Page.'
        }
      ]
    },
    {
      id: '4-5',
      title: 'Component Communication: CustomEvent (bubbles & composed), LMS & Streaming empApi',
      duration: 'Days 69–72',
      summary: 'Deep dive into DOM event propagation across Shadow DOM boundaries, Lightning Message Service (LMS) pub-sub channels, and real-time server push with lightning/empApi.',
      interviewTrap: 'What are the 4 combinations of { bubbles, composed } on a CustomEvent in LWC? Answer: 1) { bubbles: false, composed: false } (Default): Only the immediate parent template can listen. 2) { bubbles: true, composed: false }: Bubbles up inside the current component\'s template, but DOES NOT cross the Shadow DOM boundary! 3) { bubbles: true, composed: true }: Bubbles up AND pierces all Shadow DOM boundaries up to document (use sparingly!). 4) { bubbles: false, composed: true }: Invalid/not used.',
      concepts: [
        {
          title: '1. Child-to-Parent Events & Shadow DOM Propagation (bubbles vs. composed)',
          body: 'When a child component dispatches <code>new CustomEvent(\'storeselect\', { detail: { storeId: this.id } })</code>, both <code>bubbles</code> and <code>composed</code> default to <code>false</code>. The parent listens in HTML via <code>&lt;c-store-row onstoreselect={handleSelect}&gt;&lt;/c-store-row&gt;</code>.<br>If you have a Grandchild → Child → Parent hierarchy and want the event to bubble up through a slot or internal wrapper without crossing out of the host shadow root, use <code>{ bubbles: true, composed: false }</code>.'
        },
        {
          title: '2. Sibling / Cross-DOM Communication via Lightning Message Service (LMS)',
          body: 'When two components sit in completely separate columns of a Lightning Record Page or Utility Bar, use <strong>Lightning Message Service (LMS)</strong>:<br>1. Create <code>force-app/main/default/messageChannels/InstaleapStoreChannel.messageChannel-meta.xml</code>.<br>2. In the publisher LWC: import <code>publish, MessageContext</code> from <code>lightning/messageService</code> and call <code>publish(this.messageContext, STORE_CHANNEL, { storeId: this.id })</code>.<br>3. In the subscriber LWC: call <code>this.subscription = subscribe(this.messageContext, STORE_CHANNEL, (msg) =&gt; this.handleMessage(msg), { scope: APPLICATION_SCOPE })</code> inside <code>connectedCallback()</code> and <code>unsubscribe(this.subscription)</code> inside <code>disconnectedCallback()</code>.'
        },
        {
          title: '3. Real-Time Server-to-Browser Push in LWC (lightning/empApi)',
          body: 'How do you make an LWC table update automatically the exact second our Node.js server finishes provisioning a tenant without the user clicking Refresh?<br>Use the <strong><code>lightning/empApi</code></strong> module! It connects the browser via CometD (Bayeux protocol long-polling) directly to Salesforce\'s Event Bus to subscribe to a Platform Event (<code>/event/Tenant_Status_Changed__e</code>) or Change Data Capture channel (<code>/data/AccountChangeEvent</code>), calling <code>refreshApex()</code> as soon as the event arrives!'
        }
      ],
      code: {
        filename: 'Real-Time Server Push in LWC using lightning/empApi',
        snippet: `import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe } from 'lightning/empApi';

export default class RealtimeProvisioningMonitor extends LightningElement {
    @api recordId;
    channelName = '/data/AccountChangeEvent';
    subscription = null;

    connectedCallback() {
        subscribe(this.channelName, -1, (eventReceived) => {
            const changedIds = eventReceived?.data?.payload?.ChangeEventHeader?.recordIds || [];
            if (changedIds.includes(this.recordId)) {
                // Account was updated on the server -> refresh UI!
                this.dispatchEvent(new CustomEvent('tenantupdated'));
            }
        }).then((response) => {
            this.subscription = response;
        });
    }

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription, () => { this.subscription = null; });
        }
    }
}`
      },
      steps: [
        {
          id: 's-4-5-1',
          label: 'Master the difference between CustomEvent, LMS, and empApi',
          detail: 'Verify you can explain when to use <code>CustomEvent</code> (Child → Parent), <code>LMS</code> (Sibling LWC → Sibling LWC in browser), and <code>empApi</code> (Salesforce Server Event Bus → LWC in browser).'
        }
      ]
    },
    {
      id: '4-6',
      title: 'LWC Jest Testing, 2GP Unlocked Packages & GitHub Actions CI/CD Pipeline',
      duration: 'Days 73–84',
      summary: 'Writing local Jest unit tests for LWC (@salesforce/sfdx-lwc-jest), deployment test levels, Org-Based vs. Package-Based (2GP) deployments, and automated CI/CD.',
      interviewTrap: 'Do LWC Jest unit tests run inside your Salesforce Org or count toward the 75% Production deployment code coverage requirement? Answer: NO! LWC Jest tests run locally in Node.js (jsdom) on your machine or CI server, and the 75% Production deployment requirement applies strictly to Apex classes and triggers.',
      concepts: [
        {
          title: '1. Unit Testing LWC with Jest (@salesforce/sfdx-lwc-jest)',
          body: 'Every LWC bundle can include a <code>__tests__/</code> folder (ignored by Salesforce deployments via <code>.forceignore</code>) containing local Jest tests:<br>• You instantiate the component in a virtual DOM using <code>const element = createElement(\'c-instaleap-provisioning-panel\', { is: InstaleapProvisioningPanel }); document.body.appendChild(element);</code>.<br>• You mock <code>@wire</code> adapters and imperative Apex imports using <code>jest.mock()</code> and verify DOM updates after <code>await Promise.resolve()</code>.'
        },
        {
          title: '2. Deployment Models: Change Sets vs. Org-Based (Metadata API) vs. 2GP Unlocked Packages',
          body: '• <strong>Change Sets (Legacy UI):</strong> Point-and-click XML transfer between connected Orgs with zero Git tracking, no automated conflict resolution, and no rollback.<br>• <strong>Org-Based Deployment (`sf project deploy start`):</strong> Git repository deploys metadata directly into Sandboxes and Production. Uses <code>--test-level RunSpecifiedTests</code> for fast PR validation and <em>Quick Deploy</em>.<br>• <strong>Package-Based Deployment (Second-Generation 2GP Unlocked Packages):</strong> Divides a massive enterprise Org into modular, versioned packages (e.g., <code>instaleap-core@1.4.0</code>) built and tested inside Scratch Orgs via the Dev Hub and installed as immutable artifacts into Production.'
        }
      ],
      table: {
        headers: ['Deployment Test Level', 'What Tests Execute?', 'Allowed in Production?', 'Best Use Case'],
        rows: [
          ['NoTestRun', 'Zero tests', 'NO (Sandboxes only)', 'Fast iterative deploys to Developer / QA Sandboxes'],
          ['RunSpecifiedTests', 'Only the comma-separated test classes you specify', 'YES (requires >=75% coverage on deployed Apex)', 'Fast CI/CD PR validation & Production Quick Deploy'],
          ['RunLocalTests', 'All Org tests except installed Managed Packages', 'YES (Default in Production)', 'Full regression check on staging/release branches'],
          ['RunAllTestsInOrg', 'Every test in the Org including Managed Packages', 'YES', 'Major quarterly platform upgrades']
        ]
      },
      steps: [
        {
          id: 's-4-6-1',
          label: 'Run npm test in your instaleap-sdfc workspace to verify LWC Jest setup',
          detail: 'Check <code>package.json</code> and <code>jest.config.js</code> in your project root to see how <code>@salesforce/sfdx-lwc-jest</code> is configured.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-4',
    title: 'Block 4 Exam: LWC Architecture, LDS, Events & DevOps',
    questions: [
      {
        q: 'In an LWC lifecycle, why should you NEVER access this.template.querySelector() or read @api properties inside constructor()?',
        options: [
          'Because constructor() only runs on the server',
          'Because in constructor() the component has not been inserted into the DOM yet and public @api properties have not been populated by the parent yet',
          'Because constructor() is deprecated in LWC',
          'Because @api properties can only be read inside disconnectedCallback()'
        ],
        correct: 1,
        explanation: 'Wait until connectedCallback() to read @api properties, and wait until renderedCallback() to query rendered child DOM nodes.'
      },
      {
        q: 'What is the DML statement governor limit inside an Apex method annotated with @AuraEnabled(cacheable=true)?',
        options: [
          '150 DML statements',
          '1 DML statement',
          '0 DML statements (any DML inside a cacheable=true method immediately throws a LimitException)',
          '10,000 DML statements'
        ],
        correct: 2,
        explanation: 'Cacheable methods are strictly idempotent and read-only; Salesforce sets Limits.getLimitDmlStatements() to 0 inside @AuraEnabled(cacheable=true) methods.'
      },
      {
        q: 'Which CustomEvent configuration allows an event to bubble up through elements inside the current component\'s template WITHOUT crossing the Shadow DOM boundary?',
        options: [
          '{ bubbles: false, composed: false }',
          '{ bubbles: true, composed: false }',
          '{ bubbles: true, composed: true }',
          '{ bubbles: false, composed: true }'
        ],
        correct: 1,
        explanation: 'bubbles: true, composed: false bubbles up within the internal shadow tree while stopping at the component\'s Shadow DOM boundary.'
      },
      {
        q: 'Which deployment test level allows a 5-minute Production deployment by running only the test classes relevant to the classes being deployed?',
        options: [
          'NoTestRun',
          'RunSpecifiedTests (passing the specific test classes that cover >=75% of the deployed code)',
          'RunLocalTests',
          'RunAllTestsInOrg'
        ],
        correct: 1,
        explanation: 'RunSpecifiedTests validates only the specified test classes and unlocks Production Quick Deploy as long as >=75% coverage is achieved on all deployed Apex components.'
      }
    ]
  }
};
