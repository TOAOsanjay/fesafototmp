import {
  TenantParty,
  Order,
  QueueJob,
  StuckUpload,
  ModerationItem,
  PlanConfig,
  ClusterNode,
  AuditLine,
  Voucher,
  NavSection,
} from '../types/manage';

export const operatorAccount = {
  name: 'Sanjay Mankoe',
  email: 'sanjay@live.nl',
  role: 'operator',
  location: 'Amsterdam, NL',
  lastLogin: '2026-10-20 22:15 CET',
};

export const initialTenants: TenantParty[] = [
  {
    id: 't-sanjay-dewie',
    name: 'Sanjay & Dewie',
    slug: 'sanjayendewie',
    subdomain: 'sanjayendewie.fesafotos.nl',
    date: 'Vrijdag 30 oktober 2026',
    hashtag: '#HoldMyDrinkKeepCalm41!',
    plan: 'event_plus',
    uploads: 9,
    videos: 2,
    guests: 24,
    health: 'healthy',
    daysToGo: 9,
    hostName: 'Sanjay & Dewie',
    hostEmail: 'sanjay@live.nl',
    customDomain: 'sanjayendewie.nl',
    storageMb: 1420,
  },
  {
    id: 't-mientjes-65',
    name: 'Mientjes 65',
    slug: 'mientjes65',
    subdomain: 'mientjes65.fesafotos.nl',
    date: 'Zaterdag 14 november 2026',
    hashtag: '#Mientje65',
    plan: 'event',
    uploads: 42,
    videos: 4,
    guests: 38,
    health: 'warning',
    daysToGo: 24,
    hostName: 'Klaas van der Meer',
    hostEmail: 'klaas@vandermeer.nl',
    storageMb: 3850,
  },
  {
    id: 't-test-amsterdam',
    name: 'Test Feestje Amsterdam',
    slug: 'test-amsterdam',
    subdomain: 'test-amsterdam.fesafotos.nl',
    date: 'Woensdag 21 oktober 2026',
    hashtag: '#TestParty2026',
    plan: 'free',
    uploads: 5,
    videos: 0,
    guests: 4,
    health: 'healthy',
    daysToGo: 1,
    hostName: 'Sanjay Test',
    hostEmail: 'sanjay@live.nl',
    storageMb: 180,
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-10492',
    partyName: 'Sanjay & Dewie',
    tenantSlug: 'sanjayendewie',
    planName: 'Event+ Upgrade',
    amountEur: 69.0,
    status: 'completed',
    providerRef: 'tr_9PQ6nGBbDvETPvKPJcSYJ',
    createdAt: '2026-10-18 14:22 CET',
    method: 'iDEAL (Rabobank)',
  },
  {
    id: 'ord-10493',
    partyName: 'Mientjes 65',
    tenantSlug: 'mientjes65',
    planName: 'Event Pakket',
    amountEur: 49.0,
    status: 'pending',
    providerRef: 'tr_K7Lm28xZb90wP',
    createdAt: '2026-10-20 20:10 CET',
    method: 'iDEAL (ING)',
  },
  {
    id: 'ord-10488',
    partyName: 'Noa 30th Rooftop',
    tenantSlug: 'noa30',
    planName: 'Media Top-up (+500)',
    amountEur: 15.0,
    status: 'completed',
    providerRef: 'tr_4F82mNx7QpL2',
    createdAt: '2026-10-16 11:05 CET',
    method: 'Creditcard (Visa)',
  },
];

export const initialPlans: PlanConfig[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    guestsLimit: 'Tot 50 gasten',
    mediaLimit: 'Tot 1.000 foto\'s en video\'s',
    videoClips: 20,
    videoDurationSec: 120,
    retentionMonths: 3,
    unlocks: [
      'Standaard QR-code generator',
      'Directe gasten uploads via browser',
      'Web-kwaliteit downloads',
    ],
  },
  {
    id: 'event',
    name: 'Event',
    price: 49,
    guestsLimit: 'Onbeperkt aantal gasten',
    mediaLimit: 'Onbeperkt aantal uploads',
    videoClips: 50,
    videoDurationSec: 180,
    retentionMonths: 12,
    unlocks: [
      '12 maanden online beschikbaar',
      'Originele hoge resolutie downloads',
      'Fotograaf portaal voor directe originals',
      'Complete archief download als 1 ZIP',
      'Gastenboek reacties en likes',
    ],
  },
  {
    id: 'event_plus',
    name: 'Event+',
    price: 69,
    guestsLimit: 'Onbeperkt aantal gasten',
    mediaLimit: 'Onbeperkt aantal uploads',
    videoClips: 100,
    videoDurationSec: 300,
    retentionMonths: 24,
    unlocks: [
      '24 maanden veilige hosting',
      'Eigen domeinnaam koppeling (bijv. sanjayendewie.nl)',
      'Live Beamer Slideshow modus voor zaalschermen',
      'Live moderatie filter voor upload review',
      'Prioriteits export en cloud back-up garantie',
    ],
  },
];

export const initialQueueJobs: QueueJob[] = [
  {
    id: 'job-9841',
    type: 'video_transcode',
    tenantName: 'Mientjes 65',
    state: 'failed',
    attempts: 3,
    duration: '4m 12s',
    startedAt: '2026-10-20 21:50 CET',
    workerNode: 'node-ams-02',
    error: 'Worker timeout: ffmpeg H.264 encode exceeded memory limit at frame 4120',
  },
  {
    id: 'job-9842',
    type: 'zip_packaging',
    tenantName: 'Sanjay & Dewie',
    state: 'done',
    attempts: 1,
    duration: '18s',
    startedAt: '2026-10-20 21:55 CET',
    workerNode: 'node-ams-01',
  },
  {
    id: 'job-9843',
    type: 'cloud_backup',
    tenantName: 'Sanjay & Dewie',
    state: 'running',
    attempts: 1,
    duration: '42s',
    startedAt: '2026-10-20 22:12 CET',
    workerNode: 'node-ams-03',
  },
  {
    id: 'job-9844',
    type: 'moderation_scan',
    tenantName: 'Test Feestje Amsterdam',
    state: 'queued',
    attempts: 0,
    duration: '0s',
    startedAt: '2026-10-20 22:14 CET',
    workerNode: 'node-ams-01',
  },
];

export const initialStuckUpload: StuckUpload = {
  id: 'stuck-001',
  tenantName: 'Mientjes 65',
  tenantSlug: 'mientjes65',
  filename: 'VID_20261020_003.mp4',
  filesize: '84.2 MB',
  guestName: 'Oom Johan',
  stuckStage: 'Video Transcode (720p fallback)',
  stuckSince: '48 minuten geleden',
  errorLog: 'Error 504: Gateway Timeout at worker-transcode-02. Chunk 18/22 stalled.',
};

export const initialModerationItems: ModerationItem[] = [
  {
    id: 'mod-101',
    tenantName: 'Mientjes 65',
    mediaUrl: '/src/assets/images/party_guest_moments_grid_1791985661203.jpg',
    type: 'photo',
    reason: 'Gemarkeerd door gast: onscherpe foto of per ongeluk geüpload',
    reporterCount: 1,
    deadlineCountdown: '1u 45m',
    uploadedBy: 'Gast op dansvloer',
    timestamp: '2026-10-20 21:10 CET',
  },
  {
    id: 'mod-102',
    tenantName: 'Test Feestje Amsterdam',
    mediaUrl: '/src/assets/images/hero_party_celebration_1791985660408.jpg',
    type: 'photo',
    reason: 'Automatische scan: gezichtsherkenning vlag voor privacy verzoek',
    reporterCount: 1,
    deadlineCountdown: '4u 10m',
    uploadedBy: 'Test gebruiker',
    timestamp: '2026-10-20 21:40 CET',
  },
];

export const initialClusterNodes: ClusterNode[] = [
  {
    name: 'node-ams-01',
    status: 'healthy',
    cpuPercent: 34,
    memPercent: 58,
    podsRunning: 15,
    region: 'europe-west4-a',
    uptime: '42 dagen, 11 uur',
  },
  {
    name: 'node-ams-02',
    status: 'healthy',
    cpuPercent: 71,
    memPercent: 82,
    podsRunning: 14,
    region: 'europe-west4-b',
    uptime: '19 dagen, 4 uur',
  },
  {
    name: 'node-ams-03',
    status: 'healthy',
    cpuPercent: 28,
    memPercent: 44,
    podsRunning: 12,
    region: 'europe-west4-c',
    uptime: '61 dagen, 8 uur',
  },
];

export const initialVouchers: Voucher[] = [
  {
    code: 'ZOMER2026',
    discount: '15% korting op Event en Event+',
    usedCount: 18,
    maxUses: 50,
    status: 'active',
    validUntil: '31 december 2026',
  },
  {
    code: 'FEESTVRIEND',
    discount: 'EUR 10 korting',
    usedCount: 25,
    maxUses: 25,
    status: 'expired',
    validUntil: '1 september 2026',
  },
];

export const initialAuditLines: AuditLine[] = [
  {
    id: 'aud-991',
    actor: 'Sanjay Mankoe',
    action: 'Plan aangepast naar Event+',
    target: 'Tenant: Sanjay & Dewie (sanjayendewie)',
    timestamp: '2026-10-20 22:12 CET',
    ip: '82.161.44.12 (NL)',
    status: 'success',
  },
  {
    id: 'aud-990',
    actor: 'Systeem: agent-watcher-prod',
    action: 'Gefaalde taak job-9841 geregistreerd',
    target: 'Worker: node-ams-02 / Mientjes 65',
    timestamp: '2026-10-20 21:50 CET',
    ip: '10.244.0.18 (intern)',
    status: 'warn',
  },
  {
    id: 'aud-989',
    actor: 'Mollie Webhook',
    action: 'Betaling EUR 69 ontvangen (tr_9PQ6nGBbDvETPvKPJcSYJ)',
    target: 'Order ord-10492 / Sanjay & Dewie',
    timestamp: '2026-10-18 14:22 CET',
    ip: '87.233.217.242',
    status: 'success',
  },
];

export const initialLogStream: string[] = [
  '2026-10-20T22:12:01.412Z [INFO] [ingress-controller] GET /sanjayendewie 200 OK 24ms TLSv1.3',
  '2026-10-20T22:12:15.118Z [INFO] [media-storage] S3 putObject tenant=sanjayendewie key=uploads/IMG_4021.jpg size=4.2MB',
  '2026-10-20T22:12:44.209Z [WARN] [worker-transcode-02] Worker timeout on job-9841: ffmpeg memory threshold reached',
  '2026-10-20T22:13:02.880Z [INFO] [agent-watcher-prod] Health check 41/41 pods healthy. Node node-ams-02 memory 82%',
  '2026-10-20T22:14:10.012Z [INFO] [mail-dispatcher] Queue empty, 0 pending notification dispatches',
  '2026-10-20T22:15:33.744Z [INFO] [auth-service] Operator login Sanjay Mankoe (sanjay@live.nl) session valid',
];

export const navSections: NavSection[] = [
  {
    group: 'Overzicht',
    items: [
      { id: 'dashboard', labelNl: 'Dashboard', labelEn: 'Dashboard' },
      { id: 'status', labelNl: 'Status', labelEn: 'Status' },
      { id: 'audit', labelNl: 'Audit', labelEn: 'Audit' },
    ],
  },
  {
    group: 'Feesten en gasten',
    items: [
      { id: 'tenants', labelNl: 'Tenants (feesten)', labelEn: 'Tenants (parties)', badge: 3 },
      { id: 'fotografen', labelNl: 'Fotografen', labelEn: 'Photographers' },
      { id: 'locatie', labelNl: 'Locatie (venue)', labelEn: 'Venue' },
    ],
  },
  {
    group: 'Media en wachtrijen',
    items: [
      { id: 'wachtrijtaken', labelNl: 'Wachtrijtaken', labelEn: 'Queue jobs', badge: 1, badgeType: 'warning' },
      { id: 'vastgelopen_uploads', labelNl: 'Vastgelopen uploads', labelEn: 'Stuck uploads', badge: 1, badgeType: 'danger' },
      { id: 'moderatie', labelNl: 'Moderatie', labelEn: 'Moderation', badge: 2 },
      { id: 'emailwachtrij', labelNl: 'E-mailwachtrij', labelEn: 'Email queue' },
    ],
  },
  {
    group: 'Domeinen',
    items: [
      { id: 'domeinen', labelNl: 'Domeinen', labelEn: 'Domains' },
      { id: 'identiteit', labelNl: 'Identiteit', labelEn: 'Identity' },
    ],
  },
  {
    group: 'Abonnementen',
    items: [
      { id: 'bestellingen', labelNl: 'Bestellingen', labelEn: 'Orders', badge: '1 open', badgeType: 'warning' },
      { id: 'kortingscodes', labelNl: 'Kortingscodes', labelEn: 'Vouchers' },
    ],
  },
  {
    group: 'E-mail',
    items: [
      { id: 'email', labelNl: 'Templates & Logs', labelEn: 'Templates & Logs' },
    ],
  },
  {
    group: 'Agent-oppervlakken',
    items: [
      { id: 'agents', labelNl: 'Agent Watcher', labelEn: 'Agent Watcher' },
    ],
  },
  {
    group: 'Operatie en toezicht',
    items: [
      { id: 'cluster', labelNl: 'Cluster & Nodes', labelEn: 'Cluster & Nodes', badge: '41 pods' },
      { id: 'beveiliging', labelNl: 'Beveiliging', labelEn: 'Security' },
      { id: 'sessies', labelNl: 'Sessies', labelEn: 'Sessions' },
      { id: 'pijplijn', labelNl: 'Pijplijn & Runs', labelEn: 'Pipeline & Runs' },
      { id: 'assistent', labelNl: 'Assistent', labelEn: 'Assistant' },
      { id: 'analytics', labelNl: 'Analytics', labelEn: 'Analytics' },
    ],
  },
  {
    group: 'Instellingen',
    items: [
      { id: 'plannen', labelNl: 'Plannen & limieten', labelEn: 'Plans & limits' },
      { id: 'instellingen', labelNl: 'Instellingen', labelEn: 'Settings' },
      { id: 'account', labelNl: 'Mijn account', labelEn: 'My account' },
    ],
  },
];
