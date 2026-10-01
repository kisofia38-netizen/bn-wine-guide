(function(){
  const REMOVE_IDS=new Set(["2022-vermentino-igor-larionov-partnerskaya-vinodelnya"]);
  window.WINES=(window.WINES||[]).filter(w=>!REMOVE_IDS.has(w.id));

  window.WINE_IMAGES=window.WINE_IMAGES||{};
  Object.assign(window.WINE_IMAGES,{
    "2022-chianti-classico-querciabella":"https://dara.jo/cdn/shop/files/ScreenShot2026-02-08at4.20.46PM.png?v=1770722543&width=1100",
    "2022-valpolicella-ripasso-buglioni":"https://lieblings-weine.de/wp-content/uploads/2024/11/buglioni_il_bugiardo_ripasso_valpolicella_classico_superiore_DOC_lieblings-weine.jpg",
    "2024-le-naturel-zero-zero-blanco-vintae-le-naturel":"https://www.icheers.tw/fileserver/upload/WI00274901_btl.jpg"
  });

  const SOON_OUT_IDS=new Set([
    "nv-a-bergere-origine-brut",
    "nv-nathalie-falmet-cuvèe-brut",
    "2024-red-convivi-convivi",
    "2022-ossian-viñas-viejas-blanco-ossian-vides-y-vinos",
    "2021-chianti-classico-rocca-di-montegrossi",
    "2022-bourgogne-aligoté-le-hardi-domaine-ballorin-domaine-ballorin-f",
    "2022-bourgogne-pinot-noir-naïma-didon-naïma-david-didon",
    "2023-sancerre-les-boucauds-claude-riffault-domaine-claude-riffault",
    "2023-pouilly-fumé-de-ladoucette-baron-de-ladoucette-château-du-nozet",
    "2024-le-naturel-zero-zero-blanco-vintae-le-naturel",
    "nv-prevoteau-perrier-la-vallee-brut-champagne-prevoteau-perrier"
  ]);
  const SOON_TITLE_PARTS=[
    "a.bergere origine brut","nathalie falmet cuvèe brut","by.ott rose","red convivi","ossian vinas viejas blanco","ossian viñas viejas blanco","chianti classico rocca di montegrossi","bourgogne aligote le hardi","bourgogne aligoté le hardi","bourgogne pinot noir naïma didon","sancerre les boucauds","pouilly-fumé de ladoucette","pouilly-fume de ladoucette","le naturel zero zero blanco","prevoteau-perrier la vallee brut"
  ];
  const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[«»“”'’]/g,"").replace(/[^a-zа-я0-9]+/gi," ").trim();
  window.WINES.forEach(w=>{
    const t=norm(w.title);
    if(SOON_OUT_IDS.has(w.id)||SOON_TITLE_PARTS.some(x=>t.includes(norm(x))))w.soon_out=true;
  });

  function cleanInternalNote(input){
    let s=String(input||"").trim();if(!s)return s;
    return s
      .replace(/\s*\([^)]*(?:сверить|сверки|подтвердить по (?:вашей )?бутылке|уточнить по (?:бутылке|этикетке|техлисту))[^)]*\)/gi,"")
      .replace(/;\s*[^.;]*(?:сверить|сверки|подтвердить по (?:вашей )?бутылке|уточнить по (?:бутылке|этикетке|техлисту))[^.]*\.?$/gi,"")
      .replace(/\s*[—–-]\s*(?:зависит от выпуска,\s*)?(?:встречаются[^;,.]*[;,]\s*)?(?:сверить|подтвердить|уточнить)[^.]*\.?$/gi,"")
      .replace(/\s*[—–-]\s*[^.]*?(?:сверить|сверки)[^.]*\.?$/gi,"")
      .replace(/^(?:[^.]*требу(?:ет|ют) сверки|Требует сверки|Нужно сверить|Сверить|Уточнить)(?:[^.]*)\.?$/gi,"")
      .replace(/\s{2,}/g," ").replace(/[,;:]\s*$/,"").trim();
  }

  function cleanPairing(input){
    let s=String(input||"").trim();if(!s)return s;
    s=s.replace(/charcuterie/gi,"мясные закуски").replace(/jambon persillé/gi,"бургундскую ветчину с петрушкой").replace(/bistecca/gi,"стейк по-флорентийски").replace(/prosciutto/gi,"прошутто").replace(/porcini/gi,"белыми грибами").replace(/pecorino/gi,"пекорино").replace(/tri-tip/gi,"из костреца").replace(/После сверки(?: винтажа)?:?\s*/gi,"").replace(/\bизысканными?\b/gi,"").replace(/\bроскошн(?:ому|ое|ый|ая|ые)\b/gi,"").replace(/\bпрекрасно\b/gi,"").replace(/\bидеально\b/gi,"").replace(/\bотлично\b/gi,"").replace(/\s+([,.;:])/g,"$1").replace(/,\s*,/g,",").replace(/\s{2,}/g," ").trim();
    return s;
  }

  function cleanText(input){
    let s=String(input||"").trim();if(!s)return s;
    const reps=[[/\bроскошн(?:ое|ый|ая|ые)\b/gi,""],[/\bизысканн(?:ое|ый|ая|ые)\b/gi,""],[/\bвосхитительн(?:ое|ый|ая|ые)\b/gi,""],[/\bвеликолепн(?:ое|ый|ая|ые)\b/gi,""],[/\bпревосходн(?:ое|ый|ая|ые)\b/gi,""],[/\bбезупречн(?:ое|ый|ая|ые)\b/gi,""],[/\bPinot Noir\b/g,"Пино Нуар"],[/\bPinot Meunier\b/g,"Пино Менье"],[/\bChardonnay\b/g,"Шардоне"],[/\bSauvignon Blanc\b/g,"Совиньон Блан"],[/\bSyrah\b/g,"Сира"],[/\bRiesling\b/g,"Рислинг"],[/\bGrand Cru\b/g,"Гран Крю"],[/\bPremier Cru\b/g,"Премье Крю"],[/создавай уникальные/gi,"создавая уникальные"],[/виноград, достигшей оптимальной зрелости/gi,"виноград, достигший оптимальной зрелости"],[/а специальных баках/gi,"а в специальных баках"],[/Сumieres/g,"Кюмьер"],[/Cumieres/g,"Кюмьер"],[/17-го века/gi,"XVII века"],[/\s+([,.;:])/g,"$1"],[/\.(?=[А-ЯA-Z«])/g,". "],[/\s{2,}/g," "]];
    reps.forEach(([r,v])=>s=s.replace(r,v));
    return s.replace(/\bпокоряют с первых секунд\.?/gi,"").replace(/Шампанские вина Paul Bara покоряют сердца многих ценителей по всему миру\.?/gi,"").replace(/\bспособн(?:ое|ый|ая) удивить даже искушенного гурмана\.?/gi,"").trim().replace(/\s{2,}/g," ");
  }

  window.WINES.forEach(w=>{
    if(w.id==="nv-prosecco-universo-di-corvezzo"){w.price=6900;w.glass_price=1150;w.price_label="6 900 ₽";w.glass_price_label="1 150 ₽"}
    if(w.id==="2022-chianti-classico-querciabella"){w.price=7400;w.price_label="7 400 ₽"}
    if(w.id==="2020-barolo-tortoniano-michele-chiarlo"){w.price=11300;w.price_label="11 300 ₽"}
    ["abv","grapes","taste","aroma","color","pairing","description","producer_description"].forEach(f=>{if(typeof w[f]==="string")w[f]=cleanInternalNote(w[f])});
    w.pairing=cleanPairing(w.pairing);w.description=cleanText(w.description);w.producer_description=cleanText(w.producer_description);
  });
})();
