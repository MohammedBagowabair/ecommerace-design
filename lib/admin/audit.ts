import type { AuditEntityType } from "./ops-types";
import { useAdminOpsStore } from "../store/admin-ops";
import { useAdminAuthStore } from "../store/admin-auth";

export function logAdminAudit(input: {
  action: string;
  target: string;
  entityType?: AuditEntityType;
  entityId?: string;
  before?: string;
  after?: string;
  meta?: string;
  actorName?: string;
  actorId?: string;
}) {
  let session: { name?: string; userId?: string } | null = null;
  try {
    session = useAdminAuthStore.getState().session;
  } catch {
    session = null;
  }
  useAdminOpsStore.getState().addActivity({
    actorName: input.actorName ?? session?.name ?? "مشرف",
    actorId: input.actorId ?? session?.userId,
    action: input.action,
    target: input.target,
    entityType: input.entityType,
    entityId: input.entityId,
    before: input.before,
    after: input.after,
    meta: input.meta,
  });
}
