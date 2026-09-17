import type { FindingStatus, Role } from "./types";
const transitions:Record<FindingStatus,FindingStatus[]>={
 Open:["Investigation","Corrective Action"], Investigation:["Corrective Action"],
 "Corrective Action":["Waiting Verification"], "Waiting Verification":["Corrective Action","Verified"],
 Verified:["Closed"], Closed:[]
};
export function canTransition(from:FindingStatus,to:FindingStatus){return transitions[from].includes(to)}
export function canManageFinding(role:Role){return role==="AUDITOR"||role==="ADMIN"}
export function formatIDR(value:number){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value)}
