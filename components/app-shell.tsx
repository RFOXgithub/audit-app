"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, Boxes, Building2, CheckSquare2, ClipboardList, FileArchive, FileBarChart, Gauge, LogOut, Menu, Search, Settings, ShieldCheck, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AppState, User } from "@/lib/types";
import { initialState, users } from "@/lib/demo-data";

const groups=[
 ["Overview",[["/dashboard","Dashboard",Gauge]]],
 ["Audit management",[["/audit-plans","Audit Plans",ClipboardList],["/audits","Audits",CheckSquare2],["/findings","Findings",ShieldCheck],["/corrective-actions","Corrective Actions",Activity]]],
 ["Audit tools",[["/inventory","Inventory Audit",Boxes],["/evidence","Evidence",FileArchive]]],
 ["Analytics",[["/reports","Reports",BarChart3]]],
 ["Administration",[["/users","Users",Users],["/departments","Departments",Building2],["/activity-log","Activity Log",FileBarChart]]],
 ["",[["/settings","Settings",Settings],["/case-study","Case Study",FileBarChart]]]
] as const;
type SearchResult={type:"Audit"|"Finding"|"Evidence";id:string;title:string;meta:string;href:string};
function getDemoState():AppState{try{return JSON.parse(localStorage.getItem("auditflow-state")||"") as AppState}catch{return initialState}}

export function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname();const router=useRouter();const searchBox=useRef<HTMLDivElement>(null);
 const [user,setUser]=useState<User>(users[1]);const [mobile,setMobile]=useState(false);const [query,setQuery]=useState("");const [searching,setSearching]=useState(false);const [data,setData]=useState<AppState>(initialState);
 useEffect(()=>{const timer=setTimeout(()=>{const raw=sessionStorage.getItem("auditflow-user");if(raw)setUser(JSON.parse(raw));else router.replace("/login");setData(getDemoState())},0);return()=>clearTimeout(timer)},[router,path]);
 useEffect(()=>{function outside(e:MouseEvent){if(!searchBox.current?.contains(e.target as Node))setSearching(false)}document.addEventListener("mousedown",outside);return()=>document.removeEventListener("mousedown",outside)},[]);
 const results=useMemo<SearchResult[]>(()=>{const q=query.trim().toLowerCase();if(q.length<2)return[];const audits=data.audits.filter(a=>`${a.id} ${a.title} ${a.department} ${a.lead}`.toLowerCase().includes(q)).slice(0,4).map(a=>({type:"Audit" as const,id:a.id,title:a.title,meta:`${a.department} · ${a.status}`,href:`/audits/${a.id}`}));const findings=data.findings.filter(f=>`${f.id} ${f.title} ${f.department} ${f.pic} ${f.category}`.toLowerCase().includes(q)).slice(0,5).map(f=>({type:"Finding" as const,id:f.id,title:f.title,meta:`${f.department} · ${f.severity} · ${f.status}`,href:"/findings"}));const evidence=data.activities.filter(a=>a.action.toLowerCase().includes("evidence")&&`${a.entityId} ${a.detail} ${a.user}`.toLowerCase().includes(q)).slice(0,3).map(a=>({type:"Evidence" as const,id:a.entityId,title:a.detail,meta:`Uploaded by ${a.user}`,href:"/evidence"}));return[...audits,...findings,...evidence]},[query,data]);
 function openResult(result:SearchResult){if(result.type==="Finding")localStorage.setItem("auditflow-global-search",result.id);setQuery("");setSearching(false);router.push(result.href)}
 function logout(){sessionStorage.removeItem("auditflow-user");router.push("/login")}
 const nav=<><div className="logo"><span className="logoMark"><ShieldCheck size={18}/></span>AuditFlow<span className="brandEdition">/ INTERNAL AUDIT</span></div>{groups.map(([label,items])=><div key={label}>{label&&<div className="navLabel">{label}</div>}{items.map(([href,name,Icon])=>{if(user.role==="AUDITEE"&&["/users","/departments","/activity-log","/audit-plans"].includes(href))return null;return <Link href={href} onClick={()=>setMobile(false)} className={`navItem ${path===href?"active":""}`} key={href}><Icon size={16}/>{name}</Link>})}</div>)}</>;
 return <div className="shell"><aside className="sidebar">{nav}</aside>{mobile&&<div className="modalBack" onClick={()=>setMobile(false)}><aside className="sidebar" style={{display:"block",position:"fixed",left:0,top:0,width:260,zIndex:60}} onClick={e=>e.stopPropagation()}>{nav}</aside></div>}<div className="workspace"><header className="topbar"><button className="btn mobileMenu" aria-label="Open navigation" onClick={()=>setMobile(true)}>{mobile?<X size={18}/>:<Menu size={18}/>}</button><div className="globalSearch" ref={searchBox}><Search size={17} aria-hidden/><input aria-label="Search audits, findings, or evidence" placeholder="Search audits, findings, or evidence…" value={query} onFocus={()=>setSearching(true)} onChange={e=>{setQuery(e.target.value);setSearching(true)}} onKeyDown={e=>{if(e.key==="Escape"){setSearching(false);e.currentTarget.blur()}if(e.key==="Enter"&&results[0])openResult(results[0])}}/>{query&&<button className="searchClear" aria-label="Clear search" onClick={()=>setQuery("")}><X size={14}/></button>}{searching&&query.trim().length>=2&&<div className="searchResults" role="listbox" aria-label="Global search results">{results.length?results.map(r=><button type="button" role="option" aria-selected="false" className="searchResult" key={`${r.type}-${r.id}`} onClick={()=>openResult(r)}><span className={`searchType ${r.type.toLowerCase()}`}>{r.type}</span><span className="searchResultText"><strong>{r.title}</strong><small><span className="id">{r.id}</span> · {r.meta}</small></span></button>):<div className="searchEmpty">No audits, findings, or evidence found for “{query}”.</div>}</div>}</div><div className="user"><div className="avatar">{user.initials}</div><div className="userName"><strong style={{fontSize:12}}>{user.name}</strong><div className="sub">{user.role==="AUDITEE"?"Auditee / PIC":user.role}</div></div><button className="btn" aria-label="Log out" onClick={logout}><LogOut size={15}/></button></div></header>{children}</div></div>
}
