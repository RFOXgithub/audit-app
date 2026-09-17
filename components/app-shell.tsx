"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, Boxes, Building2, CheckSquare2, ClipboardList, FileArchive, FileBarChart, Gauge, LogOut, Menu, Search, Settings, ShieldCheck, Users, X } from "lucide-react";
import { useEffect,useState } from "react";
import type { User } from "@/lib/types";
import { users } from "@/lib/demo-data";

const groups=[
 ["Overview",[["/dashboard","Dashboard",Gauge]]],
 ["Audit management",[["/audit-plans","Audit Plans",ClipboardList],["/audits","Audits",CheckSquare2],["/findings","Findings",ShieldCheck],["/corrective-actions","Corrective Actions",Activity]]],
 ["Audit tools",[["/inventory","Inventory Audit",Boxes],["/evidence","Evidence",FileArchive]]],
 ["Analytics",[["/reports","Reports",BarChart3]]],
 ["Administration",[["/users","Users",Users],["/departments","Departments",Building2],["/activity-log","Activity Log",FileBarChart]]],
 ["",[["/settings","Settings",Settings],["/case-study","Case Study",FileBarChart]]]
] as const;
export function AppShell({children}:{children:React.ReactNode}){const path=usePathname();const router=useRouter();const [user,setUser]=useState<User>(users[1]);const [mobile,setMobile]=useState(false);useEffect(()=>{const raw=sessionStorage.getItem("auditflow-user");if(raw)setUser(JSON.parse(raw));else router.replace("/login")},[router]);function logout(){sessionStorage.removeItem("auditflow-user");router.push("/login")};const nav=<>{<div className="logo"><span className="logoMark"><ShieldCheck size={18}/></span>AuditFlow</div>}{groups.map(([label,items])=><div key={label}>{label&&<div className="navLabel">{label}</div>}{items.map(([href,name,Icon])=>{if(user.role==="AUDITEE"&&["/users","/departments","/activity-log","/audit-plans"].includes(href))return null;return <Link href={href} onClick={()=>setMobile(false)} className={`navItem ${path===href?"active":""}`} key={href}><Icon size={16}/>{name}</Link>})}</div>)}</>;
return <div className="shell"><aside className="sidebar">{nav}</aside>{mobile&&<div className="modalBack" onClick={()=>setMobile(false)}><aside className="sidebar" style={{display:"block",position:"fixed",left:0,top:0,width:260,zIndex:60}} onClick={e=>e.stopPropagation()}>{nav}</aside></div>}<div className="workspace"><header className="topbar"><div className="topSearch"><button className="btn mobileMenu" aria-label="Open navigation" onClick={()=>setMobile(true)}>{mobile?<X size={18}/>:<Menu size={18}/>}</button><Search size={17}/><span>Search audits, findings, or evidence</span></div><div className="user"><div className="avatar">{user.initials}</div><div className="userName"><strong style={{fontSize:12}}>{user.name}</strong><div className="sub">{user.role==="AUDITEE"?"Auditee / PIC":user.role}</div></div><button className="btn" aria-label="Log out" onClick={logout}><LogOut size={15}/></button></div></header>{children}</div></div>}
