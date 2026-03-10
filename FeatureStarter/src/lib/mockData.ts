import type { Category } from './categories';
import type { FeatureWithVotes, FeatureStatus } from './features';

const IMG = 'https://iylihysvbwlyrmcedsaj.supabase.co/storage/v1/object/public/category-images';

/** Returns an ISO date string for `n` days before 2026-03-09 */
function daysAgo(n: number): string {
  const base = new Date('2026-03-09T12:00:00Z');
  base.setDate(base.getDate() - n);
  return base.toISOString();
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1', name: 'Productivity',
    description: 'Tools and features to boost your daily workflow',
    image: `${IMG}/productivity.jpg`, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-2', name: 'AI & Machine Learning',
    description: 'Smart features powered by artificial intelligence',
    image: `${IMG}/ai-machine-learning.jpg`, created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'cat-3', name: 'Design Tools',
    description: 'Creative tools for designers and visual thinkers',
    image: `${IMG}/design-tools.jpg`, created_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 'cat-4', name: 'Developer Experience',
    description: 'Improve the developer workflow and tooling',
    image: `${IMG}/developer-experience.jpg`, created_at: '2026-01-04T00:00:00Z',
  },
  {
    id: 'cat-5', name: 'Mobile Apps',
    description: 'Features for native and cross-platform mobile development',
    image: `${IMG}/mobile-apps.jpg`, created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'cat-6', name: 'Cloud Infrastructure',
    description: 'Scalable cloud services and deployment tools',
    image: `${IMG}/cloud-infrastructure.jpg`, created_at: '2026-01-06T00:00:00Z',
  },
  {
    id: 'cat-7', name: 'Security & Privacy',
    description: 'Keep your data and users safe',
    image: `${IMG}/security-privacy.jpg`, created_at: '2026-01-07T00:00:00Z',
  },
  {
    id: 'cat-8', name: 'Data Analytics',
    description: 'Insights, dashboards, and data visualization',
    image: `${IMG}/data-analytics.jpg`, created_at: '2026-01-08T00:00:00Z',
  },
  {
    id: 'cat-9', name: 'Social Features',
    description: 'Community, sharing, and collaboration tools',
    image: `${IMG}/social-features.jpg`, created_at: '2026-01-09T00:00:00Z',
  },
  {
    id: 'cat-10', name: 'Accessibility',
    description: 'Make your product usable by everyone',
    image: `${IMG}/accessibility.jpg`, created_at: '2026-01-10T00:00:00Z',
  },
];

function f(
  id: string, catId: string, title: string, desc: string,
  up: number, down: number,
  status: FeatureStatus = 'requested',
  rationale: string = '',
  createdAt: string = '2026-01-15T00:00:00Z',
): FeatureWithVotes {
  return {
    id, title, description: desc, rationale, status, voter_id: 'system', category_id: catId,
    created_at: createdAt,
    upvotes_count: up, downvotes_count: down, score: up - down, my_vote: 0,
  };
}

export const MOCK_FEATURES: Record<string, FeatureWithVotes[]> = {
  'cat-1': [
    f('f1-1','cat-1','Keyboard shortcuts for common actions','Add customizable keyboard shortcuts to speed up repetitive tasks.',24,3,'requested','Power users waste significant time reaching for the mouse on repetitive tasks. Customizable keyboard shortcuts let them stay in flow and complete common actions 2–3x faster.',daysAgo(1)),
    f('f1-2','cat-1','Focus mode with notification blocking','A distraction-free mode that silences non-critical notifications.',32,1,'in_progress','Context switching from notifications destroys deep work sessions. A focus mode that blocks non-critical interruptions helps users reclaim unbroken blocks of productive time.',daysAgo(4)),
    f('f1-3','cat-1','Daily summary email digest','Automated email summarizing activity and pending tasks each morning.',15,7,'requested','Teams lose track of what happened while they were heads-down working. A concise morning digest lets users catch up on activity and plan their day in under two minutes.',daysAgo(7)),
    f('f1-4','cat-1','Quick-add widget for tasks','A floating widget to capture tasks without switching context.',20,2,'requested','Capturing a task idea requires switching apps and losing the current context. A floating widget lets users log tasks instantly without leaving what they are doing.',daysAgo(10)),
    f('f1-5','cat-1','Pomodoro timer integration','Built-in work/break timer following the Pomodoro technique.',18,5,'requested','Many users follow time-boxing techniques but rely on separate apps to manage them. A built-in Pomodoro timer reduces tool-switching and keeps the entire workflow in one place.',daysAgo(13)),
    f('f1-6','cat-1','Smart task prioritization','Automatically re-order tasks based on due date and importance.',27,4,'requested','Manual sorting of large task lists is tedious and often neglected. AI-driven reordering based on urgency and importance ensures critical work rises to the top automatically.',daysAgo(16)),
    f('f1-7','cat-1','Calendar sync','Two-way sync with Google Calendar and Outlook.',35,3,'shipped','Deadlines and events split across multiple apps create missed commitments. Two-way calendar sync means tasks and events stay aligned without manual duplication.',daysAgo(19)),
    f('f1-8','cat-1','Template library for recurring workflows','Pre-built templates for common project types and workflows.',12,1,'requested','Teams re-create the same project structure from scratch every time. A template library eliminates setup overhead and ensures consistent starting points for recurring workflows.',daysAgo(22)),
    f('f1-9','cat-1','Batch actions on multiple items','Select and move, tag, or archive many items at once.',22,6,'requested','Acting on dozens of items one-by-one is time-consuming and frustrating. Batch operations let users move, tag, or archive large sets of items in a single gesture.',daysAgo(25)),
    f('f1-10','cat-1','Global search across all workspaces','Search notes, tasks, and files from one unified search bar.',40,2,'requested','Finding anything across multiple workspaces requires knowing exactly where it lives. A unified search bar gives users instant access to any note, task, or file from one place.',daysAgo(28)),
  ],
  'cat-2': [
    f('f2-1','cat-2','Smart auto-categorization','Use ML to automatically categorize incoming items based on content.',41,5,'requested','Manually tagging and sorting incoming content is a constant chore that slows users down. ML-based auto-categorization keeps inboxes organized without any user effort.',daysAgo(2)),
    f('f2-2','cat-2','Natural language search','Search using plain English queries instead of exact keywords.',28,2,'requested','Keyword-based search fails when users cannot remember exact terminology. Natural language queries let users find content the way they would describe it to a colleague.',daysAgo(5)),
    f('f2-3','cat-2','AI-powered writing assistant','Suggest edits, grammar fixes, and tone improvements inline.',36,8,'requested','Writers spend significant time on grammar and tone corrections that could be flagged automatically. Inline AI suggestions accelerate editing and raise the quality floor for all written content.',daysAgo(8)),
    f('f2-4','cat-2','Predictive text completion','Context-aware text predictions as you type.',19,3,'requested','Typing repetitive phrases and common patterns takes time that adds up across a workday. Context-aware completions reduce keystrokes and let users write faster without sacrificing accuracy.',daysAgo(11)),
    f('f2-5','cat-2','Automated meeting notes','Transcribe and summarize meetings in real time.',44,4,'in_progress','Manual note-taking during meetings means participants cannot focus fully on the discussion. Real-time transcription and summarization frees everyone to be present while still capturing all decisions.',daysAgo(14)),
    f('f2-6','cat-2','Sentiment analysis on feedback','Tag user feedback as positive, negative, or neutral automatically.',14,6,'requested','Reading through hundreds of feedback submissions to gauge overall sentiment is time-consuming. Automatic sentiment tagging surfaces patterns instantly and lets teams prioritize the most critical responses.',daysAgo(17)),
    f('f2-7','cat-2','Smart duplicate detection','Flag potential duplicate entries before they are created.',23,2,'requested','Duplicate entries cause data quality issues and user confusion that are hard to clean up later. Proactive duplicate flagging prevents the problem at the point of creation.',daysAgo(20)),
    f('f2-8','cat-2','Image recognition for uploads','Auto-tag and describe uploaded images using vision models.',17,5,'requested','Uploaded images are unsearchable without manual labeling, creating a dark archive of visual content. Vision-based auto-tagging makes images as discoverable as any text document.',daysAgo(23)),
    f('f2-9','cat-2','Anomaly detection in metrics','Alert when key metrics deviate from expected patterns.',31,3,'requested','Unusual spikes or drops in key metrics often go unnoticed until they cause serious problems. Automated anomaly alerts give teams early warning so they can investigate before the situation escalates.',daysAgo(26)),
    f('f2-10','cat-2','AI chatbot for user support','An in-app chatbot that answers common questions instantly.',38,9,'requested','Support ticket volume for common questions strains the team and creates wait times for users. An in-app chatbot resolves the most frequent queries instantly, freeing agents for complex cases.',daysAgo(29)),
  ],
  'cat-3': [
    f('f3-1','cat-3','Built-in color palette generator','Generate harmonious palettes from a base color with CSS export.',19,4,'requested','Finding harmonious color combinations manually is time-consuming and requires design expertise. An automated palette generator gives anyone a solid starting point in seconds.',daysAgo(3)),
    f('f3-2','cat-3','Drag-and-drop layout builder','Visual layout builder with snap-to-grid and responsive preview.',35,8,'requested','Describing complex layouts in code or spec documents is slow and error-prone. A visual builder with snap-to-grid lets designers iterate and preview layouts without writing a single line of code.',daysAgo(6)),
    f('f3-3','cat-3','Asset library with tagging','Organize design assets with custom tags for easy reuse.',12,1,'requested','Design assets scattered across folders and drives cause duplication and version drift. A centralized tagged library ensures everyone pulls from the same approved asset set.',daysAgo(9)),
    f('f3-4','cat-3','Real-time design collaboration','Multiple users editing the same canvas simultaneously.',42,3,'shipped','Sharing static files back and forth creates versioning confusion and slows feedback cycles. Live multi-user editing on the same canvas brings design collaboration in line with how code teams already work.',daysAgo(12)),
    f('f3-5','cat-3','Component version history','Track changes to design components with rollback support.',26,5,'requested','Overwriting a design component without a rollback option means mistakes are permanent. Version history gives designers the confidence to iterate freely, knowing they can always recover a previous state.',daysAgo(15)),
    f('f3-6','cat-3','Auto-generate style guides','Export a living style guide from your design tokens.',18,2,'requested','Writing and maintaining a design style guide manually is a full-time job that rarely stays current. Auto-generating it directly from design tokens ensures the guide is always in sync with the source of truth.',daysAgo(18)),
    f('f3-7','cat-3','Icon search and insertion','Searchable icon library with one-click insertion into designs.',30,4,'requested','Hunting for the right icon across external sites breaks design flow and slows handoff. A searchable built-in library means designers can find and place icons without ever leaving the tool.',daysAgo(21)),
    f('f3-8','cat-3','Responsive breakpoint preview','Preview designs at mobile, tablet, and desktop sizes instantly.',24,1,'requested','Designing for multiple screen sizes without instant preview leads to surprises at implementation time. Side-by-side breakpoint views let designers catch layout issues before any code is written.',daysAgo(24)),
    f('f3-9','cat-3','Figma import/export','Seamless round-trip sync between the app and Figma files.',37,6,'requested','Most design assets live in Figma, and manual export-import workflows waste hours each week. Seamless round-trip sync eliminates the friction of bridging two design environments.',daysAgo(27)),
    f('f3-10','cat-3','Contrast checker for accessibility','Inline WCAG contrast ratio checker for text and backgrounds.',21,0,'requested','Designers often discover accessibility contrast failures only after development is complete. An inline WCAG checker catches issues at design time, when they are cheapest to fix.',daysAgo(30)),
  ],
  'cat-4': [
    f('f4-1','cat-4','Hot reload for config changes','Apply configuration changes without restarting the dev server.',45,2,'requested','Restarting a dev server to pick up a config change can take 30 seconds to several minutes. Hot config reload keeps developers in flow and cuts iteration time on configuration-heavy systems.',daysAgo(1)),
    f('f4-2','cat-4','Inline API documentation','Hover tooltips showing API docs and type hints in the editor.',22,3,'requested','Switching between code and browser documentation tabs breaks concentration and costs time. Hover tooltips that surface API details in-context keep developers focused on the code.',daysAgo(3)),
    f('f4-3','cat-4','One-click environment setup','Spin up a fully configured dev environment from a single command.',39,4,'requested','Onboarding a new developer or setting up a fresh machine can take a full day of troubleshooting. A single command that configures the entire environment removes the biggest friction point in getting started.',daysAgo(6)),
    f('f4-4','cat-4','Built-in database seeder','Populate the database with realistic test data in one step.',16,1,'requested','Writing and maintaining custom seed scripts for every project is repetitive and error-prone. A built-in seeder that generates realistic data on demand removes setup friction for testing and demos.',daysAgo(9)),
    f('f4-5','cat-4','Visual dependency graph','Interactive graph showing package and module dependencies.',20,5,'requested','Understanding implicit dependencies in large codebases requires reading through build files and source code. An interactive visual graph surfaces relationships instantly and helps teams reason about impact before making changes.',daysAgo(12)),
    f('f4-6','cat-4','Auto-fix lint errors on save','Automatically apply linter suggestions when a file is saved.',33,7,'requested','Manually applying linter fix suggestions one by one after a save adds unnecessary friction to the coding cycle. Auto-fix on save keeps the codebase clean without interrupting the writing flow.',daysAgo(15)),
    f('f4-7','cat-4','PR preview deployments','Deploy every pull request to a unique preview URL.',48,2,'in_progress','Reviewing a pull request without seeing it run live makes it easy to miss layout or runtime issues. A per-PR preview URL gives reviewers real context and catches bugs that static code review misses.',daysAgo(18)),
    f('f4-8','cat-4','Error boundary dashboard','Aggregated view of all runtime errors with stack traces.',25,3,'requested','Runtime errors scattered across logs are hard to prioritize without a unified view. A single dashboard with grouped errors and stack traces helps teams triage and fix the most impactful issues first.',daysAgo(21)),
    f('f4-9','cat-4','CLI plugin system','Extend the CLI with community-built plugins and scripts.',14,2,'requested','Every team has unique workflow automation needs that a monolithic CLI cannot anticipate. A plugin system lets teams extend the CLI with exactly the scripts and integrations they need.',daysAgo(24)),
    f('f4-10','cat-4','Performance profiling tab','Built-in flame graph and memory profiler for debugging.',29,4,'requested','Identifying performance bottlenecks without built-in tooling means reaching for external profilers and correlating results manually. An integrated flame graph and memory profiler makes optimization a first-class part of the development loop.',daysAgo(27)),
  ],
  'cat-5': [
    f('f5-1','cat-5','Offline mode with sync','Use the app offline and sync changes when reconnected.',38,3,'requested','Mobile users in low-connectivity areas cannot use the app reliably without offline support. Background sync ensures data is preserved locally and seamlessly uploaded when connectivity returns.',daysAgo(2)),
    f('f5-2','cat-5','Push notification scheduling','Schedule push notifications with timezone-aware delivery.',21,4,'requested','Sending notifications at the wrong local time alienates users and hurts engagement. Timezone-aware scheduling ensures messages arrive when users are actually awake and receptive.',daysAgo(5)),
    f('f5-3','cat-5','Biometric authentication','Login with fingerprint or Face ID on supported devices.',34,2,'shipped','Typing a password on a small keyboard every time the app opens creates friction that pushes users away. Biometric login removes that barrier while maintaining strong security.',daysAgo(8)),
    f('f5-4','cat-5','Deep linking support','Open specific screens directly from URLs or notifications.',27,1,'requested','Users arriving from a notification or external link are often dropped on the home screen rather than the relevant content. Deep links provide a direct path to the right screen and reduce drop-off.',daysAgo(11)),
    f('f5-5','cat-5','App widget for home screen','Glanceable home screen widget showing key information.',19,5,'requested','Users who need a quick glance at key information have to unlock and open the app, breaking their flow. A home screen widget surfaces the most relevant data without requiring any app navigation.',daysAgo(14)),
    f('f5-6','cat-5','Dark mode auto-switch','Follow the device system theme automatically.',42,3,'requested','Users who set a system theme expect every app to follow it automatically. Manual dark mode settings that do not sync with the OS feel inconsistent and dated.',daysAgo(17)),
    f('f5-7','cat-5','Gesture-based navigation','Swipe gestures for common actions like delete and archive.',16,6,'requested','Tapping small targets for destructive actions like delete is error-prone on mobile screens. Swipe gestures give users a faster and more natural way to perform common actions.',daysAgo(20)),
    f('f5-8','cat-5','In-app update prompts','Prompt users to update when a new version is available.',23,8,'requested','Users on outdated versions encounter bugs that have already been fixed, leading to unnecessary support requests. Timely in-app update prompts ensure users benefit from the latest improvements.',daysAgo(23)),
    f('f5-9','cat-5','Haptic feedback on interactions','Subtle vibration feedback on button presses and swipes.',11,3,'requested','Without tactile feedback, users are unsure whether a tap was registered, especially on interactive elements. Haptic responses provide a physical confirmation that makes the app feel responsive and polished.',daysAgo(26)),
    f('f5-10','cat-5','Adaptive layout for tablets','Optimized multi-pane layout on larger screens.',30,2,'requested','A phone layout stretched to fill a tablet screen looks amateur and wastes valuable screen real estate. An adaptive multi-pane layout makes the app feel native on larger devices and improves productivity.',daysAgo(29)),
  ],
  'cat-6': [
    f('f6-1','cat-6','One-click deploy to production','Ship to production with a single button press and rollback.',50,4,'in_progress','Multi-step deployment processes introduce human error and slow down release cycles. A single-button deploy with automatic rollback gives teams the confidence to ship frequently and safely.',daysAgo(3)),
    f('f6-2','cat-6','Auto-scaling based on traffic','Dynamically adjust resources based on real-time load.',37,2,'requested','Traffic spikes that outpace manual scaling cause downtime and excess capacity during quiet periods. Automatic resource adjustment based on real-time load keeps the service reliable and cost-efficient.',daysAgo(5)),
    f('f6-3','cat-6','Multi-region deployment','Deploy to multiple geographic regions for lower latency.',28,5,'requested','Users far from the primary data center experience noticeably higher latency. Multi-region deployment brings data closer to users and removes geography as a source of performance inequality.',daysAgo(8)),
    f('f6-4','cat-6','Infrastructure as code templates','Pre-built Terraform/Pulumi templates for common stacks.',22,3,'requested','Setting up a standard cloud stack from scratch takes hours of research and configuration. Pre-built templates based on common patterns let teams get a production-ready environment running in minutes.',daysAgo(11)),
    f('f6-5','cat-6','Cost monitoring dashboard','Real-time spending breakdown by service and environment.',33,1,'requested','Cloud bills are notoriously opaque, making it hard to know which service or environment is driving costs. A real-time breakdown by service helps teams optimize spend before it becomes a problem.',daysAgo(14)),
    f('f6-6','cat-6','Blue-green deployments','Zero-downtime deployments with traffic shifting.',26,2,'requested','Traditional deployments cause brief but impactful downtime for end users. Blue-green traffic shifting eliminates downtime entirely and allows instant rollback if a release has issues.',daysAgo(17)),
    f('f6-7','cat-6','Managed database backups','Automatic daily backups with point-in-time restore.',41,1,'requested','Manual backup processes are frequently skipped or incorrectly configured, leaving teams exposed to data loss. Automatic daily backups with point-in-time restore provide a reliable safety net without any operational overhead.',daysAgo(20)),
    f('f6-8','cat-6','Edge function support','Run serverless functions at the edge for faster responses.',18,4,'requested','Centralizing all server logic in one region adds avoidable latency for geographically distributed users. Edge functions run compute close to the user, dramatically reducing response time for latency-sensitive operations.',daysAgo(23)),
    f('f6-9','cat-6','Container registry integration','Built-in Docker registry with vulnerability scanning.',15,3,'requested','Using an external Docker registry adds a dependency outside the platform and requires separate access management. A built-in registry with vulnerability scanning simplifies the workflow and closes a security gap.',daysAgo(26)),
    f('f6-10','cat-6','Uptime monitoring with alerts','Monitor service health and alert on downtime via Slack or email.',35,2,'requested','Service outages discovered by end users rather than the team damage trust and increase recovery pressure. Proactive uptime monitoring with instant alerts lets the team respond before most users are affected.',daysAgo(29)),
  ],
  'cat-7': [
    f('f7-1','cat-7','Two-factor authentication','Add TOTP-based 2FA for all user accounts.',46,1,'shipped','Password-only accounts are vulnerable to credential stuffing and phishing attacks. TOTP-based 2FA adds a second layer that blocks the vast majority of unauthorized access attempts.',daysAgo(1)),
    f('f7-2','cat-7','Audit log for all actions','Immutable log of who did what and when.',32,3,'requested','When something goes wrong, teams have no way to reconstruct what happened without a detailed action history. An immutable audit log provides the evidence needed for debugging, compliance, and accountability.',daysAgo(4)),
    f('f7-3','cat-7','Role-based access control','Fine-grained permissions based on user roles.',39,2,'requested','Giving every user the same level of access violates the principle of least privilege and creates unnecessary risk. Fine-grained RBAC ensures users can only access what they need for their role.',daysAgo(7)),
    f('f7-4','cat-7','Data encryption at rest','Encrypt all stored data with AES-256.',28,1,'requested','Storing sensitive data without encryption means a database breach exposes everything in plaintext. AES-256 encryption at rest ensures that stolen data remains unreadable without the encryption key.',daysAgo(10)),
    f('f7-5','cat-7','Session timeout controls','Configurable inactivity timeouts per security level.',17,4,'requested','Long-lived sessions on shared or unattended devices create a persistent security exposure. Configurable inactivity timeouts automatically close sessions before an idle device can be exploited.',daysAgo(13)),
    f('f7-6','cat-7','IP allowlist for admin panels','Restrict admin access to trusted IP addresses only.',21,5,'requested','Admin panels accessible from any IP are a high-value target for brute-force and unauthorized access. Restricting access to a known set of IP addresses significantly reduces the attack surface.',daysAgo(16)),
    f('f7-7','cat-7','GDPR data export','Let users download all their personal data in one click.',35,2,'requested','Regulators and users increasingly expect to download their personal data on request. A one-click export fulfills this obligation instantly and avoids the legal risk of non-compliance.',daysAgo(19)),
    f('f7-8','cat-7','Vulnerability scanning in CI','Automated security scans on every pull request.',24,3,'requested','Security vulnerabilities introduced in code are cheapest to fix before they reach production. Automated scanning on every pull request catches issues early and builds security into the development process by default.',daysAgo(22)),
    f('f7-9','cat-7','Password strength meter','Real-time feedback on password strength during signup.',13,1,'requested','Users often choose weak passwords because they receive no guidance at the point of creation. A real-time strength meter with actionable feedback helps users make stronger choices without extra friction.',daysAgo(25)),
    f('f7-10','cat-7','SSO with SAML and OAuth','Enterprise single sign-on for teams and organizations.',40,4,'requested','Enterprise teams must manage separate credentials for every tool, creating security gaps and IT overhead. SSO integration lets organizations centralize access control and enforce policies uniformly across their entire toolset.',daysAgo(28)),
  ],
  'cat-8': [
    f('f8-1','cat-8','Custom dashboard builder','Drag-and-drop widgets to build personalized dashboards.',36,5,'in_progress','Pre-built dashboards rarely match every team\'s specific KPIs, forcing workarounds or tool-switching. A drag-and-drop builder lets anyone create the exact view they need without engineering support.',daysAgo(2)),
    f('f8-2','cat-8','Export reports to PDF','Generate polished PDF reports from any data view.',22,2,'requested','Sharing data insights with stakeholders who do not have system access requires taking screenshots or manual formatting. PDF export produces polished, shareable reports in a universally readable format.',daysAgo(4)),
    f('f8-3','cat-8','Real-time streaming charts','Live-updating charts for monitoring real-time data.',29,3,'requested','Static charts that require a page refresh miss rapidly changing operational data. Live-updating charts let teams monitor systems in real time and respond to changes as they happen.',daysAgo(7)),
    f('f8-4','cat-8','Cohort analysis tool','Analyze user behavior grouped by signup date or segment.',18,4,'requested','Aggregate metrics mask differences in behavior between user groups acquired at different times. Cohort analysis reveals retention and engagement patterns that drive informed product and marketing decisions.',daysAgo(10)),
    f('f8-5','cat-8','Funnel visualization','Visualize drop-off at each step of a user journey.',25,1,'requested','Without a clear picture of where users drop off, it is impossible to prioritize conversion improvements. Funnel charts make the weakest steps in a user journey immediately obvious and actionable.',daysAgo(13)),
    f('f8-6','cat-8','SQL query editor','Write and save custom SQL queries against your data.',31,6,'requested','Teams with data questions often wait days for engineering to write a report. A built-in SQL editor empowers analysts to query data directly and get answers without creating a bottleneck.',daysAgo(16)),
    f('f8-7','cat-8','Scheduled report emails','Automatically email reports on a daily or weekly schedule.',20,2,'requested','Important metrics stay visible only when someone actively opens the dashboard. Automated email delivery ensures key stakeholders receive a regular data pulse without needing to log in.',daysAgo(19)),
    f('f8-8','cat-8','Data source connectors','Connect to Postgres, BigQuery, Snowflake, and more.',38,3,'requested','Valuable data locked in separate systems cannot contribute to unified analysis. Pre-built connectors for major databases and warehouses eliminate the integration work that blocks consolidated reporting.',daysAgo(22)),
    f('f8-9','cat-8','Anomaly highlighting in charts','Automatically flag unusual data points in visualizations.',15,1,'requested','Unusual data points buried in large charts go unnoticed until they cause downstream problems. Automated flagging of outliers draws the eye to what matters and enables faster root cause investigation.',daysAgo(25)),
    f('f8-10','cat-8','Shareable dashboard links','Generate public or password-protected dashboard URLs.',27,4,'requested','Sharing a dashboard with external stakeholders currently requires granting them full system access. Shareable links with optional password protection enable selective sharing without compromising security.',daysAgo(28)),
  ],
  'cat-9': [
    f('f9-1','cat-9','Comment threads on any item','Add threaded discussions to tasks, docs, and files.',33,4,'requested','Feedback on tasks and documents currently happens in separate chat threads that lose context over time. Threaded comments attached directly to the item they refer to keep discussions organized and findable.',daysAgo(3)),
    f('f9-2','cat-9','@mention notifications','Notify users when they are mentioned in a comment.',28,2,'requested','Important messages addressed to a specific person get lost in team-wide notification noise. @mention alerts ensure the right person sees a message promptly without disturbing everyone else.',daysAgo(6)),
    f('f9-3','cat-9','Activity feed','A chronological feed of recent actions by your team.',21,3,'requested','Team members returning from a break have no easy way to catch up on what happened in their absence. A chronological activity feed provides a quick overview of recent changes and decisions.',daysAgo(9)),
    f('f9-4','cat-9','Reactions and emoji responses','React to comments and updates with emoji.',16,5,'requested','Responding to an update with a full comment creates unnecessary noise when a simple acknowledgment is sufficient. Emoji reactions give users a lightweight way to respond without cluttering the conversation.',daysAgo(12)),
    f('f9-5','cat-9','Shared workspaces for teams','Collaborate in shared spaces with granular permissions.',37,2,'shipped','Teams working across multiple disconnected spaces struggle with duplicate effort and inconsistent information. Shared workspaces with permission controls bring the right people together around a single source of truth.',daysAgo(15)),
    f('f9-6','cat-9','User profiles with bios','Public profiles showing contributions, role, and bio.',12,4,'requested','Without knowing who they are working with, collaboration feels impersonal and trust is harder to build. Public profiles with roles and contribution history give team members context about their colleagues.',daysAgo(18)),
    f('f9-7','cat-9','Follow items for updates','Subscribe to specific items to get notified of changes.',24,1,'requested','Users who care about a specific item have no way to stay informed without repeatedly checking it manually. A follow feature delivers targeted notifications only for the content each user actually cares about.',daysAgo(21)),
    f('f9-8','cat-9','Invite links for onboarding','Generate shareable links to invite new team members.',19,2,'requested','Adding new team members one email at a time is slow and requires admin involvement. A shareable invite link lets any team member bring in collaborators instantly without a friction-filled onboarding process.',daysAgo(24)),
    f('f9-9','cat-9','Leaderboard for top contributors','Gamified ranking of most active community members.',14,7,'requested','Active community contributors go unrecognized, reducing their motivation to keep participating. A leaderboard acknowledges top contributors and creates healthy social incentives that drive long-term engagement.',daysAgo(27)),
    f('f9-10','cat-9','Direct messaging between users','Private 1-on-1 messaging within the platform.',30,6,'requested','Team communication outside the platform fragments conversations across email and external messengers. In-app direct messaging keeps all relevant discussion in one place and reduces context switching.',daysAgo(30)),
  ],
  'cat-10': [
    f('f10-1','cat-10','Screen reader optimization','Ensure all UI elements have proper ARIA labels and roles.',34,1,'requested','Users relying on screen readers encounter UI elements with missing or vague labels, making navigation impossible. Comprehensive ARIA labeling ensures the app is fully usable without sight.',daysAgo(1)),
    f('f10-2','cat-10','Keyboard-only navigation','Full app navigation without requiring a mouse.',29,2,'in_progress','Users with motor impairments who cannot use a pointer device are effectively locked out without full keyboard support. Complete keyboard navigation makes the app accessible to a significantly wider audience.',daysAgo(4)),
    f('f10-3','cat-10','High contrast theme','An alternative theme with stronger contrast ratios.',22,3,'requested','Standard themes have contrast ratios that fail users with low vision or who view in bright environments. A high-contrast alternative theme ensures legibility across a broader range of visual conditions.',daysAgo(7)),
    f('f10-4','cat-10','Font size scaling','User-controlled text sizing from small to extra-large.',26,1,'requested','Fixed font sizes make content unreadable for users with vision impairments without resorting to system-level zoom. User-controlled text scaling provides a first-class reading experience without layout breakage.',daysAgo(10)),
    f('f10-5','cat-10','Reduced motion mode','Disable animations for users sensitive to motion.',18,0,'requested','Animations and transitions that cannot be disabled cause discomfort for users with vestibular disorders. A reduced motion setting respects these users\'s needs and demonstrates a genuine commitment to inclusion.',daysAgo(13)),
    f('f10-6','cat-10','Alt text for all images','Enforce descriptive alt text on every uploaded image.',20,2,'requested','Images uploaded without alt text are invisible to screen readers and fail basic accessibility standards. Enforcing descriptive alt text at upload time ensures visual content is accessible from the moment it is added.',daysAgo(16)),
    f('f10-7','cat-10','Color-blind friendly palettes','Avoid red/green combos; use patterns and labels for clarity.',31,3,'requested','Red-green color distinctions used without alternative cues are meaningless to users with common forms of color blindness. Accessible palettes using patterns and labels ensure information is conveyed to all users equally.',daysAgo(19)),
    f('f10-8','cat-10','Focus indicator styling','Clear visible focus rings on all interactive elements.',16,1,'requested','Default browser focus indicators are often invisible or easily missed, making keyboard navigation disorienting. Clear, high-visibility focus rings let keyboard users always know exactly where they are on the page.',daysAgo(22)),
    f('f10-9','cat-10','Captioned video content','Auto-generate captions for all video and audio content.',24,4,'requested','Video and audio content without captions excludes Deaf users and is unusable in sound-sensitive environments. Auto-generated captions make all media content inclusive by default.',daysAgo(25)),
    f('f10-10','cat-10','Accessibility audit reports','Automated WCAG compliance reports for every page.',28,2,'requested','WCAG compliance issues discovered after launch are expensive to fix and create legal exposure. Automated per-page audit reports give teams continuous visibility into accessibility gaps so they can be addressed early.',daysAgo(28)),
  ],
};
