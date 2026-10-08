'use strict';

// Keep deployment-specific links separate from the page content.
const siteConfig = window.CHECKDISTILL_CONFIG || {};
let projectUrl = siteConfig.projectUrl || '';
if (!projectUrl && location.protocol === 'https:' && location.hostname.endsWith('.github.io')) {
  projectUrl = new URL('.', location.href).href;
}
function validWebUrl(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); }
  catch { return false; }
}
if (projectUrl && validWebUrl(projectUrl)) {
  const canonical = document.querySelector('link[rel=canonical]') || document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = projectUrl;
  document.head.append(canonical);
  const bibtex = document.getElementById('bibtex');
  bibtex.textContent = bibtex.textContent.replace(/\n\}$/, ',\n  url = {' + projectUrl + '}\n}');
}
if (siteConfig.paperUrl) {
  document.querySelectorAll('a[href="assets/CheckDistill-Technical-Report.pdf"]').forEach(link => {
    link.href = siteConfig.paperUrl;
  });
}
if (siteConfig.codeUrl && validWebUrl(siteConfig.codeUrl)) {
  const oldButton = document.querySelector('.button-soon');
  const link = document.createElement('a');
  link.className = 'button button-soon';
  link.href = siteConfig.codeUrl;
  link.target = '_blank';
  link.rel = 'noopener';
  link.append(oldButton.querySelector('img').cloneNode(true), document.createTextNode('Code ↗'));
  oldButton.replaceWith(link);
  const resource = document.querySelector('.resource-link.unavailable');
  const resourceLink = document.createElement('a');
  resourceLink.className = 'resource-link';
  resourceLink.href = siteConfig.codeUrl;
  resourceLink.target = '_blank';
  resourceLink.rel = 'noopener';
  resourceLink.append(document.createTextNode('Code'));
  const label = document.createElement('span');
  label.textContent = 'Repository ↗';
  resourceLink.append(label);
  resource.replaceWith(resourceLink);
}

// Aggregate values transcribed from Table 1 of the supplied technical report.
const results = [
  {name:'GPT-4.1', scores:[56.60,46.83,73.40]},
  {name:'Gemini-3.1-Pro', scores:[64.29,54.50,79.80]},
  {name:'Gemini-3.0-Flash', scores:[65.34,57.17,80.90]},
  {name:'Qwen3-VL-8B-Instruct', scores:[62.10,43.67,75.80]},
  {name:'Qwen3.5-4B', scores:[57.20,42.33,70.50]},
  {name:'Qwen3.5-9B', scores:[62.40,47.17,78.20]},
  {name:'EditReward', scores:[65.70,44.83,79.20]},
  {name:'EditScore-8B', scores:[57.00,35.00,69.00]},
  {name:'SpatialReward', scores:[66.10,49.67,80.30]},
  {name:'GRPO (Qwen3.5-9B)', scores:[69.70,56.33,81.10]},
  {name:'Token-level GRPO (Qwen3.5-9B)', scores:[70.00,55.50,81.70]},
  {name:'CheckDistill (Qwen3-VL-8B)', scores:[67.70,52.83,78.90], ours:true},
  {name:'CheckDistill (Qwen3.5-4B)', scores:[72.60,51.83,82.70], ours:true},
  {name:'CheckDistill (Qwen3.5-9B)', scores:[72.30,56.67,82.90], ours:true}
];
const chartRows = [0,1,2,5,6,8,13];
const chart = document.getElementById('benchmark-chart');
const benchmarks = ['MMRB2','MER-Bench','EditReward-Bench'];
function renderChart(index) {
  chart.replaceChildren();
  for (const i of chartRows) {
    const model = results[i];
    const row = document.createElement('div');
    row.className = 'chart-row' + (model.ours ? ' highlight' : '');
    const label = document.createElement('span');
    label.className = 'chart-row-label';
    label.textContent = model.ours ? 'CheckDistill · 9B' : model.name;
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.setAttribute('aria-hidden','true');
    const bar = document.createElement('div');
    bar.className = 'bar-fill';
    bar.style.setProperty('--value',model.scores[index]+'%');
    track.append(bar);
    const value = document.createElement('span');
    value.className = 'chart-value';
    value.textContent = model.scores[index].toFixed(2);
    row.append(label,track,value);
    chart.append(row);
  }
}
const resultTable = document.getElementById('all-results');
for (const model of results) {
  const row = document.createElement('tr');
  if (model.ours) row.className='ours';
  const name = document.createElement('th');
  name.scope='row';
  name.textContent=model.name;
  row.append(name);
  for (const score of model.scores) {
    const cell = document.createElement('td');
    cell.textContent=score.toFixed(2);
    row.append(cell);
  }
  resultTable.append(row);
}

function wireTabs(selector, onChange) {
  const buttons = [...document.querySelectorAll(selector)];
  function activate(button, focus=false) {
    buttons.forEach(item => {
      const selected=item===button;
      item.setAttribute('aria-selected',String(selected));
      item.tabIndex=selected ? 0 : -1;
    });
    if (focus) button.focus();
    onChange(button);
  }
  buttons.forEach((button,index) => {
    button.addEventListener('click',()=>activate(button));
    button.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight') next=(index+1)%buttons.length;
      if(event.key==='ArrowLeft') next=(index-1+buttons.length)%buttons.length;
      if(event.key==='Home') next=0;
      if(event.key==='End') next=buttons.length-1;
      if(next!==undefined){event.preventDefault();activate(buttons[next],true);}
    });
  });
}
wireTabs('[data-benchmark]',button=>{
  const index=Number(button.dataset.benchmark);
  chart.setAttribute('aria-labelledby',button.id);
  renderChart(index);
});
renderChart(0);

const examples=[
  {prompt:'Convert the person in the photo to a 3D cartoon style, preserving facial features and the background environment.',source:'A group of people posing for a photograph.',description:'3D cartoon style conversion'},
  {prompt:'Replace the pencil in the person’s hand in the picture with a fountain pen, and replace the background with a vintage-style bar.',source:'A person writing with a pencil at a desk.',description:'Fountain pen replacement and a vintage bar background'},
  {prompt:'Add a crossbody plush backpack to the teddy bear.',source:'A teddy bear wearing a scarf.',description:'A crossbody plush backpack added to the teddy bear'},
  {prompt:'Extract the flower basket on the blue bicycle in the image.',source:'A blue bicycle with a flower basket.',description:'Extraction of the flower basket'},
  {prompt:'Remove the table in the back and the food on it, and change the perspective to a top-down view to display the food on the front table.',source:'Two tables with plated food viewed at an angle.',description:'Rear table removal and a top-down food view'}
];
const slider=document.getElementById('comparison-range');
function setSplit(value){
  slider.closest('.comparison').style.setProperty('--split',value+'%');
  slider.setAttribute('aria-valuetext',value+' percent CheckDistill result');
}
slider.addEventListener('input',()=>setSplit(slider.value));
wireTabs('[data-example]',button=>{
  const index=Number(button.dataset.example);
  const item=examples[index];
  document.getElementById('example-panel').setAttribute('aria-labelledby',button.id);
  document.getElementById('example-prompt').textContent=item.prompt;
  for(const kind of ['source','baseline','result']){
    const img=document.getElementById('example-'+kind);
    img.src=`assets/example-${index+1}-${kind==='result'?'checkdistill':kind}.webp`;
    img.alt=kind==='source'?item.source:`${item.description}: ${kind==='result'?'after CheckDistill-guided reward training':'Qwen-Image-Edit baseline'}.`;
  }
  slider.value='50';
  setSplit(50);
});

const dialog=document.getElementById('figure-dialog');
let opener=null;
document.querySelectorAll('[data-lightbox]').forEach(button=>{
  button.addEventListener('click',()=>{
    opener=button;
    const img=document.getElementById('expanded-figure');
    img.src=button.dataset.lightbox;
    img.alt=button.querySelector('img').alt;
    document.getElementById('figure-caption').textContent=button.dataset.caption;
    dialog.showModal();
    document.body.style.overflow='hidden';
  });
});
document.getElementById('close-figure').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{
  document.body.style.overflow='';
  if(opener)opener.focus({preventScroll:true});
});
document.getElementById('copy-citation').addEventListener('click',async()=>{
  const content=document.getElementById('bibtex').textContent;
  const status=document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(content);
    status.textContent='Citation copied to clipboard.';
  } catch {
    const range=document.createRange();
    range.selectNodeContents(document.getElementById('bibtex'));
    const selection=window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent='Citation selected. Press Ctrl+C or Command+C to copy.';
  }
});
const links=[...document.querySelectorAll('nav a')];
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      links.forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id));
    }
  }
},{rootMargin:'-20% 0px -60% 0px'});
['overview','method','results','examples'].forEach(id=>observer.observe(document.getElementById(id)));
