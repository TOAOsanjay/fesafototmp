export type NavPage =
  | 'dashboard'
  | 'status'
  | 'audit'
  | 'signalen'
  | 'backup_herstel'
  | 'tenants'
  | 'fotografen'
  | 'locatie'
  | 'wachtrijtaken'
  | 'vastgelopen_uploads'
  | 'moderatie'
  | 'emailwachtrij'
  | 'domeinen'
  | 'identiteit'
  | 'bestellingen'
  | 'kortingscodes'
  | 'email'
  | 'agents'
  | 'cluster'
  | 'hetzner_k3s'
  | 'minio_opslag'
  | 'database_cluster'
  | 'beveiliging'
  | 'sessies'
  | 'pijplijn'
  | 'assistent'
  | 'analytics'
  | 'plannen'
  | 'instellingen'
  | 'account';

export type OperatorRole = 'admin' | 'tenant-manager' | 'support' | 'readonly' | 'venue';

export type NavGroup =
  | 'Overzicht'
  | 'Feesten en gasten'
  | 'Media en wachtrijen'
  | 'Domeinen'
  | 'Abonnementen'
  | 'E-mail'
  | 'Agent-oppervlakken'
  | 'Operatie en toezicht'
  | 'Instellingen';

export interface NavItem {
  id: NavPage;
  labelNl: string;
  labelEn: string;
  badge?: number | string;
  badgeType?: 'default' | 'warning' | 'danger';
}

export interface NavSection {
  group: NavGroup;
  items: NavItem[];
}

export type PlanId = 'free' | 'event' | 'event_plus';

export interface TenantMediaItem {
  id: string;
  filename: string;
  type: 'photo' | 'video';
  url: string;
  poster?: string;
  videoDuration?: string;
  author: string;
  sizeMb: number;
  status: 'geaccepteerd' | 'in_beoordeling' | 'verborgen';
  likes: number;
  timestamp: string;
  cameraInfo?: string;
}

export interface TenantParty {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  date: string;
  hashtag: string;
  plan: PlanId;
  uploads: number;
  videos: number;
  guests: number;
  health: 'healthy' | 'warning' | 'error';
  daysToGo: number;
  hostName: string;
  hostEmail: string;
  customDomain?: string;
  storageMb: number;
  welcomeMessage?: string;
  mediaList?: TenantMediaItem[];
}

export interface Order {
  id: string;
  partyName: string;
  tenantSlug: string;
  planName: string;
  amountEur: number;
  vatEur?: number;
  mollieFeeEur?: number;
  status: 'completed' | 'pending' | 'provisioned' | 'refunding' | 'refunded' | 'chargeback' | 'expired';
  providerRef: string;
  createdAt: string;
  method: string;
  customerEmail?: string;
}

export interface QueueJob {
  id: string;
  type: 'video_transcode' | 'zip_packaging' | 'cloud_backup' | 'mail_dispatch' | 'moderation_scan';
  tenantName: string;
  state: 'queued' | 'running' | 'done' | 'failed' | 'quarantined';
  attempts: number;
  duration: string;
  startedAt: string;
  workerNode: string;
  error?: string;
  progressPercent?: number;
}

export interface StuckUpload {
  id: string;
  tenantName: string;
  tenantSlug: string;
  filename: string;
  filesize: string;
  guestName: string;
  stuckStage: string;
  stuckSince: string;
  errorLog: string;
  ffprobeDetails?: {
    codec: string;
    resolution: string;
    fps: number;
    bitrate: string;
    durationSec: number;
  };
}

export interface ModerationItem {
  id: string;
  tenantName: string;
  mediaUrl: string;
  type: 'photo' | 'video';
  reason: string;
  reporterCount: number;
  deadlineCountdown: string;
  uploadedBy: string;
  timestamp: string;
  aiSafetyScore?: number;
  exifData?: {
    camera: string;
    lens: string;
    iso: number;
    shutter: string;
  };
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  guestsLimit: string;
  mediaLimit: string;
  videoClips: number;
  videoDurationSec: number;
  retentionMonths: number;
  unlocks: string[];
}

export interface ClusterNode {
  name: string;
  status: 'healthy' | 'degraded';
  cpuPercent: number;
  memPercent: number;
  podsRunning: number;
  region: string;
  uptime: string;
  internalIp: string;
  kernelVersion: string;
  isCordoned?: boolean;
}

export interface ClusterPod {
  name: string;
  namespace: string;
  node: string;
  status: 'Running' | 'CrashLoopBackOff' | 'Pending';
  restarts: number;
  cpuMilli: number;
  memMb: number;
  age: string;
  version: string;
}

export interface AuditLine {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warn' | 'destructive';
  metadataJson?: string;
}

export interface Voucher {
  code: string;
  discount: string;
  discountPercent?: number;
  usedCount: number;
  maxUses: number;
  status: 'active' | 'expired';
  validUntil: string;
  targetPlan?: string;
}

export interface PhotographerUser {
  id: string;
  name: string;
  studioName: string;
  email: string;
  phone: string;
  activeTenantSlug: string;
  uploadsCount: number;
  storageMb: number;
  cameraPreset: string;
  magicToken: string;
  status: 'active' | 'pending' | 'completed';
  lastUpload: string;
}

export interface VenueLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  screens: number;
  aspectRatio: '16:9' | '16:10' | '4:3' | 'dual_stretch';
  beamerToken: string;
  wifiSsid: string;
  maxDba: number;
  activeTenantSlug: string;
  status: 'connected' | 'idle' | 'offline';
  cycleSeconds: number;
}

export interface EmailLogItem {
  id: string;
  recipient: string;
  subject: string;
  templateId: string;
  status: 'delivered' | 'bounced' | 'queued' | 'opened';
  sentAt: string;
  opensCount: number;
}

export interface PipelineRun {
  id: string;
  commitSha: string;
  commitMsg: string;
  branch: string;
  status: 'success' | 'failed' | 'running';
  duration: string;
  deployedAt: string;
  helmRelease: string;
  imageTag: string;
}

export interface CustomDomainEntry {
  domain: string;
  tenantSlug: string;
  partyName: string;
  dnsTarget: string;
  dnsVerified: boolean;
  sslActive: boolean;
  sslExpiresDays: number;
  autoRenew: boolean;
}

export interface HetznerServerNode {
  name: string;
  serverType: 'cpx31' | 'cx42' | 'cpx41';
  role: 'control-plane' | 'worker';
  datacenter: 'fsn1-dc14' | 'nbg1-dc3' | 'hel1-dc2';
  city: 'Falkenstein, DE' | 'Nuremberg, DE' | 'Helsinki, FI';
  publicIpv4: string;
  privateIp: string;
  cores: number;
  memoryGb: number;
  diskGb: number;
  status: 'running' | 'rebuilding' | 'stopped';
  csiVolumesAttached: number;
  isCordoned?: boolean;
}

export interface HetznerLoadBalancer {
  id: string;
  name: string;
  type: 'lb11';
  location: string;
  ipv4: string;
  ipv6: string;
  proxyProtocol: boolean;
  algorithm: 'round_robin' | 'least_connections';
  services: {
    listenPort: number;
    destinationPort: number;
    protocol: 'tcp';
    healthStatus: 'healthy';
  }[];
}

export interface MinioBucketInfo {
  name: string;
  objectsCount: number;
  sizeGb: number;
  quotaGb: number;
  retentionPolicy: string;
  encryption: 'AES-256 (KMS/MinIO)' | 'None';
  status: 'healthy';
  storagePool: string;
}

export interface PostgresClusterStatus {
  clusterName: string;
  version: string;
  primaryNode: string;
  standbyNodes: string[];
  replicationLagBytes: number;
  walArchiving: 'active (to MinIO)' | 'stalled';
  barmanLastBackup: string;
  connectionsActive: number;
  connectionsMax: number;
  volumeSizeGb: number;
}

export interface TranscodeHpaStatus {
  service: string;
  currentReplicas: number;
  desiredReplicas: number;
  minReplicas: number;
  maxReplicas: number;
  queueDepth: number;
  targetQueuePerPod: number;
  cpuThresholdPercent: number;
}

export interface AgentLane {
  id: string;
  name: string;
  namespace: 'fesafoto-ops' | 'fesafoto-system';
  port?: number;
  endpoints?: string[];
  roleDescription: string;
  probeType: 'timestamp' | 'reachability_only' | 'deterministic';
  status: 'healthy' | 'warning' | 'paused' | 'running';
  lastCycleTime?: string;
  isKillSwitchEngaged: boolean;
  dailyCallsUsed: number;
  dailyCallsCeiling: number;
  openFindingsCount: number;
  criticalFindingsCount: number;
  modelName?: string;
  modelCostTodayUsd?: number;
}

export interface AgentProposal {
  id: string;
  title: string;
  agentId: string;
  category: 'routine' | 'gepast' | 'spoed';
  target: string;
  summary: string;
  evidence: string;
  patchYaml: string;
  rollbackPath: string;
  smokeTest: string;
  status: 'open' | 'approved' | 'rejected' | 'applied';
  createdAt: string;
  expiresAt: string;
}

export interface FindingItem {
  id: string;
  title: string;
  severity: 'kritiek' | 'hoog' | 'medium' | 'laag';
  group: 'auth' | 'authz' | 'headers' | 'tls' | 'secrets' | 'cluster' | 'images' | 'network' | 'audit' | 'surface';
  lane: string;
  target: string;
  ageHours: number;
  description: string;
}

export interface AnomalySignal {
  id: string;
  title: string;
  category: 'uploads' | 'videowachtrij' | 'mail' | 'agent' | 'opslag';
  severity: 'afwijkend' | 'let_op' | 'verwacht';
  certainty: string;
  chain: string;
  trend: 'stijgt' | 'daalt' | 'stabiel';
  detectedAt: string;
  impactDescription: string;
  suggestedAction: string;
}

export interface PartyCostAnalysis {
  tenantId: string;
  partyName: string;
  plan: PlanId;
  revenueEur: number;
  costEur: number;
  netMarginEur: number;
  statusVerdict: 'verdient' | 'quitte' | 'kost_geld';
  storageUsedMb: number;
  videosTranscoded: number;
  modelCalls: number;
  recommendation: 'doorlopen' | 'afronden';
}

export interface BackupLayerStatus {
  id: string;
  layerName: string;
  targetLocation: string;
  lastBackupTime: string;
  sizeMb: number;
  durationSeconds: number;
  status: 'geslaagd' | 'bezig' | 'mislukt';
  sha256: string;
}

export interface RestoreDrillReport {
  drillId: string;
  completedAt: string;
  status: 'geslaagd' | 'aandacht_nodig';
  verifiedTenantsCount: number;
  verifiedSqliteDatabasesCount: number;
  verifiedMediaFilesCount: number;
  missingHashesCount: number;
  summary: string;
}

