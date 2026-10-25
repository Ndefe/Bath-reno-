/* Gert's Reno lead worker.
   Paste this into a Cloudflare Worker you create yourself.
   It does not send email or SMS, and it does not invent an ABN or a licence.
   Only text fields are stored. Photo files are ignored. */
const PAGES_ORIGIN='https://ndefe.github.io';

function allowedOrigin(origin){
  if(origin===PAGES_ORIGIN) return origin;
  return '';
}
function cors(request){
  const origin=allowedOrigin(request.headers.get('Origin')||'');
  const headers={
    'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type, X-Lead-Token',
    'Access-Control-Max-Age':'86400'
  };
  if(origin) headers['Access-Control-Allow-Origin']=origin;
  return headers;
}
function json(request, status, body){
  return new Response(JSON.stringify(body), {
    status,
    headers:{...cors(request), 'Content-Type':'application/json; charset=utf-8'}
  });
}
function clip(value, max){
  return String(value==null?'':value).trim().slice(0, max);
}

export default {
  async fetch(request, env){
    if(request.method==='OPTIONS') return new Response(null, {status:204, headers:cors(request)});
    if(request.method!=='POST') return json(request, 405, {ok:false, error:'POST only'});
    const expected=clip(env&&env.LEAD_TOKEN, 200);
    if(!expected) return json(request, 503, {ok:false, error:'Set LEAD_TOKEN before this worker accepts a lead.'});
    let form;
    try{form=await request.formData()}
    catch{return json(request, 400, {ok:false, error:'Expected a form post.'})}
    const sent=clip(request.headers.get('X-Lead-Token'), 200);
    if(sent!==expected) return json(request, 401, {ok:false, error:'Token does not match.'});
    const lead={
      customer_name:clip(form.get('customer_name')||form.get('name'), 200),
      phone:clip(form.get('phone'), 40),
      email:clip(form.get('email'), 200),
      suburb:clip(form.get('suburb'), 120),
      state:clip(form.get('state'), 20),
      notes:clip(form.get('notes'), 4000),
      job_description:clip(form.get('job_description'), 8000),
      package:clip(form.get('package'), 200),
      floor_area_m2:clip(form.get('floor_area_m2'), 40),
      quote_total:clip(form.get('quote_total'), 40),
      quote_number:clip(form.get('quote_number'), 40),
      received_at:new Date().toISOString()
    };
    const kv=env&&env.LEADS;
    if(!kv||typeof kv.put!=='function') return json(request, 200, {ok:true, stored:false});
    const number=lead.quote_number||'draft';
    await kv.put('lead:'+number+':'+Date.now(), JSON.stringify(lead));
    return json(request, 200, {ok:true, stored:true});
  }
};
