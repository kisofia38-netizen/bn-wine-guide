(function(){
  const REMOVE_IDS = new Set([
    "2022-vermentino-igor-larionov-partnerskaya-vinodelnya"
  ]);

  window.WINES = (window.WINES || []).filter(w => !REMOVE_IDS.has(w.id));

  // Stable image replacements for remote bottle photos that did not render reliably.
  window.WINE_IMAGES = window.WINE_IMAGES || {};
  Object.assign(window.WINE_IMAGES, {
    "2022-chianti-classico-querciabella": "https://dara.jo/cdn/shop/files/ScreenShot2026-02-08at4.20.46PM.png?v=1770722543&width=1100",
    "2022-valpolicella-ripasso-buglioni": "https://lieblings-weine.de/wp-content/uploads/2024/11/buglioni_il_bugiardo_ripasso_valpolicella_classico_superiore_DOC_lieblings-weine.jpg",
    "2024-le-naturel-zero-zero-blanco-vintae-le-naturel": "https://www.icheers.tw/fileserver/upload/WI00274901_btl.jpg"
  });

  function cleanPairing(input) {
    let s = String(input || "").trim();
    if (!s) return s;

    s = s
      .replace(/charcuterie/gi, "мясные закуски")
      .replace(/jambon persillé/gi, "бургундскую ветчину с петрушкой")
      .replace(/bistecca/gi, "стейк по-флорентийски")
      .replace(/prosciutto/gi, "прошутто")
      .replace(/porcini/gi, "белыми грибами")
      .replace(/pecorino/gi, "пекорино")
      .replace(/tri-tip/gi, "из костреца")
      .replace(/После сверки(?: винтажа)?:?\s*/gi, "")
      .replace(/^Шампанское прекрасно в качестве аперитива, с /i, "Аперитив, ")
      .replace(/^Шампанское прекрасно подойдет в качестве аперитива\. Оно сочетается с /i, "Аперитив, ")
      .replace(/^Шампанское прекрасно в качестве аперитива, отлично сочетается с /i, "Аперитив, ")
      .replace(/^Шампанское отлично сочетается с /i, "")
      .replace(/^Идеальный аперитив\. (?:Также )?отлично сочетается с /i, "Аперитив, ")
      .replace(/^Идеальный аперитив\. Прекрасно сочетается с /i, "Аперитив, ")
      .replace(/^Превосходный аперитив, также отлично дополнит /i, "Аперитив, ")
      .replace(/^Шампанское — превосходный аперитив, также отлично дополнит /i, "Аперитив, ")
      .replace(/^Прекрасен в качестве аперитива\. Идеально сочетается с /i, "Аперитив, ")
      .replace(/^Шампанское замечательно в качестве аперитива или как сопровождение изысканных блюд из /i, "Аперитив, ")
      .replace(/^Шампанское отлично подойдёт как в качестве аперитива, так и в паре с изысканными блюдами\. Например, /i, "Аперитив, ")
      .replace(/^Шампанское идеально в качестве аперитива, а также пары для изысканных блюд из /i, "Аперитив, ")
      .replace(/^Идеальным сопровождением этому роскошному шампанскому станут /i, "")
      .replace(/\s*Также отлично подходит в качестве аперитива и к блюдам высокой кухни\.?/i, ".")
      .replace(/^Рекомендуется в качестве аперитива, хорошо сочетается с блюдами из /i, "Аперитив, ")
      .replace(/^Универсальное гастрономичное вино\. Прекрасно в качестве аперитива, а также к /i, "Аперитив, ")
      .replace(/^Универсальный гастрономичный партнер\. Прекрасно в качестве аперитива, а также к /i, "Аперитив, ")
      .replace(/^Универсальный аперитив\. Отлично сочетается с /i, "Аперитив, ")
      .replace(/^Игристое вино идеально в качестве аперитива, а также в сочетании с /i, "Аперитив, ")
      .replace(/\bизысканными?\b/gi, "")
      .replace(/\bроскошн(?:ому|ое|ый|ая|ые)\b/gi, "")
      .replace(/\bпрекрасно\b/gi, "")
      .replace(/\bидеально\b/gi, "")
      .replace(/\bотлично\b/gi, "")
      .replace(/\s+([,.;:])/g, "$1")
      .replace(/,\s*,/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();

    s = s.replace(/^,\s*/, "").replace(/\.\s*$/, "");
    if (s) s = s.charAt(0).toUpperCase() + s.slice(1);
    return s ? s + "." : "";
  }

  function cleanText(input) {
    let s = String(input || "").trim();
    if (!s) return s;

    const replacements = [
      [/\bроскошн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bизысканн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bвосхитительн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bвеликолепн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bпревосходн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bбезупречн(?:ое|ый|ая|ые)\b/gi, ""],
      [/\bидеальный баланс\b/gi, "баланс"],
      [/\bPinot Noir\b/g, "Пино Нуар"],
      [/\bPinot Meunier\b/g, "Пино Менье"],
      [/\bChardonnay\b/g, "Шардоне"],
      [/\bSauvignon Blanc\b/g, "Совиньон Блан"],
      [/\bSyrah\b/g, "Сира"],
      [/\bRiesling\b/g, "Рислинг"],
      [/\bGrand Cru\b/g, "Гран Крю"],
      [/\bPremier Cru\b/g, "Премье Крю"],
      [/создавай уникальные/gi, "создавая уникальные"],
      [/виноград, достигшей оптимальной зрелости/gi, "виноград, достигший оптимальной зрелости"],
      [/а специальных баках/gi, "а в специальных баках"],
      [/Сumieres/g, "Кюмьер"],
      [/Cumieres/g, "Кюмьер"],
      [/17-го века/gi, "XVII века"],
      [/\s+([,.;:])/g, "$1"],
      [/\.(?=[А-ЯA-Z«])/g, ". "],
      [/\s{2,}/g, " "]
    ];

    replacements.forEach(([re, val]) => { s = s.replace(re, val); });
    s = s.replace(/\s+—/g, " —").replace(/—\s+/g, "— ");
    s = s.replace(/\bпокоряют с первых секунд\.?/gi, "");
    s = s.replace(/Шампанские вина Paul Bara покоряют сердца многих ценителей по всему миру\.?/gi, "");
    s = s.replace(/\bспособн(?:ое|ый|ая) удивить даже искушенного гурмана\.?/gi, "");
    return s.trim().replace(/\s{2,}/g, " ");
  }

  function cleanInternalNote(input) {
    let s = String(input || "").trim();
    if (!s) return s;

    // Remove editorial/service notes intended for internal checking, not for guests.
    s = s
      .replace(/\s*\([^)]*(?:сверить|сверки|подтвердить по (?:вашей )?бутылке|уточнить по (?:бутылке|этикетке|техлисту))[^)]*\)/gi, "")
      .replace(/;\s*[^.;]*(?:сверить|сверки|подтвердить по (?:вашей )?бутылке|уточнить по (?:бутылке|этикетке|техлисту))[^.]*\.?$/gi, "")
      .replace(/\s*[—–-]\s*(?:зависит от выпуска,\s*)?(?:встречаются[^;,.]*[;,]\s*)?(?:сверить|подтвердить|уточнить)[^.]*\.?$/gi, "")
      .replace(/\s*[—–-]\s*[^.]*?(?:сверить|сверки)[^.]*\.?$/gi, "")
      .replace(/^(?:[^.]*требу(?:ет|ют) сверки|Требует сверки|Нужно сверить|Сверить|Уточнить)(?:[^.]*)\.?$/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return s.replace(/[,;:]\s*$/, "").trim();
  }

  window.WINES.forEach(w => {
    if (w.id === "nv-prosecco-universo-di-corvezzo") {
      w.price = 6900;
      w.glass_price = 1150;
      w.price_label = "6 900 ₽";
      w.glass_price_label = "1 150 ₽";
    }

    if (w.id === "2022-chianti-classico-querciabella") {
      w.price = 7400;
      w.price_label = "7 400 ₽";
    }

    if (w.id === "2020-barolo-tortoniano-michele-chiarlo") {
      w.price = 11300;
      w.price_label = "11 300 ₽";
    }

    ["abv", "grapes", "taste", "aroma", "color", "pairing", "description", "producer_description"].forEach(field => {
      if (typeof w[field] === "string") w[field] = cleanInternalNote(w[field]);
    });

    w.pairing = cleanPairing(w.pairing);
    w.description = cleanText(w.description);
    w.producer_description = cleanText(w.producer_description);
  });
})();
