export type Role = "ADMIN" | "AUDITOR" | "MANAGER" | "AUDITEE";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type FindingStatus = "Open" | "Investigation" | "Corrective Action" | "Waiting Verification" | "Verified" | "Closed";
export interface User { id:string; name:string; email:string; role:Role; department:string; initials:string }
export interface Audit { id:string; title:string; type:string; department:string; lead:string; start:string; end:string; risk:Severity; status:string; progress:number; scope:string; objectives:string; findings:number }
export interface Finding { id:string; auditId:string; title:string; department:string; category:string; severity:Severity; status:FindingStatus; pic:string; findingDate:string; dueDate:string; impact:number; description:string; rootCause:string; recommendation:string; correctiveAction?:string; completion?:number }
export interface InventoryItem { id:string; auditId:string; code:string; name:string; systemQty:number; physicalQty:number; unitPrice:number; status:string; notes:string; findingId?:string }
export interface Activity { id:string; action:string; entity:string; entityId:string; user:string; at:string; detail:string; relatedRecord?:string; fileType?:string; fileSize?:number }
export interface AppState { audits:Audit[]; findings:Finding[]; inventory:InventoryItem[]; activities:Activity[] }
