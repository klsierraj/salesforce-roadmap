export const block5IntegrationArchitect = {
  id: 'block-5',
  num: '05',
  title: 'INTEGRATION & IAM ARCHITECT TRACK ($8K–$13K/MO): PATTERNS, APIS, EVENTS & OAUTH',
  weeks: 'Months 4–9 (System & Integration Architect)',
  badgeColor: '#ff5722',
  summary: 'Complete curriculum for the Salesforce Certified Integration Architect and IAM Architect credentials: the 6 Official Integration Patterns, Continuation, Named/External Credentials, Composite & Composite Graph APIs, Platform Events (__e), Change Data Capture (CDC), Pub/Sub gRPC API, Bulk API 2.0, Salesforce Connect (__x), OAuth 2.0 Flows, and SAML 2.0 SSO.',
  lessons: [
    {
      id: '5-1',
      title: 'The 6 Official Integration Patterns & Enterprise Middleware Topologies',
      duration: 'Architect Module 1',
      summary: 'How to evaluate Point-to-Point vs. Hub-and-Spoke / ESB / Event-Driven topologies, and the exact decision matrix across all 6 Salesforce Integration Patterns.',
      interviewTrap: 'In the Integration Architect exam, if a question describes Salesforce needing to orchestrate a complex multi-step transaction across 3 external legacy systems (SAP, Oracle, and Mainframe) with protocol translation (SOAP to Flat File) and guaranteed delivery retries, should you write that orchestration in Apex Queueables? Answer: NO! Never use Salesforce as an Enterprise Service Bus (ESB). Delegate multi-system orchestration, protocol translation, and retry queues to middleware (MuleSoft / AWS EventBridge / Kafka) and have Salesforce make 1 single call or publish 1 Platform Event.',
      concepts: [
        {
          title: '1. Point-to-Point vs. Middleware (ESB / API-Led Connectivity)',
          body: 'When integrating Salesforce with 1 external microservice (like our Instaleap Node.js engine), a direct <strong>Point-to-Point</strong> integration using Named Credentials + Queueable Apex is fast and cost-effective.<br>However, once an enterprise has 5+ systems (ERP, WMS, Billing, Data Warehouse, HRIS), Point-to-Point creates <code>N(N-1)/2</code> brittle connections. An <strong>Integration Architect</strong> introduces middleware (MuleSoft / Kafka / Kong) to handle:<br>• <strong>Protocol &amp; Format Translation:</strong> Converting Salesforce JSON/Platform Events into XML/SOAP/CSV/AS2.<br>• <strong>Buffering &amp; Throttling (Rate Limiting):</strong> Protecting Salesforce from exceeding its 24-hour Rolling API Request Limit or the 10-second Long-Running Concurrent Request Limit.<br>• <strong>Store-and-Forward Guaranteed Delivery:</strong> Queuing messages when an on-premise ERP goes offline for maintenance.'
        },
        {
          title: '2. Deep Breakdown of the 6 Official Salesforce Integration Patterns',
          body: '1. <strong>Remote Process Invocation — Request and Reply:</strong> Synchronous outbound call where Salesforce waits for the external system\'s response before proceeding (e.g., real-time credit check or live carrier shipping rate).<br>' +
            '2. <strong>Remote Process Invocation — Fire and Forget:</strong> Asynchronous outbound call where Salesforce hands off an event or message and immediately completes its local transaction without waiting for the target system to finish processing.<br>' +
            '3. <strong>Batch Data Synchronization:</strong> Scheduled bulk data movement (ETL) synchronizing tens of thousands or millions of rows between Salesforce and an external database/warehouse.<br>' +
            '4. <strong>Remote Call-In:</strong> An external system initiates an inbound connection into Salesforce to query, insert, update, or upsert records.<br>' +
            '5. <strong>UI Update Based on Data Changes:</strong> Pushing server-side record updates directly to an operator\'s open Salesforce browser tab without manual polling.<br>' +
            '6. <strong>Data Virtualization:</strong> Displaying and searching external data (e.g., 50M ERP invoices) inside Salesforce in real time without persisting the rows inside Salesforce storage.'
        }
      ],
      table: {
        headers: ['Official Pattern', 'Timing & Direction', 'Primary Declarative Option', 'Primary Programmatic Option'],
        rows: [
          ['1. Request & Reply', 'Sync Outbound (SF → Ext)', 'Flow HTTP Callout / External Services (OpenAPI)', 'Apex HttpRequest + Continuation (LWC/VF)'],
          ['2. Fire & Forget', 'Async Outbound (SF → Ext)', 'Platform Events (__e) / Change Data Capture / Outbound Message', 'Queueable / @future(callout=true) / EventBus.publish()'],
          ['3. Batch Data Sync', 'Bulk Scheduled (SF ↔ Ext)', 'Data Loader CLI / Middleware ETL Connector', 'Bulk API 2.0 / Batch Apex with Callouts'],
          ['4. Remote Call-In', 'Inbound (Ext → SF)', 'Standard REST / SOAP / Composite / GraphQL APIs', 'Custom Apex @RestResource / @HttpPost'],
          ['5. UI Update on Change', 'Server Push (SF → Browser)', 'Streaming Dynamic Actions', 'LWC lightning/empApi subscribed to CDC or __e'],
          ['6. Data Virtualization', 'Real-Time Read (SF → Ext)', 'Salesforce Connect (OData 2.0/4.0 External Objects __x)', 'Salesforce Connect Apex Connector Framework']
        ]
      },
      steps: [
        {
          id: 's-5-1-1',
          label: 'Master why Salesforce must never be used as an ESB for multi-system orchestration',
          detail: 'Verify you can explain how middleware protects Salesforce\'s 24-hour API limits and handles protocol translation and store-and-forward retries.'
        }
      ]
    },
    {
      id: '5-2',
      title: 'Outbound Mastery: Continuation (Long-Running Callouts), Named Credentials, mTLS & Outbound Messaging',
      duration: 'Architect Module 2',
      summary: 'How to avoid the "Concurrent Long-Running Apex Limit (10 requests > 5s)" using Continuation, Named Credentials + External Credentials architecture, Mutual TLS, and SOAP Outbound Messaging.',
      interviewTrap: 'Hardcore Architect Limit Trap: "What is the Concurrent Long-Running Apex Request Limit in Salesforce, and how do you avoid hitting it when an LWC makes a synchronous HTTP Callout that takes 8 seconds to return?" Answer: An Org can have at most 10 synchronous Apex requests running simultaneously for more than 5 seconds! If an 11th user triggers a slow synchronous callout, they crash with "Unable to Process Request: Concurrent requests limit exceeded". Fix: Use an @AuraEnabled(continuation=true) method returning a Continuation object! Continuation releases the Apex application thread while waiting for the HTTP response and does NOT count against the 10 concurrent long-running request limit!',
      concepts: [
        {
          title: '1. The 10 Concurrent Long-Running Request Limit & Apex Continuation',
          body: 'In a normal synchronous <code>@AuraEnabled</code> Apex callout, the Salesforce application thread stays blocked while waiting for the external server to respond (up to 120s). If an external API slows down and takes >5 seconds, and 10 users click a button at the same time, the entire Org hits the <strong>10 Concurrent Long-Running Apex Limit</strong>!<br><strong>The Architect Solution (`Continuation`):</strong><br>• Mark your LWC controller method with <code>@AuraEnabled(continuation=true cacheable=true)</code>.<br>• Instead of calling <code>new Http().send(req)</code>, instantiate <code>Continuation con = new Continuation(40);</code> (timeout in seconds), set <code>con.continuationMethod = \'processResponse\';</code>, add your <code>HttpRequest</code> via <code>con.addHttpRequest(req);</code>, and return <code>con</code>.<br>• Salesforce suspends the request on a dedicated non-blocking I/O server (up to 3 parallel callouts per Continuation) and invokes your static callback method <code>processResponse(List&lt;String&gt; labels, Object state)</code> only when the HTTP response arrives!'
        },
        {
          title: '2. Modern Named Credentials + External Credentials & Mutual TLS (mTLS)',
          body: 'Never store API URLs, client secrets, or bearer tokens in Custom Metadata or Apex strings. Modern Salesforce separates outbound security into two metadata objects:<br>1. <strong>External Credential:</strong> Defines the authentication protocol (OAuth 2.0 Client Credentials, JWT Bearer, AWS Signature v4, or Custom Header/API Key) and links to Permission Sets so only authorized users/classes can use the credential.<br>2. <strong>Named Credential:</strong> Defines the base URL (e.g., <code>https://api.instaleap.io</code>), references the External Credential, and optionally attaches a <strong>Mutual TLS (mTLS) Client Certificate</strong> (so both Salesforce and the external firewall cryptographically verify each other\'s X.509 certificates during the TLS handshake).'
        },
        {
          title: '3. Declarative Outbound Messaging (SOAP with Built-in 24-Hour Retry Queue)',
          body: 'When an interviewer asks: <em>"What is the ONLY 100% declarative outbound integration feature that includes an automatic built-in 24-hour exponential backoff retry queue if the external endpoint is down?"</em><br>The answer is <strong>Outbound Messaging</strong> (invoked from a Record-Triggered Flow Action)! Salesforce sends a SOAP XML payload (optionally including a Session ID for callback) to the external listener and expects an XML <code>&lt;Ack&gt;true&lt;/Ack&gt;</code> response. If the endpoint does not return <code>true</code>, Salesforce automatically retries delivery with exponential backoff for up to <strong>24 hours</strong>!'
        }
      ],
      code: {
        filename: 'Non-Blocking LWC Callout Using Apex Continuation',
        snippet: `public with sharing classLiveRateContinuationController {
    @AuraEnabled(continuation=true)
    public static Object startRateRequest(String city) {
        // 40-second timeout; does NOT hold a synchronous Apex thread!
        Continuation con = new Continuation(40);
        con.continuationMethod = 'handleRateResponse';
        con.state = city;

        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint('callout:Instaleap_Core_API/api/v1/rates?city=' + EncodingUtil.urlEncode(city, 'UTF-8'));
        con.addHttpRequest(req);
        return con;
    }

    @AuraEnabled
    public static Map<String, Object> handleRateResponse(List<String> labels, Object state) {
        HttpResponse res = Continuation.getResponse(labels[0]);
        if (res.getStatusCode() == 200) {
            return (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        }
        throw new AuraHandledException('External rate service error: ' + res.getStatusCode());
    }
}`
      },
      steps: [
        {
          id: 's-5-2-1',
          label: 'Master the 10 Concurrent Long-Running Request Limit (5s) and Continuation',
          detail: 'Verify you can explain why <code>Continuation</code> is the mandatory Architect pattern when LWC components make synchronous HTTP callouts that could take longer than 5 seconds.'
        }
      ]
    },
    {
      id: '5-3',
      title: 'Inbound REST Architecture at Scale: Composite API, Composite Graph, SObject Tree & Collections',
      duration: 'Architect Module 3',
      summary: 'How external backends (like our Node.js service) insert/update complex parent-child hierarchies in 1 network round-trip using SObject Collections, SObject Tree, Composite API (25), and Composite Graph (500).',
      interviewTrap: 'An external ERP wants to insert an Account, 2 Contacts, an Opportunity, and 3 OpportunityLineItems into Salesforce in a single HTTP request with all-or-none transactional rollback, without writing any custom Apex @RestResource code. Which standard API should you recommend? Answer: The Composite API (/services/data/v62.0/composite, up to 25 subrequests with @{refAccount.id} reference variables and allOrNone: true) or Composite Graph API (up to 500 subrequests across complex hierarchies)!',
      concepts: [
        {
          title: '1. Standard REST API vs. SObject Collections vs. SObject Tree',
          body: 'When an external backend calls into Salesforce (<em>Remote Call-In</em>), making 1 HTTP request per record wastes network latency and burns the 24-hour API limit. Use Salesforce\'s built-in batching endpoints instead:<br>' +
            '• <strong>SObject Collections API (<code>/services/data/v62.0/composite/sobjects</code>):</strong> Inserts, updates, upserts, or deletes up to <strong>200 records</strong> of different object types in a single HTTP request with an <code>allOrNone</code> boolean flag.<br>' +
            '• <strong>SObject Tree API (<code>/services/data/v62.0/composite/tree/Account</code>):</strong> Inserts one root object type along with its nested child records (up to <strong>5 levels deep</strong> and up to <strong>200 total records</strong>) in a single JSON tree payload.'
        },
        {
          title: '2. Composite API (25 Subrequests) vs. Composite Graph API (500 Subrequests)',
          body: '• <strong>Composite API (<code>POST /services/data/v62.0/composite</code>):</strong> Executes up to <strong>25 sequential REST API subrequests</strong> (of which up to 5 can be GET/SOQL queries) inside a single HTTP call. You assign each subrequest a <code>referenceId</code> (e.g., <code>"refAcc"</code>) and pass its generated ID into the next subrequest using <code>"AccountId": "@{refAcc.id}"</code>! Setting <code>"allOrNone": true</code> wraps all 25 subrequests in an atomic transaction.<br>' +
            '• <strong>Composite Graph API (<code>POST /services/data/v62.0/composite/graph</code>):</strong> Scales the Composite pattern up to <strong>500 subrequests</strong> and up to <strong>15 levels deep</strong> in a single HTTP call!'
        }
      ],
      table: {
        headers: ['Inbound REST Endpoint', 'Max Records / Subrequests', 'Max Hierarchy Depth', 'Supports GET + POST + PATCH Mix?'],
        rows: [
          ['Standard SObject REST', '1 record per HTTP call', '1', '1 verb per call'],
          ['SObject Collections (/composite/sobjects)', 'Up to 200 records', 'Flat list (no auto parent ref)', 'Homogeneous verb (POST/PATCH/DELETE)'],
          ['SObject Tree (/composite/tree/:Object)', 'Up to 200 total records', 'Up to 5 levels deep', 'Insert (POST) only'],
          ['Composite API (/composite)', 'Up to 25 subrequests (max 5 queries)', 'Sequential @{ref.id} chaining', 'YES (GET, POST, PATCH, DELETE)'],
          ['Composite Graph (/composite/graph)', 'Up to 500 subrequests', 'Up to 15 levels deep', 'YES (POST, PATCH, DELETE, GET)']
        ]
      },
      code: {
        filename: 'Composite API Payload (Creating Account + Child Store in 1 Atomic HTTP Call)',
        snippet: `// POST /services/data/v62.0/composite
{
  "allOrNone": true,
  "compositeRequest": [
    {
      "method": "POST",
      "url": "/services/data/v62.0/sobjects/Account",
      "referenceId": "newAccount",
      "body": {
        "Name": "Exito Colombia S.A.",
        "Onboarding_Status__c": "Prospect"
      }
    },
    {
      "method": "POST",
      "url": "/services/data/v62.0/sobjects/Fulfillment_Center__c",
      "referenceId": "newStore1",
      "body": {
        "Name": "Exito Country Bogota",
        "City__c": "Bogota",
        "Account__c": "@{newAccount.id}"
      }
    }
  ]
}`
      },
      steps: [
        {
          id: 's-5-3-1',
          label: 'Memorize the 25-subrequest limit of Composite API vs. 500 of Composite Graph',
          detail: 'Verify you can explain how <code>"@{newAccount.id}"</code> links child records to parent records inside a single Composite API transaction.'
        }
      ]
    },
    {
      id: '5-4',
      title: 'Event-Driven Architecture: Platform Events (__e) & Change Data Capture (CDC) Internals',
      duration: 'Architect Module 4',
      summary: 'Deep dive into Platform Event schemas, Publish After Commit vs. Publish Immediately, ReplayId retention (72 hours), Automated Process trigger context, and CDC payload headers.',
      interviewTrap: 'When an Apex Trigger subscribes to a Platform Event (trigger TenantEventTrigger on Tenant_Provisioned__e (after insert)), which user executes that trigger, and what is the maximum batch size of Trigger.new? Answer: 1) It runs under the special "Automated Process" system user (unless overridden via PlatformEventSubscriberConfig metadata), and 2) Unlike standard object triggers (where max batch size is 200), a Platform Event trigger can receive up to 2,000 event messages in a single Trigger.new batch!',
      concepts: [
        {
          title: '1. Platform Events (__e) Architecture & Constraints',
          body: 'A <strong>Platform Event</strong> (API suffix <code>__e</code>) is an immutable message published to the Salesforce Event Bus:<br>• <strong>Append-Only / Immutable:</strong> You can ONLY <code>insert</code> (via <code>EventBus.publish()</code>) into a <code>__e</code> object. You can NEVER query it with SOQL, update it, or delete it.<br>• <strong>Supported Field Types Only:</strong> Text, Text Area (Long), Number, Date, Date/Time, and Checkbox (no Lookups or Formulas!).<br>• <strong>Publish Behavior:</strong><br>&nbsp;&nbsp;– <code>Publish After Commit</code>: Waits for the database transaction to succeed before putting the event on the bus. If the transaction rolls back, the event is discarded.<br>&nbsp;&nbsp;– <code>Publish Immediately</code>: Publishes the event to the bus immediately in an independent transaction—even if the caller throws an exception and rolls back! (Ideal for error/audit logging).<br>• <strong>Platform Event Trigger Batch Size (2,000) &amp; Retry (`EventBus.RetryableException`):</strong> A Platform Event trigger only supports <code>after insert</code> and processes up to <strong>2,000 events at once</strong>. If a temporary error occurs, throw <code>new EventBus.RetryableException(\'Retry later\')</code> (retries up to 9 times), or call <code>EventBus.TriggerContext.currentContext().setResumeCheckpoint(event.ReplayId)</code> to checkpoint progress and avoid failing the whole 2,000-event batch!'
        },
        {
          title: '2. Change Data Capture (CDC) Internals & Payload Structure',
          body: '<strong>Change Data Capture (CDC)</strong> publishes automatic real-time change events (<code>AccountChangeEvent</code>, <code>Fulfillment_Center__ChangeEvent</code>) whenever a record is Created, Updated, Deleted, or Undeleted:<br>• Enabled declaratively in <em>Setup → Integrations → Change Data Capture</em> (up to 5 objects included free in base Performance/Enterprise licenses; unlimited with add-on).<br>• Every CDC message includes a <code>ChangeEventHeader</code> containing <code>entityName</code>, <code>recordIds</code>, <code>changeType</code> (<code>CREATE</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>UNDELETE</code>, <code>GAP_UPDATE</code>), <code>changedFields</code>, and <code>commitUser</code>, plus the new values of only the fields that actually changed.<br>• <strong>72-Hour Replay Window:</strong> Both Platform Events and CDC store events on the bus for <strong>72 hours (3 days)</strong> identified by an incrementing <code>ReplayId</code>. If an external Node.js consumer crashes for 4 hours, it reconnects passing its last processed <code>ReplayId</code> (or <code>-2</code> to replay all events from the last 72 hours; <code>-1</code> for new events only).'
        }
      ],
      table: {
        headers: ['Dimension', 'Platform Events (__e)', 'Change Data Capture (CDC)', 'Outbound Messaging (SOAP)'],
        rows: [
          ['Schema Definition', 'Custom fields defined by you', 'Auto-generated from SObject schema', 'Selected fields from triggering SObject'],
          ['How It Is Published', 'EventBus.publish(), Flow, or REST API', 'Automatically by DB kernel on DML commit', 'Triggered by Flow Action'],
          ['Delivery Model', 'Pub/Sub (1 event → N subscribers)', 'Pub/Sub (1 change → N subscribers)', 'Point-to-Point SOAP push to 1 URL'],
          ['Bus Retention / Replay', '72 hours via ReplayId (-2 or specific ID)', '72 hours via ReplayId (-2 or specific ID)', '24-hour automatic retry queue'],
          ['Trigger Batch Size', 'Up to 2,000 events (after insert only)', 'Up to 2,000 events (Async Apex Trigger)', 'N/A']
        ]
      },
      code: {
        filename: 'Publishing & Checkpointing Platform Events (__e) in Apex',
        snippet: `// 1. Publishing a Platform Event from Apex
List<Tenant_Provisioned__e> events = new List<Tenant_Provisioned__e>{
    new Tenant_Provisioned__e(
        Account_Id__c = '001g7000016YBFmAAO',
        Core_Tenant_UUID__c = '0ed78407-e76f-4cfc-838c-4c2f1164e15d',
        Status__c = 'ACTIVE'
    )
};
List<Database.SaveResult> results = EventBus.publish(events);

// 2. Resuming from a Checkpoint inside a 2,000-event Platform Event Trigger
trigger TenantProvisionedTrigger on Tenant_Provisioned__e (after insert) {
    for (Tenant_Provisioned__e evt : Trigger.new) {
        if (Limits.getQueries() >= 90) {
            // Stop here; Salesforce will re-fire the trigger starting right after this ReplayId!
            break;
        }
        // Process event...
        EventBus.TriggerContext.currentContext().setResumeCheckpoint(evt.ReplayId);
    }
}`
      },
      steps: [
        {
          id: 's-5-4-1',
          label: 'Master ReplayId (-1 vs -2), setResumeCheckpoint, and EventBus.RetryableException',
          detail: 'Verify you can explain how a Platform Event trigger handles batches of 2,000 events safely using <code>setResumeCheckpoint(evt.ReplayId)</code>.'
        }
      ]
    },
    {
      id: '5-5',
      title: 'High-Scale Data Movement & Virtualization: Pub/Sub gRPC API, Bulk API 2.0 & Salesforce Connect (__x)',
      duration: 'Architect Module 5',
      summary: 'Why the gRPC Pub/Sub API replaced CometD for external microservices, Bulk API 2.0 Ingest & Query jobs, PK Chunking, and Data Virtualization with External Objects (__x).',
      interviewTrap: 'When should an Architect choose Salesforce Connect (External Objects __x) instead of Bulk API 2.0 replication? Answer: Choose Salesforce Connect when: 1) The external dataset is massive (e.g., 100M ERP order lines) and users only view a tiny fraction on-demand, 2) Data must always be 100% real-time without sync lag, and 3) You do NOT need native Salesforce Sharing Rules, Master-Detail relationships, or complex Triggers on the external rows.',
      concepts: [
        {
          title: '1. Pub/Sub API (gRPC + HTTP/2 + Apache Avro)',
          body: 'Historically, external servers subscribed to Platform Events and CDC using CometD (JSON over HTTP long-polling), which lacked flow control and required separate REST calls to publish events.<br>Today, Salesforce\'s official standard for external backend event streaming is the <strong>Pub/Sub API</strong>:<br>• Built on <strong>gRPC and HTTP/2</strong> with binary <strong>Apache Avro</strong> serialization (10x smaller payloads than JSON).<br>• Provides <strong>bidirectional streaming</strong> (a single connection can both subscribe to CDC/Platform Events and publish events back into Salesforce).<br>• Includes <strong>pull-based flow control</strong>: your Node.js worker requests exactly <code>num_requested = 100</code> events at a time so a spike of 500,000 Salesforce updates never overwhelms your external microservice\'s memory!'
        },
        {
          title: '2. Bulk API 2.0 Internals (Ingest & Bulk Query)',
          body: 'When moving >50,000 to 50,000,000 records in or out of Salesforce:<br>• <strong>Bulk API 2.0 Ingest:</strong><br>&nbsp;&nbsp;1. <code>POST /services/data/v62.0/jobs/ingest</code> (specify <code>object</code>, <code>operation: "upsert"</code>, <code>externalIdFieldName</code>).<br>&nbsp;&nbsp;2. <code>PUT /services/data/v62.0/jobs/ingest/{jobId}/batches</code> (stream raw CSV data up to 150 MB per job).<br>&nbsp;&nbsp;3. <code>PATCH .../jobs/ingest/{jobId}</code> with <code>{"state": "UploadComplete"}</code> — Salesforce automatically slices the CSV into 2,000-row internal chunks and processes them asynchronously.<br>&nbsp;&nbsp;4. Retrieve <code>/successfulResults</code> and <code>/failedResults</code> CSVs.<br>• <strong>Bulk API 2.0 Query:</strong> Asynchronously extracts millions of rows to CSV using automatic cursor chunking.'
        },
        {
          title: '3. Data Virtualization: Salesforce Connect & External Objects (__x)',
          body: '<strong>External Objects (<code>__x</code>)</strong> look like custom objects in tabs, related lists, SOQL, and reports, but store <strong>0 rows inside Salesforce</strong>:<br>• <strong>Adapters:</strong> <em>OData 2.0 / 4.0 Adapter</em>, <em>Cross-Org Adapter</em> (connects two Salesforce Orgs natively), <em>Amazon DynamoDB / Athena Adapters</em>, or a custom <em>Apex Connector Framework</em> class (<code>DataSource.Connection</code>).<br>• <strong>Indirect Lookup Relationship:</strong> Links an External Object (<code>ERP_Invoice__x</code>) to a Standard/Custom Object (<code>Account</code>) by matching an external column against an <strong>External ID + Unique</strong> field on <code>Account</code> (like our <code>Core_Tenant_Id__c</code>!).'
        }
      ],
      table: {
        headers: ['Relationship Type for External Objects (__x)', 'Parent Object', 'Child Object', 'Matching Key Used'],
        rows: [
          ['Lookup Relationship', 'Standard or Custom (Account)', 'External Object (Order__x)', '18-char Salesforce Id stored in the external DB'],
          ['External Lookup Relationship', 'External Object (Order__x)', 'Standard, Custom, or __x', 'ExternalId standard field on the parent __x object'],
          ['Indirect Lookup Relationship', 'Standard or Custom (Account)', 'External Object (Order__x)', 'Custom External ID + Unique field on Account (Core_Tenant_Id__c)']
        ]
      },
      steps: [
        {
          id: 's-5-5-1',
          label: 'Master the 3 Lookup types for External Objects (__x): Lookup, External Lookup, and Indirect Lookup',
          detail: 'This 3-row table is a guaranteed question on both the Integration Architect and Data Architect exams. Memorize when <strong>Indirect Lookup</strong> is used!'
        }
      ]
    },
    {
      id: '5-6',
      title: 'Identity & Access Management (IAM Architect): OAuth 2.0 Flows, SAML 2.0 SSO & OIDC',
      duration: 'Architect Module 6',
      summary: 'Complete architectural blueprint of all OAuth 2.0 flows (Web Server + PKCE, JWT Bearer, Device, Asset Token), SAML 2.0 (IdP-Initiated vs. SP-Initiated), My Domain, and Delegated Authentication.',
      interviewTrap: 'IAM Architect Exam Classic: "What is the difference between SAML 2.0 Single Sign-On and Delegated Authentication?" Answer: In SAML 2.0 SSO, the user never enters their password into Salesforce; the Identity Provider (Okta/Entra ID) authenticates the user and sends a signed XML SAML Assertion to Salesforce. In Delegated Authentication, the user types their username and password into the Salesforce login page, and Salesforce makes a synchronous outbound SOAP callout wrapping the credentials to the company\'s internal auth web service returning a boolean true/false.',
      concepts: [
        {
          title: '1. Deep Dive into the 5 OAuth 2.0 Flows in Salesforce',
          body: '1. <strong>OAuth 2.0 Web Server Flow (Authorization Code Grant + PKCE):</strong><br>&nbsp;&nbsp;– <em>Use Case:</em> Web applications with a secure backend where a human user logs in interactively.<br>&nbsp;&nbsp;– <em>Mechanism:</em> Redirects browser to <code>/services/oauth2/authorize</code> → User approves → Redirects back with short-lived <code>code</code> → Backend exchanges <code>code</code> + <code>client_secret</code> + <code>code_verifier</code> at <code>/services/oauth2/token</code> for an <code>access_token</code> and <code>refresh_token</code>.<br>' +
            '2. <strong>OAuth 2.0 JWT Bearer Token Flow (RFC 7523):</strong><br>&nbsp;&nbsp;– <em>Use Case:</em> <strong>Headless Server-to-Server integrations</strong> (Node.js/Python/MuleSoft cron jobs or event workers with zero human interaction).<br>&nbsp;&nbsp;– <em>Mechanism:</em> You upload an X.509 public certificate to the Salesforce Connected App / External Client App and pre-authorize the Integration User\'s Profile/Permission Set. Your Node.js server constructs a JSON Web Token (<code>iss</code> = Client ID, <code>sub</code> = SF Username, <code>aud</code> = <code>https://login.salesforce.com</code>, <code>exp</code> = +3 min), signs it with your RSA private key, and POSTs it to <code>/services/oauth2/token</code> with <code>grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer</code>. Returns an <code>access_token</code> (never returns a <code>refresh_token</code>).<br>' +
            '3. <strong>OAuth 2.0 Client Credentials Flow:</strong> Headless Server-to-Server flow supported in External Client Apps / Connected Apps exchanging <code>client_id</code> + <code>client_secret</code> mapped to a designated Run-As Integration User.<br>' +
            '4. <strong>OAuth 2.0 Device Flow:</strong> For CLI tools or smart TVs without a full browser; displays a short verification code the user types on their phone/laptop.<br>' +
            '5. <strong>OAuth 2.0 Asset Token Flow:</strong> Binds an OAuth token to an IoT hardware device registered as a Salesforce <code>Asset</code> record.'
        },
        {
          title: '2. Single Sign-On (SSO): SAML 2.0 (SP-Initiated vs. IdP-Initiated) & Just-In-Time (JIT) Provisioning',
          body: '• <strong>Identity Provider (IdP):</strong> The system that owns user credentials (e.g., Okta, Microsoft Entra ID / Azure AD, PingFederate).<br>• <strong>Service Provider (SP):</strong> Salesforce (requires <strong>My Domain</strong> to be deployed).<br>• <strong>IdP-Initiated Login:</strong> User logs into their Okta dashboard and clicks the Salesforce tile → Okta HTTP POSTs a signed XML <strong>SAML Assertion</strong> containing the user\'s <strong>Federation ID</strong> directly to Salesforce\'s ACS (Assertion Consumer Service) URL.<br>• <strong>SP-Initiated Login:</strong> User navigates directly to <code>https://company.my.salesforce.com</code> → Salesforce redirects browser with a <code>SAMLRequest</code> to Okta → User authenticates in Okta → Okta POSTs the signed <code>SAMLResponse</code> back to Salesforce.<br>• <strong>Just-In-Time (JIT) Provisioning:</strong> If a new employee logs in via SAML SSO and their User record does not exist in Salesforce yet, Salesforce automatically creates (or updates) their <code>User</code>, <code>Contact</code>, and <code>Account</code> record on the fly using attributes inside the SAML assertion (or customizes it via a <code>SamlJitHandler</code> Apex class).'
        }
      ],
      code: {
        filename: 'Node.js Headless Server-to-Server Auth via OAuth 2.0 JWT Bearer Flow',
        snippet: `import jwt from 'jsonwebtoken';
import fs from 'fs';

// 1. Sign JWT assertion using RSA Private Key matching X.509 cert in Salesforce Connected App
const privateKey = fs.readFileSync('./certs/server.key', 'utf8');
const assertion = jwt.sign(
  {
    iss: process.env.SF_CLIENT_ID,               // Connected App Consumer Key
    sub: 'integration@instaleap.sfdc',           // Pre-authorized SF Username
    aud: 'https://login.salesforce.com',         // Use test.salesforce.com for Sandboxes
    exp: Math.floor(Date.now() / 1000) + 180     // Expires in 3 minutes
  },
  privateKey,
  { algorithm: 'RS256' }
);

// 2. Exchange signed JWT for a Salesforce access_token (Zero human interaction!)
const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion
  })
});
const { access_token, instance_url } = await response.json();`
      },
      steps: [
        {
          id: 's-5-6-1',
          label: 'Master JWT Bearer Flow vs. Web Server Flow and SP-Initiated vs. IdP-Initiated SAML',
          detail: 'Review the Node.js JWT Bearer code above—this exact pattern is tested heavily on both the Integration Architect and IAM Architect exams.'
        }
      ]
    }
  ],
  exam: {
    id: 'exam-5',
    title: 'Block 5 Exam: Integration & IAM Architect Mastery',
    questions: [
      {
        q: 'An LWC component makes a synchronous @AuraEnabled Apex HTTP Callout to an external pricing engine that takes 7 seconds to respond. When 12 users click the button simultaneously, users receive "Concurrent requests limit exceeded". How should an Integration Architect fix this?',
        options: [
          'Change the class to without sharing',
          'Refactor the method to use @AuraEnabled(continuation=true) returning a Continuation object so the callout runs on Salesforce\'s non-blocking Continuation server without holding synchronous Apex threads',
          'Increase the timeout to 120 seconds',
          'Move the callout into a Before-Save trigger'
        ],
        correct: 1,
        explanation: 'Salesforce enforces a hard org-wide limit of 10 concurrent synchronous Apex requests lasting longer than 5 seconds. Continuation offloads the HTTP wait to a non-blocking server and does not count toward the 10-request limit.'
      },
      {
        q: 'Which standard Salesforce API allows an external Node.js service to insert a parent Account, 2 child Contacts, and 3 child Fulfillment Centers in a SINGLE HTTP request with automatic @{referenceId.id} resolution and allOrNone transactional rollback?',
        options: [
          'Bulk API 2.0 Query',
          'Composite API (/services/data/v62.0/composite) or Composite Graph API',
          'Streaming API (CometD)',
          'Outbound Messaging'
        ],
        correct: 1,
        explanation: 'Composite API (up to 25 subrequests) and Composite Graph API (up to 500 subrequests) execute chained dependent operations using @{ref.id} inside one atomic transaction.'
      },
      {
        q: 'When linking an External Object (ERP_Order__x) as a child of the standard Account object by matching on a custom External ID field (Core_Tenant_Id__c) rather than the 18-character Salesforce Id, which relationship type must you create?',
        options: [
          'Master-Detail Relationship',
          'External Lookup Relationship',
          'Indirect Lookup Relationship',
          'Hierarchical Relationship'
        ],
        correct: 2,
        explanation: 'An Indirect Lookup Relationship links a child External Object (__x) to a parent Standard/Custom Object using a custom Unique + External ID field on the parent.'
      },
      {
        q: 'Why does the OAuth 2.0 JWT Bearer Token Flow NEVER return a refresh_token in its response?',
        options: [
          'Because JWT tokens never expire',
          'Because it is a headless Server-to-Server flow where the client holds the RSA private key and simply signs a brand-new JWT assertion whenever a new access_token is needed',
          'Because refresh tokens only work with SOAP APIs',
          'Because you forgot to request the full scope'
        ],
        correct: 1,
        explanation: 'In the JWT Bearer Flow, the server authenticates autonomously using its private key, eliminating the need for a long-lived refresh_token.'
      }
    ]
  }
};
