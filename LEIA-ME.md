# FAEJ · Plazza di Michelon — landing de demonstração

Site estático (HTML, CSS e JS puros). Abra `index.html` no navegador ou suba a pasta em qualquer hospedagem estática (Hostinger, Netlify, Vercel, servidor próprio).

## Estrutura
- `index.html` — página única: abertura, A obra, Galeria, Plantas, Unidades (espelho de vendas), Lazer, Coleção FAEJ, Contato e rodapé legal
- `assets/style.css` — visual preto e dourado (estilo sala de exposição)
- `assets/app.js` — WhatsApp, galeria ampliada, abas de plantas, espelho de vendas com simulador e formulário
- `img/` — renders recortados e comprimidos, plantas humanizadas e logo

## O que editar
Tudo fica no topo de `assets/app.js`:
- `CONFIG.whatsapp` — número oficial (o atual veio do site antigo e ainda precisa ser confirmado)
- `CONFIG.formEndpoint` — URL para onde o formulário envia (Formspree, Web3Forms, webhook do CRM). Vazio = só valida e mostra a confirmação
- `TABELA` — valores de tabela por unidade. Para atualizar todo mês, substitua pelos valores da nova tabela; unidade fora da lista aparece como indisponível
- `PLANTAS` — ao receber novas plantas, coloque a imagem em `img/plantas/apto-XXX.jpg`, adicione a entrada aqui e um botão em `.tabs` no `index.html`

## Google Ads / GTM
- Cole o snippet do Google Tag Manager no `<head>` (há um comentário marcando o local)
- O site já envia eventos para o `dataLayer`: `lead_enviado`, `whatsapp_click`, `cta_click`, `unidade_selecionada`, `filtro_unidades`. Use `lead_enviado` e `whatsapp_click` como conversões no Google Ads

## Pendências antes de publicar
- Confirmar se os apartamentos têm suíte. O site não usa a palavra "suíte" até isso ser confirmado
- Matrícula: o rodapé usa a do memorial (781). Os renders originais trazem "Matrícula 13.022" na lateral e também precisam ser corrigidos
- WhatsApp oficial, endpoint do formulário e Política de Privacidade (o checkbox de autorização cita a política)
- Plantas das demais tipologias (54 m², 3 dormitórios, Garden 88,65 m², PCD)
