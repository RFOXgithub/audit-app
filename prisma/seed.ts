import { PrismaClient,RoleName,RiskLevel,AuditStatus,FindingStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { departments,initialState,users } from "../lib/demo-data";
const db=new PrismaClient();
const risk=(v:string)=>RiskLevel[v.toUpperCase() as keyof typeof RiskLevel];
const auditStatus=(v:string)=>AuditStatus[v.toUpperCase().replaceAll(" ","_") as keyof typeof AuditStatus];
const findingStatus=(v:string)=>FindingStatus[v.toUpperCase().replaceAll(" ","_") as keyof typeof FindingStatus];
async function main(){
 await db.activityLog.deleteMany();await db.evidence.deleteMany();await db.correctiveAction.deleteMany();await db.inventoryAuditItem.deleteMany();await db.inventoryAudit.deleteMany();await db.finding.deleteMany();await db.auditChecklist.deleteMany();await db.auditTeam.deleteMany();await db.audit.deleteMany();await db.auditPlan.deleteMany();await db.user.deleteMany();await db.department.deleteMany();await db.role.deleteMany();
 const roles=Object.values(RoleName);for(const name of roles)await db.role.create({data:{name}});
 const roleRows=await db.role.findMany();const roleMap=Object.fromEntries(roleRows.map(r=>[r.name,r.id]));
 for(const name of [...departments,"Internal Audit"])await db.department.create({data:{name,code:name.split(" ").map(x=>x[0]).join("").toUpperCase()}});
 const deptRows=await db.department.findMany();const deptMap=Object.fromEntries(deptRows.map(d=>[d.name,d.id]));const passwordHash=await hash("AuditFlow2026!",12);
 for(const u of users)await db.user.create({data:{name:u.name,email:u.email,passwordHash,roleId:roleMap[u.role],departmentId:deptMap[u.department]}});
 const userRows=await db.user.findMany();const userMap=Object.fromEntries(userRows.map(u=>[u.name,u.id]));
 for(const a of initialState.audits)await db.audit.create({data:{auditCode:a.id,title:a.title,auditType:a.type,departmentId:deptMap[a.department],leadAuditorId:userMap[a.lead],scope:a.scope,objectives:a.objectives,periodStart:new Date(a.start),periodEnd:new Date(a.end),startDate:new Date(a.start),endDate:new Date(a.end),riskLevel:risk(a.risk),status:auditStatus(a.status),progress:a.progress}});
 const auditRows=await db.audit.findMany();const auditMap=Object.fromEntries(auditRows.map(a=>[a.auditCode,a.id]));
 for(const f of initialState.findings)await db.finding.create({data:{findingCode:f.id,auditId:auditMap[f.auditId],title:f.title,description:f.description,departmentId:deptMap[f.department],category:f.category,rootCause:f.rootCause,riskImpact:"Potential financial loss, operational disruption, or control non-compliance.",recommendation:f.recommendation,severity:risk(f.severity),financialImpact:f.impact,picId:userMap[f.pic],createdById:userMap["Raka Mahendra"],findingDate:new Date(f.findingDate),dueDate:new Date(f.dueDate),status:findingStatus(f.status)}});
 const inv=await db.inventoryAudit.create({data:{auditId:auditMap["AUD-2026-001"],departmentId:deptMap.Warehouse,countDate:new Date("2026-09-17"),status:"IN_PROGRESS"}});
 await db.inventoryAuditItem.createMany({data:initialState.inventory.map(i=>({inventoryAuditId:inv.id,itemCode:i.code,itemName:i.name,systemQuantity:i.systemQty,physicalQuantity:i.physicalQty,unitPrice:i.unitPrice,verificationStatus:i.status,auditorNotes:i.notes}))});
 console.log(`Seeded ${users.length} users, ${initialState.audits.length} audits, ${initialState.findings.length} findings, and ${initialState.inventory.length} inventory items.`)
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>db.$disconnect());
