/* FAEJ · Plazza di Michelon — comportamento da landing
   Configuração editável no topo; o restante não precisa ser alterado. */
(function () {
  "use strict";

  // ---------------------------------------------------------------- CONFIG
  var CONFIG = {
    whatsapp: "5551981157105",          // PENDENTE: confirmar número oficial
    // Endpoint para onde o formulário envia (Formspree, Web3Forms, webhook do CRM...).
    // Enquanto vazio, o formulário só valida e mostra a confirmação.
    formEndpoint: ""
  };

  // Valores de tabela (R$) das unidades disponíveis · Tabela de Vendas OUT/26.
  // Para atualizar: substituir este objeto pela tabela do mês. Unidade ausente = indisponível.
  var TABELA = {101:818400,102:858400,103:566500,104:664400,105:591000,106:552000,107:549600,108:542400,109:544800,110:547200,111:594200,112:575800,113:608500,114:842900,115:826400,
    203:578800,204:596600,205:604300,206:564100,207:561600,208:554400,209:556800,210:559200,214:815000,
    301:850900,303:591000,305:616800,306:576100,307:573700,308:566500,309:568900,310:571300,311:620000,312:600200,313:586600,314:839500,315:859000,
    401:867100,403:603200,404:635400,405:629800,406:588100,407:585700,408:578500,409:580900,410:583300,411:633000,412:612500,413:600800,414:863900,415:875300,
    501:883400,503:615600,505:642600,506:600100,507:597700,508:590500,510:595300,511:645800,514:888200,
    601:899600,602:919200,603:627800,604:669000,605:657000,606:612100,607:609700,608:602500,609:604900,610:607300,611:660200,614:904600,615:907800,
    701:915800,702:935400,703:640100,704:683400,705:671400,706:624200,707:621800,708:614500,709:616900,710:619400,711:674600,712:649200,714:920800,715:924000,
    801:932200,802:951700,803:652300,804:697900,805:685800,806:636200,807:633800,808:626600,809:629000,810:631400,811:689000,812:661400,814:937100,
    901:948400,902:967900,903:664600,904:748400,905:700300,906:648200,907:645800,908:638600,909:683000,910:643400,911:739600,912:673700,914:953300,
    1001:964700,1002:984200,1003:676800,1005:707300,1006:660200,1007:657800,1008:650600,1009:653000,1010:655400,1014:969600};

  // Tipologia por final (área m², vagas, tipo) e exceções
  var FINAIS = {1:[73,2,"3d"],2:[73,2,"3d"],3:[55,1,"2d"],4:[58.2,1,"2d"],5:[58,1,"2d"],6:[54,1,"2d"],7:[54,1,"2d"],8:[54,1,"2d"],9:[54,1,"2d"],10:[54,1,"2d"],11:[58,1,"2d"],12:[55,1,"2d"],13:[58.2,1,"pcd"],14:[73,2,"3d"],15:[73,2,"3d"]};
  var EXCECOES = {102:[88.65,2,"3d",true],104:[74,2,"2d",true],113:[74,1,"pcd",true],114:[88.65,2,"3d",true],904:[58.2,2,"2d"],909:[54,2,"2d"],911:[58,2,"2d"]};
  var TIPO = {"2d":"2 dormitórios","3d":"3 dormitórios","pcd":"1 dormitório PCD"};

  // Plantas humanizadas disponíveis
  var PLANTAS = {
    103: { titulo: "2 dormitórios · 55,00 m²", w: 1100, h: 1186, ambientes: [["Sala, cozinha e lavanderia", "18,18 m²"], ["Dormitório", "8,75 m²"], ["Dormitório", "8,10 m²"], ["Banho", "3,65 m²"], ["Banho", "3,60 m²"], ["Sacada com churrasqueira", "2,80 m²"]] },
    105: { titulo: "2 dormitórios · 58,00 m²", w: 1100, h: 899, ambientes: [["Sala, cozinha e lavanderia", "18,16 m²"], ["Dormitório", "8,75 m²"], ["Dormitório", "8,10 m²"], ["Banho", "4,15 m²"], ["Banho", "3,40 m²"], ["Sacada com churrasqueira", "2,80 m²"]] },
    104: { titulo: "2 dormitórios Garden · 74,00 m²", w: 1100, h: 1164, ambientes: [["Sala de estar e jantar", "18,00 m²"], ["Garden privativo com churrasqueira", "16,85 m²"], ["Dormitório", "8,75 m²"], ["Dormitório", "8,10 m²"], ["Banho", "3,65 m²"], ["Banho", "3,60 m²"]] }
  };

  // ---------------------------------------------------------------- UTIL
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var r100 = function (x) { return Math.round(x / 100) * 100; };
  var brl = function (x) { return "R$ " + x.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var m2 = function (a) { return a.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + " m²"; };
  var pad = function (n) { return String(n).padStart(2, "0"); };

  // Eventos para Google Ads / GTM
  window.dataLayer = window.dataLayer || [];
  function track(evento, extra) {
    var d = { event: evento };
    for (var k in extra || {}) d[k] = extra[k];
    window.dataLayer.push(d);
  }

  // ---------------------------------------------------------------- WHATSAPP
  function waLink(msg) { return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg); }
  $$(".js-wa").forEach(function (a) {
    a.href = waLink(a.dataset.msg || "Olá!");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-track]");
    if (t) track(t.dataset.track.indexOf("whatsapp") === 0 ? "whatsapp_click" : "cta_click", { origem: t.dataset.track });
  });

  // ---------------------------------------------------------------- GALERIA
  var lb = $("#lightbox");
  $$(".work").forEach(function (w) {
    w.addEventListener("click", function () {
      $("#lbImg").src = w.dataset.src;
      $("#lbImg").alt = w.dataset.title;
      $("#lbTitle").textContent = w.dataset.title;
      $("#lbCat").textContent = w.dataset.cat;
      if (lb.showModal) lb.showModal();
    });
  });
  $(".lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  // ---------------------------------------------------------------- PLANTAS
  function showPlanta(n) {
    var p = PLANTAS[n];
    var img = $("#plantaImg");
    img.src = "img/plantas/apto-" + n + ".jpg";
    img.width = p.w; img.height = p.h;
    img.alt = "Planta humanizada do apartamento " + n;
    $("#plantaNo").textContent = "Estudo " + n;
    $("#plantaTitle").textContent = p.titulo;
    $("#plantaRooms").innerHTML = p.ambientes.map(function (a) { return "<li><span>" + a[0] + "</span><span>" + a[1] + "</span></li>"; }).join("");
    $$(".tabs button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.p === String(n))); });
  }
  $(".tabs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (b) showPlanta(b.dataset.p);
  });
  showPlanta(103);

  // ---------------------------------------------------------------- UNIDADES
  function unidade(n) {
    var e = EXCECOES[n], d = e || FINAIS[n % 100];
    return { n: n, andar: Math.floor(n / 100), area: d[0], vagas: d[1], tipo: d[2], garden: !!(e && e[3]), valor: TABELA[n] };
  }
  function condicoes(p) {
    var t1 = r100(p * 0.8), t2 = r100(p * 0.9);
    return [
      { nome: "100% durante a obra · 20% de desconto", linhas: [["Entrada (20%)", t1 * 0.2], ["36 parcelas de", t1 * 0.8 / 36]], total: t1 },
      { nome: "Obra + financiamento · 10% de desconto", linhas: [["Entrada (20%)", t2 * 0.2], ["36 parcelas de", t2 * 0.3 / 36], ["Financiamento na entrega", t2 * 0.5]], total: t2 },
      { nome: "Entrada reduzida · valor de tabela", linhas: [["Entrada (15%)", p * 0.15], ["36 parcelas de", p * 0.35 / 36], ["Financiamento na entrega", p * 0.5]], total: p }
    ];
  }

  var filtro = "all", selecionada = 108;
  var FILTROS = [["all", "Todas"], ["2d", "2 dormitórios"], ["3d", "3 dormitórios"], ["garden", "Garden"], ["pcd", "PCD"]];
  var fEl = $("#filters");
  fEl.innerHTML = FILTROS.map(function (f) {
    return '<button type="button" id="filtro-' + f[0] + '" data-f="' + f[0] + '" aria-pressed="' + (f[0] === filtro) + '">' + f[1] + "</button>";
  }).join("");
  fEl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    filtro = b.dataset.f;
    $$("button", fEl).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    track("filtro_unidades", { filtro: filtro });
    desenhar();
  });
  function combina(u) { return filtro === "all" || (filtro === "garden" ? u.garden : u.tipo === filtro); }

  var gEl = $("#grid");
  gEl.addEventListener("click", function (e) {
    var c = e.target.closest(".cell.av"); if (!c) return;
    selecionada = +c.dataset.n;
    track("unidade_selecionada", { unidade: selecionada });
    desenhar();
  });

  function desenhar() {
    var h = '<div class="h"></div>';
    for (var f = 1; f <= 15; f++) h += '<div class="h">' + pad(f) + "</div>";
    for (var a = 10; a >= 1; a--) {
      h += '<div class="fl">' + a + "º</div>";
      for (var fi = 1; fi <= 15; fi++) {
        var u = unidade(a * 100 + fi);
        var rot = u.garden ? "Garden" : u.tipo === "pcd" ? "PCD" : u.tipo === "3d" ? "3 dorm" : String(u.area).replace(".", ",") + "m²";
        var cls = "cell " + (u.valor ? "av" : "off") + (combina(u) ? "" : " dim") + (u.n === selecionada ? " sel" : "");
        h += '<button type="button" class="' + cls + '" data-n="' + u.n + '"' + (u.valor ? "" : " disabled") +
          ' aria-label="Apartamento ' + u.n + (u.valor ? ", disponível" : ", indisponível") + '">' + u.n + "<small>" + rot + "</small></button>";
      }
    }
    gEl.innerHTML = h;
    painel(unidade(selecionada));
  }

  function painel(u) {
    var andar = u.andar === 1 ? (u.garden ? "1º pavimento · Garden" : "1º pavimento") : u.andar + "º pavimento";
    var html = '<p class="placard-no">Apartamento</p><h3>' + u.n + "</h3>" +
      '<p class="spec">' + andar + " · " + TIPO[u.tipo] + "<br>" + m2(u.area) + " privativos · " + u.vagas + (u.vagas > 1 ? " vagas" : " vaga") + "</p>";
    condicoes(u.valor).forEach(function (c) {
      html += '<div class="cond"><b>' + c.nome + "</b>" + c.linhas.map(function (l) {
        return '<div class="row"><span>' + l[0] + "</span><span>" + brl(l[1]) + "</span></div>";
      }).join("") + '<div class="row tot"><span>Total</span><span>' + brl(c.total) + "</span></div></div>";
    });
    html += '<a class="btn btn-gold" href="#contato" id="reservar">Quero esta unidade</a>';
    $("#panel").innerHTML = html;
    $("#reservar").addEventListener("click", function () {
      $("#f-unid").value = "Apto " + u.n + " · " + TIPO[u.tipo] + " · " + m2(u.area);
      track("cta_click", { origem: "painel_unidade", unidade: u.n });
    });
  }

  var legenda = document.createElement("div");
  legenda.className = "legend";
  legenda.innerHTML = '<span><i></i>Disponível</span><span><i style="background:rgba(255,255,255,.02);border-color:rgba(255,255,255,.04)"></i>Indisponível</span><span><i style="background:var(--gold);border-color:var(--gold)"></i>Selecionada</span>';
  $(".mirror-scroll").appendChild(legenda);
  desenhar();

  // ---------------------------------------------------------------- FORMULÁRIO
  var form = $("#leadForm"), msg = $("#formMsg");
  $("#f-tel").addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = d.length > 6 ? "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4) : d.length > 2 ? "(" + d.slice(0, 2) + ") " + d.slice(2) : d;
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var erros = [];
    var nome = $("#f-nome"), tel = $("#f-tel"), email = $("#f-email"), lgpd = $("#f-lgpd");
    [nome, tel, email].forEach(function (i) { i.removeAttribute("aria-invalid"); });
    if (nome.value.trim().length < 2) { erros.push("seu nome"); nome.setAttribute("aria-invalid", "true"); }
    if (tel.value.replace(/\D/g, "").length < 10) { erros.push("um WhatsApp com DDD"); tel.setAttribute("aria-invalid", "true"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { erros.push("um e-mail válido"); email.setAttribute("aria-invalid", "true"); }
    if (!lgpd.checked) erros.push("a autorização de contato");
    if (erros.length) {
      msg.className = "form-msg field-wide err";
      msg.textContent = "Falta preencher " + erros.join(", ") + ".";
      return;
    }
    var dados = Object.fromEntries(new FormData(form).entries());
    var concluir = function () {
      msg.className = "form-msg field-wide";
      msg.textContent = "Recebemos seus dados, " + nome.value.trim().split(" ")[0] + ". Um consultor vai chamar você no WhatsApp.";
      track("lead_enviado", { interesse: dados.interesse, unidade: dados.unidade || "" });
      form.reset();
    };
    if (!CONFIG.formEndpoint) return concluir();
    fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(dados) })
      .then(function (r) { if (!r.ok) throw new Error(); concluir(); })
      .catch(function () {
        msg.className = "form-msg field-wide err";
        msg.textContent = "Não foi possível enviar agora. Tente de novo ou fale direto pelo WhatsApp.";
      });
  });
})();
