import{s as Ra,c as Oa,n as Pa}from"../chunks/CwImYb1J.js";import{S as ja,i as Fa,d as l,l as v,m as f,v as Ia,a as s,p as Sa,g as o,w as Ma,j as n,k as p,n as m,b as u,o as d,c as a,q as r,r as x,e as E,f as $,h as i,u as w,t as q,x as Da}from"../chunks/C0e3dW7X.js";import{C}from"../chunks/D0OL2RRu.js";import{l as Ba}from"../chunks/Csh4crAz.js";import{b as Ea}from"../chunks/vNBdmfBM.js";function Aa(c){let k,P="Building foxloves from scratch",z,H,Xt=`A complete walkthrough of how the library is constructed, layer by layer, in
  the order you would build it. foxloves is pure Lua for LÖVE 11.x with no
  dependencies: a shared theme, a set of widgets that all obey one lifecycle
  contract, a <code>Root</code> that drives them, and a headless test suite.`,Gt,y,dl="1. Design principles",h,_,sl="Four constraints shape every decision. Keep them in mind as you read the rest.",ol,vt,Eo='<li class="svelte-1qzvwo1"><strong>No dependencies.</strong> Pure Lua and the LÖVE API only. It drops into any love2d project by copying one folder.</li> <li class="svelte-1qzvwo1"><strong>One lifecycle.</strong> Every widget implements the same handful of methods, so a host can drive a heterogeneous list of widgets in a single loop.</li> <li class="svelte-1qzvwo1"><strong>Theme-driven.</strong> No widget hardcodes a color or metric; all appearance comes from a theme table, so a game restyles the whole UI by swapping one table.</li> <li class="svelte-1qzvwo1"><strong>Headless-testable.</strong> A mock of the LÖVE API lets the whole suite run in CI with no window.</li>',nl,j,Ro="2. Project skeleton",al,F,Oo="2.1 Folder layout",il,I,jo="The library lives in an inner <code>foxloves/</code> folder (the require root); the outer folder holds the demo and tests.",rl,S,ul,D,Fo="2.2 Window config",cl,B,Io="<code>conf.lua</code> is LÖVE&#39;s pre-boot hook — set the window here.",vl,ft,fl,A,So="2.3 Module resolution",pl,V,Do=`<code>require(&quot;foxloves&quot;)</code> loads <code>foxloves/init.lua</code>, which returns a
  table of every widget plus <code>theme</code> and <code>util</code>. Submodules resolve by
  dotted path from the project root.`,ml,pt,xl,U,Bo="3. The theme",wl,G,Ao="3.1 Colors and metrics",Cl,R,vo,Yt,Vo="{r, g, b, a}",fo,po,hl,mt,bl,W,Uo="3.2 Font resolution and overrides",$l,N,Go=`<code>getFont</code> resolves the active font in priority order: a widget&#39;s own theme,
  then the module default, then LÖVE&#39;s current font. Every widget accepts an
  optional <code>theme</code> in its options and falls back to this default, so one widget
  can be restyled without touching the rest.`,ql,K,Wo="3.3 Semantic status colors",yl,Q,No=`<code>info</code>, <code>success</code>, <code>warning</code>, and <code>error</code>
  give status widgets (Toast, Badge) a shared vocabulary rather than ad-hoc hues. See the
  <a href="${Ea}/foundations/theme">Theme reference</a> for the live swatches.`,_l,J,Ko="4. Shared helpers",zl,X,Qo="Before the first widget, a tiny <code>util</code> module for what every widget repeats.",Hl,Y,Jo="4.1 Geometry",Tl,Z,Xo="<code>contains</code> powers every widget&#39;s hit-test; <code>clamp</code> bounds slider/stepper values.",kl,ee,Yo="4.2 Focus ring and focus check",Ll,te,Zo=`<code>focusRing</code> draws the keyboard-focus outline; <code>isFocused</code> asks the
  widget&#39;s <code>Root</code> whether this widget currently holds focus. Both keep the
  focus model consistent across widgets.`,gl,xt,Ml,le,en="5. The widget contract",Pl,se,tn="5.1 The six lifecycle methods",El,oe,ln="Every widget is a module returning a factory <code>Widget.new(opts)</code>, and implements:",Rl,wt,sn='<li class="svelte-1qzvwo1"><code>update(dt)</code> — per-frame logic (hover, caret blink, animation).</li> <li class="svelte-1qzvwo1"><code>draw()</code> — render with <code>love.graphics</code>, restoring prior color state.</li> <li class="svelte-1qzvwo1"><code>mousepressed / mousereleased(x, y, btn)</code> — return <code>true</code> when consumed.</li> <li class="svelte-1qzvwo1"><code>keypressed(key)</code>, <code>textinput(text)</code> — keyboard input.</li>',Ol,ne,on="5.2 The five rules",jl,Ct,nn='<li class="svelte-1qzvwo1">Never call <code>setColor</code> without restoring prior state; read all colors/metrics from the theme.</li> <li class="svelte-1qzvwo1">Widgets hold their own state — no globals.</li> <li class="svelte-1qzvwo1">Input handlers return <code>true</code> when they consume the event, so the caller stops propagation.</li> <li class="svelte-1qzvwo1">Callbacks (<code>onClick</code>, <code>onChange</code>) come from <code>opts</code> and are optional.</li> <li class="svelte-1qzvwo1">Document the public API in a comment block above <code>new</code>.</li>',Fl,ae,an="5.3 Optional additive hooks",Il,ie,rn="Present only where they fit — the six core methods are stable and never grow:",Sl,ht,dn='<li class="svelte-1qzvwo1"><code>focusable = true</code> — opt into Tab traversal; draw a ring and gate keyboard activation on <code>isFocused</code>.</li> <li class="svelte-1qzvwo1"><code>setFocused(bool)</code> — let <code>Root</code> sync a widget&#39;s own focus flag (Textbox uses it).</li> <li class="svelte-1qzvwo1"><code>wheelmoved(dx, dy)</code> — scrollable widgets; the wheel has no coordinates, so the widget self-checks the mouse against its bounds.</li> <li class="svelte-1qzvwo1"><code>mousemoved(x, y, dx, dy)</code> — event-driven hover in local coordinates.</li>',Dl,re,un="5.4 The coordinate model",Bl,de,cn=`Handlers receive coordinates already in the widget&#39;s own space. A
  <code>Container</code> subtracts its content origin before forwarding, so a widget nested
  in a Panel hit-tests against the same coordinates it was positioned in.
  Prefer <code>mousemoved</code> over polling <code>love.mouse.getPosition()</code>, which
  yields screen coords and misfires inside a translated container.`,Al,ue,vn="6. First widget: Button",Vl,ce,fn="6.1 Constructor and options",Ul,ve,pn="Read options with defaults, stash the theme, expose state fields, opt into focus.",Gl,bt,Wl,fe,mn="6.2 Draw: state-driven fills and color restore",Nl,pe,xn="The four numbered steps are the contract in miniature: save color, pick a themed fill from state, draw (plus focus ring), restore.",Kl,$t,Ql,me,wn="6.3 Consume semantics",Jl,xe,Cn=`Press marks <code>pressed</code> and returns <code>true</code>; release fires
  <code>onClick</code> only when the release lands inside <em>and</em> the press began
  inside — the standard button behavior that lets a user slide off to cancel.`,Xl,qt,Yl,we,hn="6.4 Keyboard activation",Zl,Ce,bn="Gated on focus: when the Button holds focus in a Root, Space/Enter fire the same <code>onClick</code>. (Shown in the snippet above.)",es,he,$n="7. Register and run it",ts,be,qn="7.1 The export table",ls,$e,yn="<code>init.lua</code> is the public surface; add each new widget here.",ss,yt,os,qe,_n="7.2 The driver loop",ns,ye,zn=`Create widgets in <code>love.load</code>, then forward each LÖVE callback to the Root,
  letting the UI consume input first.`,as,_t,is,_e,Hn="8. Stateful input: Textbox",rs,ze,Tn="8.1 Focus that the Root can sync",ds,He,kn=`Unlike Button, a Textbox tracks its own <code>focused</code> flag and exposes
  <code>setFocused</code> so <code>Root</code> keeps managed focus and the box&#39;s flag in
  step when Tab moves focus in or out.`,us,zt,cs,Te,Ln="8.2 Text entry and editing",vs,ke,gn=`<code>textinput</code> inserts characters at the caret (respecting <code>maxLength</code>);
  <code>keypressed</code> handles editing keys. The real widget also does caret movement,
  word jumps, a selection range, and system-clipboard cut/copy/paste — all built on the
  same byte-indexed value.`,fs,Ht,ps,Le,Mn="8.3 Change and submit callbacks",ms,ge,Pn=`<code>onChange(newValue)</code> fires on any edit; Enter fires <code>onSubmit(value)</code>
  and blurs through the Root so keyboard focus clears too.`,xs,Me,En="9. Value widgets: the Toggle pattern",ws,Pe,Rn="9.1 Value plus onChange",Cs,Ee,On=`Checkbox, Toggle, Slider, and Stepper share a shape: hold a value, mutate it on
  interaction, and fire <code>onChange(value)</code> only when it actually changes.`,hs,Re,jn="9.2 Animation in update",bs,Oe,Fn=`State changes are instant, but the visuals ease. Toggle stores an <code>anim</code>
  value in <code>[0, 1]</code> and advances it toward the target each frame in
  <code>update</code> — the same pattern Modal and Slider use for entrance/handle motion.`,$s,Tt,qs,je,In="10. fox.Root: the manager",ys,Fe,Sn=`Standalone widgets work, but a real UI needs z-order, one keyboard focus, and
  overlays. <code>Root</code> owns a base layer plus an overlay stack and routes LÖVE
  events to them.`,_s,Ie,Dn="10.1 The base layer",zs,Se,Bn="<code>add</code> registers a widget and sets its <code>.root</code> backref, so the widget can later open overlays or clear focus.",Hs,kt,Ts,De,An="10.2 Keyboard focus and Tab cycling",ks,Be,Vn=`<code>setFocus</code> moves focus and syncs any <code>setFocused</code> widget; Tab /
  Shift-Tab cycle among focusable base widgets. A modal overlay traps keys before the
  base layer sees them.`,Ls,Lt,gs,Ae,Un="10.3 The overlay stack",Ms,L,mo,Zt,Gn="openOverlay(widget, { modal = bool })",xo,wo,Wt,Wn="closeOverlay",Co,Ps,gt,Es,Ve,Nn="10.4 Event routing order",Rs,Ue,Kn=`Input flows top-down: overlays first (top of stack first), then base widgets,
  first-consume-wins. Draw runs the other way — base, then overlays bottom-to-top —
  so later overlays paint on top. Esc closes the top overlay before anything else.`,Os,Ge,Qn="11. Containers and nesting",js,We,Jn="11.1 Relative coordinates",Fs,Ne,Xn=`<code>Container</code> is shared machinery (not a standalone widget) for widgets that
  hold children. It translates by a content origin in <code>draw</code> and subtracts that
  origin from input coordinates, so children live in local space and nesting composes.`,Is,Mt,Ss,Ke,Yn="11.2 Building Panel and Tabs on it",Ds,Qe,Zn=`Panel embeds a Container and supplies an <code>originFn</code> that points at its content
  area (inside the title bar and padding). Tabs swaps which child panel the Container draws
  based on the selected header. Because each level applies its own offset, a Button inside a
  Panel inside Tabs still hovers and clicks correctly.`,Bs,Je,ea="12. Overlays",As,Xe,ta="With Root and Container in place, overlays are just widgets pushed onto the stack:",Vs,b,Pt,la="<strong>Modal</strong> — scrim + centered dialog with buttons; traps input; eases in via an <code>anim</code> value.",ho,Et,sa="<strong>Dropdown</strong> — a closed control that opens a scrollable popup as a non-modal overlay.",bo,Rt,oa="<strong>Tooltip</strong> — polls hover on a target and fades a hint in near the cursor.",$o,O,Nt,na="ContextMenu",qo,el,aa="root:openOverlay(popup, { modal = false })",yo,_o,zo,Ot,ia="<strong>ToastHost</strong> — a corner stack of transient messages, each fading on a timer.",Us,Ye,ra="13. Testing headless",Gs,Ze,da="The suite mocks LÖVE so it runs with no window and drops straight into CI.",Ws,et,ua="13.1 The LÖVE stub",Ns,tt,ca="Implement only the calls widgets make; drawing is a no-op, fonts are faked with fixed metrics.",Ks,jt,Qs,lt,va="13.2 The harness",Js,st,fa="Install the stub, load the library once, and expose a shared <code>check</code> plus pass/fail counters.",Xs,Ft,Ys,ot,pa="13.3 Writing a case",Zs,nt,ma=`A case constructs a widget, mutates state, asserts callbacks fire and input is
  consumed or ignored correctly, and draws once as a smoke test (never errors).`,eo,It,to,at,xa="13.4 Running the suite",lo,it,wa="List each case in <code>run.lua</code>; the runner exits non-zero on any failure.",so,St,oo,Dt,no,rt,Ca="14. Conventions and growth",ao,dt,ha="The house style that keeps the system coherent as it grows:",io,T,g,Ho,tl,ba="local M = {}",To,ko,Kt,$a="return M",Lo,go,Bt,qa="Keep each widget file under ~200 lines; lift repeated logic into <code>util.lua</code> or <code>container.lua</code>.",Mo,At,ya="Descriptive names; no single-letter locals except loop indices and coordinates.",Po,Vt,_a="Conventional commits (<code>feat</code>, <code>fix</code>, <code>docs</code>, <code>test</code>, <code>refactor</code>, <code>chore</code>), imperative subject ≤ 50 chars.",ro,ut,za="<strong>Checklist to add a widget:</strong>",uo,Ut,Ha='<li class="svelte-1qzvwo1">Create <code>foxloves/widgets/name.lua</code> with a documented <code>new</code> and the six methods.</li> <li class="svelte-1qzvwo1">Read all appearance from the theme; add any missing token to <code>theme.lua</code>.</li> <li class="svelte-1qzvwo1">Register it in <code>init.lua</code>.</li> <li class="svelte-1qzvwo1">Add <code>tests/cases/name.lua</code> and list it in <code>run.lua</code>; run <code>luajit tests/run.lua</code>.</li> <li class="svelte-1qzvwo1">Show it in <code>main.lua</code> and exercise it with <code>love .</code>.</li>',co;return S=new C({props:{code:c[1],lang:"text"}}),ft=new C({props:{code:c[2]}}),pt=new C({props:{code:c[3]}}),mt=new C({props:{code:c[4]}}),xt=new C({props:{code:c[5]}}),bt=new C({props:{code:c[6]}}),$t=new C({props:{code:c[7]}}),qt=new C({props:{code:c[8]}}),yt=new C({props:{code:c[9]}}),_t=new C({props:{code:c[10]}}),zt=new C({props:{code:c[11]}}),Ht=new C({props:{code:c[12]}}),Tt=new C({props:{code:c[13]}}),kt=new C({props:{code:c[14]}}),Lt=new C({props:{code:c[15]}}),gt=new C({props:{code:c[16]}}),Mt=new C({props:{code:c[17]}}),jt=new C({props:{code:c[18]}}),Ft=new C({props:{code:c[19]}}),It=new C({props:{code:c[20]}}),St=new C({props:{code:c[21]}}),Dt=new C({props:{code:"luajit tests/run.lua",lang:"bash"}}),{c(){k=i("h1"),k.textContent=P,z=n(),H=i("p"),H.innerHTML=Xt,Gt=n(),y=i("h2"),y.textContent=dl,h=n(),_=i("p"),_.textContent=sl,ol=n(),vt=i("ul"),vt.innerHTML=Eo,nl=n(),j=i("h2"),j.textContent=Ro,al=n(),F=i("h3"),F.textContent=Oo,il=n(),I=i("p"),I.innerHTML=jo,rl=n(),w(S.$$.fragment),ul=n(),D=i("h3"),D.textContent=Fo,cl=n(),B=i("p"),B.innerHTML=Io,vl=n(),w(ft.$$.fragment),fl=n(),A=i("h3"),A.textContent=So,pl=n(),V=i("p"),V.innerHTML=Do,ml=n(),w(pt.$$.fragment),xl=n(),U=i("h2"),U.textContent=Bo,wl=n(),G=i("h3"),G.textContent=Ao,Cl=n(),R=i("p"),vo=q(`Centralize appearance first — everything downstream reads from it. Colors are
  `),Yt=i("code"),fo=q(Vo),po=q(" tables in 0–1 range; metrics are plain numbers."),hl=n(),w(mt.$$.fragment),bl=n(),W=i("h3"),W.textContent=Uo,$l=n(),N=i("p"),N.innerHTML=Go,ql=n(),K=i("h3"),K.textContent=Wo,yl=n(),Q=i("p"),Q.innerHTML=No,_l=n(),J=i("h2"),J.textContent=Ko,zl=n(),X=i("p"),X.innerHTML=Qo,Hl=n(),Y=i("h3"),Y.textContent=Jo,Tl=n(),Z=i("p"),Z.innerHTML=Xo,kl=n(),ee=i("h3"),ee.textContent=Yo,Ll=n(),te=i("p"),te.innerHTML=Zo,gl=n(),w(xt.$$.fragment),Ml=n(),le=i("h2"),le.textContent=en,Pl=n(),se=i("h3"),se.textContent=tn,El=n(),oe=i("p"),oe.innerHTML=ln,Rl=n(),wt=i("ul"),wt.innerHTML=sn,Ol=n(),ne=i("h3"),ne.textContent=on,jl=n(),Ct=i("ol"),Ct.innerHTML=nn,Fl=n(),ae=i("h3"),ae.textContent=an,Il=n(),ie=i("p"),ie.textContent=rn,Sl=n(),ht=i("ul"),ht.innerHTML=dn,Dl=n(),re=i("h3"),re.textContent=un,Bl=n(),de=i("p"),de.innerHTML=cn,Al=n(),ue=i("h2"),ue.textContent=vn,Vl=n(),ce=i("h3"),ce.textContent=fn,Ul=n(),ve=i("p"),ve.textContent=pn,Gl=n(),w(bt.$$.fragment),Wl=n(),fe=i("h3"),fe.textContent=mn,Nl=n(),pe=i("p"),pe.textContent=xn,Kl=n(),w($t.$$.fragment),Ql=n(),me=i("h3"),me.textContent=wn,Jl=n(),xe=i("p"),xe.innerHTML=Cn,Xl=n(),w(qt.$$.fragment),Yl=n(),we=i("h3"),we.textContent=hn,Zl=n(),Ce=i("p"),Ce.innerHTML=bn,es=n(),he=i("h2"),he.textContent=$n,ts=n(),be=i("h3"),be.textContent=qn,ls=n(),$e=i("p"),$e.innerHTML=yn,ss=n(),w(yt.$$.fragment),os=n(),qe=i("h3"),qe.textContent=_n,ns=n(),ye=i("p"),ye.innerHTML=zn,as=n(),w(_t.$$.fragment),is=n(),_e=i("h2"),_e.textContent=Hn,rs=n(),ze=i("h3"),ze.textContent=Tn,ds=n(),He=i("p"),He.innerHTML=kn,us=n(),w(zt.$$.fragment),cs=n(),Te=i("h3"),Te.textContent=Ln,vs=n(),ke=i("p"),ke.innerHTML=gn,fs=n(),w(Ht.$$.fragment),ps=n(),Le=i("h3"),Le.textContent=Mn,ms=n(),ge=i("p"),ge.innerHTML=Pn,xs=n(),Me=i("h2"),Me.textContent=En,ws=n(),Pe=i("h3"),Pe.textContent=Rn,Cs=n(),Ee=i("p"),Ee.innerHTML=On,hs=n(),Re=i("h3"),Re.textContent=jn,bs=n(),Oe=i("p"),Oe.innerHTML=Fn,$s=n(),w(Tt.$$.fragment),qs=n(),je=i("h2"),je.textContent=In,ys=n(),Fe=i("p"),Fe.innerHTML=Sn,_s=n(),Ie=i("h3"),Ie.textContent=Dn,zs=n(),Se=i("p"),Se.innerHTML=Bn,Hs=n(),w(kt.$$.fragment),Ts=n(),De=i("h3"),De.textContent=An,ks=n(),Be=i("p"),Be.innerHTML=Vn,Ls=n(),w(Lt.$$.fragment),gs=n(),Ae=i("h3"),Ae.textContent=Un,Ms=n(),L=i("p"),mo=q("Overlays are pushed with "),Zt=i("code"),xo=q(Gn),wo=q(` and
  popped with `),Wt=i("code"),Wt.textContent=Wn,Co=q(`. A modal traps all input; a non-modal (dropdown,
  tooltip) is dismissed when a press lands outside it.`),Ps=n(),w(gt.$$.fragment),Es=n(),Ve=i("h3"),Ve.textContent=Nn,Rs=n(),Ue=i("p"),Ue.textContent=Kn,Os=n(),Ge=i("h2"),Ge.textContent=Qn,js=n(),We=i("h3"),We.textContent=Jn,Fs=n(),Ne=i("p"),Ne.innerHTML=Xn,Is=n(),w(Mt.$$.fragment),Ss=n(),Ke=i("h3"),Ke.textContent=Yn,Ds=n(),Qe=i("p"),Qe.innerHTML=Zn,Bs=n(),Je=i("h2"),Je.textContent=ea,As=n(),Xe=i("p"),Xe.textContent=ta,Vs=n(),b=i("ul"),Pt=i("li"),Pt.innerHTML=la,ho=n(),Et=i("li"),Et.innerHTML=sa,bo=n(),Rt=i("li"),Rt.innerHTML=oa,$o=n(),O=i("li"),Nt=i("strong"),Nt.textContent=na,qo=q(" — opens a popup at a point via "),el=i("code"),yo=q(aa),_o=q("."),zo=n(),Ot=i("li"),Ot.innerHTML=ia,Us=n(),Ye=i("h2"),Ye.textContent=ra,Gs=n(),Ze=i("p"),Ze.textContent=da,Ws=n(),et=i("h3"),et.textContent=ua,Ns=n(),tt=i("p"),tt.textContent=ca,Ks=n(),w(jt.$$.fragment),Qs=n(),lt=i("h3"),lt.textContent=va,Js=n(),st=i("p"),st.innerHTML=fa,Xs=n(),w(Ft.$$.fragment),Ys=n(),ot=i("h3"),ot.textContent=pa,Zs=n(),nt=i("p"),nt.textContent=ma,eo=n(),w(It.$$.fragment),to=n(),at=i("h3"),at.textContent=xa,lo=n(),it=i("p"),it.innerHTML=wa,so=n(),w(St.$$.fragment),oo=n(),w(Dt.$$.fragment),no=n(),rt=i("h2"),rt.textContent=Ca,ao=n(),dt=i("p"),dt.textContent=ha,io=n(),T=i("ul"),g=i("li"),Ho=q("Local module pattern: "),tl=i("code"),To=q(ba),ko=q(" … "),Kt=i("code"),Kt.textContent=$a,Lo=q(". 2-space indent, no tabs."),go=n(),Bt=i("li"),Bt.innerHTML=qa,Mo=n(),At=i("li"),At.textContent=ya,Po=n(),Vt=i("li"),Vt.innerHTML=_a,ro=n(),ut=i("p"),ut.innerHTML=za,uo=n(),Ut=i("ol"),Ut.innerHTML=Ha,this.h()},l(e){k=a(e,"H1",{"data-svelte-h":!0}),r(k)!=="svelte-nlx4vk"&&(k.textContent=P),z=o(e),H=a(e,"P",{class:!0,"data-svelte-h":!0}),r(H)!=="svelte-y6llzw"&&(H.innerHTML=Xt),Gt=o(e),y=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(y)!=="svelte-1bvgvi6"&&(y.textContent=dl),h=o(e),_=a(e,"P",{class:!0,"data-svelte-h":!0}),r(_)!=="svelte-1xqp080"&&(_.textContent=sl),ol=o(e),vt=a(e,"UL",{"data-svelte-h":!0}),r(vt)!=="svelte-l1jclw"&&(vt.innerHTML=Eo),nl=o(e),j=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(j)!=="svelte-rt6hc6"&&(j.textContent=Ro),al=o(e),F=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(F)!=="svelte-1saltuh"&&(F.textContent=Oo),il=o(e),I=a(e,"P",{class:!0,"data-svelte-h":!0}),r(I)!=="svelte-1ycs3m5"&&(I.innerHTML=jo),rl=o(e),x(S.$$.fragment,e),ul=o(e),D=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(D)!=="svelte-1mchdu6"&&(D.textContent=Fo),cl=o(e),B=a(e,"P",{class:!0,"data-svelte-h":!0}),r(B)!=="svelte-57n192"&&(B.innerHTML=Io),vl=o(e),x(ft.$$.fragment,e),fl=o(e),A=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(A)!=="svelte-18d505f"&&(A.textContent=So),pl=o(e),V=a(e,"P",{class:!0,"data-svelte-h":!0}),r(V)!=="svelte-3000qg"&&(V.innerHTML=Do),ml=o(e),x(pt.$$.fragment,e),xl=o(e),U=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(U)!=="svelte-4az0ad"&&(U.textContent=Bo),wl=o(e),G=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(G)!=="svelte-1e5nyus"&&(G.textContent=Ao),Cl=o(e),R=a(e,"P",{class:!0});var t=E(R);vo=$(t,`Centralize appearance first — everything downstream reads from it. Colors are
  `),Yt=a(t,"CODE",{});var Ta=E(Yt);fo=$(Ta,Vo),Ta.forEach(l),po=$(t," tables in 0–1 range; metrics are plain numbers."),t.forEach(l),hl=o(e),x(mt.$$.fragment,e),bl=o(e),W=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(W)!=="svelte-f9n012"&&(W.textContent=Uo),$l=o(e),N=a(e,"P",{class:!0,"data-svelte-h":!0}),r(N)!=="svelte-1rncxi2"&&(N.innerHTML=Go),ql=o(e),K=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(K)!=="svelte-k5ebck"&&(K.textContent=Wo),yl=o(e),Q=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Q)!=="svelte-9vaoci"&&(Q.innerHTML=No),_l=o(e),J=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(J)!=="svelte-mr5hcw"&&(J.textContent=Ko),zl=o(e),X=a(e,"P",{class:!0,"data-svelte-h":!0}),r(X)!=="svelte-1pt2wy2"&&(X.innerHTML=Qo),Hl=o(e),Y=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Y)!=="svelte-1sbhu2v"&&(Y.textContent=Jo),Tl=o(e),Z=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Z)!=="svelte-ianbak"&&(Z.innerHTML=Xo),kl=o(e),ee=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ee)!=="svelte-1vklq9b"&&(ee.textContent=Yo),Ll=o(e),te=a(e,"P",{class:!0,"data-svelte-h":!0}),r(te)!=="svelte-5cjznj"&&(te.innerHTML=Zo),gl=o(e),x(xt.$$.fragment,e),Ml=o(e),le=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(le)!=="svelte-uyd81s"&&(le.textContent=en),Pl=o(e),se=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(se)!=="svelte-yx93gj"&&(se.textContent=tn),El=o(e),oe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(oe)!=="svelte-1uaxt6u"&&(oe.innerHTML=ln),Rl=o(e),wt=a(e,"UL",{"data-svelte-h":!0}),r(wt)!=="svelte-gtpceo"&&(wt.innerHTML=sn),Ol=o(e),ne=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ne)!=="svelte-1jpvvuf"&&(ne.textContent=on),jl=o(e),Ct=a(e,"OL",{"data-svelte-h":!0}),r(Ct)!=="svelte-w5ur2f"&&(Ct.innerHTML=nn),Fl=o(e),ae=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ae)!=="svelte-4vpls2"&&(ae.textContent=an),Il=o(e),ie=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ie)!=="svelte-wor8zw"&&(ie.textContent=rn),Sl=o(e),ht=a(e,"UL",{"data-svelte-h":!0}),r(ht)!=="svelte-x8c920"&&(ht.innerHTML=dn),Dl=o(e),re=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(re)!=="svelte-hcw1m1"&&(re.textContent=un),Bl=o(e),de=a(e,"P",{class:!0,"data-svelte-h":!0}),r(de)!=="svelte-1gmffub"&&(de.innerHTML=cn),Al=o(e),ue=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(ue)!=="svelte-12y660q"&&(ue.textContent=vn),Vl=o(e),ce=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ce)!=="svelte-1dyfa02"&&(ce.textContent=fn),Ul=o(e),ve=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ve)!=="svelte-12x47ag"&&(ve.textContent=pn),Gl=o(e),x(bt.$$.fragment,e),Wl=o(e),fe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(fe)!=="svelte-j22sr6"&&(fe.textContent=mn),Nl=o(e),pe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(pe)!=="svelte-10b9vr4"&&(pe.textContent=xn),Kl=o(e),x($t.$$.fragment,e),Ql=o(e),me=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(me)!=="svelte-1npf6tc"&&(me.textContent=wn),Jl=o(e),xe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(xe)!=="svelte-r8pldb"&&(xe.innerHTML=Cn),Xl=o(e),x(qt.$$.fragment,e),Yl=o(e),we=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(we)!=="svelte-hgvw3f"&&(we.textContent=hn),Zl=o(e),Ce=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ce)!=="svelte-b54335"&&(Ce.innerHTML=bn),es=o(e),he=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(he)!=="svelte-1f00ybh"&&(he.textContent=$n),ts=o(e),be=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(be)!=="svelte-1c8s5hr"&&(be.textContent=qn),ls=o(e),$e=a(e,"P",{class:!0,"data-svelte-h":!0}),r($e)!=="svelte-1fmp5kt"&&($e.innerHTML=yn),ss=o(e),x(yt.$$.fragment,e),os=o(e),qe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(qe)!=="svelte-2g24hc"&&(qe.textContent=_n),ns=o(e),ye=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ye)!=="svelte-13ylt4g"&&(ye.innerHTML=zn),as=o(e),x(_t.$$.fragment,e),is=o(e),_e=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(_e)!=="svelte-vb0dzy"&&(_e.textContent=Hn),rs=o(e),ze=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ze)!=="svelte-ftptio"&&(ze.textContent=Tn),ds=o(e),He=a(e,"P",{class:!0,"data-svelte-h":!0}),r(He)!=="svelte-1m48ww4"&&(He.innerHTML=kn),us=o(e),x(zt.$$.fragment,e),cs=o(e),Te=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Te)!=="svelte-1y13bt6"&&(Te.textContent=Ln),vs=o(e),ke=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ke)!=="svelte-1clac28"&&(ke.innerHTML=gn),fs=o(e),x(Ht.$$.fragment,e),ps=o(e),Le=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Le)!=="svelte-oe7fv2"&&(Le.textContent=Mn),ms=o(e),ge=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ge)!=="svelte-10akiuk"&&(ge.innerHTML=Pn),xs=o(e),Me=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Me)!=="svelte-f8rk4k"&&(Me.textContent=En),ws=o(e),Pe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Pe)!=="svelte-1goahes"&&(Pe.textContent=Rn),Cs=o(e),Ee=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ee)!=="svelte-1pslxau"&&(Ee.innerHTML=On),hs=o(e),Re=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Re)!=="svelte-7uc34t"&&(Re.textContent=jn),bs=o(e),Oe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Oe)!=="svelte-401y4x"&&(Oe.innerHTML=Fn),$s=o(e),x(Tt.$$.fragment,e),qs=o(e),je=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(je)!=="svelte-akwu4m"&&(je.textContent=In),ys=o(e),Fe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Fe)!=="svelte-1pcyvpq"&&(Fe.innerHTML=Sn),_s=o(e),Ie=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ie)!=="svelte-uivd0d"&&(Ie.textContent=Dn),zs=o(e),Se=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Se)!=="svelte-12ud5s"&&(Se.innerHTML=Bn),Hs=o(e),x(kt.$$.fragment,e),Ts=o(e),De=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(De)!=="svelte-1qusoxt"&&(De.textContent=An),ks=o(e),Be=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Be)!=="svelte-1n5in4b"&&(Be.innerHTML=Vn),Ls=o(e),x(Lt.$$.fragment,e),gs=o(e),Ae=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ae)!=="svelte-1h69z55"&&(Ae.textContent=Un),Ms=o(e),L=a(e,"P",{class:!0});var Qt=E(L);mo=$(Qt,"Overlays are pushed with "),Zt=a(Qt,"CODE",{});var ka=E(Zt);xo=$(ka,Gn),ka.forEach(l),wo=$(Qt,` and
  popped with `),Wt=a(Qt,"CODE",{"data-svelte-h":!0}),r(Wt)!=="svelte-27cc14"&&(Wt.textContent=Wn),Co=$(Qt,`. A modal traps all input; a non-modal (dropdown,
  tooltip) is dismissed when a press lands outside it.`),Qt.forEach(l),Ps=o(e),x(gt.$$.fragment,e),Es=o(e),Ve=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ve)!=="svelte-1qw9eip"&&(Ve.textContent=Nn),Rs=o(e),Ue=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ue)!=="svelte-wdkbr4"&&(Ue.textContent=Kn),Os=o(e),Ge=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Ge)!=="svelte-wl2dfl"&&(Ge.textContent=Qn),js=o(e),We=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(We)!=="svelte-1mh89j8"&&(We.textContent=Jn),Fs=o(e),Ne=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ne)!=="svelte-12mb01c"&&(Ne.innerHTML=Xn),Is=o(e),x(Mt.$$.fragment,e),Ss=o(e),Ke=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ke)!=="svelte-it1tfh"&&(Ke.textContent=Yn),Ds=o(e),Qe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Qe)!=="svelte-58hlob"&&(Qe.innerHTML=Zn),Bs=o(e),Je=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Je)!=="svelte-4p0inm"&&(Je.textContent=ea),As=o(e),Xe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Xe)!=="svelte-1dysdku"&&(Xe.textContent=ta),Vs=o(e),b=a(e,"UL",{});var M=E(b);Pt=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Pt)!=="svelte-12118vu"&&(Pt.innerHTML=la),ho=o(M),Et=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Et)!=="svelte-1q33zwm"&&(Et.innerHTML=sa),bo=o(M),Rt=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Rt)!=="svelte-eu98qt"&&(Rt.innerHTML=oa),$o=o(M),O=a(M,"LI",{class:!0});var ll=E(O);Nt=a(ll,"STRONG",{"data-svelte-h":!0}),r(Nt)!=="svelte-liunt2"&&(Nt.textContent=na),qo=$(ll," — opens a popup at a point via "),el=a(ll,"CODE",{});var La=E(el);yo=$(La,aa),La.forEach(l),_o=$(ll,"."),ll.forEach(l),zo=o(M),Ot=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Ot)!=="svelte-x7alke"&&(Ot.innerHTML=ia),M.forEach(l),Us=o(e),Ye=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Ye)!=="svelte-1g1xmxb"&&(Ye.textContent=ra),Gs=o(e),Ze=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ze)!=="svelte-1cf1sh6"&&(Ze.textContent=da),Ws=o(e),et=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(et)!=="svelte-19t6wjf"&&(et.textContent=ua),Ns=o(e),tt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(tt)!=="svelte-1wwily3"&&(tt.textContent=ca),Ks=o(e),x(jt.$$.fragment,e),Qs=o(e),lt=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(lt)!=="svelte-pqen6f"&&(lt.textContent=va),Js=o(e),st=a(e,"P",{class:!0,"data-svelte-h":!0}),r(st)!=="svelte-1qb0b7g"&&(st.innerHTML=fa),Xs=o(e),x(Ft.$$.fragment,e),Ys=o(e),ot=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ot)!=="svelte-onrav6"&&(ot.textContent=pa),Zs=o(e),nt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(nt)!=="svelte-ipbl0h"&&(nt.textContent=ma),eo=o(e),x(It.$$.fragment,e),to=o(e),at=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(at)!=="svelte-ylgcha"&&(at.textContent=xa),lo=o(e),it=a(e,"P",{class:!0,"data-svelte-h":!0}),r(it)!=="svelte-474c04"&&(it.innerHTML=wa),so=o(e),x(St.$$.fragment,e),oo=o(e),x(Dt.$$.fragment,e),no=o(e),rt=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(rt)!=="svelte-nrcuad"&&(rt.textContent=Ca),ao=o(e),dt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(dt)!=="svelte-145cgp4"&&(dt.textContent=ha),io=o(e),T=a(e,"UL",{});var ct=E(T);g=a(ct,"LI",{class:!0});var Jt=E(g);Ho=$(Jt,"Local module pattern: "),tl=a(Jt,"CODE",{});var ga=E(tl);To=$(ga,ba),ga.forEach(l),ko=$(Jt," … "),Kt=a(Jt,"CODE",{"data-svelte-h":!0}),r(Kt)!=="svelte-1d8fdvd"&&(Kt.textContent=$a),Lo=$(Jt,". 2-space indent, no tabs."),Jt.forEach(l),go=o(ct),Bt=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(Bt)!=="svelte-1mkd5p9"&&(Bt.innerHTML=qa),Mo=o(ct),At=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(At)!=="svelte-103b4kd"&&(At.textContent=ya),Po=o(ct),Vt=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(Vt)!=="svelte-7xrk12"&&(Vt.innerHTML=_a),ct.forEach(l),ro=o(e),ut=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ut)!=="svelte-lyoaw"&&(ut.innerHTML=za),uo=o(e),Ut=a(e,"OL",{"data-svelte-h":!0}),r(Ut)!=="svelte-v4viqq"&&(Ut.innerHTML=Ha),this.h()},h(){d(H,"class","lead svelte-1qzvwo1"),d(y,"class","svelte-1qzvwo1"),d(_,"class","svelte-1qzvwo1"),d(j,"class","svelte-1qzvwo1"),d(F,"class","svelte-1qzvwo1"),d(I,"class","svelte-1qzvwo1"),d(D,"class","svelte-1qzvwo1"),d(B,"class","svelte-1qzvwo1"),d(A,"class","svelte-1qzvwo1"),d(V,"class","svelte-1qzvwo1"),d(U,"class","svelte-1qzvwo1"),d(G,"class","svelte-1qzvwo1"),d(R,"class","svelte-1qzvwo1"),d(W,"class","svelte-1qzvwo1"),d(N,"class","svelte-1qzvwo1"),d(K,"class","svelte-1qzvwo1"),d(Q,"class","svelte-1qzvwo1"),d(J,"class","svelte-1qzvwo1"),d(X,"class","svelte-1qzvwo1"),d(Y,"class","svelte-1qzvwo1"),d(Z,"class","svelte-1qzvwo1"),d(ee,"class","svelte-1qzvwo1"),d(te,"class","svelte-1qzvwo1"),d(le,"class","svelte-1qzvwo1"),d(se,"class","svelte-1qzvwo1"),d(oe,"class","svelte-1qzvwo1"),d(ne,"class","svelte-1qzvwo1"),d(ae,"class","svelte-1qzvwo1"),d(ie,"class","svelte-1qzvwo1"),d(re,"class","svelte-1qzvwo1"),d(de,"class","svelte-1qzvwo1"),d(ue,"class","svelte-1qzvwo1"),d(ce,"class","svelte-1qzvwo1"),d(ve,"class","svelte-1qzvwo1"),d(fe,"class","svelte-1qzvwo1"),d(pe,"class","svelte-1qzvwo1"),d(me,"class","svelte-1qzvwo1"),d(xe,"class","svelte-1qzvwo1"),d(we,"class","svelte-1qzvwo1"),d(Ce,"class","svelte-1qzvwo1"),d(he,"class","svelte-1qzvwo1"),d(be,"class","svelte-1qzvwo1"),d($e,"class","svelte-1qzvwo1"),d(qe,"class","svelte-1qzvwo1"),d(ye,"class","svelte-1qzvwo1"),d(_e,"class","svelte-1qzvwo1"),d(ze,"class","svelte-1qzvwo1"),d(He,"class","svelte-1qzvwo1"),d(Te,"class","svelte-1qzvwo1"),d(ke,"class","svelte-1qzvwo1"),d(Le,"class","svelte-1qzvwo1"),d(ge,"class","svelte-1qzvwo1"),d(Me,"class","svelte-1qzvwo1"),d(Pe,"class","svelte-1qzvwo1"),d(Ee,"class","svelte-1qzvwo1"),d(Re,"class","svelte-1qzvwo1"),d(Oe,"class","svelte-1qzvwo1"),d(je,"class","svelte-1qzvwo1"),d(Fe,"class","svelte-1qzvwo1"),d(Ie,"class","svelte-1qzvwo1"),d(Se,"class","svelte-1qzvwo1"),d(De,"class","svelte-1qzvwo1"),d(Be,"class","svelte-1qzvwo1"),d(Ae,"class","svelte-1qzvwo1"),d(L,"class","svelte-1qzvwo1"),d(Ve,"class","svelte-1qzvwo1"),d(Ue,"class","svelte-1qzvwo1"),d(Ge,"class","svelte-1qzvwo1"),d(We,"class","svelte-1qzvwo1"),d(Ne,"class","svelte-1qzvwo1"),d(Ke,"class","svelte-1qzvwo1"),d(Qe,"class","svelte-1qzvwo1"),d(Je,"class","svelte-1qzvwo1"),d(Xe,"class","svelte-1qzvwo1"),d(Pt,"class","svelte-1qzvwo1"),d(Et,"class","svelte-1qzvwo1"),d(Rt,"class","svelte-1qzvwo1"),d(O,"class","svelte-1qzvwo1"),d(Ot,"class","svelte-1qzvwo1"),d(Ye,"class","svelte-1qzvwo1"),d(Ze,"class","svelte-1qzvwo1"),d(et,"class","svelte-1qzvwo1"),d(tt,"class","svelte-1qzvwo1"),d(lt,"class","svelte-1qzvwo1"),d(st,"class","svelte-1qzvwo1"),d(ot,"class","svelte-1qzvwo1"),d(nt,"class","svelte-1qzvwo1"),d(at,"class","svelte-1qzvwo1"),d(it,"class","svelte-1qzvwo1"),d(rt,"class","svelte-1qzvwo1"),d(dt,"class","svelte-1qzvwo1"),d(g,"class","svelte-1qzvwo1"),d(Bt,"class","svelte-1qzvwo1"),d(At,"class","svelte-1qzvwo1"),d(Vt,"class","svelte-1qzvwo1"),d(ut,"class","svelte-1qzvwo1")},m(e,t){s(e,k,t),s(e,z,t),s(e,H,t),s(e,Gt,t),s(e,y,t),s(e,h,t),s(e,_,t),s(e,ol,t),s(e,vt,t),s(e,nl,t),s(e,j,t),s(e,al,t),s(e,F,t),s(e,il,t),s(e,I,t),s(e,rl,t),m(S,e,t),s(e,ul,t),s(e,D,t),s(e,cl,t),s(e,B,t),s(e,vl,t),m(ft,e,t),s(e,fl,t),s(e,A,t),s(e,pl,t),s(e,V,t),s(e,ml,t),m(pt,e,t),s(e,xl,t),s(e,U,t),s(e,wl,t),s(e,G,t),s(e,Cl,t),s(e,R,t),u(R,vo),u(R,Yt),u(Yt,fo),u(R,po),s(e,hl,t),m(mt,e,t),s(e,bl,t),s(e,W,t),s(e,$l,t),s(e,N,t),s(e,ql,t),s(e,K,t),s(e,yl,t),s(e,Q,t),s(e,_l,t),s(e,J,t),s(e,zl,t),s(e,X,t),s(e,Hl,t),s(e,Y,t),s(e,Tl,t),s(e,Z,t),s(e,kl,t),s(e,ee,t),s(e,Ll,t),s(e,te,t),s(e,gl,t),m(xt,e,t),s(e,Ml,t),s(e,le,t),s(e,Pl,t),s(e,se,t),s(e,El,t),s(e,oe,t),s(e,Rl,t),s(e,wt,t),s(e,Ol,t),s(e,ne,t),s(e,jl,t),s(e,Ct,t),s(e,Fl,t),s(e,ae,t),s(e,Il,t),s(e,ie,t),s(e,Sl,t),s(e,ht,t),s(e,Dl,t),s(e,re,t),s(e,Bl,t),s(e,de,t),s(e,Al,t),s(e,ue,t),s(e,Vl,t),s(e,ce,t),s(e,Ul,t),s(e,ve,t),s(e,Gl,t),m(bt,e,t),s(e,Wl,t),s(e,fe,t),s(e,Nl,t),s(e,pe,t),s(e,Kl,t),m($t,e,t),s(e,Ql,t),s(e,me,t),s(e,Jl,t),s(e,xe,t),s(e,Xl,t),m(qt,e,t),s(e,Yl,t),s(e,we,t),s(e,Zl,t),s(e,Ce,t),s(e,es,t),s(e,he,t),s(e,ts,t),s(e,be,t),s(e,ls,t),s(e,$e,t),s(e,ss,t),m(yt,e,t),s(e,os,t),s(e,qe,t),s(e,ns,t),s(e,ye,t),s(e,as,t),m(_t,e,t),s(e,is,t),s(e,_e,t),s(e,rs,t),s(e,ze,t),s(e,ds,t),s(e,He,t),s(e,us,t),m(zt,e,t),s(e,cs,t),s(e,Te,t),s(e,vs,t),s(e,ke,t),s(e,fs,t),m(Ht,e,t),s(e,ps,t),s(e,Le,t),s(e,ms,t),s(e,ge,t),s(e,xs,t),s(e,Me,t),s(e,ws,t),s(e,Pe,t),s(e,Cs,t),s(e,Ee,t),s(e,hs,t),s(e,Re,t),s(e,bs,t),s(e,Oe,t),s(e,$s,t),m(Tt,e,t),s(e,qs,t),s(e,je,t),s(e,ys,t),s(e,Fe,t),s(e,_s,t),s(e,Ie,t),s(e,zs,t),s(e,Se,t),s(e,Hs,t),m(kt,e,t),s(e,Ts,t),s(e,De,t),s(e,ks,t),s(e,Be,t),s(e,Ls,t),m(Lt,e,t),s(e,gs,t),s(e,Ae,t),s(e,Ms,t),s(e,L,t),u(L,mo),u(L,Zt),u(Zt,xo),u(L,wo),u(L,Wt),u(L,Co),s(e,Ps,t),m(gt,e,t),s(e,Es,t),s(e,Ve,t),s(e,Rs,t),s(e,Ue,t),s(e,Os,t),s(e,Ge,t),s(e,js,t),s(e,We,t),s(e,Fs,t),s(e,Ne,t),s(e,Is,t),m(Mt,e,t),s(e,Ss,t),s(e,Ke,t),s(e,Ds,t),s(e,Qe,t),s(e,Bs,t),s(e,Je,t),s(e,As,t),s(e,Xe,t),s(e,Vs,t),s(e,b,t),u(b,Pt),u(b,ho),u(b,Et),u(b,bo),u(b,Rt),u(b,$o),u(b,O),u(O,Nt),u(O,qo),u(O,el),u(el,yo),u(O,_o),u(b,zo),u(b,Ot),s(e,Us,t),s(e,Ye,t),s(e,Gs,t),s(e,Ze,t),s(e,Ws,t),s(e,et,t),s(e,Ns,t),s(e,tt,t),s(e,Ks,t),m(jt,e,t),s(e,Qs,t),s(e,lt,t),s(e,Js,t),s(e,st,t),s(e,Xs,t),m(Ft,e,t),s(e,Ys,t),s(e,ot,t),s(e,Zs,t),s(e,nt,t),s(e,eo,t),m(It,e,t),s(e,to,t),s(e,at,t),s(e,lo,t),s(e,it,t),s(e,so,t),m(St,e,t),s(e,oo,t),m(Dt,e,t),s(e,no,t),s(e,rt,t),s(e,ao,t),s(e,dt,t),s(e,io,t),s(e,T,t),u(T,g),u(g,Ho),u(g,tl),u(tl,To),u(g,ko),u(g,Kt),u(g,Lo),u(T,go),u(T,Bt),u(T,Mo),u(T,At),u(T,Po),u(T,Vt),s(e,ro,t),s(e,ut,t),s(e,uo,t),s(e,Ut,t),co=!0},p:Pa,i(e){co||(f(S.$$.fragment,e),f(ft.$$.fragment,e),f(pt.$$.fragment,e),f(mt.$$.fragment,e),f(xt.$$.fragment,e),f(bt.$$.fragment,e),f($t.$$.fragment,e),f(qt.$$.fragment,e),f(yt.$$.fragment,e),f(_t.$$.fragment,e),f(zt.$$.fragment,e),f(Ht.$$.fragment,e),f(Tt.$$.fragment,e),f(kt.$$.fragment,e),f(Lt.$$.fragment,e),f(gt.$$.fragment,e),f(Mt.$$.fragment,e),f(jt.$$.fragment,e),f(Ft.$$.fragment,e),f(It.$$.fragment,e),f(St.$$.fragment,e),f(Dt.$$.fragment,e),co=!0)},o(e){v(S.$$.fragment,e),v(ft.$$.fragment,e),v(pt.$$.fragment,e),v(mt.$$.fragment,e),v(xt.$$.fragment,e),v(bt.$$.fragment,e),v($t.$$.fragment,e),v(qt.$$.fragment,e),v(yt.$$.fragment,e),v(_t.$$.fragment,e),v(zt.$$.fragment,e),v(Ht.$$.fragment,e),v(Tt.$$.fragment,e),v(kt.$$.fragment,e),v(Lt.$$.fragment,e),v(gt.$$.fragment,e),v(Mt.$$.fragment,e),v(jt.$$.fragment,e),v(Ft.$$.fragment,e),v(It.$$.fragment,e),v(St.$$.fragment,e),v(Dt.$$.fragment,e),co=!1},d(e){e&&(l(k),l(z),l(H),l(Gt),l(y),l(h),l(_),l(ol),l(vt),l(nl),l(j),l(al),l(F),l(il),l(I),l(rl),l(ul),l(D),l(cl),l(B),l(vl),l(fl),l(A),l(pl),l(V),l(ml),l(xl),l(U),l(wl),l(G),l(Cl),l(R),l(hl),l(bl),l(W),l($l),l(N),l(ql),l(K),l(yl),l(Q),l(_l),l(J),l(zl),l(X),l(Hl),l(Y),l(Tl),l(Z),l(kl),l(ee),l(Ll),l(te),l(gl),l(Ml),l(le),l(Pl),l(se),l(El),l(oe),l(Rl),l(wt),l(Ol),l(ne),l(jl),l(Ct),l(Fl),l(ae),l(Il),l(ie),l(Sl),l(ht),l(Dl),l(re),l(Bl),l(de),l(Al),l(ue),l(Vl),l(ce),l(Ul),l(ve),l(Gl),l(Wl),l(fe),l(Nl),l(pe),l(Kl),l(Ql),l(me),l(Jl),l(xe),l(Xl),l(Yl),l(we),l(Zl),l(Ce),l(es),l(he),l(ts),l(be),l(ls),l($e),l(ss),l(os),l(qe),l(ns),l(ye),l(as),l(is),l(_e),l(rs),l(ze),l(ds),l(He),l(us),l(cs),l(Te),l(vs),l(ke),l(fs),l(ps),l(Le),l(ms),l(ge),l(xs),l(Me),l(ws),l(Pe),l(Cs),l(Ee),l(hs),l(Re),l(bs),l(Oe),l($s),l(qs),l(je),l(ys),l(Fe),l(_s),l(Ie),l(zs),l(Se),l(Hs),l(Ts),l(De),l(ks),l(Be),l(Ls),l(gs),l(Ae),l(Ms),l(L),l(Ps),l(Es),l(Ve),l(Rs),l(Ue),l(Os),l(Ge),l(js),l(We),l(Fs),l(Ne),l(Is),l(Ss),l(Ke),l(Ds),l(Qe),l(Bs),l(Je),l(As),l(Xe),l(Vs),l(b),l(Us),l(Ye),l(Gs),l(Ze),l(Ws),l(et),l(Ns),l(tt),l(Ks),l(Qs),l(lt),l(Js),l(st),l(Xs),l(Ys),l(ot),l(Zs),l(nt),l(eo),l(to),l(at),l(lo),l(it),l(so),l(oo),l(no),l(rt),l(ao),l(dt),l(io),l(T),l(ro),l(ut),l(uo),l(Ut)),p(S,e),p(ft,e),p(pt,e),p(mt,e),p(xt,e),p(bt,e),p($t,e),p(qt,e),p(yt,e),p(_t,e),p(zt,e),p(Ht,e),p(Tt,e),p(kt,e),p(Lt,e),p(gt,e),p(Mt,e),p(jt,e),p(Ft,e),p(It,e),p(St,e),p(Dt,e)}}}function Va(c){let k,P="Construindo o foxloves do zero",z,H,Xt=`Um passo a passo completo de como a biblioteca é construída, camada por camada,
  na ordem em que você a montaria. O foxloves é Lua puro para LÖVE 11.x, sem
  dependências: um tema compartilhado, um conjunto de widgets que seguem um único
  contrato de ciclo de vida, um <code>Root</code> que os controla e uma suíte de
  testes headless.`,Gt,y,dl="1. Princípios de design",h,_,sl="Quatro restrições moldam cada decisão. Tenha-as em mente ao ler o restante.",ol,vt,Eo='<li class="svelte-1qzvwo1"><strong>Sem dependências.</strong> Apenas Lua puro e a API do LÖVE. Entra em qualquer projeto love2d copiando uma pasta.</li> <li class="svelte-1qzvwo1"><strong>Um ciclo de vida.</strong> Cada widget implementa os mesmos poucos métodos, então o host controla uma lista heterogênea de widgets em um único laço.</li> <li class="svelte-1qzvwo1"><strong>Orientado a tema.</strong> Nenhum widget fixa cor ou métrica no código; toda a aparência vem de uma tabela de tema, então um jogo re-estiliza a interface inteira trocando uma tabela.</li> <li class="svelte-1qzvwo1"><strong>Testável headless.</strong> Um mock da API do LÖVE permite rodar toda a suíte em CI sem janela.</li>',nl,j,Ro="2. Estrutura do projeto",al,F,Oo="2.1 Organização de pastas",il,I,jo="A biblioteca fica em uma pasta interna <code>foxloves/</code> (a raiz do require); a pasta externa contém a demo e os testes.",rl,S,ul,D,Fo="2.2 Configuração da janela",cl,B,Io="<code>conf.lua</code> é o hook de pré-inicialização do LÖVE — defina a janela aqui.",vl,ft,fl,A,So="2.3 Resolução de módulos",pl,V,Do=`<code>require(&quot;foxloves&quot;)</code> carrega <code>foxloves/init.lua</code>, que retorna uma
  tabela com todos os widgets além de <code>theme</code> e <code>util</code>. Submódulos
  resolvem por caminho pontuado a partir da raiz do projeto.`,ml,pt,xl,U,Bo="3. O tema",wl,G,Ao="3.1 Cores e métricas",Cl,R,vo,Yt,Vo="{r, g, b, a}",fo,po,hl,mt,bl,W,Uo="3.2 Resolução de fonte e overrides",$l,N,Go=`<code>getFont</code> resolve a fonte ativa por ordem de prioridade: o tema do próprio
  widget, depois o padrão do módulo, depois a fonte atual do LÖVE. Cada widget aceita um
  <code>theme</code> opcional em suas opções e recorre a esse padrão, então um widget pode
  ser re-estilizado sem afetar os demais.`,ql,K,Wo="3.3 Cores semânticas de status",yl,Q,No=`<code>info</code>, <code>success</code>, <code>warning</code> e <code>error</code> dão aos
  widgets de status (Toast, Badge) um vocabulário compartilhado em vez de tons ad-hoc. Veja a
  <a href="${Ea}/foundations/theme">referência de tema</a> para as amostras ao vivo.`,_l,J,Ko="4. Helpers compartilhados",zl,X,Qo="Antes do primeiro widget, um pequeno módulo <code>util</code> para o que todo widget repete.",Hl,Y,Jo="4.1 Geometria",Tl,Z,Xo="<code>contains</code> alimenta o teste de acerto de cada widget; <code>clamp</code> limita valores de slider/stepper.",kl,ee,Yo="4.2 Anel de foco e verificação de foco",Ll,te,Zo=`<code>focusRing</code> desenha o contorno de foco do teclado; <code>isFocused</code> pergunta
  ao <code>Root</code> do widget se ele está com o foco no momento. Ambos mantêm o modelo de
  foco consistente entre os widgets.`,gl,xt,Ml,le,en="5. O contrato do widget",Pl,se,tn="5.1 Os seis métodos do ciclo de vida",El,oe,ln="Cada widget é um módulo que retorna uma fábrica <code>Widget.new(opts)</code> e implementa:",Rl,wt,sn='<li class="svelte-1qzvwo1"><code>update(dt)</code> — lógica por quadro (hover, piscar do cursor).</li> <li class="svelte-1qzvwo1"><code>draw()</code> — desenha com <code>love.graphics</code>, restaurando o estado de cor anterior.</li> <li class="svelte-1qzvwo1"><code>mousepressed / mousereleased(x, y, btn)</code> — retornam <code>true</code> quando consumidos.</li> <li class="svelte-1qzvwo1"><code>keypressed(key)</code>, <code>textinput(text)</code> — entrada de teclado.</li>',Ol,ne,on="5.2 As cinco regras",jl,Ct,nn='<li class="svelte-1qzvwo1">Nunca chame <code>setColor</code> sem restaurar o estado anterior; leia todas as cores/métricas do tema.</li> <li class="svelte-1qzvwo1">Widgets guardam o próprio estado — sem globais.</li> <li class="svelte-1qzvwo1">Manipuladores de entrada retornam <code>true</code> quando consomem o evento, para o chamador interromper a propagação.</li> <li class="svelte-1qzvwo1">Callbacks (<code>onClick</code>, <code>onChange</code>) vêm de <code>opts</code> e são opcionais.</li> <li class="svelte-1qzvwo1">Documente a API pública em um bloco de comentário acima de <code>new</code>.</li>',Fl,ae,an="5.3 Ganchos adicionais opcionais",Il,ie,rn="Presentes apenas onde fazem sentido — os seis métodos centrais são estáveis e nunca crescem:",Sl,ht,dn='<li class="svelte-1qzvwo1"><code>focusable = true</code> — participa da navegação por Tab; desenhe um anel e condicione a ativação por teclado a <code>isFocused</code>.</li> <li class="svelte-1qzvwo1"><code>setFocused(bool)</code> — deixa o <code>Root</code> sincronizar a flag de foco do próprio widget (o Textbox usa).</li> <li class="svelte-1qzvwo1"><code>wheelmoved(dx, dy)</code> — widgets roláveis; a roda não tem coordenadas, então o widget verifica o mouse contra os próprios limites.</li> <li class="svelte-1qzvwo1"><code>mousemoved(x, y, dx, dy)</code> — hover orientado a eventos em coordenadas locais.</li>',Dl,re,un="5.4 O modelo de coordenadas",Bl,de,cn=`Os manipuladores recebem coordenadas já no espaço do próprio widget. Um
  <code>Container</code> subtrai a origem do conteúdo antes de repassar, então um widget
  aninhado em um Panel testa acerto contra as mesmas coordenadas em que foi posicionado.
  Prefira <code>mousemoved</code> a consultar <code>love.mouse.getPosition()</code>, que
  retorna coordenadas de tela e falha dentro de um container transladado.`,Al,ue,vn="6. Primeiro widget: Button",Vl,ce,fn="6.1 Construtor e opções",Ul,ve,pn="Leia opções com padrões, guarde o tema, exponha campos de estado, participe do foco.",Gl,bt,Wl,fe,mn="6.2 Draw: preenchimentos por estado e restauração de cor",Nl,pe,xn="Os quatro passos numerados são o contrato em miniatura: salvar a cor, escolher um preenchimento do tema conforme o estado, desenhar (mais o anel de foco), restaurar.",Kl,$t,Ql,me,wn="6.3 Semântica de consumo",Jl,xe,Cn=`O press marca <code>pressed</code> e retorna <code>true</code>; o release dispara
  <code>onClick</code> apenas quando cai dentro <em>e</em> o press começou dentro — o
  comportamento padrão de botão que permite ao usuário deslizar para fora e cancelar.`,Xl,qt,Yl,we,hn="6.4 Ativação por teclado",Zl,Ce,bn="Condicionada ao foco: quando o Button está com o foco em um Root, Espaço/Enter disparam o mesmo <code>onClick</code>. (Mostrado no trecho acima.)",es,he,$n="7. Registre e execute",ts,be,qn="7.1 A tabela de exportação",ls,$e,yn="<code>init.lua</code> é a superfície pública; adicione cada novo widget aqui.",ss,yt,os,qe,_n="7.2 O laço de controle",ns,ye,zn="Crie widgets em <code>love.load</code> e repasse cada callback do LÖVE ao Root, deixando a interface consumir a entrada primeiro.",as,_t,is,_e,Hn="8. Entrada com estado: Textbox",rs,ze,Tn="8.1 Foco que o Root pode sincronizar",ds,He,kn=`Diferente do Button, um Textbox mantém a própria flag <code>focused</code> e expõe
  <code>setFocused</code> para o <code>Root</code> manter o foco gerenciado e a flag da caixa
  em sincronia quando o Tab move o foco para dentro ou fora.`,us,zt,cs,Te,Ln="8.2 Digitação e edição",vs,ke,gn=`<code>textinput</code> insere caracteres na posição do cursor (respeitando
  <code>maxLength</code>); <code>keypressed</code> trata teclas de edição. O widget real também
  faz movimento de cursor, saltos por palavra, uma seleção de intervalo e recortar/copiar/colar
  via área de transferência do sistema — tudo sobre o mesmo <code>value</code> indexado por bytes.`,fs,Ht,ps,Le,Mn="8.3 Callbacks de mudança e envio",ms,ge,Pn=`<code>onChange(newValue)</code> dispara a cada edição; Enter dispara <code>onSubmit(value)</code>
  e tira o foco pelo Root, limpando também o foco de teclado.`,xs,Me,En="9. Widgets de valor: o padrão Toggle",ws,Pe,Rn="9.1 Valor mais onChange",Cs,Ee,On=`Checkbox, Toggle, Slider e Stepper compartilham a forma: guardar um valor, alterá-lo na
  interação e disparar <code>onChange(value)</code> apenas quando ele realmente muda.`,hs,Re,jn="9.2 Animação no update",bs,Oe,Fn=`Mudanças de estado são instantâneas, mas os visuais suavizam. O Toggle guarda um valor
  <code>anim</code> em <code>[0, 1]</code> e o avança em direção ao alvo a cada quadro no
  <code>update</code> — o mesmo padrão que Modal e Slider usam para o movimento de
  entrada/manípulo.`,$s,Tt,qs,je,In="10. fox.Root: o gerenciador",ys,Fe,Sn=`Widgets isolados funcionam, mas uma interface real precisa de ordem de profundidade, um
  único foco de teclado e sobreposições. O <code>Root</code> possui uma camada base mais uma
  pilha de sobreposições e roteia os eventos do LÖVE para elas.`,_s,Ie,Dn="10.1 A camada base",zs,Se,Bn="<code>add</code> registra um widget e define seu backref <code>.root</code>, para o widget depois abrir sobreposições ou limpar o foco.",Hs,kt,Ts,De,An="10.2 Foco de teclado e navegação por Tab",ks,Be,Vn=`<code>setFocus</code> move o foco e sincroniza qualquer widget com <code>setFocused</code>;
  Tab / Shift-Tab circulam entre widgets base focáveis. Uma sobreposição modal captura as
  teclas antes de a camada base vê-las.`,Ls,Lt,gs,Ae,Un="10.3 A pilha de sobreposições",Ms,L,mo,Zt,Gn="openOverlay(widget, { modal = bool })",xo,wo,Wt,Wn="closeOverlay",Co,Ps,gt,Es,Ve,Nn="10.4 Ordem de roteamento de eventos",Rs,Ue,Kn=`A entrada flui de cima para baixo: sobreposições primeiro (topo da pilha primeiro), depois
  widgets base, o primeiro que consome vence. O desenho vai ao contrário — base, depois
  sobreposições de baixo para cima — para as sobreposições posteriores pintarem por cima. Esc
  fecha a sobreposição do topo antes de qualquer outra coisa.`,Os,Ge,Qn="11. Containers e aninhamento",js,We,Jn="11.1 Coordenadas relativas",Fs,Ne,Xn=`<code>Container</code> é maquinário compartilhado (não um widget isolado) para widgets que
  contêm filhos. Ele translada por uma origem de conteúdo no <code>draw</code> e subtrai essa
  origem das coordenadas de entrada, então os filhos vivem em espaço local e o aninhamento compõe.`,Is,Mt,Ss,Ke,Yn="11.2 Construindo Panel e Tabs sobre ele",Ds,Qe,Zn=`O Panel embute um Container e fornece um <code>originFn</code> que aponta para sua área de
  conteúdo (dentro da barra de título e do espaçamento). O Tabs troca qual painel filho o
  Container desenha conforme o cabeçalho selecionado. Como cada nível aplica seu próprio
  deslocamento, um Button dentro de um Panel dentro de Tabs ainda recebe hover e cliques corretamente.`,Bs,Je,ea="12. Sobreposições",As,Xe,ta="Com Root e Container no lugar, sobreposições são apenas widgets empilhados:",Vs,b,Pt,la="<strong>Modal</strong> — scrim + diálogo centralizado com botões; captura a entrada; entra suavemente por um valor <code>anim</code>.",ho,Et,sa="<strong>Dropdown</strong> — um controle fechado que abre um popup rolável como sobreposição não-modal.",bo,Rt,oa="<strong>Tooltip</strong> — monitora o hover sobre um alvo e faz uma dica surgir perto do cursor.",$o,O,Nt,na="ContextMenu",qo,el,aa="root:openOverlay(popup, { modal = false })",yo,_o,zo,Ot,ia="<strong>ToastHost</strong> — uma pilha, em um canto, de mensagens transitórias, cada uma sumindo por um temporizador.",Us,Ye,ra="13. Testando headless",Gs,Ze,da="A suíte faz mock do LÖVE para rodar sem janela e cair direto em CI.",Ws,et,ua="13.1 O stub do LÖVE",Ns,tt,ca="Implemente apenas as chamadas que os widgets fazem; o desenho é no-op, as fontes são falsas com métricas fixas.",Ks,jt,Qs,lt,va="13.2 O harness",Js,st,fa="Instale o stub, carregue a biblioteca uma vez e exponha um <code>check</code> compartilhado mais contadores de aprovado/reprovado.",Xs,Ft,Ys,ot,pa="13.3 Escrevendo um caso",Zs,nt,ma=`Um caso constrói um widget, altera o estado, verifica que callbacks disparam e que a entrada
  é consumida ou ignorada corretamente, e desenha uma vez como teste de fumaça (nunca dá erro).`,eo,It,to,at,xa="13.4 Executando a suíte",lo,it,wa="Liste cada caso em <code>run.lua</code>; o executor sai com código diferente de zero em qualquer falha.",so,St,oo,Dt,no,rt,Ca="14. Convenções e crescimento",ao,dt,ha="O estilo da casa que mantém o sistema coerente conforme ele cresce:",io,T,g,Ho,tl,ba="local M = {}",To,ko,Kt,$a="return M",Lo,go,Bt,qa="Mantenha cada arquivo de widget abaixo de ~200 linhas; extraia lógica repetida para <code>util.lua</code> ou <code>container.lua</code>.",Mo,At,ya="Nomes descritivos; sem locais de uma letra, exceto índices de laço e coordenadas.",Po,Vt,_a="Commits convencionais (<code>feat</code>, <code>fix</code>, <code>docs</code>, <code>test</code>, <code>refactor</code>, <code>chore</code>), assunto imperativo ≤ 50 caracteres.",ro,ut,za="<strong>Checklist para adicionar um widget:</strong>",uo,Ut,Ha='<li class="svelte-1qzvwo1">Crie <code>foxloves/widgets/name.lua</code> com um <code>new</code> documentado e os seis métodos.</li> <li class="svelte-1qzvwo1">Leia toda a aparência do tema; adicione qualquer token faltante a <code>theme.lua</code>.</li> <li class="svelte-1qzvwo1">Registre-o em <code>init.lua</code>.</li> <li class="svelte-1qzvwo1">Adicione <code>tests/cases/name.lua</code> e liste-o em <code>run.lua</code>; rode <code>luajit tests/run.lua</code>.</li> <li class="svelte-1qzvwo1">Mostre-o em <code>main.lua</code> e exercite com <code>love .</code>.</li>',co;return S=new C({props:{code:c[1],lang:"text"}}),ft=new C({props:{code:c[2]}}),pt=new C({props:{code:c[3]}}),mt=new C({props:{code:c[4]}}),xt=new C({props:{code:c[5]}}),bt=new C({props:{code:c[6]}}),$t=new C({props:{code:c[7]}}),qt=new C({props:{code:c[8]}}),yt=new C({props:{code:c[9]}}),_t=new C({props:{code:c[10]}}),zt=new C({props:{code:c[11]}}),Ht=new C({props:{code:c[12]}}),Tt=new C({props:{code:c[13]}}),kt=new C({props:{code:c[14]}}),Lt=new C({props:{code:c[15]}}),gt=new C({props:{code:c[16]}}),Mt=new C({props:{code:c[17]}}),jt=new C({props:{code:c[18]}}),Ft=new C({props:{code:c[19]}}),It=new C({props:{code:c[20]}}),St=new C({props:{code:c[21]}}),Dt=new C({props:{code:"luajit tests/run.lua",lang:"bash"}}),{c(){k=i("h1"),k.textContent=P,z=n(),H=i("p"),H.innerHTML=Xt,Gt=n(),y=i("h2"),y.textContent=dl,h=n(),_=i("p"),_.textContent=sl,ol=n(),vt=i("ul"),vt.innerHTML=Eo,nl=n(),j=i("h2"),j.textContent=Ro,al=n(),F=i("h3"),F.textContent=Oo,il=n(),I=i("p"),I.innerHTML=jo,rl=n(),w(S.$$.fragment),ul=n(),D=i("h3"),D.textContent=Fo,cl=n(),B=i("p"),B.innerHTML=Io,vl=n(),w(ft.$$.fragment),fl=n(),A=i("h3"),A.textContent=So,pl=n(),V=i("p"),V.innerHTML=Do,ml=n(),w(pt.$$.fragment),xl=n(),U=i("h2"),U.textContent=Bo,wl=n(),G=i("h3"),G.textContent=Ao,Cl=n(),R=i("p"),vo=q(`Centralize a aparência primeiro — tudo depois lê dela. Cores são tabelas
  `),Yt=i("code"),fo=q(Vo),po=q(" no intervalo 0–1; métricas são números simples."),hl=n(),w(mt.$$.fragment),bl=n(),W=i("h3"),W.textContent=Uo,$l=n(),N=i("p"),N.innerHTML=Go,ql=n(),K=i("h3"),K.textContent=Wo,yl=n(),Q=i("p"),Q.innerHTML=No,_l=n(),J=i("h2"),J.textContent=Ko,zl=n(),X=i("p"),X.innerHTML=Qo,Hl=n(),Y=i("h3"),Y.textContent=Jo,Tl=n(),Z=i("p"),Z.innerHTML=Xo,kl=n(),ee=i("h3"),ee.textContent=Yo,Ll=n(),te=i("p"),te.innerHTML=Zo,gl=n(),w(xt.$$.fragment),Ml=n(),le=i("h2"),le.textContent=en,Pl=n(),se=i("h3"),se.textContent=tn,El=n(),oe=i("p"),oe.innerHTML=ln,Rl=n(),wt=i("ul"),wt.innerHTML=sn,Ol=n(),ne=i("h3"),ne.textContent=on,jl=n(),Ct=i("ol"),Ct.innerHTML=nn,Fl=n(),ae=i("h3"),ae.textContent=an,Il=n(),ie=i("p"),ie.textContent=rn,Sl=n(),ht=i("ul"),ht.innerHTML=dn,Dl=n(),re=i("h3"),re.textContent=un,Bl=n(),de=i("p"),de.innerHTML=cn,Al=n(),ue=i("h2"),ue.textContent=vn,Vl=n(),ce=i("h3"),ce.textContent=fn,Ul=n(),ve=i("p"),ve.textContent=pn,Gl=n(),w(bt.$$.fragment),Wl=n(),fe=i("h3"),fe.textContent=mn,Nl=n(),pe=i("p"),pe.textContent=xn,Kl=n(),w($t.$$.fragment),Ql=n(),me=i("h3"),me.textContent=wn,Jl=n(),xe=i("p"),xe.innerHTML=Cn,Xl=n(),w(qt.$$.fragment),Yl=n(),we=i("h3"),we.textContent=hn,Zl=n(),Ce=i("p"),Ce.innerHTML=bn,es=n(),he=i("h2"),he.textContent=$n,ts=n(),be=i("h3"),be.textContent=qn,ls=n(),$e=i("p"),$e.innerHTML=yn,ss=n(),w(yt.$$.fragment),os=n(),qe=i("h3"),qe.textContent=_n,ns=n(),ye=i("p"),ye.innerHTML=zn,as=n(),w(_t.$$.fragment),is=n(),_e=i("h2"),_e.textContent=Hn,rs=n(),ze=i("h3"),ze.textContent=Tn,ds=n(),He=i("p"),He.innerHTML=kn,us=n(),w(zt.$$.fragment),cs=n(),Te=i("h3"),Te.textContent=Ln,vs=n(),ke=i("p"),ke.innerHTML=gn,fs=n(),w(Ht.$$.fragment),ps=n(),Le=i("h3"),Le.textContent=Mn,ms=n(),ge=i("p"),ge.innerHTML=Pn,xs=n(),Me=i("h2"),Me.textContent=En,ws=n(),Pe=i("h3"),Pe.textContent=Rn,Cs=n(),Ee=i("p"),Ee.innerHTML=On,hs=n(),Re=i("h3"),Re.textContent=jn,bs=n(),Oe=i("p"),Oe.innerHTML=Fn,$s=n(),w(Tt.$$.fragment),qs=n(),je=i("h2"),je.textContent=In,ys=n(),Fe=i("p"),Fe.innerHTML=Sn,_s=n(),Ie=i("h3"),Ie.textContent=Dn,zs=n(),Se=i("p"),Se.innerHTML=Bn,Hs=n(),w(kt.$$.fragment),Ts=n(),De=i("h3"),De.textContent=An,ks=n(),Be=i("p"),Be.innerHTML=Vn,Ls=n(),w(Lt.$$.fragment),gs=n(),Ae=i("h3"),Ae.textContent=Un,Ms=n(),L=i("p"),mo=q("Sobreposições são empilhadas com "),Zt=i("code"),xo=q(Gn),wo=q(` e
  removidas com `),Wt=i("code"),Wt.textContent=Wn,Co=q(`. Uma modal captura toda a entrada; uma não-modal
  (dropdown, tooltip) é descartada quando um clique cai fora dela.`),Ps=n(),w(gt.$$.fragment),Es=n(),Ve=i("h3"),Ve.textContent=Nn,Rs=n(),Ue=i("p"),Ue.textContent=Kn,Os=n(),Ge=i("h2"),Ge.textContent=Qn,js=n(),We=i("h3"),We.textContent=Jn,Fs=n(),Ne=i("p"),Ne.innerHTML=Xn,Is=n(),w(Mt.$$.fragment),Ss=n(),Ke=i("h3"),Ke.textContent=Yn,Ds=n(),Qe=i("p"),Qe.innerHTML=Zn,Bs=n(),Je=i("h2"),Je.textContent=ea,As=n(),Xe=i("p"),Xe.textContent=ta,Vs=n(),b=i("ul"),Pt=i("li"),Pt.innerHTML=la,ho=n(),Et=i("li"),Et.innerHTML=sa,bo=n(),Rt=i("li"),Rt.innerHTML=oa,$o=n(),O=i("li"),Nt=i("strong"),Nt.textContent=na,qo=q(" — abre um popup em um ponto via "),el=i("code"),yo=q(aa),_o=q("."),zo=n(),Ot=i("li"),Ot.innerHTML=ia,Us=n(),Ye=i("h2"),Ye.textContent=ra,Gs=n(),Ze=i("p"),Ze.textContent=da,Ws=n(),et=i("h3"),et.textContent=ua,Ns=n(),tt=i("p"),tt.textContent=ca,Ks=n(),w(jt.$$.fragment),Qs=n(),lt=i("h3"),lt.textContent=va,Js=n(),st=i("p"),st.innerHTML=fa,Xs=n(),w(Ft.$$.fragment),Ys=n(),ot=i("h3"),ot.textContent=pa,Zs=n(),nt=i("p"),nt.textContent=ma,eo=n(),w(It.$$.fragment),to=n(),at=i("h3"),at.textContent=xa,lo=n(),it=i("p"),it.innerHTML=wa,so=n(),w(St.$$.fragment),oo=n(),w(Dt.$$.fragment),no=n(),rt=i("h2"),rt.textContent=Ca,ao=n(),dt=i("p"),dt.textContent=ha,io=n(),T=i("ul"),g=i("li"),Ho=q("Padrão de módulo local: "),tl=i("code"),To=q(ba),ko=q(" … "),Kt=i("code"),Kt.textContent=$a,Lo=q(". Indentação de 2 espaços, sem tabs."),go=n(),Bt=i("li"),Bt.innerHTML=qa,Mo=n(),At=i("li"),At.textContent=ya,Po=n(),Vt=i("li"),Vt.innerHTML=_a,ro=n(),ut=i("p"),ut.innerHTML=za,uo=n(),Ut=i("ol"),Ut.innerHTML=Ha,this.h()},l(e){k=a(e,"H1",{"data-svelte-h":!0}),r(k)!=="svelte-g6bcro"&&(k.textContent=P),z=o(e),H=a(e,"P",{class:!0,"data-svelte-h":!0}),r(H)!=="svelte-rkm3ga"&&(H.innerHTML=Xt),Gt=o(e),y=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(y)!=="svelte-ydmmug"&&(y.textContent=dl),h=o(e),_=a(e,"P",{class:!0,"data-svelte-h":!0}),r(_)!=="svelte-hrqe38"&&(_.textContent=sl),ol=o(e),vt=a(e,"UL",{"data-svelte-h":!0}),r(vt)!=="svelte-wee6cc"&&(vt.innerHTML=Eo),nl=o(e),j=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(j)!=="svelte-1pxuhl3"&&(j.textContent=Ro),al=o(e),F=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(F)!=="svelte-i4zr5k"&&(F.textContent=Oo),il=o(e),I=a(e,"P",{class:!0,"data-svelte-h":!0}),r(I)!=="svelte-1plaflu"&&(I.innerHTML=jo),rl=o(e),x(S.$$.fragment,e),ul=o(e),D=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(D)!=="svelte-1dgd4rn"&&(D.textContent=Fo),cl=o(e),B=a(e,"P",{class:!0,"data-svelte-h":!0}),r(B)!=="svelte-113mhv0"&&(B.innerHTML=Io),vl=o(e),x(ft.$$.fragment,e),fl=o(e),A=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(A)!=="svelte-znonee"&&(A.textContent=So),pl=o(e),V=a(e,"P",{class:!0,"data-svelte-h":!0}),r(V)!=="svelte-22jwsj"&&(V.innerHTML=Do),ml=o(e),x(pt.$$.fragment,e),xl=o(e),U=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(U)!=="svelte-1v0rlw9"&&(U.textContent=Bo),wl=o(e),G=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(G)!=="svelte-1x9uqht"&&(G.textContent=Ao),Cl=o(e),R=a(e,"P",{class:!0});var t=E(R);vo=$(t,`Centralize a aparência primeiro — tudo depois lê dela. Cores são tabelas
  `),Yt=a(t,"CODE",{});var Ta=E(Yt);fo=$(Ta,Vo),Ta.forEach(l),po=$(t," no intervalo 0–1; métricas são números simples."),t.forEach(l),hl=o(e),x(mt.$$.fragment,e),bl=o(e),W=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(W)!=="svelte-sn7a3b"&&(W.textContent=Uo),$l=o(e),N=a(e,"P",{class:!0,"data-svelte-h":!0}),r(N)!=="svelte-nywb0y"&&(N.innerHTML=Go),ql=o(e),K=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(K)!=="svelte-u72fi4"&&(K.textContent=Wo),yl=o(e),Q=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Q)!=="svelte-115j7gl"&&(Q.innerHTML=No),_l=o(e),J=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(J)!=="svelte-1ho0v4l"&&(J.textContent=Ko),zl=o(e),X=a(e,"P",{class:!0,"data-svelte-h":!0}),r(X)!=="svelte-1uo37au"&&(X.innerHTML=Qo),Hl=o(e),Y=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Y)!=="svelte-7jdtlk"&&(Y.textContent=Jo),Tl=o(e),Z=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Z)!=="svelte-kovowb"&&(Z.innerHTML=Xo),kl=o(e),ee=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ee)!=="svelte-aijebl"&&(ee.textContent=Yo),Ll=o(e),te=a(e,"P",{class:!0,"data-svelte-h":!0}),r(te)!=="svelte-15sr20s"&&(te.innerHTML=Zo),gl=o(e),x(xt.$$.fragment,e),Ml=o(e),le=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(le)!=="svelte-1rovxs9"&&(le.textContent=en),Pl=o(e),se=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(se)!=="svelte-p6fij"&&(se.textContent=tn),El=o(e),oe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(oe)!=="svelte-1egqroe"&&(oe.innerHTML=ln),Rl=o(e),wt=a(e,"UL",{"data-svelte-h":!0}),r(wt)!=="svelte-2umfaw"&&(wt.innerHTML=sn),Ol=o(e),ne=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ne)!=="svelte-l3y77z"&&(ne.textContent=on),jl=o(e),Ct=a(e,"OL",{"data-svelte-h":!0}),r(Ct)!=="svelte-1g8a03x"&&(Ct.innerHTML=nn),Fl=o(e),ae=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ae)!=="svelte-946vjg"&&(ae.textContent=an),Il=o(e),ie=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ie)!=="svelte-1q67cnn"&&(ie.textContent=rn),Sl=o(e),ht=a(e,"UL",{"data-svelte-h":!0}),r(ht)!=="svelte-17t7ab8"&&(ht.innerHTML=dn),Dl=o(e),re=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(re)!=="svelte-1ss5spg"&&(re.textContent=un),Bl=o(e),de=a(e,"P",{class:!0,"data-svelte-h":!0}),r(de)!=="svelte-1mj7q0m"&&(de.innerHTML=cn),Al=o(e),ue=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(ue)!=="svelte-15e5gzj"&&(ue.textContent=vn),Vl=o(e),ce=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ce)!=="svelte-kgfe5i"&&(ce.textContent=fn),Ul=o(e),ve=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ve)!=="svelte-1e1yfqp"&&(ve.textContent=pn),Gl=o(e),x(bt.$$.fragment,e),Wl=o(e),fe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(fe)!=="svelte-11nqrwt"&&(fe.textContent=mn),Nl=o(e),pe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(pe)!=="svelte-lkdeeu"&&(pe.textContent=xn),Kl=o(e),x($t.$$.fragment,e),Ql=o(e),me=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(me)!=="svelte-1vuhcao"&&(me.textContent=wn),Jl=o(e),xe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(xe)!=="svelte-m26dz4"&&(xe.innerHTML=Cn),Xl=o(e),x(qt.$$.fragment,e),Yl=o(e),we=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(we)!=="svelte-ht8dv7"&&(we.textContent=hn),Zl=o(e),Ce=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ce)!=="svelte-d67wve"&&(Ce.innerHTML=bn),es=o(e),he=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(he)!=="svelte-12fpn4e"&&(he.textContent=$n),ts=o(e),be=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(be)!=="svelte-1o99lt"&&(be.textContent=qn),ls=o(e),$e=a(e,"P",{class:!0,"data-svelte-h":!0}),r($e)!=="svelte-htw2mx"&&($e.innerHTML=yn),ss=o(e),x(yt.$$.fragment,e),os=o(e),qe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(qe)!=="svelte-1ixu0c4"&&(qe.textContent=_n),ns=o(e),ye=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ye)!=="svelte-1jhlii4"&&(ye.innerHTML=zn),as=o(e),x(_t.$$.fragment,e),is=o(e),_e=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(_e)!=="svelte-1rvuxr6"&&(_e.textContent=Hn),rs=o(e),ze=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ze)!=="svelte-o1pk9q"&&(ze.textContent=Tn),ds=o(e),He=a(e,"P",{class:!0,"data-svelte-h":!0}),r(He)!=="svelte-sgnd2l"&&(He.innerHTML=kn),us=o(e),x(zt.$$.fragment,e),cs=o(e),Te=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Te)!=="svelte-14afer"&&(Te.textContent=Ln),vs=o(e),ke=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ke)!=="svelte-1cb1u5h"&&(ke.innerHTML=gn),fs=o(e),x(Ht.$$.fragment,e),ps=o(e),Le=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Le)!=="svelte-le2yaf"&&(Le.textContent=Mn),ms=o(e),ge=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ge)!=="svelte-5j7oew"&&(ge.innerHTML=Pn),xs=o(e),Me=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Me)!=="svelte-1udj0fd"&&(Me.textContent=En),ws=o(e),Pe=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Pe)!=="svelte-g0srdj"&&(Pe.textContent=Rn),Cs=o(e),Ee=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ee)!=="svelte-uqnidy"&&(Ee.innerHTML=On),hs=o(e),Re=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Re)!=="svelte-jz0e5q"&&(Re.textContent=jn),bs=o(e),Oe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Oe)!=="svelte-1iifsl0"&&(Oe.innerHTML=Fn),$s=o(e),x(Tt.$$.fragment,e),qs=o(e),je=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(je)!=="svelte-19m4j5u"&&(je.textContent=In),ys=o(e),Fe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Fe)!=="svelte-11g5dop"&&(Fe.innerHTML=Sn),_s=o(e),Ie=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ie)!=="svelte-1h9h79p"&&(Ie.textContent=Dn),zs=o(e),Se=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Se)!=="svelte-1mjbo5l"&&(Se.innerHTML=Bn),Hs=o(e),x(kt.$$.fragment,e),Ts=o(e),De=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(De)!=="svelte-125knv1"&&(De.textContent=An),ks=o(e),Be=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Be)!=="svelte-1druh4i"&&(Be.innerHTML=Vn),Ls=o(e),x(Lt.$$.fragment,e),gs=o(e),Ae=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ae)!=="svelte-112d2ms"&&(Ae.textContent=Un),Ms=o(e),L=a(e,"P",{class:!0});var Qt=E(L);mo=$(Qt,"Sobreposições são empilhadas com "),Zt=a(Qt,"CODE",{});var ka=E(Zt);xo=$(ka,Gn),ka.forEach(l),wo=$(Qt,` e
  removidas com `),Wt=a(Qt,"CODE",{"data-svelte-h":!0}),r(Wt)!=="svelte-27cc14"&&(Wt.textContent=Wn),Co=$(Qt,`. Uma modal captura toda a entrada; uma não-modal
  (dropdown, tooltip) é descartada quando um clique cai fora dela.`),Qt.forEach(l),Ps=o(e),x(gt.$$.fragment,e),Es=o(e),Ve=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ve)!=="svelte-k33ece"&&(Ve.textContent=Nn),Rs=o(e),Ue=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ue)!=="svelte-1rb8w3y"&&(Ue.textContent=Kn),Os=o(e),Ge=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Ge)!=="svelte-1iwst7t"&&(Ge.textContent=Qn),js=o(e),We=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(We)!=="svelte-1c8pwxd"&&(We.textContent=Jn),Fs=o(e),Ne=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ne)!=="svelte-clz2qn"&&(Ne.innerHTML=Xn),Is=o(e),x(Mt.$$.fragment,e),Ss=o(e),Ke=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(Ke)!=="svelte-cwsm4m"&&(Ke.textContent=Yn),Ds=o(e),Qe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Qe)!=="svelte-gii4lj"&&(Qe.innerHTML=Zn),Bs=o(e),Je=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Je)!=="svelte-rt4jo3"&&(Je.textContent=ea),As=o(e),Xe=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Xe)!=="svelte-1u5rknf"&&(Xe.textContent=ta),Vs=o(e),b=a(e,"UL",{});var M=E(b);Pt=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Pt)!=="svelte-1hi3ax3"&&(Pt.innerHTML=la),ho=o(M),Et=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Et)!=="svelte-f1f5m1"&&(Et.innerHTML=sa),bo=o(M),Rt=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Rt)!=="svelte-1husdyq"&&(Rt.innerHTML=oa),$o=o(M),O=a(M,"LI",{class:!0});var ll=E(O);Nt=a(ll,"STRONG",{"data-svelte-h":!0}),r(Nt)!=="svelte-liunt2"&&(Nt.textContent=na),qo=$(ll," — abre um popup em um ponto via "),el=a(ll,"CODE",{});var La=E(el);yo=$(La,aa),La.forEach(l),_o=$(ll,"."),ll.forEach(l),zo=o(M),Ot=a(M,"LI",{class:!0,"data-svelte-h":!0}),r(Ot)!=="svelte-1jqj5r7"&&(Ot.innerHTML=ia),M.forEach(l),Us=o(e),Ye=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(Ye)!=="svelte-g8bs0n"&&(Ye.textContent=ra),Gs=o(e),Ze=a(e,"P",{class:!0,"data-svelte-h":!0}),r(Ze)!=="svelte-ns2a6t"&&(Ze.textContent=da),Ws=o(e),et=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(et)!=="svelte-ozzhvi"&&(et.textContent=ua),Ns=o(e),tt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(tt)!=="svelte-17nxoi7"&&(tt.textContent=ca),Ks=o(e),x(jt.$$.fragment,e),Qs=o(e),lt=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(lt)!=="svelte-1yomyzl"&&(lt.textContent=va),Js=o(e),st=a(e,"P",{class:!0,"data-svelte-h":!0}),r(st)!=="svelte-2s9dla"&&(st.innerHTML=fa),Xs=o(e),x(Ft.$$.fragment,e),Ys=o(e),ot=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(ot)!=="svelte-143ra99"&&(ot.textContent=pa),Zs=o(e),nt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(nt)!=="svelte-1xk7uzp"&&(nt.textContent=ma),eo=o(e),x(It.$$.fragment,e),to=o(e),at=a(e,"H3",{class:!0,"data-svelte-h":!0}),r(at)!=="svelte-dwmgjj"&&(at.textContent=xa),lo=o(e),it=a(e,"P",{class:!0,"data-svelte-h":!0}),r(it)!=="svelte-p59yb3"&&(it.innerHTML=wa),so=o(e),x(St.$$.fragment,e),oo=o(e),x(Dt.$$.fragment,e),no=o(e),rt=a(e,"H2",{class:!0,"data-svelte-h":!0}),r(rt)!=="svelte-1i3fc2d"&&(rt.textContent=Ca),ao=o(e),dt=a(e,"P",{class:!0,"data-svelte-h":!0}),r(dt)!=="svelte-tasxij"&&(dt.textContent=ha),io=o(e),T=a(e,"UL",{});var ct=E(T);g=a(ct,"LI",{class:!0});var Jt=E(g);Ho=$(Jt,"Padrão de módulo local: "),tl=a(Jt,"CODE",{});var ga=E(tl);To=$(ga,ba),ga.forEach(l),ko=$(Jt," … "),Kt=a(Jt,"CODE",{"data-svelte-h":!0}),r(Kt)!=="svelte-1d8fdvd"&&(Kt.textContent=$a),Lo=$(Jt,". Indentação de 2 espaços, sem tabs."),Jt.forEach(l),go=o(ct),Bt=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(Bt)!=="svelte-1eqj4ko"&&(Bt.innerHTML=qa),Mo=o(ct),At=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(At)!=="svelte-vepxe3"&&(At.textContent=ya),Po=o(ct),Vt=a(ct,"LI",{class:!0,"data-svelte-h":!0}),r(Vt)!=="svelte-v2wgv0"&&(Vt.innerHTML=_a),ct.forEach(l),ro=o(e),ut=a(e,"P",{class:!0,"data-svelte-h":!0}),r(ut)!=="svelte-17abrx1"&&(ut.innerHTML=za),uo=o(e),Ut=a(e,"OL",{"data-svelte-h":!0}),r(Ut)!=="svelte-14gj0d9"&&(Ut.innerHTML=Ha),this.h()},h(){d(H,"class","lead svelte-1qzvwo1"),d(y,"class","svelte-1qzvwo1"),d(_,"class","svelte-1qzvwo1"),d(j,"class","svelte-1qzvwo1"),d(F,"class","svelte-1qzvwo1"),d(I,"class","svelte-1qzvwo1"),d(D,"class","svelte-1qzvwo1"),d(B,"class","svelte-1qzvwo1"),d(A,"class","svelte-1qzvwo1"),d(V,"class","svelte-1qzvwo1"),d(U,"class","svelte-1qzvwo1"),d(G,"class","svelte-1qzvwo1"),d(R,"class","svelte-1qzvwo1"),d(W,"class","svelte-1qzvwo1"),d(N,"class","svelte-1qzvwo1"),d(K,"class","svelte-1qzvwo1"),d(Q,"class","svelte-1qzvwo1"),d(J,"class","svelte-1qzvwo1"),d(X,"class","svelte-1qzvwo1"),d(Y,"class","svelte-1qzvwo1"),d(Z,"class","svelte-1qzvwo1"),d(ee,"class","svelte-1qzvwo1"),d(te,"class","svelte-1qzvwo1"),d(le,"class","svelte-1qzvwo1"),d(se,"class","svelte-1qzvwo1"),d(oe,"class","svelte-1qzvwo1"),d(ne,"class","svelte-1qzvwo1"),d(ae,"class","svelte-1qzvwo1"),d(ie,"class","svelte-1qzvwo1"),d(re,"class","svelte-1qzvwo1"),d(de,"class","svelte-1qzvwo1"),d(ue,"class","svelte-1qzvwo1"),d(ce,"class","svelte-1qzvwo1"),d(ve,"class","svelte-1qzvwo1"),d(fe,"class","svelte-1qzvwo1"),d(pe,"class","svelte-1qzvwo1"),d(me,"class","svelte-1qzvwo1"),d(xe,"class","svelte-1qzvwo1"),d(we,"class","svelte-1qzvwo1"),d(Ce,"class","svelte-1qzvwo1"),d(he,"class","svelte-1qzvwo1"),d(be,"class","svelte-1qzvwo1"),d($e,"class","svelte-1qzvwo1"),d(qe,"class","svelte-1qzvwo1"),d(ye,"class","svelte-1qzvwo1"),d(_e,"class","svelte-1qzvwo1"),d(ze,"class","svelte-1qzvwo1"),d(He,"class","svelte-1qzvwo1"),d(Te,"class","svelte-1qzvwo1"),d(ke,"class","svelte-1qzvwo1"),d(Le,"class","svelte-1qzvwo1"),d(ge,"class","svelte-1qzvwo1"),d(Me,"class","svelte-1qzvwo1"),d(Pe,"class","svelte-1qzvwo1"),d(Ee,"class","svelte-1qzvwo1"),d(Re,"class","svelte-1qzvwo1"),d(Oe,"class","svelte-1qzvwo1"),d(je,"class","svelte-1qzvwo1"),d(Fe,"class","svelte-1qzvwo1"),d(Ie,"class","svelte-1qzvwo1"),d(Se,"class","svelte-1qzvwo1"),d(De,"class","svelte-1qzvwo1"),d(Be,"class","svelte-1qzvwo1"),d(Ae,"class","svelte-1qzvwo1"),d(L,"class","svelte-1qzvwo1"),d(Ve,"class","svelte-1qzvwo1"),d(Ue,"class","svelte-1qzvwo1"),d(Ge,"class","svelte-1qzvwo1"),d(We,"class","svelte-1qzvwo1"),d(Ne,"class","svelte-1qzvwo1"),d(Ke,"class","svelte-1qzvwo1"),d(Qe,"class","svelte-1qzvwo1"),d(Je,"class","svelte-1qzvwo1"),d(Xe,"class","svelte-1qzvwo1"),d(Pt,"class","svelte-1qzvwo1"),d(Et,"class","svelte-1qzvwo1"),d(Rt,"class","svelte-1qzvwo1"),d(O,"class","svelte-1qzvwo1"),d(Ot,"class","svelte-1qzvwo1"),d(Ye,"class","svelte-1qzvwo1"),d(Ze,"class","svelte-1qzvwo1"),d(et,"class","svelte-1qzvwo1"),d(tt,"class","svelte-1qzvwo1"),d(lt,"class","svelte-1qzvwo1"),d(st,"class","svelte-1qzvwo1"),d(ot,"class","svelte-1qzvwo1"),d(nt,"class","svelte-1qzvwo1"),d(at,"class","svelte-1qzvwo1"),d(it,"class","svelte-1qzvwo1"),d(rt,"class","svelte-1qzvwo1"),d(dt,"class","svelte-1qzvwo1"),d(g,"class","svelte-1qzvwo1"),d(Bt,"class","svelte-1qzvwo1"),d(At,"class","svelte-1qzvwo1"),d(Vt,"class","svelte-1qzvwo1"),d(ut,"class","svelte-1qzvwo1")},m(e,t){s(e,k,t),s(e,z,t),s(e,H,t),s(e,Gt,t),s(e,y,t),s(e,h,t),s(e,_,t),s(e,ol,t),s(e,vt,t),s(e,nl,t),s(e,j,t),s(e,al,t),s(e,F,t),s(e,il,t),s(e,I,t),s(e,rl,t),m(S,e,t),s(e,ul,t),s(e,D,t),s(e,cl,t),s(e,B,t),s(e,vl,t),m(ft,e,t),s(e,fl,t),s(e,A,t),s(e,pl,t),s(e,V,t),s(e,ml,t),m(pt,e,t),s(e,xl,t),s(e,U,t),s(e,wl,t),s(e,G,t),s(e,Cl,t),s(e,R,t),u(R,vo),u(R,Yt),u(Yt,fo),u(R,po),s(e,hl,t),m(mt,e,t),s(e,bl,t),s(e,W,t),s(e,$l,t),s(e,N,t),s(e,ql,t),s(e,K,t),s(e,yl,t),s(e,Q,t),s(e,_l,t),s(e,J,t),s(e,zl,t),s(e,X,t),s(e,Hl,t),s(e,Y,t),s(e,Tl,t),s(e,Z,t),s(e,kl,t),s(e,ee,t),s(e,Ll,t),s(e,te,t),s(e,gl,t),m(xt,e,t),s(e,Ml,t),s(e,le,t),s(e,Pl,t),s(e,se,t),s(e,El,t),s(e,oe,t),s(e,Rl,t),s(e,wt,t),s(e,Ol,t),s(e,ne,t),s(e,jl,t),s(e,Ct,t),s(e,Fl,t),s(e,ae,t),s(e,Il,t),s(e,ie,t),s(e,Sl,t),s(e,ht,t),s(e,Dl,t),s(e,re,t),s(e,Bl,t),s(e,de,t),s(e,Al,t),s(e,ue,t),s(e,Vl,t),s(e,ce,t),s(e,Ul,t),s(e,ve,t),s(e,Gl,t),m(bt,e,t),s(e,Wl,t),s(e,fe,t),s(e,Nl,t),s(e,pe,t),s(e,Kl,t),m($t,e,t),s(e,Ql,t),s(e,me,t),s(e,Jl,t),s(e,xe,t),s(e,Xl,t),m(qt,e,t),s(e,Yl,t),s(e,we,t),s(e,Zl,t),s(e,Ce,t),s(e,es,t),s(e,he,t),s(e,ts,t),s(e,be,t),s(e,ls,t),s(e,$e,t),s(e,ss,t),m(yt,e,t),s(e,os,t),s(e,qe,t),s(e,ns,t),s(e,ye,t),s(e,as,t),m(_t,e,t),s(e,is,t),s(e,_e,t),s(e,rs,t),s(e,ze,t),s(e,ds,t),s(e,He,t),s(e,us,t),m(zt,e,t),s(e,cs,t),s(e,Te,t),s(e,vs,t),s(e,ke,t),s(e,fs,t),m(Ht,e,t),s(e,ps,t),s(e,Le,t),s(e,ms,t),s(e,ge,t),s(e,xs,t),s(e,Me,t),s(e,ws,t),s(e,Pe,t),s(e,Cs,t),s(e,Ee,t),s(e,hs,t),s(e,Re,t),s(e,bs,t),s(e,Oe,t),s(e,$s,t),m(Tt,e,t),s(e,qs,t),s(e,je,t),s(e,ys,t),s(e,Fe,t),s(e,_s,t),s(e,Ie,t),s(e,zs,t),s(e,Se,t),s(e,Hs,t),m(kt,e,t),s(e,Ts,t),s(e,De,t),s(e,ks,t),s(e,Be,t),s(e,Ls,t),m(Lt,e,t),s(e,gs,t),s(e,Ae,t),s(e,Ms,t),s(e,L,t),u(L,mo),u(L,Zt),u(Zt,xo),u(L,wo),u(L,Wt),u(L,Co),s(e,Ps,t),m(gt,e,t),s(e,Es,t),s(e,Ve,t),s(e,Rs,t),s(e,Ue,t),s(e,Os,t),s(e,Ge,t),s(e,js,t),s(e,We,t),s(e,Fs,t),s(e,Ne,t),s(e,Is,t),m(Mt,e,t),s(e,Ss,t),s(e,Ke,t),s(e,Ds,t),s(e,Qe,t),s(e,Bs,t),s(e,Je,t),s(e,As,t),s(e,Xe,t),s(e,Vs,t),s(e,b,t),u(b,Pt),u(b,ho),u(b,Et),u(b,bo),u(b,Rt),u(b,$o),u(b,O),u(O,Nt),u(O,qo),u(O,el),u(el,yo),u(O,_o),u(b,zo),u(b,Ot),s(e,Us,t),s(e,Ye,t),s(e,Gs,t),s(e,Ze,t),s(e,Ws,t),s(e,et,t),s(e,Ns,t),s(e,tt,t),s(e,Ks,t),m(jt,e,t),s(e,Qs,t),s(e,lt,t),s(e,Js,t),s(e,st,t),s(e,Xs,t),m(Ft,e,t),s(e,Ys,t),s(e,ot,t),s(e,Zs,t),s(e,nt,t),s(e,eo,t),m(It,e,t),s(e,to,t),s(e,at,t),s(e,lo,t),s(e,it,t),s(e,so,t),m(St,e,t),s(e,oo,t),m(Dt,e,t),s(e,no,t),s(e,rt,t),s(e,ao,t),s(e,dt,t),s(e,io,t),s(e,T,t),u(T,g),u(g,Ho),u(g,tl),u(tl,To),u(g,ko),u(g,Kt),u(g,Lo),u(T,go),u(T,Bt),u(T,Mo),u(T,At),u(T,Po),u(T,Vt),s(e,ro,t),s(e,ut,t),s(e,uo,t),s(e,Ut,t),co=!0},p:Pa,i(e){co||(f(S.$$.fragment,e),f(ft.$$.fragment,e),f(pt.$$.fragment,e),f(mt.$$.fragment,e),f(xt.$$.fragment,e),f(bt.$$.fragment,e),f($t.$$.fragment,e),f(qt.$$.fragment,e),f(yt.$$.fragment,e),f(_t.$$.fragment,e),f(zt.$$.fragment,e),f(Ht.$$.fragment,e),f(Tt.$$.fragment,e),f(kt.$$.fragment,e),f(Lt.$$.fragment,e),f(gt.$$.fragment,e),f(Mt.$$.fragment,e),f(jt.$$.fragment,e),f(Ft.$$.fragment,e),f(It.$$.fragment,e),f(St.$$.fragment,e),f(Dt.$$.fragment,e),co=!0)},o(e){v(S.$$.fragment,e),v(ft.$$.fragment,e),v(pt.$$.fragment,e),v(mt.$$.fragment,e),v(xt.$$.fragment,e),v(bt.$$.fragment,e),v($t.$$.fragment,e),v(qt.$$.fragment,e),v(yt.$$.fragment,e),v(_t.$$.fragment,e),v(zt.$$.fragment,e),v(Ht.$$.fragment,e),v(Tt.$$.fragment,e),v(kt.$$.fragment,e),v(Lt.$$.fragment,e),v(gt.$$.fragment,e),v(Mt.$$.fragment,e),v(jt.$$.fragment,e),v(Ft.$$.fragment,e),v(It.$$.fragment,e),v(St.$$.fragment,e),v(Dt.$$.fragment,e),co=!1},d(e){e&&(l(k),l(z),l(H),l(Gt),l(y),l(h),l(_),l(ol),l(vt),l(nl),l(j),l(al),l(F),l(il),l(I),l(rl),l(ul),l(D),l(cl),l(B),l(vl),l(fl),l(A),l(pl),l(V),l(ml),l(xl),l(U),l(wl),l(G),l(Cl),l(R),l(hl),l(bl),l(W),l($l),l(N),l(ql),l(K),l(yl),l(Q),l(_l),l(J),l(zl),l(X),l(Hl),l(Y),l(Tl),l(Z),l(kl),l(ee),l(Ll),l(te),l(gl),l(Ml),l(le),l(Pl),l(se),l(El),l(oe),l(Rl),l(wt),l(Ol),l(ne),l(jl),l(Ct),l(Fl),l(ae),l(Il),l(ie),l(Sl),l(ht),l(Dl),l(re),l(Bl),l(de),l(Al),l(ue),l(Vl),l(ce),l(Ul),l(ve),l(Gl),l(Wl),l(fe),l(Nl),l(pe),l(Kl),l(Ql),l(me),l(Jl),l(xe),l(Xl),l(Yl),l(we),l(Zl),l(Ce),l(es),l(he),l(ts),l(be),l(ls),l($e),l(ss),l(os),l(qe),l(ns),l(ye),l(as),l(is),l(_e),l(rs),l(ze),l(ds),l(He),l(us),l(cs),l(Te),l(vs),l(ke),l(fs),l(ps),l(Le),l(ms),l(ge),l(xs),l(Me),l(ws),l(Pe),l(Cs),l(Ee),l(hs),l(Re),l(bs),l(Oe),l($s),l(qs),l(je),l(ys),l(Fe),l(_s),l(Ie),l(zs),l(Se),l(Hs),l(Ts),l(De),l(ks),l(Be),l(Ls),l(gs),l(Ae),l(Ms),l(L),l(Ps),l(Es),l(Ve),l(Rs),l(Ue),l(Os),l(Ge),l(js),l(We),l(Fs),l(Ne),l(Is),l(Ss),l(Ke),l(Ds),l(Qe),l(Bs),l(Je),l(As),l(Xe),l(Vs),l(b),l(Us),l(Ye),l(Gs),l(Ze),l(Ws),l(et),l(Ns),l(tt),l(Ks),l(Qs),l(lt),l(Js),l(st),l(Xs),l(Ys),l(ot),l(Zs),l(nt),l(eo),l(to),l(at),l(lo),l(it),l(so),l(oo),l(no),l(rt),l(ao),l(dt),l(io),l(T),l(ro),l(ut),l(uo),l(Ut)),p(S,e),p(ft,e),p(pt,e),p(mt,e),p(xt,e),p(bt,e),p($t,e),p(qt,e),p(yt,e),p(_t,e),p(zt,e),p(Ht,e),p(Tt,e),p(kt,e),p(Lt,e),p(gt,e),p(Mt,e),p(jt,e),p(Ft,e),p(It,e),p(St,e),p(Dt,e)}}}function Ua(c){let k,P,z,H,Xt;const Gt=[Va,Aa],y=[];function dl(h,_){return h[0]==="pt"?0:1}return P=dl(c),z=y[P]=Gt[P](c),{c(){k=n(),z.c(),H=Ma(),this.h()},l(h){Sa("svelte-1kg9v3j",document.head).forEach(l),k=o(h),z.l(h),H=Ma(),this.h()},h(){document.title="Building foxloves — foxloves"},m(h,_){s(h,k,_),y[P].m(h,_),s(h,H,_),Xt=!0},p(h,[_]){let sl=P;P=dl(h),P===sl?y[P].p(h,_):(Da(),v(y[sl],1,1,()=>{y[sl]=null}),Ia(),z=y[P],z?z.p(h,_):(z=y[P]=Gt[P](h),z.c()),f(z,1),z.m(H.parentNode,H))},i(h){Xt||(f(z),Xt=!0)},o(h){v(z),Xt=!1},d(h){h&&(l(k),l(H)),y[P].d(h)}}}function Ga(c,k,P){let z;return Oa(c,Ba,S=>P(0,z=S)),[z,`foxloves/
├── conf.lua              -- LÖVE window config (love.conf)
├── main.lua              -- demo / playground entry point (love .)
├── foxloves/             -- the library itself (require path root)
│   ├── init.lua          -- module entry: require("foxloves") -> table
│   ├── theme.lua         -- colors, radius, padding, font
│   ├── util.lua          -- shared helpers (contains, clamp, focus ring)
│   ├── container.lua     -- child management + relative coords (Panel, Tabs)
│   ├── root.lua          -- the UI manager (z-order, focus, overlays)
│   └── widgets/
│       ├── button.lua
│       ├── textbox.lua
│       └── …one file per widget
└── tests/
    ├── run.lua           -- registers + runs every case
    ├── harness.lua       -- installs the stub, loads fox, exposes check()
    ├── love_stub.lua     -- headless mock of the LÖVE API
    └── cases/            -- one assertion file per widget/topic`,`-- conf.lua
function love.conf(t)
  t.window.title = "foxloves demo"
  t.window.width = 900
  t.window.height = 600
  t.version = "11.4"        -- target LÖVE 11.x
end`,`-- Drop foxloves/ onto the require path, then:
local fox = require("foxloves")   -- returns { Button, Textbox, …, theme, util, Root }
-- Submodules resolve by dotted path from the project root:
--   require("foxloves.theme")            -> foxloves/theme.lua
--   require("foxloves.widgets.button")   -> foxloves/widgets/button.lua`,`-- foxloves/theme.lua
-- Widgets read every color/metric from a theme table; override by passing
-- \`theme\` in a widget's options, or replace the default here.
local M = {
  color = {
    bg        = {0.16, 0.17, 0.20, 1}, -- widget body fill
    fg        = {0.22, 0.24, 0.28, 1}, -- inset fill (textbox, track)
    accent    = {0.90, 0.55, 0.25, 1}, -- fox orange: active / on
    border    = {0.35, 0.37, 0.42, 1},
    hover     = {0.28, 0.30, 0.35, 1}, -- hovered fill (distinct from fg)
    focus     = {0.98, 0.72, 0.40, 1}, -- keyboard focus ring
    selection = {0.90, 0.55, 0.25, 0.35}, -- text selection (translucent accent)
    disabled  = {0.30, 0.31, 0.34, 1},
    text      = {0.94, 0.95, 0.97, 1},
    textMuted = {0.55, 0.57, 0.62, 1},
    info = {0.32,0.55,0.90,1}, success = {0.35,0.72,0.42,1},
    warning = {0.92,0.72,0.25,1}, error = {0.86,0.32,0.30,1},
  },
  radius = 4,
  padding = 8,
  font = nil,  -- filled from love.graphics.getFont() on first use
}

-- Resolve the active font: widget theme > module default > LÖVE current.
function M.getFont(theme)
  return (theme and theme.font) or M.font or love.graphics.getFont()
end

return M`,`-- foxloves/util.lua — kept tiny and dependency-free.
local M = {}

-- Point-in-rectangle test used by every widget's :contains.
function M.contains(px, py, x, y, w, h)
  return px >= x and px <= x + w
     and py >= y and py <= y + h
end

-- Clamp v into [lo, hi].
function M.clamp(v, lo, hi)
  if v < lo then return lo end
  if v > hi then return hi end
  return v
end

-- Draw a keyboard focus ring just outside a widget's bounds. The caller
-- restores its own color afterwards (same contract rule as everywhere else).
function M.focusRing(theme, x, y, w, h)
  love.graphics.setColor(theme.color.focus or theme.color.accent)
  love.graphics.rectangle("line", x - 2, y - 2, w + 4, h + 4, theme.radius, theme.radius)
end

-- True when this widget currently holds keyboard focus in its Root. Widgets get
-- their .root set by Root:add / Root:openOverlay; standalone widgets return false.
function M.isFocused(widget)
  return widget.root ~= nil and widget.root.focused == widget
end

return M`,`local defaultTheme = require("foxloves.theme")
local util = require("foxloves.util")

local Button = {}
Button.__index = Button

function Button.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Button)
  self.x, self.y = opts.x or 0, opts.y or 0
  self.w, self.h = opts.w or 120, opts.h or 32
  self.label    = opts.label or "Button"
  self.onClick  = opts.onClick       -- optional callback from opts
  self.disabled = opts.disabled or false
  self.theme    = opts.theme or defaultTheme
  self.hovered, self.pressed = false, false
  self.focusable = true              -- opt into Tab traversal
  return self
end

function Button:contains(px, py)
  return util.contains(px, py, self.x, self.y, self.w, self.h)
end
function Button:update(dt) end`,`-- Hover is event-driven: coords arrive already in this widget's own space
-- (a Container translates before forwarding), so nested buttons hover correctly.
function Button:mousemoved(px, py)
  self.hovered = not self.disabled and self:contains(px, py)
end

function Button:draw()
  local t = self.theme
  local r, g, b, a = love.graphics.getColor()   -- 1. save prior color state

  local fill                                     -- 2. pick fill from state + theme
  if self.disabled then fill = t.color.disabled
  elseif self.pressed and self.hovered then fill = t.color.accent
  elseif self.hovered then fill = t.color.hover
  else fill = t.color.bg end

  love.graphics.setColor(fill)
  love.graphics.rectangle("fill", self.x, self.y, self.w, self.h, t.radius, t.radius)
  love.graphics.setColor(t.color.border)
  love.graphics.rectangle("line", self.x, self.y, self.w, self.h, t.radius, t.radius)

  if util.isFocused(self) then                   -- 3. focus ring when focused
    util.focusRing(t, self.x, self.y, self.w, self.h)
  end

  local font = defaultTheme.getFont(t)
  love.graphics.setFont(font)
  love.graphics.setColor(self.disabled and t.color.textMuted or t.color.text)
  local ty = self.y + (self.h - font:getHeight()) / 2
  love.graphics.printf(self.label, self.x, ty, self.w, "center")

  love.graphics.setColor(r, g, b, a)             -- 4. restore
end`,`function Button:mousepressed(px, py, btn)
  if self.disabled or btn ~= 1 then return false end
  if self:contains(px, py) then
    self.pressed = true
    return true                       -- consumed: caller stops propagation
  end
  return false
end

function Button:mousereleased(px, py, btn)
  if btn ~= 1 then return false end
  local wasPressed = self.pressed
  self.pressed = false
  if self.disabled or not wasPressed then return false end
  -- Fire only when the release lands inside AND the press began inside.
  if self:contains(px, py) then
    if self.onClick then self.onClick(self) end
    return true
  end
  return false
end

-- When focused (via Tab in a Root), Space/Enter activate like a click.
function Button:keypressed(key)
  if self.disabled or not util.isFocused(self) then return false end
  if key == "space" or key == "return" or key == "kpenter" then
    if self.onClick then self.onClick(self) end
    return true
  end
  return false
end
function Button:textinput(text) return false end

return Button`,`-- foxloves/init.lua
return {
  theme  = require("foxloves.theme"),
  util   = require("foxloves.util"),
  Root   = require("foxloves.root"),
  Button = require("foxloves.widgets.button"),
  Textbox = require("foxloves.widgets.textbox"),
  Toggle  = require("foxloves.widgets.toggle"),
  -- …register every new widget here
}`,`-- main.lua — create widgets in love.load, forward callbacks to the Root.
local fox = require("foxloves")
local ui

function love.load()
  ui = fox.Root.new()
  ui:add(fox.Button.new{ x = 40, y = 40, w = 120, h = 34, label = "Greet",
    onClick = function() print("Hello!") end })
end

function love.update(dt)            ui:update(dt) end
function love.draw()                ui:draw() end
function love.mousepressed(x,y,b)   ui:mousepressed(x,y,b) end
function love.mousereleased(x,y,b)  ui:mousereleased(x,y,b) end
function love.mousemoved(x,y,dx,dy) ui:mousemoved(x,y,dx,dy) end
function love.wheelmoved(dx,dy)     ui:wheelmoved(dx,dy) end
function love.textinput(t)          ui:textinput(t) end
function love.keypressed(key)
  if ui:keypressed(key) then return end       -- let the UI consume first
  if key == "escape" then love.event.quit() end
end`,`function Textbox.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Textbox)
  self.x, self.y = opts.x or 0, opts.y or 0
  self.w, self.h = opts.w or 200, opts.h or 32
  self.value       = opts.value or ""
  self.placeholder = opts.placeholder or ""
  self.onChange    = opts.onChange
  self.onSubmit    = opts.onSubmit
  self.maxLength   = opts.maxLength
  self.theme = opts.theme or defaultTheme
  self.focused = false
  self.caret = #self.value          -- caret position, in bytes
  self.focusable = true
  return self
end

-- Root calls this when keyboard focus moves here (Tab) or away. A widget that
-- tracks its own focus flag exposes setFocused so Root can keep them in sync.
function Textbox:setFocused(on)
  self.focused = on
end`,`-- Insert text at the caret, honoring maxLength.
function Textbox:_insert(text)
  if self.maxLength then
    local room = self.maxLength - #self.value
    if room <= 0 then return end
    if #text > room then text = text:sub(1, room) end
  end
  self.value = self.value:sub(1, self.caret) .. text .. self.value:sub(self.caret + 1)
  self.caret = self.caret + #text
end

-- LÖVE delivers typed characters here; only the focused box accepts them.
function Textbox:textinput(text)
  if not self.focused then return false end
  self:_insert(text)
  if self.onChange then self.onChange(self.value) end
  return true
end

-- Enter submits then blurs; through Root so keyboard focus clears too.
function Textbox:keypressed(key)
  if not self.focused then return false end
  if key == "return" or key == "kpenter" then
    if self.onSubmit then self.onSubmit(self.value) end
    if self.root then self.root:setFocus(nil) else self:setFocused(false) end
    return true
  end
  -- …backspace, delete, left/right/home/end, selection + clipboard…
  return false
end`,`function Toggle:_toggle()
  self.on = not self.on
  if self.onChange then self.onChange(self.on) end
end

function Toggle:mousereleased(px, py, btn)
  if btn ~= 1 then return false end
  local wasPressed = self.pressed
  self.pressed = false
  if self.disabled or not wasPressed then return false end
  if self:contains(px, py) then self:_toggle(); return true end
  return false
end

-- Ease the knob toward its target end each frame (0 = off, 1 = on).
local SLIDE_SPEED = 8
function Toggle:update(dt)
  local target = self.on and 1 or 0
  local step = SLIDE_SPEED * dt
  if self.anim < target then self.anim = math.min(target, self.anim + step)
  elseif self.anim > target then self.anim = math.max(target, self.anim - step) end
end`,`local Root = {}
Root.__index = Root

function Root.new()
  local self = setmetatable({}, Root)
  self.base = {}       -- ordered top-level widgets
  self.overlays = {}   -- LIFO of { widget = <w>, modal = <bool> }
  self.focused = nil   -- widget receiving keyboard, or nil
  return self
end

function Root:add(widget)
  widget.root = self   -- backref: lets widgets open overlays / clear focus
  table.insert(self.base, widget)
  return widget
end`,`-- Move keyboard focus to widget (or nil), syncing widgets that track it.
function Root:setFocus(widget)
  if self.focused == widget then return end
  if self.focused and self.focused.setFocused then self.focused:setFocused(false) end
  self.focused = widget
  if widget and widget.setFocused then widget:setFocused(true) end
end

-- Tab / Shift-Tab cycle focus among base widgets with focusable == true.
function Root:keypressed(key)
  if key == "escape" and #self.overlays > 0 then self:closeOverlay(); return true end
  local top = self.overlays[#self.overlays]
  if top and top.modal then return top.widget:keypressed(key) end   -- modal traps keys
  if key == "tab" then
    local reverse = love.keyboard.isDown("lshift", "rshift")
    if self:_cycleFocus(reverse) then return true end
  end
  if self.focused and self.focused:keypressed(key) then return true end
  for _, w in ipairs(self.base) do if w:keypressed(key) then return true end end
  return false
end`,`function Root:openOverlay(widget, opts)
  opts = opts or {}
  widget.root = self
  table.insert(self.overlays, { widget = widget, modal = opts.modal or false })
  return widget
end

-- Overlays get first crack at a press, top-down; a modal swallows everything,
-- a non-modal that misses is dismissed and we keep falling through to the base.
function Root:mousepressed(px, py, btn)
  for i = #self.overlays, 1, -1 do
    local o = self.overlays[i]
    if o.widget:mousepressed(px, py, btn) then self:setFocus(o.widget); return true end
    if o.modal then return true end
    self:closeOverlay(o.widget)
  end
  for _, w in ipairs(self.base) do
    if w:mousepressed(px, py, btn) then self:setFocus(w); return true end
  end
  self:setFocus(nil)
  return false
end`,`-- Container: child management + relative coordinates. Not a standalone widget;
-- Panel and Tabs embed one. originFn() returns the content origin (ox, oy).
function Container:draw()
  local ox, oy = self.originFn()
  love.graphics.push(); love.graphics.translate(ox, oy)   -- children drawn in local space
  for _, c in ipairs(self.children) do c:draw() end
  love.graphics.pop()
end

function Container:mousepressed(px, py, btn)
  local ox, oy = self.originFn()
  local lx, ly = px - ox, py - oy       -- subtract origin so children see local coords
  for _, c in ipairs(self.children) do
    if c:mousepressed(lx, ly, btn) then return true end
  end
  return false
end`,`-- tests/love_stub.lua — a headless mock of the LÖVE API. Only the calls widgets
-- actually make are implemented; drawing is a no-op, fonts are faked.
stub.install = function()
  local G = {}
  function G.getColor() return 1, 1, 1, 1 end
  function G.setColor() end
  function G.rectangle() end
  function G.print() end
  function G.printf() end
  function G.getFont() return fakeFont end   -- fakeFont:getWidth/getHeight/getWrap
  function G.getDimensions() return 800, 600 end
  -- push/pop/translate/setScissor/circle/line… all no-ops
  love = { graphics = G, keyboard = {...}, mouse = {...}, system = {...} }
end`,`-- tests/harness.lua — installs the stub, loads the library, exposes check().
package.path = "./?.lua;./?/init.lua;" .. package.path
local love_stub = require("tests.love_stub")
love_stub.install()

local H = { fox = require("foxloves"), pass = 0, fail = 0 }
function H.section(name) print(name) end
function H.check(name, cond)
  if cond then H.pass = H.pass + 1; print("  ok   " .. name)
  else H.fail = H.fail + 1; print("  FAIL " .. name) end
end
return H`,`-- tests/cases/toggle.lua
local h = require("tests.harness")
local fox, check = h.fox, h.check

do
  h.section("Toggle")
  local got
  local tg = fox.Toggle.new{ x = 0, y = 0, w = 44, h = 24,
    onChange = function(v) got = v end }

  check("starts off", tg.on == false)
  tg:mousepressed(5, 5, 1); tg:mousereleased(5, 5, 1)
  check("clicked on", tg.on == true)
  check("onChange got true", got == true)

  -- animation eases toward the target over updates
  tg.anim = 0
  for _ = 1, 60 do tg:update(0.016) end
  check("anim reaches on end", tg.anim == 1)

  check("input ignored outside", tg:mousepressed(900, 900, 1) == false)
  local ok = pcall(function() tg:draw() end)
  check("draw no error", ok)     -- draw smoke test: never errors
end`,`-- tests/run.lua registers each case file and reports totals.
local h = require("tests.harness")
local cases = { "button", "textbox", "toggle", "slider", "root", "modal", --[[ … ]] }
for _, name in ipairs(cases) do require("tests.cases." .. name) end
print(string.format("\\n%d passed, %d failed", h.pass, h.fail))
os.exit(h.fail == 0 and 0 or 1)`]}class Xa extends ja{constructor(k){super(),Fa(this,k,Ga,Ua,Ra,{})}}export{Xa as component};
