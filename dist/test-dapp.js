import{d as l}from"./inpage.js";let a=[];function o(e,s="info"){const t=document.getElementById("status");t&&(t.textContent=e,t.className=`status ${s}`)}function i(e){const s=document.getElementById("wallet-list");if(s){if(s.innerHTML="",e.length===0){s.innerHTML=`
      <div style="text-align: center; color: #666; padding: 20px;">
        <p>No compliant Aptos wallets found.</p>
        <p><strong>Steps to fix:</strong></p>
        <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
          <li>Install Petra, Okto, or other Aptos wallets</li>
          <li>Ensure they implement all 8 required features</li>
          <li>Refresh this page</li>
        </ol>
      </div>
    `;return}e.forEach(t=>{var n;const r=document.createElement("div");r.className="wallet-item",r.innerHTML=`
      <img src="${t.icon}" alt="${t.name}" class="wallet-icon" onerror="this.style.display='none'">
      <div class="wallet-info">
        <div class="wallet-name">${t.name}</div>
        <div class="wallet-description">Version: ${t.version} | Chains: ${((n=t.chains)==null?void 0:n.length)||0} | Features: ${Object.keys(t.features).length}</div>
      </div>
    `,r.addEventListener("click",()=>{d(t)}),s.appendChild(r)})}}async function d(e){var s;o(`Testing connection to ${e.name}...`,"info");try{if(e.features["aptos:connect"]){const t=await e.features["aptos:connect"].connect();t.status==="Approved"?o(`✅ Successfully connected to ${e.name}! Address: ${((s=t.args)==null?void 0:s.address)||"N/A"}`,"success"):o(`❌ Connection to ${e.name} was rejected by user.`,"error")}else o(`❌ ${e.name} does not support connection feature.`,"error")}catch(t){o(`❌ Failed to connect to ${e.name}: ${t.message}`,"error"),console.error("Connection error:",t)}}function c(){try{const{aptosWallets:e,on:s}=l();a=e,console.log(`Found ${e.length} AIP-62 compliant wallets`),e.length>0?(o(`✅ Found ${e.length} AIP-62 compliant wallet(s)`,"success"),i(e),e.forEach(n=>{console.log(`- ${n.name} v${n.version}`)})):(o("⚠️ No AIP-62 compliant wallets detected. Install Petra, Okto, or other standard wallets.","error"),i([]));const t=s("register",function(){console.log("New wallet registered via AIP-62 standard");const{aptosWallets:n}=l();a=n,o(`🎉 New wallet registered! Found ${n.length} wallet(s)`,"success"),i(n)}),r=s("unregister",function(){console.log("Wallet unregistered via AIP-62 standard");const{aptosWallets:n}=l();a=n,o(`Wallet removed. ${n.length} wallet(s) remaining`,"info"),i(n)});window.walletListeners={removeRegisterListener:t,removeUnregisterListener:r}}catch(e){o(`❌ Error with AIP-62 detection: ${e.message}`,"error"),console.error("AIP-62 detection error:",e)}}document.addEventListener("DOMContentLoaded",()=>{c();const e=document.getElementById("refresh-btn");e&&e.addEventListener("click",()=>{o("🔄 Refreshing with official AIP-62 detection...","info"),setTimeout(c,500)})});window.addEventListener("beforeunload",()=>{const e=window.walletListeners;e&&(e.removeRegisterListener(),e.removeUnregisterListener())});
