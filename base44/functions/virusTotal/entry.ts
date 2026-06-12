import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const VT_API_KEY = Deno.env.get("VIRUSTOTAL_API_KEY");
const VT_BASE = "https://www.virustotal.com/api/v3";

function detectType(query) {
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(query)) return 'ip_addresses';
  if (/^[a-fA-F0-9]{32}$/.test(query) || /^[a-fA-F0-9]{40}$/.test(query) || /^[a-fA-F0-9]{64}$/.test(query)) return 'files';
  if (query.startsWith('http://') || query.startsWith('https://') || query.includes('/')) return 'urls';
  return 'domains';
}

function buildEndpoint(type, lookupId) {
  if (type === 'urls') {
    const encoded = btoa(lookupId).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return { endpoint: `${VT_BASE}/urls/${encoded}`, rescanEndpoint: `${VT_BASE}/urls/${encoded}/analyse` };
  } else if (type === 'ip_addresses') {
    return { endpoint: `${VT_BASE}/ip_addresses/${lookupId}`, rescanEndpoint: null };
  } else if (type === 'domains') {
    return { endpoint: `${VT_BASE}/domains/${lookupId}`, rescanEndpoint: null };
  } else {
    return { endpoint: `${VT_BASE}/files/${lookupId}`, rescanEndpoint: `${VT_BASE}/files/${lookupId}/analyse` };
  }
}

function parseResult(data, type, lookupId) {
  const attrs = data?.data?.attributes || {};
  const stats = attrs.last_analysis_stats || {};
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;

  let riskLevel = 'clean';
  if (malicious > 5) riskLevel = 'malicious';
  else if (malicious > 0 || suspicious > 0) riskLevel = 'suspicious';
  else if (total === 0) riskLevel = 'unknown';

  const analysisResults = attrs.last_analysis_results || {};
  const detections = Object.entries(analysisResults)
    .filter(([, v]) => v.category === 'malicious' || v.category === 'suspicious')
    .slice(0, 10)
    .map(([engine, v]) => ({ engine, category: v.category, result: v.result }));

  return {
    query: lookupId,
    type,
    riskLevel,
    stats: { malicious, suspicious, harmless: stats.harmless || 0, undetected: stats.undetected || 0, total },
    detections,
    reputation: attrs.reputation,
    country: attrs.country,
    asOwner: attrs.as_owner,
    tags: attrs.tags || [],
    lastAnalysisDate: attrs.last_analysis_date,
    names: attrs.names || [],
    typeDescription: attrs.type_description,
    size: attrs.size,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, rescan } = await req.json();
    if (!query) {
      return Response.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const type = detectType(query.trim());
    const lookupId = query.trim();
    const { endpoint, rescanEndpoint } = buildEndpoint(type, lookupId);

    // If rescan requested and supported, trigger rescan first
    if (rescan && rescanEndpoint) {
      await fetch(rescanEndpoint, {
        method: 'POST',
        headers: { 'x-apikey': VT_API_KEY, 'Accept': 'application/json' },
      });
      // Wait a moment for the rescan to register
      await new Promise(r => setTimeout(r, 3000));
    }

    const response = await fetch(endpoint, {
      headers: { 'x-apikey': VT_API_KEY, 'Accept': 'application/json' },
    });

    if (response.status === 404) {
      return Response.json({ error: 'not_found', message: 'לא נמצא מידע עבור השאילתה' }, { status: 404 });
    }
    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: 'vt_error', message: err }, { status: response.status });
    }

    const data = await response.json();
    const canRescan = !!(rescanEndpoint);
    return Response.json({ ...parseResult(data, type, lookupId), canRescan });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});