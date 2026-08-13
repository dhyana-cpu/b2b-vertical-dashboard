// Paste your new single API link right here:
const SHEET_URL='https://script.google.com/macros/s/AKfycbzsb5FX-sds7Hv25Cd_crPLtJGqTDWaPDuNz10Z68UvaHjD_US5bLys6ncfkY_Wm1ibzA/exec';
// Your existing supplementary links:
const BD_URL='https://script.google.com/macros/s/AKfycbwZOjviZgLXKd0nuXKxiGHUeJ9vrqRHxv3_-Hdc1fX-5UrTSNxiuMV_op4X_ey-7h4iNg/exec';
const SAMPLES_URL='https://script.google.com/macros/s/AKfycbwHPMP6i9NcDOZCR7xL7eEdJZXho8Ju0BWs0H7RVLKJmMs1h4JqJ7r3qRpHP-3iyAU/exec';
const DIWALI_URL='https://script.google.com/macros/s/AKfycbwWOXAeQl5-KCG90vYob0uoCRA10QGq9qE9lPzc12Te3wP__7mt9IEGdB8g1gxFC0xF/exec';
const PENDING_SAMPLES_URL='https://script.google.com/macros/s/AKfycbxPgaV6qRo4b5t4MmcWJimbsanDLMkT-I-3REEgiYFYvJdkmCJ6hDZnntyCYX20Ouyq/exec';
var PENDING_SAMPLES=[], PENDING_SALES=[];
var BD_ROWS=[], ML_PRIMARY=[], ML_FOLLOWUP=[], SALES=[], SAMPLES=[], ML_BY_DATE=[], ML_BY_IND=[], ADS=[], INMAILS=[], DW_EMAIL=[]; var CCBD_ROWS=[], CCBD_FESTIVE=[];
function switchDiwali(subId) {
  document.getElementById('d-ov').style.display = 'none';
  document.getElementById('d-li').style.display = 'none';
  document.getElementById('d-tgt').style.display = 'none';
  document.getElementById('btn-d-ov').classList.remove('on');
  document.getElementById('btn-d-li').classList.remove('on');
  document.getElementById('btn-d-tgt').classList.remove('on');
  document.getElementById(subId).style.display = 'block';
  document.getElementById('btn-' + subId).classList.add('on');
}
function switchCCBD(subId) {
  document.getElementById('ccbd-s1').style.display = 'none';
  document.getElementById('ccbd-fest').style.display = 'none';
  document.getElementById('btn-ccbd-s1').classList.remove('on');
  document.getElementById('btn-ccbd-fest').classList.remove('on');
  document.getElementById(subId).style.display = 'block';
  document.getElementById('btn-' + subId).classList.add('on');
  setTimeout(renderCCBD, 30);
}
function fmt(n){if(!n||isNaN(n)||n===0)return'—';if(n>=100000)return'₹'+(n/100000).toFixed(1)+'L';if(n>=1000)return'₹'+(n/1000).toFixed(0)+'K';return'₹'+Math.round(n);}
function pct(a,b){return b>0?Math.round(a/b*100)+'%':'0%';}
function fd(d){return d?d.slice(5).replace('-','/'):'—';}
function set(id,v){var el=document.getElementById(id);if(el)el.textContent=v;}
var tipEl=document.getElementById('tip');
function showTip(e,h){tipEl.innerHTML=h;tipEl.style.display='block';tipEl.style.left=(e.clientX+12)+'px';tipEl.style.top=(e.clientY-30)+'px';}
function hideTip(){tipEl.style.display='none';}
function getWeekMonday(dateStr) {
  if(!dateStr) return '';
  var p = dateStr.split('-');
  if(p.length < 3) return dateStr;
  var d = new Date(parseInt(p[0]), parseInt(p[1])-1, parseInt(p[2]));
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function saveLocalStatus(key, value) {
  localStorage.setItem(key, value);
  var originalTxt = document.getElementById('stxt').textContent;
  document.getElementById('stxt').textContent = 'selection saved locally';
  setTimeout(function() { document.getElementById('stxt').textContent = originalTxt; }, 1500);
}
function getF(){return document.getElementById('df').value;}
function getT(){return document.getElementById('dt').value;}
function inR(date){var f=getF(),t=getT();if(f&&date<f)return false;if(t&&date>t)return false;return true;}
function fSales(){return SALES.filter(function(s){return inR(s.date);});}
function fAds(){return ADS.filter(function(a){return inR(a.date);});}
function fML(){
  var f=getF(),t=getT();
  if(!f&&!t)return ML_BY_DATE;
  return ML_BY_DATE.filter(function(d){
    if(f&&d.date<f)return false;
    if(t&&d.date>t)return false;
    return true;
  });
}
function barChart(id,labels,datasets,h){
  var el=document.getElementById(id);if(!el)return;
  h=h||200;
  var W=Math.max(el.getBoundingClientRect().width,el.clientWidth,el.offsetWidth)||680,P={t:8,r:10,b:65,l:55},cW=W-P.l-P.r,cH=h-P.t-P.b;
  if(!labels||!labels.length){el.innerHTML='<p style="color:#555;padding:20px;font-size:12px;text-align:center">No data in selected range</p>';return;}
  var maxV=0;
  datasets.forEach(function(d){d.data.forEach(function(v){if(v>maxV)maxV=v;});});
  if(maxV===0)maxV=1;
  var bW=Math.min((cW/labels.length)*0.8/datasets.length,34);
  var s='<svg width="'+W+'" height="'+h+'" xmlns="http://www.w3.org/2000/svg">';
  var isMoney = id.toLowerCase().includes('sales') || id.toLowerCase().includes('rev');
  var axisFmt = function(n) { if(n===0) return '0'; if(isMoney) return fmt(n); return n>=1000 ? (n/1000).toFixed(1)+'K' : Math.round(n); };
  for(var i=0;i<=4;i++){
    var y=P.t+cH-(i/4)*cH,v=maxV*i/4;
    s+='<line x1="'+P.l+'" y1="'+(y|0)+'" x2="'+(P.l+cW)+'" y2="'+(y|0)+'" stroke="rgba(255,255,255,.06)" stroke-width="1"/>';
    var lbl = datasets[0]&&datasets[0].yf ? datasets[0].yf(v) : axisFmt(v);
    s+='<text x="'+(P.l-4)+'" y="'+((y+4)|0)+'" text-anchor="end" fill="#777" font-size="9" font-family="system-ui">'+lbl+'</text>';
  }
  datasets.forEach(function(d,di){
    labels.forEach(function(lbl,i){
      var v=d.data[i]||0,bH=Math.max((v/maxV)*cH,0);
      var x=P.l+i*(cW/labels.length)+(cW/labels.length-datasets.length*bW)/2+di*bW,y=P.t+cH-bH;
      var tv=d.vf?d.vf(v, i):axisFmt(v);
      if (bH > 0) {
        s+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+bW.toFixed(1)+'" height="'+bH.toFixed(1)+'" fill="'+d.color+'" rx="3" opacity=".88" style="cursor:pointer" onmouseenter="showTip(event,\'<b>'+lbl+'</b><br>'+(d.label||'')+': '+tv+'\')" onmouseleave="hideTip()"/>';
      }
    });
  });
  labels.forEach(function(lbl,i){
    var x=(P.l+i*(cW/labels.length)+(cW/labels.length)/2)|0;
    var ty = h - 8;
    s+='<text x="'+x+'" y="'+ty+'" text-anchor="end" fill="#aaa" font-size="9" font-family="system-ui" transform="rotate(-45,'+x+','+ty+')">'+lbl+'</text>';
  });
  s+='<line x1="'+P.l+'" y1="'+P.t+'" x2="'+P.l+'" y2="'+(P.t+cH)+'" stroke="#333" stroke-width="1"/>';
  s+='<line x1="'+P.l+'" y1="'+(P.t+cH)+'" x2="'+(P.l+cW)+'" y2="'+(P.t+cH)+'" stroke="#333" stroke-width="1"/>';
  s+='</svg>';el.innerHTML=s;
}
function hbar(id,labels,values,colors,vf){
  var el=document.getElementById(id);if(!el)return;
  if(!labels||!labels.length){el.innerHTML='<p style="color:#555;padding:20px;font-size:12px;text-align:center">No data</p>';return;}
  var W=Math.max(el.getBoundingClientRect().width,el.clientWidth,el.offsetWidth)||500,maxV=0;
  values.forEach(function(v){if(v>maxV)maxV=v;});
  if(maxV===0)maxV=1;
  var rowH=32,P={l:115,r:55,t:4},H=labels.length*rowH+P.t*2;
  var s='<svg width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg">';
  labels.forEach(function(lbl,i){
    var y=P.t+i*rowH,bW=((values[i]||0)/maxV)*(W-P.l-P.r);
    var col=Array.isArray(colors)?colors[i%colors.length]:colors;
    var tv=vf?vf(values[i]):''+Math.round(values[i]);
    s+='<text x="'+(P.l-7)+'" y="'+(y+rowH/2+4)+'" text-anchor="end" fill="#aaa" font-size="10" font-family="system-ui">'+lbl+'</text>';
    s+='<rect x="'+P.l+'" y="'+(y+5)+'" width="'+Math.max(bW,3).toFixed(1)+'" height="'+(rowH-12)+'" fill="'+col+'" rx="3" opacity=".85" style="cursor:pointer" onmouseenter="showTip(event,\''+lbl+': '+tv+'\')" onmouseleave="hideTip()"/>';
    s+='<text x="'+(P.l+bW+7)+'" y="'+(y+rowH/2+4)+'" fill="#ccc" font-size="10" font-family="system-ui">'+tv+'</text>';
  });
  s+='</svg>';el.innerHTML=s;
}
function getMLRows(){
  var f=getF(),t=getT();
  var mtype=window._mtype||'all';
  var src= mtype==='primary'?ML_PRIMARY : mtype==='followup'?ML_FOLLOWUP : ML_BY_DATE;
  if(!src||!src.length)src=ML_BY_DATE;
  if(!f&&!t)return src;
  return src.filter(function(d){
    if(f&&d.date<f)return false;
    if(t&&d.date>t)return false;
    return true;
  });
}
function fCCBD() {
  var f=getF(), t=getT();
  var urgF = document.getElementById('ccUrgencyF') ? document.getElementById('ccUrgencyF').value : 'all';
  var pocF = document.getElementById('ccPocF') ? document.getElementById('ccPocF').value : 'all';
  return CCBD_ROWS.filter(function(r) {
    if (f && r.date < f) return false;
    if (t && r.date > t) return false;
    if (urgF === 'urgent' && r.urgency.toLowerCase() !== 'urgent') return false;
    if (urgF === 'non-urgent' && r.urgency.toLowerCase() === 'urgent') return false;
    if (pocF !== 'all' && r.poc !== pocF) return false;
    return true;
  });
}
function fCCBDFestive() {
  var f=getF(), t=getT();
  return CCBD_FESTIVE.filter(function(r) {
    if (f && r.date < f) return false;
    if (t && r.date > t) return false;
    return true;
  });
}
function renderCCBD() {
  var rows = fCCBD();
  var urgent = rows.filter(function(r) { return r.urgency.toLowerCase() === 'urgent'; }).length;
  var converted = rows.filter(function(r) { var c = r.conversion.toLowerCase(); return c === 'yes' || c === 'converted'; }).length;
  var cityMap = {};
  rows.forEach(function(r) { if (r.city) cityMap[r.city] = (cityMap[r.city]||0) + 1; });
  var citySorted = Object.entries(cityMap).sort(function(a,b) { return b[1]-a[1]; });
  var topCity = citySorted[0];
  set('ccTotal', rows.length);
  set('ccSub', rows.length + ' leads in range');
  set('ccUrgent', urgent);
  set('ccUrgentR', pct(urgent, rows.length) + ' of leads');
  set('ccConverted', converted);
  set('ccConvertedR', pct(converted, rows.length) + ' conv rate');
  set('ccTopCity', topCity ? topCity[0].slice(0,18) : '—');
  set('ccTopCityN', topCity ? topCity[1] + ' leads' : '—');
  set('ccCount', rows.length + ' leads shown');
  set('ccTableCount', rows.length + ' leads');
  var byDate = {};
  rows.forEach(function(r) { if (r.date) byDate[r.date] = (byDate[r.date]||0) + 1; });
  var dates = Object.keys(byDate).sort();
  barChart('ccDateChart', dates.map(fd), [{label:'Leads', data: dates.map(function(d){return byDate[d];}), color:'#3b82f6', vf:function(v){return v;}}], 180);
  var topCities = citySorted.slice(0, 8);
  hbar('ccCityChart', topCities.map(function(c){return c[0].slice(0,20);}), topCities.map(function(c){return c[1];}), ['#3b82f6','#6d28d9','#5b21b6','#4c1d95','#1d4ed8','#1e40af','#1e3a8a','#0ea5e9']);
  var tbl = document.getElementById('ccTable');
  if (tbl) {
    tbl.innerHTML = rows.length ? rows.map(function(r) {
      var urgBadge = r.urgency.toLowerCase() === 'urgent' ? '<span class="badge urgent">Urgent</span>' : '<span class="badge cold">' + (r.urgency || '—') + '</span>';
      var convBadge = '';
      var cl = r.conversion.toLowerCase();
      if (cl === 'yes' || cl === 'converted') convBadge = '<span class="badge yes">Yes</span>';
      else if (cl === 'no') convBadge = '<span class="badge no">No</span>';
      else convBadge = '<span style="color:#888">' + (r.conversion || '—') + '</span>';
      return '<tr><td style="color:#888">' + r.sr + '</td><td>' + fd(r.date) + '</td><td style="color:#fff">' + r.name + '</td><td style="font-family:monospace;color:#a78bfa">' + r.phone + '</td><td>' + r.city + '</td><td style="color:#aaa;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + r.remarks + '">' + r.remarks + '</td><td>' + urgBadge + '</td><td>' + convBadge + '</td><td>' + (r.poc ? '<span class="badge poc">' + r.poc + '</span>' : '—') + '</td></tr>';
    }).join('') : '<tr><td colspan="9" style="text-align:center;color:#555;padding:20px">No B2B inbound leads in range</td></tr>';
  }
  // Festive
  var fest = fCCBDFestive();
  var platMap = {}, pocMap = {};
  fest.forEach(function(r) {
    if (r.platform) platMap[r.platform] = (platMap[r.platform]||0) + 1;
    if (r.poc) pocMap[r.poc.trim()] = (pocMap[r.poc.trim()]||0) + 1;
  });
  var platSorted = Object.entries(platMap).sort(function(a,b){return b[1]-a[1];});
  var pocSorted = Object.entries(pocMap).sort(function(a,b){return b[1]-a[1];});
  var topPlat = platSorted[0];
  var topPoc = pocSorted[0];
  var suitable = fest.filter(function(r) { var q = (r.quality||'').toLowerCase().trim(); return q && q !== 'not suitable'; }).length;
  set('cfTotal', fest.length);
  set('cfTopPlatform', topPlat ? topPlat[0] : '—');
  set('cfTopPlatformN', topPlat ? topPlat[1] + ' leads' : '—');
  set('cfSuitable', suitable + ' / ' + fest.length);
  set('cfQualityS', 'suitable vs not suitable');
  set('cfTopPoc', topPoc ? topPoc[0] : '—');
  set('cfTopPocN', topPoc ? topPoc[1] + ' leads' : '—');
  var fByDate = {};
  fest.forEach(function(r) { if (r.date) fByDate[r.date] = (fByDate[r.date]||0) + 1; });
  var fDates = Object.keys(fByDate).sort();
  barChart('cfDateChart', fDates.map(fd), [{label:'Leads', data: fDates.map(function(d){return fByDate[d];}), color:'#f97316', vf:function(v){return v;}}], 180);
  hbar('cfPlatformChart', platSorted.map(function(p){return p[0];}), platSorted.map(function(p){return p[1];}), ['#f97316','#3b82f6','#7c3aed','#22c55e','#eab308']);
}
function renderAll(){
  var sales=fSales(), ads=fAds();
  var mlRows=getMLRows();
  var tSalesAmt=sales.reduce(function(a,s){return a+s.amt;},0);
  var mlDel=mlRows.reduce(function(a,r){return a+r.del;},0);
  var mlOpen=mlRows.reduce(function(a,r){return a+r.open;},0);
  var mlClick=mlRows.reduce(function(a,r){return a+r.click;},0);
  var mlResp=mlRows.reduce(function(a,r){return a+r.resp;},0);
  var mlBounce=mlRows.reduce(function(a,r){return a+r.bounce;},0);
  var totalLeads=ads.length, totalConv=ads.filter(function(a){return a.conv==='Yes';}).length;
  set('tSales',fmt(tSalesAmt)||'₹0'); set('tOrders',sales.length+' orders');
  set('tDel',mlDel.toLocaleString()); set('tOpenR',pct(mlOpen,mlDel)+' open rate');
  set('tResp',mlResp); set('tRespR',pct(mlResp,mlDel)+' response rate');
  set('tLeads',totalLeads); set('tConvR',totalConv+' converted · '+pct(totalConv,totalLeads||1));

  set('tInmail',INMAILS.length); set('tInmailS','FM: '+INMAILS.filter(function(i){return i.ind==='FM';}).length+' · IT: '+INMAILS.filter(function(i){return i.ind==='IT';}).length);
  set('fi',(sales.length+ads.length)+' records');
  set('fcDel',mlDel.toLocaleString());
  set('fcOpen',mlOpen); set('fcOpenR',pct(mlOpen,mlDel));
  set('fcClick',mlClick); set('fcClickR',pct(mlClick,mlDel));
  set('fcResp',mlResp); set('fcRespR',pct(mlResp,mlDel));
  var setFbar=function(id,pctId,v,total){
    var el=document.getElementById(id),pel=document.getElementById(pctId);
    var p=total>0?v/total*100:0;
    if(el){el.style.width=Math.min(p,100)+'%';el.textContent=v;}
    if(pel)pel.textContent=pct(v,total);
  };
  var fbDelEl=document.getElementById('fbDel');if(fbDelEl)fbDelEl.textContent=mlDel.toLocaleString();
  setFbar('fbOpen','fpOpen',mlOpen,mlDel);
  setFbar('fbClick','fpClick',mlClick,mlDel);
  setFbar('fbResp','fpResp',mlResp,mlDel);
  setFbar('fbBounce','fpBounce',mlBounce,mlDel);
  var byWeek={};
  sales.forEach(function(s){
    var weekStart = getWeekMonday(s.date);
    byWeek[weekStart] = (byWeek[weekStart]||0) + s.amt;
  });
  var weeks = Object.keys(byWeek).sort();
  var weekLabels = weeks.map(function(w) {
    var parts = w.split('-');
    var d1 = new Date(parts[0], parts[1]-1, parts[2]);
    var d2 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + 6);
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return m[d1.getMonth()] + ' ' + d1.getDate() + ' - ' + m[d2.getMonth()] + ' ' + d2.getDate();
  });
  barChart('ovSales', weekLabels, [{label:'Weekly Sales', data:weeks.map(function(w){return byWeek[w];}), color:'#22c55e', vf:fmt}], 220);

  var types={Inbound:ads.filter(function(a){return a.type==='Inbound';}).length,CCBD:ads.filter(function(a){return a.type==='CCBD';}).length};
  var tKeys=Object.keys(types).filter(function(k){return types[k]>0;});
  hbar('ovAdsType',tKeys,tKeys.map(function(k){return types[k];}),['#3b82f6','#7c3aed']);
  var conv={'Converted':ads.filter(function(a){return a.conv==='Yes';}).length,'Not Converted':ads.filter(function(a){return a.conv==='No';}).length,'Pending':ads.filter(function(a){return a.conv==='—';}).length};
  var cKeys=Object.keys(conv).filter(function(k){return conv[k]>0;});
  hbar('ovAdsConv',cKeys,cKeys.map(function(k){return conv[k];}),['#22c55e','#ef4444','#888']);
  var byPoc={};sales.forEach(function(s){byPoc[s.poc]=(byPoc[s.poc]||0)+s.amt;});
  var pocs=Object.entries(byPoc).sort(function(a,b){return b[1]-a[1];});
  hbar('ovPoc',pocs.map(function(p){return p[0];}),pocs.map(function(p){return p[1];}),['#a78bfa','#7c3aed','#6d28d9','#5b21b6'],fmt);
  set('mDel',mlDel.toLocaleString()); set('mDelS',mlRows.length+' days');
  set('mOpen',mlOpen.toLocaleString()); set('mOpenR',pct(mlOpen,mlDel)+' open rate');
  set('mClick',mlClick.toLocaleString()); set('mClickR',pct(mlClick,mlDel)+' click rate');
  set('mResp',mlResp.toLocaleString()); set('mRespR',pct(mlResp,mlDel)+' resp rate');
  set('mBounce',mlBounce.toLocaleString()); set('mBounceR',pct(mlBounce,mlDel)+' bounce rate');
  var evFilter = document.getElementById('mEventFilter') ? document.getElementById('mEventFilter').value : 'all';
  var allEventDatasets = [
    {id:'del', label:'Delivered', data:mlRows.map(function(r){return r.del;}), color:'#3b82f6', vf:function(v){return v.toLocaleString();}},
    {id:'open', label:'Opened', data:mlRows.map(function(r){return r.open;}), color:'#7c3aed', vf:function(v, i){ return v.toLocaleString() + ' (' + pct(v, mlRows[i].del) + ' rate)'; }},
    {id:'click', label:'Clicked', data:mlRows.map(function(r){return r.click;}), color:'#f97316', vf:function(v, i){ return v.toLocaleString() + ' (' + pct(v, mlRows[i].del) + ' rate)'; }},
    {id:'resp', label:'Responded', data:mlRows.map(function(r){return r.resp;}), color:'#22c55e', vf:function(v, i){ return v.toLocaleString() + ' (' + pct(v, mlRows[i].del) + ' rate)'; }}
  ];

  var chartDatasets = evFilter === 'all' ? allEventDatasets : allEventDatasets.filter(function(d){ return d.id === evFilter; });

  barChart('mDailyChart', mlRows.map(function(r){return fd(r.date);}), chartDatasets, 240);
  hbar('mIndChart',ML_BY_IND.map(function(m){return m.ind;}),
    ML_BY_IND.map(function(m){return +(pct(m.open,m.del).replace('%',''));}),
    ['#7c3aed','#6d28d9','#5b21b6','#4c1d95'],function(v){return v+'% open';});
  var mTD=ML_BY_IND.reduce(function(a,m){return a+m.del;},0),mTO=ML_BY_IND.reduce(function(a,m){return a+m.open;},0),mTC=ML_BY_IND.reduce(function(a,m){return a+m.click;},0),mTR=ML_BY_IND.reduce(function(a,m){return a+m.resp;},0);
  if(document.getElementById('mIndTable')) {
      document.getElementById('mIndTable').innerHTML=ML_BY_IND.map(function(m){return '<div class="mrow"><span style="color:#eee">'+m.ind+'</span><span>'+m.del.toLocaleString()+'</span><span>'+m.open.toLocaleString()+' <span class="rate">'+pct(m.open,m.del)+'</span></span><span>'+m.click.toLocaleString()+' <span class="rate">'+pct(m.click,m.del)+'</span></span><span>'+m.resp.toLocaleString()+' <span class="rate">'+pct(m.resp,m.del)+'</span></span></div>';}).join('');
      document.getElementById('mIndTotal').innerHTML='<span>TOTAL</span><span>'+mTD.toLocaleString()+'</span><span>'+mTO.toLocaleString()+' <span class="rate">'+pct(mTO,mTD)+'</span></span><span>'+mTC.toLocaleString()+' <span class="rate">'+pct(mTC,mTD)+'</span></span><span>'+mTR.toLocaleString()+' <span class="rate">'+pct(mTR,mTD)+'</span></span>';
  }
  var avg = sales.length ? tSalesAmt / sales.length : 0;
  var topPoc = pocs[0];
  var top5 = sales.slice().sort(function(a,b){return b.amt - a.amt;}).slice(0,5);
  set('sTotalRev',fmt(tSalesAmt)||'₹0'); set('sTotalOrd',sales.length+' orders');
  set('sAvg',fmt(avg)||'—');
  set('sTopPoc',topPoc?topPoc[0]:'—'); set('sTopAmt',topPoc?fmt(topPoc[1]):' ');
  var top5Html = top5.length ? top5.map(function(s) {
    var clientName = s.client ? s.client.slice(0, 18) + (s.client.length > 18 ? '…' : '') : 'Unknown';
    return '<div style="display:flex; justify-content:space-between; font-size:11px; align-items:center;">' +
           '<span style="color:#fff;" title="' + (s.client || '') + '">' + clientName + '</span>' +
           '<span style="color:var(--gr); font-family:monospace; font-weight:600;">' + fmt(s.amt) + '</span>' +
           '</div>';
  }).join('') : '<div style="color:#555;font-size:11px;text-align:center;padding:10px 0;">No orders</div>';
  var top5El = document.getElementById('sTop5List');
  if (top5El) top5El.innerHTML = top5Html;
  set('sCount',sales.length+' orders in range');
  hbar('sPocChart',pocs.map(function(p){return p[0];}),pocs.map(function(p){return p[1];}),['#22c55e','#16a34a','#15803d','#166534'],fmt);
  barChart('sDateChart', weekLabels, [{label:'Weekly Revenue', data:weeks.map(function(w){return byWeek[w];}), color:'#22c55e', vf:fmt}], 180);

  var sortVal = document.getElementById('sSort') ? document.getElementById('sSort').value : 'date-desc';
  var displaySales = sales.slice();
  if (sortVal === 'amt-desc') displaySales.sort(function(a,b){ return b.amt - a.amt; });
  else if (sortVal === 'amt-asc') displaySales.sort(function(a,b){ return a.amt - b.amt; });
  else displaySales.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  if(document.getElementById('sTable')) document.getElementById('sTable').innerHTML=displaySales.length?displaySales.map(function(s){return '<tr><td style="font-family:monospace;color:#a78bfa">'+s.ref+'</td><td>'+fd(s.date)+'</td><td style="color:#fff">'+s.client+'</td><td><span class="badge poc">'+s.poc+'</span></td><td style="color:#888">'+s.type+'</td><td style="text-align:right;font-family:monospace;color:#22c55e;font-weight:600">'+fmt(s.amt)+'</td></tr>';}).join(''):'<tr><td colspan="6" style="text-align:center;color:#555;padding:20px">No orders in selected range</td></tr>';
  var inbound=ads.filter(function(a){return a.type==='Inbound';}).length;
  var ccbd=ads.filter(function(a){return a.type==='CCBD';}).length;
  set('aTotal',totalLeads); set('aInbound',inbound); set('aInboundR',pct(inbound,totalLeads||1)+' of leads');
  set('aCcbd',ccbd); set('aCcbdR',pct(ccbd,totalLeads||1)+' of leads');
  set('aConv',totalConv); set('aConvR',pct(totalConv,totalLeads||1)+' conv rate');
  set('aCount',ads.length+' leads in range');

  if(document.getElementById('aTable')) document.getElementById('aTable').innerHTML=ads.length?ads.map(function(a){return '<tr><td>'+fd(a.date)+'</td><td style="color:#fff">'+a.client+'</td><td><span class="badge '+a.type.toLowerCase()+'">'+a.type+'</span></td><td><span class="badge poc">'+a.poc+'</span></td><td><span class="badge '+a.lead.toLowerCase()+'">'+a.lead+'</span></td><td><span class="badge '+(a.conv==='Yes'?'yes':a.conv==='No'?'no':'')+'">'+(a.conv||'—')+'</span></td><td style="text-align:right;font-family:monospace;color:#22c55e">'+(a.val?fmt(a.val):'—')+'</td></tr>';}).join(''):'<tr><td colspan="7" style="text-align:center;color:#555;padding:20px">No leads in selected range</td></tr>';
  set('iTotal',INMAILS.length);
  set('iFM',INMAILS.filter(function(i){return i.ind==='FM';}).length);
  set('iIT',INMAILS.filter(function(i){return i.ind==='IT';}).length);

  if(document.getElementById('iTable')) document.getElementById('iTable').innerHTML=INMAILS.length ? INMAILS.map(function(m){return '<tr><td style="color:#888">'+m.n+'</td><td><span class="badge '+(m.ind==='FM'?'inbound':'ccbd')+'">'+m.ind+'</span></td><td style="color:#fff">'+m.company+'</td><td style="color:#aaa">'+m.role+'</td><td style="color:#a78bfa">'+m.poc+'</td></tr>';}).join('') : '<tr><td colspan="5" style="text-align:center;color:#555;padding:20px">No InMail data found in sheet</td></tr>';
  renderBD();
  renderSamples();
  renderDiwaliEmail();
  renderCCBD();
  document.getElementById('lu').textContent='Updated '+new Date().toLocaleTimeString();
}
document.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){
  document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');});
  document.querySelectorAll('.tp').forEach(function(x){x.classList.remove('on');});
  t.classList.add('on');
  document.getElementById('tp-'+t.dataset.tab).classList.add('on');
  setTimeout(function(){renderAll();if(typeof renderPending==='function')renderPending();},30);
});});
window._mtype='all';
document.querySelectorAll('[data-mtype]').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('[data-mtype]').forEach(function(x){x.classList.remove('on');});
    b.classList.add('on');
    window._mtype=b.dataset.mtype;
    var labels={all:'Showing all mails',primary:'Showing primary mails only',followup:'Showing follow-up mails only'};
    var el=document.getElementById('mTypeLabel');if(el)el.textContent=labels[window._mtype]||'';
    renderAll();
  });
});
function todayStr(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
document.querySelectorAll('[data-r]').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('[data-r]').forEach(function(x){x.classList.remove('on');});
  b.classList.add('on');
  var rv=b.dataset.r;
  if(rv==='all'){ document.getElementById('df').value=''; document.getElementById('dt').value=''; }
  else if(rv==='today'){ var td=todayStr(); document.getElementById('df').value=td; document.getElementById('dt').value=td; }
  else if(rv==='mtd'){ var td3=todayStr(); var mtd=new Date(td3); mtd.setDate(1); document.getElementById('df').value=mtd.toISOString().slice(0,10); document.getElementById('dt').value=td3; }
  else { var td2=todayStr(); var fd2=new Date(td2); fd2.setDate(fd2.getDate()-(+rv-1)); document.getElementById('df').value=fd2.toISOString().slice(0,10); document.getElementById('dt').value=td2; }
  renderAll();
});});
document.getElementById('df').addEventListener('change',function(){document.querySelectorAll('[data-r]').forEach(function(x){x.classList.remove('on');});renderAll();if(typeof renderPending==='function')renderPending();});
document.getElementById('dt').addEventListener('change',function(){document.querySelectorAll('[data-r]').forEach(function(x){x.classList.remove('on');});renderAll();if(typeof renderPending==='function')renderPending();});
var PHASE_COLOR={Cold:'#3b82f6',Hot:'#f97316',Converted:'#22c55e',Unknown:'#888'};
function fBD(){
  var f=getF(),t=getT();
  var phase=document.getElementById('bdPhase').value;
  var source=document.getElementById('bdSource').value;
  var poc=document.getElementById('bdPoc').value;
  var src=BD_ROWS;
  return src.filter(function(b){
    if(f&&b.date<f)return false;
    if(t&&b.date>t)return false;
    if(phase!=='all'&&b.phase!==phase)return false;
    if(source!=='all'&&b.source.trim()!==source)return false;
    if(poc!=='all'&&b.poc!==poc)return false;
    return true;
  });
}
function fSamples(){
  var f=getF(),t=getT();
  var prod=document.getElementById('smProd').value;
  var by=document.getElementById('smBy').value;
  return SAMPLES.filter(function(s){
    if(f&&s.date<f)return false;
    if(t&&s.date>t)return false;
    if(prod!=='all'&&!s.product.toLowerCase().includes(prod.toLowerCase().slice(0,15)))return false;
    if(by!=='all'&&s.req_by.toLowerCase()!==by.toLowerCase())return false;
    return true;
  });
}
var RC_ROWS=[];
function renderRecurring(){
  var rows=RC_ROWS;
  var total=rows.length;
  var totalRev=0;
  var pocMap={};
  rows.forEach(function(r){
    var rev=parseFloat(String(r.revenue).replace(/[₹,]/g,''))||0;
    totalRev+=rev;
    if(r.poc){pocMap[r.poc]=(pocMap[r.poc]||0)+rev;}
  });
  var topPoc=Object.keys(pocMap).sort(function(a,b){return pocMap[b]-pocMap[a];})[0]||'—';
  set('rcTotal', total);
  set('rcRevenue', totalRev>0?'₹'+fmt(totalRev):'—');
  set('rcTopPoc', topPoc);
  set('rcTopPocAmt', pocMap[topPoc]?'₹'+fmt(pocMap[topPoc]):'—');
  set('rcCount', total+' clients');
  if(document.getElementById('rcTable')){
    document.getElementById('rcTable').innerHTML=rows.length?rows.map(function(r){
        var rev=parseFloat(String(r.revenue).replace(/[₹,]/g,''))||0;
        return '<tr><td>'+String(r.client)+'</td><td><span class="badge poc">'+String(r.poc)+'</span></td><td>'+String(r.phone)+'</td><td>'+String(r.location)+'</td><td style="text-align:center;font-weight:600;">'+String(r.orders)+'</td><td style="font-family:monospace;color:#a78bfa;font-size:11px;">'+String(r.dates)+'</td><td style="text-align:right;color:var(--gr);font-family:monospace;">'+(rev?'₹'+fmt(rev):'—')+'</td></tr>';
    }).join('') : '<tr><td colspan="7" class="nd">No recurring clients found</td></tr>';
  }
}
 function renderDiwaliEmail(){
  // Build date-filtered industry totals from Master_Log raw data
  var f=getF(), t=getT();
  var indMap={};
  var DIWALI_INDUSTRIES = [
    'DIWALI Banking','DIWALI IT','DIWALI Asset','DIWALI Banking 2',
    'DIWALI Oil & Gas 2','DIWALI Wealth','DIWALI Manufacturing & Automative',
    'DIWALI Oil and Gas','DIWALI Consultancy','DIWALI FMCG','DIWALI Pharma'
  ];
  (window._ML_IND_DATE||[]).forEach(function(r){
    if(r.ind.toLowerCase().indexOf('diwali') === -1) return;
    if(f && r.date<f) return;
    if(t && r.date>t) return;
    if(!indMap[r.ind]) indMap[r.ind]={industry:r.ind,totalSent:0,opened:0,clicked:0,responses:0};
    indMap[r.ind].totalSent += r.del;
    indMap[r.ind].opened += r.open;
    indMap[r.ind].clicked += r.click;
    indMap[r.ind].responses += r.resp;
  });
  // Fall back to DW_EMAIL (Email Tracker) if Master_Log has no data
  var filteredDW = Object.values(indMap).filter(function(m){return m.totalSent>0;});
  var f=getF(), t=getT();
  // If no date filter active, always use Email Tracker (ground truth)
  // Only use ML-derived data when actually filtering by date
  // If date filter is active and returns no data, show 0 (don't fall back to full total)
  // Always use DW_EMAIL for responses (it has canonical industry names + response counts)
  // Use filteredDW for opened/clicked when date filter is active
  var source = (f || t) ? filteredDW : DW_EMAIL;
  var dwDel = source.reduce(function(a,m){return a+m.totalSent;},0);
  // For responses, always sum from DW_EMAIL regardless of date filter
  var dwResp = DW_EMAIL.reduce(function(a,m){return a+m.responses;},0);
  set('dw-tot-sent', dwDel.toLocaleString());
  set('dw-tot-resp', dwResp.toLocaleString());
  set('dw-resp-rate', pct(dwResp, dwDel) + ' avg response');
  var sorted = source.slice().sort(function(a,b){return b.totalSent-a.totalSent;});
  var colors = ['var(--or)', 'var(--bl)', '#7c3aed', 'var(--gr)', '#eab308'];
  var maxV = sorted.length ? sorted[0].totalSent : 1;
  var dwBarsHtml = sorted.slice(0,5).map(function(m,i){
    var w = maxV>0 ? Math.max((m.totalSent/maxV)*100,2) : 0;
    return '<div class="frow"><span class="flbl" style="width:170px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+m.industry+'</span><div class="fwrap"><div class="fbar" style="width:'+w+'%;background:'+colors[i%colors.length]+'">'+m.totalSent.toLocaleString()+'</div></div></div>';
  }).join('');
  var dwTableHtml = sorted.map(function(m){
    var opened = m.opened||0, clicked = m.clicked||0;
    var resp = m.responses||0;
    return '<tr><td style="color:#fff;font-weight:600;">'+m.industry+'</td>'+
      '<td>'+m.totalSent.toLocaleString()+'</td>'+
      '<td>'+(opened>0?opened.toLocaleString():'—')+'</td>'+
      '<td>'+(clicked>0?clicked.toLocaleString():'—')+'</td>'+
      '<td>'+(resp>0?resp.toLocaleString():'—')+'</td>'+
      '<td><span class="badge warm">'+pct(resp,m.totalSent)+'</span></td></tr>';
  }).join('');
  if(!sorted.length){
    dwBarsHtml = '<div style="color:#555;font-size:11px;text-align:center;padding:20px;">No data</div>';
    dwTableHtml = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#555;">No Diwali Email Tracker data found</td></tr>';
  }
  var elDwBars = document.getElementById('dw-ind-bars');
  if(elDwBars) elDwBars.innerHTML = dwBarsHtml;
  var elDwTable = document.getElementById('dw-ind-table');
  if(elDwTable) elDwTable.innerHTML = dwTableHtml;
}
function renderBD(){
  var bd=fBD();
  var cold=bd.filter(function(b){return b.phase==='Cold';}).length;
  var hot=bd.filter(function(b){return b.phase==='Hot';}).length;
  var conv=bd.filter(function(b){return b.phase==='Converted';}).length;
  set('bdTotal',bd.length); set('bdSub',bd.length+' leads in range');
  set('bdCold',cold); set('bdColdR',pct(cold,bd.length||1)+' of leads');
  set('bdHot',hot); set('bdHotR',pct(hot,bd.length||1)+' of leads');
  set('bdConv',conv); set('bdConvR',pct(conv,bd.length||1)+' conv rate');
  set('bdCount',bd.length+' leads shown');
  var phases=['Cold','Hot','Converted'];
  var phaseLabels={Cold:'❄️ Cold',Hot:'🔥 Hot',Converted:'✅ Converted'};

  if(document.getElementById('bdPipeline')) {
      document.getElementById('bdPipeline').innerHTML=phases.map(function(ph){
        var leads=bd.filter(function(b){return b.phase===ph;});
        var col=PHASE_COLOR[ph]||'#888';
        return '<div class="cc" style="border-top:2px solid '+col+';">'+
          '<div class="ch"><div class="ct">'+phaseLabels[ph]+'</div><span style="background:'+col+'22;color:'+col+';padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">'+leads.length+'</span></div>'+
          (leads.length?leads.map(function(b){
            return '<div style="background:var(--s2);border-radius:8px;padding:10px;margin-bottom:8px;">'+
              '<div style="font-size:12px;font-weight:600;color:#fff;margin-bottom:3px;">'+(b.company||b.name)+'</div>'+
              (b.company?'<div style="font-size:11px;color:#aaa;margin-bottom:3px;">'+b.name+'</div>':'')+
              '<div style="font-size:10px;color:var(--m);display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">'+
              '<span>📅 '+b.date.slice(5).replace('-','/')+'</span>'+
              (b.poc?'<span>👤 '+b.poc+'</span>':'')+
              (b.source?'<span style="background:rgba(124,58,237,.15);color:#a78bfa;padding:1px 5px;border-radius:3px;">'+b.source.trim()+'</span>':'')+
              '</div>'+
              (b.remarks?'<div style="font-size:10px;color:#aaa;margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.05);">'+b.remarks.slice(0,60)+(b.remarks.length>60?'…':'')+'</div>':'')+
              (b.followup?'<div style="font-size:10px;color:#eab308;margin-top:3px;">⏰ Follow-up: '+b.followup.slice(5).replace('-','/')+'</div>':'')+
              '</div>';
          }).join(''):'<div style="color:var(--m);font-size:12px;text-align:center;padding:16px;">No leads</div>')+
          '</div>';
      }).join('');
  }
  if(document.getElementById('bdTable')){
      document.getElementById('bdTable').innerHTML = bd.length ? bd.map(function(b) {
        var col = PHASE_COLOR[b.phase] || '#888';
        var leadKey = 'conv_' + (b.company + b.name).replace(/\s+/g, '_');
        var savedStatus = localStorage.getItem(leadKey) || '';
        var tickKey = 'tick_' + (b.company + b.name).replace(/\s+/g, '_');
        var isTicked = localStorage.getItem(tickKey) === 'true';
        return '<tr>' +
          '<td>' + fd(b.date) + '</td>' +
          '<td style="color:#fff">' + (b.company || '—') + '</td>' +
          '<td style="color:#ddd">' + b.name + '</td>' +
          '<td><span class="badge poc">' + (b.poc || '—') + '</span></td>' +
          '<td style="color:#aaa">' + (b.source.trim() || '—') + '</td>' +
          '<td><span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:' + col + '22;color:' + col + '">' + b.phase + '</span></td>' +
          '<td><select class="di" style="font-size:10px; padding:2px 4px; height:22px; width:70px; background:var(--s2); border-color:var(--b);" onchange="saveLocalStatus(\'' + leadKey + '\', this.value)"><option value="" ' + (savedStatus === '' ? 'selected' : '') + '>—</option><option value="Yes" ' + (savedStatus === 'Yes' ? 'selected' : '') + '>Yes</option><option value="No" ' + (savedStatus === 'No' ? 'selected' : '') + '>No</option></select></td>' +
          '<td style="text-align:center"><input type="checkbox" style="cursor:pointer; width:16px; height:16px; accent-color:#22c55e;" ' + (isTicked ? 'checked ' : '') + 'onchange="saveLocalStatus(\'' + tickKey + '\', this.checked ? \'true\' : \'false\')"></td>' +
          '<td style="color:#eab308;font-size:11px">' + (b.followup ? '⏰ ' + b.followup.slice(5).replace('-', '/') : '—') + '</td>' +
          '<td style="color:#aaa;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + b.remarks + '</td>' +
          '</tr>';
      }).join('') : '<tr><td colspan="10" style="text-align:center;color:#555;padding:20px">No leads found</td></tr>';
  }
}
function renderSamples(){
  var sm = fSamples();
  var clients = new Set(sm.map(function(s){return s.client;}).filter(Boolean));
  var byProd = {}; sm.forEach(function(s){if(s.product) byProd[s.product] = (byProd[s.product]||0) + s.qty;});
  var topProdsArray = Object.entries(byProd).sort(function(a,b){return b[1]-a[1];});
  var topProd = topProdsArray[0];
  var byBy = {}; sm.forEach(function(s){if(s.req_by) byBy[s.req_by] = (byBy[s.req_by]||0) + 1;});
  var topBy = Object.entries(byBy).sort(function(a,b){return b[1]-a[1];})[0];
  var grouped = {};
  sm.forEach(function(s) {
    var key = s.date + '|' + s.client + '|' + s.req_by;
    if (!grouped[key]) grouped[key] = { date: s.date, client: s.client, req_by: s.req_by, totalQty: 0, products: [] };
    grouped[key].products.push(s.product + ' (' + s.qty + ')');
    grouped[key].totalQty += s.qty;
  });

  var groupedArr = Object.values(grouped).sort(function(a,b){return b.date.localeCompare(a.date);});
  set('smTotal', sm.length);
  set('smSub', sm.length + ' items in range');
  set('smClients', clients.size);
  set('smTopProd', topProd ? topProd[0].slice(0,22) : '—');
  set('smTopQty', topProd ? topProd[1] + ' units' : '—');
  set('smTopPoc', topBy ? topBy[0] : '—');
  set('smCount', groupedArr.length + ' requests shown');
  var byDate = {}; sm.forEach(function(s){byDate[s.date] = (byDate[s.date]||0) + 1;});
  var dates = Object.keys(byDate).sort();
  barChart('smDateChart', dates.map(fd), [{label:'Items', data:dates.map(function(d){return byDate[d];}), color:'#3b82f6', vf:function(v){return v;}}], 180);
  var topProds = topProdsArray.slice(0,7);
  hbar('smProdChart', topProds.map(function(p){return p[0].slice(0,22);}), topProds.map(function(p){return p[1];}), ['#3b82f6','#6d28d9','#5b21b6','#4c1d95','#1d4ed8','#1e40af','#1e3a8a']);
  if(document.getElementById('smTable')){
      document.getElementById('smTable').innerHTML = groupedArr.length ? groupedArr.map(function(g) {
        var prodHtml = g.products.map(function(p) { return '• ' + p; }).join('<br>');
        return '<tr><td style="vertical-align:top; padding-top:12px;">'+fd(g.date)+'</td><td style="color:#fff; vertical-align:top; padding-top:12px; line-height:1.6;">'+prodHtml+'</td><td style="color:#ddd; vertical-align:top; padding-top:12px;">'+(g.client||'—')+'</td><td style="font-family:monospace;color:#a78bfa; vertical-align:top; padding-top:12px; font-weight:600;">'+g.totalQty+'</td><td style="vertical-align:top; padding-top:12px;"><span class="badge poc">'+g.req_by+'</span></td><td style="color:#aaa; vertical-align:top; padding-top:12px;">—</td></tr>';
      }).join('') : '<tr><td colspan="6" style="text-align:center;color:#555;padding:20px">No samples in selected range</td></tr>';
  }
}
if(document.getElementById('bdPhase')){ ['bdPhase','bdSource','bdPoc'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',renderBD);}); }
if(document.getElementById('smProd')){ ['smProd','smBy'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',renderSamples);}); }
function renderPending(){
  var today=new Date();
  var todayStr=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  var ALLOWED_POCS=['Mahi','Bhoomika','Prabhnoor','Kritik','Dhyana','Khushi'];
  var src=PENDING_SAMPLES.filter(function(s){
    return ALLOWED_POCS.some(function(p){return String(s.poc||'').toLowerCase().trim()===p.toLowerCase();});
  });
  var f=getF(),t=getT();
  var pocFilter=document.getElementById('pdPocFilter')?document.getElementById('pdPocFilter').value:'all';
  var typeFilter=document.getElementById('pdTypeFilter')?document.getElementById('pdTypeFilter').value:'all';
  var companyCount={};
  src.forEach(function(s){var c=(s.company||s.client||'').trim();if(c)companyCount[c]=(companyCount[c]||0)+1;});
  var sm=src.filter(function(s){
    if(f&&s.date<f)return false;
    if(t&&s.date>t)return false;
    if(pocFilter!=='all'&&s.poc!==pocFilter)return false;
    if(typeFilter!=='all'){
      var c=(s.company||s.client||'').trim();
      var isBau=companyCount[c]>1;
      if(typeFilter==='bau'&&!isBau)return false;
      if(typeFilter==='unique'&&isBau)return false;
    }
    return true;
  });
  var todaySamples=src.filter(function(s){return s.date===todayStr;});
  var todayByPoc={};
  todaySamples.forEach(function(s){var p=s.poc||'Unknown';todayByPoc[p]=(todayByPoc[p]||0)+1;});
  var todayPocStr=Object.entries(todayByPoc).map(function(e){return e[0]+': '+e[1];}).join(', ')||'None today';
  var byProd={};
  sm.forEach(function(s){var p=s.product||'Unknown';byProd[p]=(byProd[p]||0)+(s.qty||1);});
  var topProd=Object.entries(byProd).sort(function(a,b){return b[1]-a[1];})[0];
  var weekAgo=new Date(today);weekAgo.setDate(weekAgo.getDate()-7);
  var weekStr=weekAgo.getFullYear()+'-'+String(weekAgo.getMonth()+1).padStart(2,'0')+'-'+String(weekAgo.getDate()).padStart(2,'0');
  var weekAvg=Math.round(src.filter(function(s){return s.date>=weekStr;}).length/7*10)/10;
  var monthAgo=new Date(today);monthAgo.setDate(monthAgo.getDate()-30);
  var monthStr=monthAgo.getFullYear()+'-'+String(monthAgo.getMonth()+1).padStart(2,'0')+'-'+String(monthAgo.getDate()).padStart(2,'0');
  var monthAvg=Math.round(src.filter(function(s){return s.date>=monthStr;}).length/30*10)/10;
  var allDatesSorted=src.map(function(s){return s.date;}).filter(Boolean).sort();
  var allAvg=0;
  if(allDatesSorted.length){
    var earliest=new Date(allDatesSorted[0]);
    var daysSpan=Math.max(1,Math.round((today-earliest)/(1000*60*60*24))+1);
    allAvg=Math.round(src.length/daysSpan*10)/10;
  }
  var bau=0,unique=0,seen={};
  sm.forEach(function(s){var c=(s.company||s.client||'').trim();if(!c||seen[c])return;seen[c]=true;if(companyCount[c]>1)bau++;else unique++;});
  var byPoc={};
  sm.forEach(function(s){var p=s.poc||'Unknown';byPoc[p]=(byPoc[p]||0)+1;});
  var pocEntries=Object.entries(byPoc).sort(function(a,b){return b[1]-a[1];});
  set('pdTotal',sm.length);set('pdSub',sm.length+' samples in range');
  set('pdToday',todaySamples.length);set('pdTodaySub',todayPocStr);
  set('pdBAU',bau);set('pdUnique',unique);
  set('pdWeekAvg',weekAvg+'/day');set('pdMonthAvg',monthAvg+'/day');set('pdAllAvg',allAvg+'/day');
  set('pdTopProd',topProd?topProd[0].slice(0,28):'—');
  set('pdTopQty',topProd?topProd[1]+' units':'—');
  set('pdTopPoc',pocEntries.length?pocEntries[0][0]:'—');
  set('pdCount',sm.length+' samples shown');
  var byDate={};
  sm.forEach(function(s){if(s.date)byDate[s.date]=(byDate[s.date]||0)+1;});
  var dates=Object.keys(byDate).sort();
  if(typeof barChart==='function')barChart('pdDateChart',dates.map(fd),[{label:'Samples',data:dates.map(function(d){return byDate[d];}),color:'#3b82f6',vf:function(v){return v;}}],180);
  var topProds=Object.entries(byProd).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
  if(typeof hbar==='function'){
    hbar('pdProdChart',topProds.map(function(p){return p[0].slice(0,24);}),topProds.map(function(p){return p[1];}),['#3b82f6','#6d28d9','#5b21b6','#4c1d95','#1d4ed8','#1e40af'],function(v){return v+' units';});
    hbar('pdPocChart',pocEntries.map(function(p){return p[0];}),pocEntries.map(function(p){return p[1];}),['#a78bfa','#7c3aed','#6d28d9','#5b21b6']);
  }
  var el=document.getElementById('pdTable');
  if(el){
    var sorted=sm.slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
    el.innerHTML=sorted.length?sorted.map(function(s){
      var c=(s.company||s.client||'—').trim();
      var isBau=companyCount[c]>1;
      return '<tr><td style="font-family:monospace;color:#a78bfa;font-size:11px">'+(s.ref||'—')+'</td><td>'+fd(s.date)+'</td><td style="color:#fff;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(s.product||'—')+'</td><td style="color:#aaa">'+(s.grammage||'—')+'</td><td style="font-family:monospace;color:#22c55e">'+(s.qty||1)+'</td><td style="color:#ddd">'+(s.client||'—')+'</td><td style="color:#ddd;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+c+'</td><td><span class="badge poc">'+(s.poc||'—')+'</span></td><td><span class="badge '+(isBau?'inbound':'yes')+'">'+(isBau?'BAU':'Unique')+'</span></td><td style="color:#aaa">'+(s.dispatch||'—')+'</td></tr>';
    }).join(''):'<tr><td colspan="10" style="text-align:center;color:#555;padding:20px">No pending samples in range</td></tr>';
  }
}
function renderPendSales(){
  var f=getF(), t=getT();
  var src=PENDING_SALES.filter(function(s){
    if(f && s.poDate<f) return false;
    if(t && s.poDate>t) return false;
    return true;
  });
  set('pdSalesCount', src.length+' orders');
  var tbl=document.getElementById('pdSalesTable');
  if(tbl){
    tbl.innerHTML=src.length?src.map(function(s){
      return '<tr>'+
        '<td style="font-family:monospace;color:#a78bfa;font-size:11px">'+(s.ref||'—')+'</td>'+
        '<td>'+fd(s.poDate)+'</td>'+
        '<td>'+fd(s.orderDate)+'</td>'+
        '<td><span class="badge poc">'+(s.poc||'—')+'</span></td>'+
        '<td style="color:#fff;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(s.client||'—')+'</td>'+
        '<td style="text-align:right;color:#22c55e;font-family:monospace">₹'+Number(s.gross||0).toLocaleString()+'</td>'+
        '<td style="color:#aaa">'+(s.pocName||'—')+'</td>'+
        '<td style="color:#aaa;font-family:monospace">'+(s.contact||'—')+'</td>'+
      '</tr>';
    }).join(''):'<tr><td colspan="8" style="text-align:center;color:#555;padding:20px">No sales orders in range</td></tr>';
  }
}
['ccUrgencyF','ccPocF'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',renderCCBD);});
var sSortEl = document.getElementById('sSort'); if(sSortEl) sSortEl.addEventListener('change', renderAll);
function switchPendSub(which){
  document.getElementById('pd-samples').style.display=(which==='samples'?'block':'none');
  document.getElementById('pd-sales').style.display=(which==='sales'?'block':'none');
  document.getElementById('pdSubSamples').classList.toggle('on',which==='samples');
  document.getElementById('pdSubSales').classList.toggle('on',which==='sales');
  if(which==='sales') renderPendSales();
  if(which==='samples'&&typeof renderPending==='function')renderPending();
}
// Parse pending samples. Prefers the new dedicated Pending_Samples tab (has a
// header row, so it gets sliced off); falls back to the older Pending_Delivery
// tab (no header row in that one) if Pending_Samples hasn't been added yet.
// Used to be a duplicate SHEET_URL fetch — now shares the one response below.
function parsePendingDelivery(raw){
  var usingNewTab = !!raw['Pending_Samples'];
  var rawRows = usingNewTab ? raw['Pending_Samples'] : raw['Pending_Delivery'];
  var rows=(rawRows||[]).filter(function(r){return r[0]||r[6];});
  if(usingNewTab) rows = rows.slice(1); // drop the header row (Ref No., POC, Date, ...)
  PENDING_SAMPLES=rows.map(function(r){
    var dRaw=r[2],ds='';
    if(dRaw){
      var dObj=new Date(dRaw);
      if(!isNaN(dObj)){
        var ist=new Date(dObj.getTime()+5.5*60*60*1000);
        ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');
      } else if(typeof dRaw==='string'&&dRaw.length>=8){ds=dRaw.slice(0,10);}
    }
    return {ref:String(r[0]||'').trim(),poc:String(r[1]||'').trim(),date:ds,product:String(r[3]||'').trim(),grammage:String(r[4]||'').trim(),qty:parseFloat(r[5])||1,client:String(r[6]||'').trim(),contact:String(r[7]||'').trim(),location:String(r[8]||'').trim(),company:String(r[9]||'').trim(),dispatch:String(r[10]||'').trim()};
  });
  var ALLOWED_POCS_LIST=['Mahi','Bhoomika','Prabhnoor','Kritik','Dhyana','Khushi'];
  var pocsInData={};
  PENDING_SAMPLES.forEach(function(s){
    var pn=String(s.poc||'').trim();
    ALLOWED_POCS_LIST.forEach(function(ap){
      if(pn.toLowerCase()===ap.toLowerCase())pocsInData[ap]=1;
    });
  });
  var sel=document.getElementById('pdPocFilter');
  if(sel){
    sel.innerHTML='<option value="all">All POCs</option>'+Object.keys(pocsInData).sort().map(function(p){return '<option value="'+p+'">'+p+'</option>';}).join('');
    sel.addEventListener('change',renderPending);
  }
  var typeSel=document.getElementById('pdTypeFilter');
  if(typeSel)typeSel.addEventListener('change',renderPending);
  console.log('Pending samples loaded: '+PENDING_SAMPLES.length+' rows');
  renderPending();
}
// Fetch + parse JSON with automatic retry/backoff. Apps Script web apps
// enforce a "simultaneous executions per user" quota — if several people
// open this dashboard around the same time, or a call gets rate-limited,
// Apps Script can return a 429/503, or a 200 with an HTML "quota exceeded"
// page instead of real JSON. Both count as retryable here.
function fetchJSON(url, opts) {
  opts = opts || {};
  var maxRetries = opts.retries === undefined ? 3 : opts.retries;
  var timeoutMs = opts.timeoutMs || 30000;

  function attempt(retriesLeft, attemptNum) {
    var ctrl = new AbortController();
    var timeoutId = setTimeout(function () { ctrl.abort(); }, timeoutMs);
    var sep = url.indexOf('?') > -1 ? '&' : '?';
    return fetch(url + sep + 't=' + Date.now(), { cache: 'no-store', redirect: 'follow', signal: ctrl.signal })
      .then(function (r) {
        clearTimeout(timeoutId);
        if (!r.ok) {
          var httpErr = new Error('HTTP ' + r.status);
          httpErr.retryable = (r.status === 429 || r.status === 503 || r.status === 500);
          throw httpErr;
        }
        return r.text();
      })
      .then(function (text) {
        try { return JSON.parse(text); }
        catch (e) {
          var parseErr = new Error('Non-JSON response (likely an Apps Script quota/error page)');
          parseErr.retryable = true;
          throw parseErr;
        }
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        if (retriesLeft > 0 && err.retryable !== false) {
          var delay = 900 * attemptNum + Math.random() * 500;
          console.warn('fetchJSON retrying ' + url + ' in ' + Math.round(delay) + 'ms (' + retriesLeft + ' left) — ' + err.message);
          return new Promise(function (res) { setTimeout(res, delay); })
            .then(function () { return attempt(retriesLeft - 1, attemptNum + 1); });
        }
        throw err;
      });
  }
  return attempt(maxRetries, 1);
}
// ── BOOT ──────────────────────────────────────────────────
window.addEventListener('load',function(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){ renderAll(); });});
  // Spread the startup fetches out a little instead of firing all 4 in the
  // same instant — helps avoid tripping Apps Script's simultaneous-execution
  // quota when multiple people load the dashboard close together.
  var STAGGER_MS = 250;

  if (typeof SHEET_URL !== 'undefined' && SHEET_URL) {
    setTimeout(function() {
      fetchJSON(SHEET_URL, { timeoutMs: 60000 })
        .then(function(raw) {
          var sheetKeys = Object.keys(raw);
          // MASTER LOG
          if(raw['Master_Log']){
            var smap={'Email Delivered':'del','Email Opened':'open','Email Clicked':'click','RESPONDED':'resp','BOUNCED':'bounce'};
            var bd2={},bi2={},bdP={},bdF={};
            // NEW: per-industry per-date store for Diwali date filtering
            var bi2d={};
            var firstHeader={};

            raw['Master_Log'].forEach(function(r){
              if(!r||!r[0])return;
              var ind=String(r[0]).trim();
              if(!firstHeader[ind])firstHeader[ind]=String(r[2]||'').trim();
            });

             raw['Master_Log'].forEach(function(r){
              if(!r||!r[3])return;
              var key=smap[String(r[3]).trim()];
              if(!key)return;

              var ind=String(r[0]||'').trim();
              var isPrimary = (String(r[2]||'').trim()===firstHeader[ind]);
              var d=r[4], ds='';

              if(d&&typeof d==='string'&&d.length>=8){
                var utc=new Date(d);
                if(!isNaN(utc)){
                  var ist=new Date(utc.getTime()+5.5*60*60*1000);
                  ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');
                }
              }
              if(!ds || ds < '2020-01-01') ds = '2026-04-15';

              if(!bd2[ds])bd2[ds]={date:ds,del:0,open:0,click:0,resp:0,bounce:0};
              bd2[ds][key]++;

              if(isPrimary){if(!bdP[ds])bdP[ds]={date:ds,del:0,open:0,click:0,resp:0,bounce:0};bdP[ds][key]++;}
              else{if(!bdF[ds])bdF[ds]={date:ds,del:0,open:0,click:0,resp:0,bounce:0};bdF[ds][key]++;}

              var ind_cl=String(r[0]||'').trim().replace(/^N\(\d+\)[-–]\s*/,'').replace(/^O\(\d+\)[-–]\s*/,'').replace(/^[NO][-–]\s*/,'').replace(/^0[-–]\s*/,'').replace(/[-–]\s*\d+\/\d+\/\d+\s*$/,'').trim();
              if(!ind_cl)return;
              if(!bi2[ind_cl])bi2[ind_cl]={ind:ind_cl,del:0,open:0,click:0,resp:0,bounce:0};
              bi2[ind_cl][key]++;
              // NEW: also store in bi2d keyed by "industry|date"
              var idk=ind_cl+'|'+ds;
              if(!bi2d[idk])bi2d[idk]={ind:ind_cl,date:ds,del:0,open:0,click:0,resp:0,bounce:0};
              bi2d[idk][key]++;
            });

            ML_BY_DATE.length=0; Object.values(bd2).sort(function(a,b){return a.date.localeCompare(b.date);}).forEach(function(d){ML_BY_DATE.push(d);});
            ML_BY_IND.length=0; Object.values(bi2).filter(function(i){return i.del>0;}).forEach(function(i){ML_BY_IND.push(i);});
            ML_PRIMARY=Object.values(bdP).sort(function(a,b){return a.date.localeCompare(b.date);});
            ML_FOLLOWUP=Object.values(bdF).sort(function(a,b){return a.date.localeCompare(b.date);});
            // NEW: expose for Diwali tab
            window._ML_IND_DATE = Object.values(bi2d);
          }
          // ADS LOG
          var adsKey = sheetKeys.find(function(k){ return k.toLowerCase().replace(/\s+/g, '').includes('ads_log') || k.toLowerCase().replace(/\s+/g, '') === 'adslog'; }) || 'Ads_Log';
          if(raw[adsKey]){
            var parsedAds = raw[adsKey].slice(1).map(function(r){
              var client = String(r[1]||'').trim();
              if(!client || client==='—') return null;
              var dRaw = r[4], ds = '';
              if(dRaw){
                var dStr = String(dRaw).trim();
                if(dStr.includes('/')){
                    var p = dStr.split('/');
                    if(p.length >= 3) {
                        var yr = p[2].length===2 ? '20'+p[2] : p[2];
                        var first = parseInt(p[0]), second = parseInt(p[1]);
                        if(first > 12) ds = yr+'-'+String(second).padStart(2,'0')+'-'+String(first).padStart(2,'0');
                        else ds = yr+'-'+String(first).padStart(2,'0')+'-'+String(second).padStart(2,'0');
                    }
                } else {
                    var dObj = new Date(dStr);
                    if(!isNaN(dObj.getTime())){
                        var ist = new Date(dObj.getTime() + 5.5 * 60 * 60 * 1000);
                        ds = ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');
                    }
                }
              }
              if(!ds) ds = new Date().toISOString().slice(0,10);
              var valRaw = String(r[11]||r[10]||r[6]||'').replace(/[^\d.-]/g, '');
              return {
                date: ds, client: client, type: String(r[8]||r[7]||'Inbound').trim() || 'Inbound',
                poc: String(r[9]||'—').trim(), lead: String(r[13]||'Cold').trim(),
                conv: String(r[12]||'—').trim(), val: parseFloat(valRaw) || null
              };
            }).filter(Boolean);
            if(parsedAds.length > 0) ADS = parsedAds;
          }
          // INMAILS
          var inmailsKey = sheetKeys.find(function(k){ return k.toLowerCase().replace(/\s+/g, '') === 'inmails'; }) || 'InMails ';
          if(raw[inmailsKey]){
            var parsedInmails = raw[inmailsKey].slice(1).map(function(r, i){
              var company = String(r[2]||'').trim();
              if(!company) return null;
              return {
                n: i+1, ind: String(r[1]||'—').trim(), company: company,
                role: String(r[3]||'—').trim(), poc: String(r[4]||'—').trim()
              };
            }).filter(Boolean);
            if(parsedInmails.length > 0) INMAILS = parsedInmails;
          }
          // SALES LOG (Inside SHEET_URL fetch now)
          var salesKey = sheetKeys.find(function(k) { return k.toLowerCase().includes('sale'); }) || 'Sales_Log';
          if(raw[salesKey]){
            var parsedSales = raw[salesKey].slice(1).map(function(r){
              var typeStr = String(r[1] || '').trim().toLowerCase();
              if (!typeStr.includes('inst')) return null;
              var pocRaw = String(r[4]||r[3]||'').trim();
              if (pocRaw.toLowerCase() === 'aditi') return null;
              var dRaw=r[2]||r[3],ds='';
              if(dRaw){
                var dStr = String(dRaw).trim();
                if(dStr.includes('/')){
                    var p=dStr.split('/');
                    if(p.length >= 3) ds=(p[2].length===2?'20'+p[2]:p[2])+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0');
                } else {
                    var dObj=new Date(dStr);
                    if(!isNaN(dObj.getTime())){
                        var ist = new Date(dObj.getTime() + 5.5 * 60 * 60 * 1000);
                        ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');
                    }
                }
              }
              var amt = parseFloat(String(r[6]||r[7]||r[8]||r[5]||'0').replace(/[^\d.-]/g, ''));
              if (!ds || isNaN(amt) || amt === 0) return null;
              return { ref: String(r[0]||'—'), date: ds, client: String(r[5]||r[4]||'—').trim(), poc: pocRaw || '—', type: String(r[1]||'Inst Order').trim(), amt: amt };
            }).filter(Boolean);
            if(parsedSales.length > 0){ SALES = parsedSales; }
          }
           // CCBD_BAU — new CCBD Tracker BAU tab
          // Cols: [0]SrNo [1]Date [2]Name [3]Phone [4]City [5]Remarks [6]Urgency [7]Dept [8]Channel [9]POC [10]Quality [11]Conversion
          // Pending Sales
          if(raw['Pending_Sales']){
            PENDING_SALES = raw['Pending_Sales'].filter(function(r){return r[0];}).map(function(r){
              function toDS(v){
                if(!v) return '';
                var d=new Date(String(v));
                if(!isNaN(d.getTime())){var ist=new Date(d.getTime()+5.5*60*60*1000);return ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');}
                return '';
              }
              return {
                ref:String(r[0]||'').trim(),
                poDate:toDS(r[1]),
                orderDate:toDS(r[2]),
                poc:String(r[3]||'').trim(),
                client:String(r[4]||'').trim(),
                gross:parseFloat(r[5])||0,
                pocName:String(r[6]||'').trim(),
                contact:String(r[7]||'').trim()
              };
            });
          }
          if(raw['CCBD_BAU']){
            var ccbdRaw = raw['CCBD_BAU'];
            var pocSet = new Set();
            CCBD_ROWS = ccbdRaw.filter(function(r){return r[2]||r[1];}).map(function(r){
              var dRaw=r[1], ds='';
              if(dRaw){
                var dObj=new Date(String(dRaw));
                if(!isNaN(dObj.getTime())){var ist=new Date(dObj.getTime()+5.5*60*60*1000);ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');}
              }
              var poc = String(r[9]||'').trim();
              if (poc) pocSet.add(poc);
              return {
                sr: String(r[0]||'').trim(), date: ds||'', name: String(r[2]||'').trim(),
                phone: String(r[3]||'').trim().replace(/\.0$/,''), city: String(r[4]||'').trim(),
                remarks: String(r[5]||'').trim(), urgency: String(r[6]||'').trim(),
                conversion: String(r[11]||'').trim(), poc: poc
              };
            });
            var pocSelect = document.getElementById('ccPocF');
            if (pocSelect) {
              pocSelect.querySelectorAll('option:not([value="all"])').forEach(function(o){o.remove();});
              pocSet.forEach(function(p){ if(p){var opt=document.createElement('option');opt.value=p;opt.textContent=p;pocSelect.appendChild(opt);} });
            }
          }
          // CCBD_Festive
          if(raw['CCBD_Festive']){
            CCBD_FESTIVE = raw['CCBD_Festive'].slice(1).filter(function(r){return r[0]||r[2];}).map(function(r){
              var dRaw=r[1], ds='';
              if(dRaw){
                var dObj=new Date(String(dRaw));
                if(!isNaN(dObj.getTime())){var ist=new Date(dObj.getTime()+5.5*60*60*1000);ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');}
              }
              return {
                sr: String(r[0]||'').trim(), date: ds||'', name: String(r[2]||'').trim(),
                phone: String(r[3]||'').trim().replace(/\.0$/,''), platform: String(r[4]||'').trim(),
                quality: String(r[5]||'').trim(), remark: String(r[6]||'').trim(), poc: String(r[7]||'').trim()
              };
            });
          }
          // Pending_Delivery — previously fetched via a second separate SHEET_URL call; now reuses this response
          parsePendingDelivery(raw);
          document.getElementById('stxt').textContent='live · google sheets';
          renderAll();
        }).catch(function(err){
            console.error("SHEET_URL Fetch Error:", err);
            document.getElementById('stxt').textContent='cached data (fetch failed)';
        });
    }, 0);
  }

  if (typeof BD_URL !== 'undefined' && BD_URL) {
    setTimeout(function() {
    fetchJSON(BD_URL).then(function(bdRaw){
      BD_ROWS=(bdRaw['Sheet1']||[]).slice(1).filter(function(r){return r[0]||r[1];}).map(function(r){
        var dRaw=r[0],ds='';
        if(dRaw){
          var dObj=new Date(dRaw);
          if(!isNaN(dObj)){var ist=new Date(dObj.getTime()+5.5*60*60*1000);ds=ist.getFullYear()+'-'+String(ist.getMonth()+1).padStart(2,'0')+'-'+String(ist.getDate()).padStart(2,'0');}
          else if(typeof dRaw==='string'&&dRaw.length>=8){ds=dRaw.replace(/(\d+)\/(\d+)\/(\d+)/,function(m,d,mo,y){return(y.length===2?'20'+y:y)+'-'+mo.padStart(2,'0')+'-'+d.padStart(2,'0');});}
        }
        return {date:ds,company:String(r[1]||'').trim(),name:String(r[2]||'').trim(),contact:String(r[3]||'').trim(),location:String(r[4]||'').trim(),poc:String(r[5]||'').trim(),remarks:String(r[6]||'').trim(),source:String(r[7]||'').trim(),phase:String(r[10]||'').trim()||'Unknown',followup:String(r[12]||'').trim()};
      });
      renderBD();
      var rcRaw=(bdRaw['Recurring clients']||[]).slice(1);
      RC_ROWS=rcRaw.filter(function(r){return r[0]||r[1];}).map(function(r){ return { client:String(r[0]||'').trim(), poc:String(r[1]||'').trim(), phone:String(r[2]||'').trim(), location:String(r[3]||'').trim(), revenue:String(r[4]||'').trim(), orders:String(r[5]||'').trim(), dates:String(r[6]||'').trim() }; });
      renderRecurring();
    }).catch(function(e){console.warn('BD_URL fetch failed', e);});
    }, STAGGER_MS);
  }
  if (typeof DIWALI_URL !== 'undefined' && DIWALI_URL) {
    setTimeout(function() {
    fetchJSON(DIWALI_URL)
      .then(function(dw){
        var liRaw = dw['LinkedIn Tracker'] || [];
        var liStart = 0;
        for(var i=0; i<liRaw.length; i++) { if(String(liRaw[i][0]).trim() === 'First Name') { liStart = i+1; break; } }
        var li = liRaw.slice(liStart || 4).filter(function(r){ return r[0] || r[2]; });
        var liSent = li.filter(function(r){ return String(r[6]||'').trim().toLowerCase()==='yes' || String(r[6]||'').trim().toLowerCase()==='sent'; }).length;

        set('dw-li-count', li.length); set('dw-li-sub', liSent + ' InMails sent');
        set('li-tile-tot', li.length); set('li-tile-sent', liSent);
        set('li-tile-sent-pct', pct(liSent, li.length) + ' coverage'); set('li-tile-pend', li.length - liSent);

        if(document.getElementById('dw-li-table')) document.getElementById('dw-li-table').innerHTML = li.length ? li.map(function(r){
          var name = (String(r[0]||'') + ' ' + String(r[1]||'')).trim() || '—';
          var company = String(r[2]||'—'); var pos = String(r[3]||'—');
          var sentRaw = String(r[6]||'').trim().toLowerCase();
          var sent = (sentRaw === 'yes' || sentRaw === 'sent');
          return '<tr><td style="color:#fff">'+name+'</td><td style="color:#a78bfa">'+company+'</td><td>'+pos+'</td><td><span class="badge '+(sent?'yes':'cold')+'">'+(sent?'Sent':'Pending')+'</span></td></tr>';
        }).join('') : '<tr><td colspan="4" style="text-align:center;color:#555;padding:20px">No LinkedIn data</td></tr>';
        var ccRaw = dw['Cold Calls Tracker'] || [];
        var ccStart = 0;
        for(var i=0; i<ccRaw.length; i++) {
           var c0 = String(ccRaw[i][0]).trim().toLowerCase(); var c1 = String(ccRaw[i][1]).trim().toLowerCase();
           if(c0 === 'company' || c0 === 's.no' || c0 === 's no' || c1 === 'company') { ccStart = i+1; break; }
        }
        var cc = ccRaw.slice(ccStart || 4).filter(function(r){ return r[0] || r[2]; });
        var ccDone = cc.filter(function(r){ var s=String(r[11]||'').trim().toLowerCase(); return s && s!=='not picked up' && s!=='not connected'; }).length;
        var ccPos = 0, ccNo = 0, ccFu = 0;
        cc.forEach(function(r){
          var s = String(r[11]||'').trim().toLowerCase();
          if (s.includes('interested') && !s.includes('not')) ccPos++;
          else if (s.includes('share') || s.includes('catalogue') || s.includes('call done') || s.includes('b2b')) ccPos++;
          else if (s.includes('not interested')) ccNo++;
          else if (s.includes('not picked up') || s.includes('not connected') || s.includes('invalid')) ccFu++;
        });

        set('dw-cc-count', cc.length); set('dw-cc-sub', ccDone + ' connects');
        set('cc-tile-tot', cc.length); set('cc-tile-pos', ccPos);
        set('cc-tile-no', ccNo); set('cc-tile-no-pct', pct(ccNo, cc.length) + ' rejection rate'); set('cc-tile-fu', ccFu);

        if(document.getElementById('dw-cc-table')) document.getElementById('dw-cc-table').innerHTML = cc.length ? cc.map(function(r){
          var company = String(r[2]||'—'); var calledBy = String(r[10]||r[6]||'—');
          var followUp = String(r[6]||'—'); var status = String(r[11]||'—');
          var statusLower = status.toLowerCase();
          var badge = statusLower.includes('interested') && !statusLower.includes('not') ? 'yes' : (statusLower.includes('not') ? 'no' : 'cold');
          return '<tr><td style="color:#fff">'+company+'</td><td>'+calledBy+'</td><td>'+followUp+'</td><td><span class="badge '+badge+'">'+status+'</span></td></tr>';
        }).join('') : '<tr><td colspan="4" style="text-align:center;color:#555;padding:20px">No call data</td></tr>';
        var tgtRaw = dw['Sample Box'] || [];
        if (tgtRaw.length === 0) {
            var keys = Object.keys(dw).join(', ');
            if(document.getElementById('dw-tgt-table')) document.getElementById('dw-tgt-table').innerHTML = '<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:20px">Data empty! API only sent these tabs: ' + (keys || 'None') + '</td></tr>';
        } else {
            var tgtStart = 0;
            for(var i=0; i<Math.min(10, tgtRaw.length); i++) {
               var rowStr = String(tgtRaw[i].join('')).toLowerCase();
               if(rowStr.includes('company') || rowStr.includes('industry')) { tgtStart = i+1; break; }
            }
            var tgt = tgtRaw.slice(tgtStart).filter(function(r){ return r.join('').trim() !== ''; });
            var tgtWithPoc = tgt.filter(function(r){ var p=String(r[6]||r[7]||'').trim(); return p && p !== '—'; }).length;
            var tgtWithNum = tgt.filter(function(r){ var c=String(r[8]||r[9]||'').trim(); return c && c !== '—'; }).length;
            var tgtNoPoc = tgt.length - tgtWithPoc;

            set('dw-tgt-count', tgt.length); set('dw-tgt-sub', tgtWithPoc + ' POCs found (' + pct(tgtWithPoc, tgt.length || 1) + ')');
            set('tgt-tile-tot', tgt.length); set('tgt-tile-poc', tgtWithPoc); set('tgt-tile-poc-pct', pct(tgtWithPoc, tgt.length || 1) + ' coverage');
            set('tgt-tile-num', tgtWithNum); set('tgt-tile-num-pct', pct(tgtWithNum, tgt.length || 1) + ' dialable'); set('tgt-tile-nopoc', tgtNoPoc);

            var indMap = {};
            tgt.forEach(function(r) { var ind = String(r[1] || r[0] || '').trim(); if (!ind || ind === '—') ind = 'Ungrouped / Other'; indMap[ind] = (indMap[ind] || 0) + 1; });
            var indEntries = Object.entries(indMap).sort(function(a,b) { return b[1] - a[1]; });
            hbar('tgt-ind-chart', indEntries.map(function(e) { return e[0]; }), indEntries.map(function(e) { return e[1]; }), ['#6b7280', '#3b82f6', '#f97316', '#22c55e', '#7c3aed', '#0ea5e9']);

            if(document.getElementById('dw-tgt-table')) document.getElementById('dw-tgt-table').innerHTML = tgt.length ? tgt.map(function(r,i){
              var company = String(r[2] || r[1] || r[3] || '—').trim(); var industry = String(r[1] || r[0] || '—').trim();
              var trigger = String(r[4] || r[5] || '—').trim(); var poc = String(r[6] || r[7] || '—').trim(); var contact = String(r[8] || r[9] || '—').trim();
              var hasPoc = !!poc && poc !== '—'; var hasContact = !!contact && contact !== '—';
              var status = hasPoc && hasContact ? 'Identified' : (hasPoc ? 'No number' : 'No POC');
              var badge = hasPoc && hasContact ? 'yes' : (hasPoc ? 'warm' : 'no');
              return '<tr><td>'+(i+1)+'</td><td style="color:#fff">'+company+'</td><td>'+industry+'</td><td>'+trigger+'</td><td style="color:#a78bfa">'+poc+'</td><td>'+contact+'</td><td><span class="badge '+badge+'">'+status+'</span></td></tr>';
            }).join('') : '<tr><td colspan="7" style="text-align:center;color:#555;padding:20px">Headers found, but no rows below them!</td></tr>';
        }
        var et=(dw['Email Tracker']||[]).slice(1);
        var curInd=''; var etMap={};
        et.forEach(function(r){
          var indRaw=String(r[1]||'').trim(); if(indRaw) curInd=indRaw; if(!curInd) return;
          var totalSent=parseFloat(r[9])||0; var resp=parseFloat(r[10])||0;
          if(!etMap[curInd]) etMap[curInd]={industry:curInd,totalSent:0,responses:0};
          etMap[curInd].totalSent+=totalSent; etMap[curInd].responses+=resp;
        });
        DW_EMAIL=Object.values(etMap).filter(function(m){return m.totalSent>0;});
        renderDiwaliEmail();
      }).catch(function(e){console.warn('Diwali extras fetch failed',e);});
    }, STAGGER_MS*2);
  }
  if (typeof SAMPLES_URL !== 'undefined' && SAMPLES_URL) {
    setTimeout(function() {
    fetchJSON(SAMPLES_URL)
      .then(function(raw) {
        var sheetKeys = Object.keys(raw);
        var sheetName = sheetKeys.find(function(k) { return k.toLowerCase().includes('recent'); }) || sheetKeys.reverse().find(function(k) { return k.toLowerCase().includes('sample'); }) || sheetKeys[0];
        var rows = (raw[sheetName] || []).slice(1);
        var currentPOC = '', currentDate = '', currentClient = '—';
        var parsed = rows.map(function(r) {
          var reqByRaw = String(r[2] || '').trim();
          if (reqByRaw) {
            currentClient = '—';
            var reqByLower = reqByRaw.toLowerCase();
            var allowed = ['siya', 'mahi', 'bhoomika', 'dhyana'];
            currentPOC = '';
            for (var i = 0; i < allowed.length; i++) {
              if (reqByLower.includes(allowed[i])) { currentPOC = allowed[i].charAt(0).toUpperCase() + allowed[i].slice(1); break; }
            }
          }
          var dRaw = r[3];
          if (dRaw && String(dRaw).trim() !== '') {
            var dStr = String(dRaw).trim();
            if (dStr.includes('/')) {
              var p = dStr.split('/');
              if (p.length >= 3) { var yr = p[2].length === 2 ? '20' + p[2] : p[2]; currentDate = yr + '-' + p[1].padStart(2, '0') + '-' + p[0].padStart(2, '0'); }
            } else {
              var tempD = new Date(dStr);
              if (!isNaN(tempD.getTime())) { var ist = new Date(tempD.getTime() + 5.5 * 60 * 60 * 1000); currentDate = ist.getFullYear() + '-' + String(ist.getMonth() + 1).padStart(2, '0') + '-' + String(ist.getDate()).padStart(2, '0'); }
            }
          }
          var clientRaw = String(r[11] || '').trim();
          if (clientRaw) currentClient = clientRaw;
          if (!currentPOC || !currentDate || currentDate.length < 8) return null;
          var prod = String(r[8] || r[4] || '').trim();
          var qtyVal = parseInt(r[10] || r[5]) || 1;
          if (!prod || prod.toLowerCase() === 'q' || prod.toLowerCase() === 'dipsters list') return null;
          return { date: currentDate, product: prod, client: currentClient, qty: qtyVal, req_by: currentPOC, dispatch: '' };
        }).filter(Boolean);
        if (parsed.length > 0) { SAMPLES = parsed; renderAll(); }
      }).catch(function(e) { console.warn('Samples fetch failed', e); });
    }, STAGGER_MS*3);
  }
});