export type NavPage =
  | 'dashboard'
  | 'status'
  | 'audit'
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
  | 'beveiliging'
  | 'sessies'
  | 'pijplijn'
  | 'assistent'
  | 'analytics'
  | 'plannen'
  | 'instellingen'
  | 'account';

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
}

export interface Order {
  id: string;
  partyName: string;
  tenantSlug: string;
  planName: string;
  amountEur: number;
  status: 'completed' | 'pending' | 'provisioned' | 'refunding' | 'refunded' | 'chargeback' | 'expired';
  providerRef: string;
  createdAt: string;
  method: string;
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
}

export interface AuditLine {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warn' | 'destructive';
}

export interface Voucher {
  code: string;
  discount: string;
  usedCount: number;
  maxUses: number;
  status: 'active' | 'expired';
  validUntil: string;
}
