# Brukerveiledning – Sanity Studio

Studio er fagverktøyet der du redigerer innholdet på nettsiden. Alt du lagrer og
publiserer her, blir til sider på nettstedet.

## Kom i gang

1. Åpne Studio på adressen du har fått (f.eks. `zamec.sanity.studio`).
2. Logg inn med e-post/passord, Google eller GitHub.
3. Velg **Content** i menyen til venstre.

Hurtigtaster:

| Tast | Gjør |
|---|---|
| `Ctrl/Cmd + K` | Søk i alt innhold |
| `Ctrl/Cmd + S` | Lagre utkast |
| `Ctrl/Cmd + Z` | Angre |

## Utkast og publisering

- Endringer lagres automatisk som **utkast** (draft). De er ikke synlige på nettsiden.
- Trykk **Publish** nederst til venstre for å gjøre endringene offentlige.
- **Discard** forkaster utkastet og går tilbake til sist publiserte versjon.
- Nettsiden bygges automatisk på nytt når du publiserer. Det tar vanligvis et
  par minutter før endringen vises.


## Språk

Alt tekstinnhold finnes på to språk: **English** (`en`) og **Norsk bokmål** (`nb`).

- Engelsk ligger på `/`, norsk på `/nb/…`.
- Fyller du bare ut ett språk, finnes bare den ene siden. Tomt felt = ingen side
  på det språket.

## Innholdet i Studio

### Innstillinger (singleton)

Fast dokument for hele nettstedet. Kan ikke opprettes på nytt – rediger det som
ligger der.

| Felt | Betyr |
|---|---|
| Site title | Firmanavn/tittel som brukes i meny og metadata |
| Site description | Kort beskrivelse (SEO og deling) |
| Share image (link previews) | Bildet som vises ved siden av lenken når nettstedet deles i sosiale medier eller meldinger. Brukes på alle sider som ikke har sitt eget delebilde. Liggende JPG/PNG, ca. 1200 × 630 px |
| Site URL | Nettadressen, f.eks. `https://sarazamecznik.no` |

### Navigasjon (singleton)

Hovedmenyen øverst på siden.

- **Add item** legger til en lenke.
- **Label** er teksten som vises, per språk.
- Velg **Internal reference** for å lenke til et innlegg, en side eller en
  kategori. Da følger lenken automatisk med om adressen endres.
- Bruk **External / manual URL** bare for eksterne nettsteder.
- Rekkefølgen kan endres ved å dra i håndtaket til venstre.
- **Show the contact link** slår kontaktlenken i menyen av og på. Selve
  kontaktsiden blir liggende på `/contact` uansett.
- **Contact link label** er valgfri tekst for kontaktlenken. Tomt felt gir
  «Contact» på engelsk og «Kontakt» på norsk.

### Tema (singleton)

Farger, fonter og avrunding for hele nettstedet.

- **Colors**: `Light mode` og `Dark mode` har hver sin palett. Klikk på en
  fargefirkant for å endre, eller skriv inn en hex-kode (`#c96442`).
- **Fonts**: velg overskriftsfont og brødtekstfont fra listen. Forhåndsvisningen
  viser hvordan de ser ut.
- **Layout**: `Corner radius` styrer hvor avrundede knapper og kort er.

### Footer (singleton)

Kontaktinformasjon nederst på alle sider: Instagram, telefon, e-post, adresse og
copyright-tekst (adresse og copyright finnes per språk).

### Innlegg (post)

Prosjekt som vises i galleriet på forsiden.

| Felt | Betyr |
|---|---|
| Title | Tittel, per språk |
| Slug | Adressen til innlegget (`/post/min-side`). Fylles ut automatisk fra den engelske tittelen – du trenger ikke trykke på noe. Endre den bare hvis adressen skal være noe annet |
| SEO description | Teksten som vises under tittelen i Google og når lenken deles. 120–160 tegn. Tomt = starten av brødteksten brukes |
| Cover image | Forsidebilde i galleriet. Tomt = første bilde i galleriet brukes |
| Gallery images | Alle bildene i innlegget. Dra for å endre rekkefølge |
| Categories | Én eller flere kategorier |
| Published At | Dato. Nyeste vises først |
| Body | Brødtekst med formatering |

### Kategori (category)

Grupperer innlegg, f.eks. Keramikk og Tekstiler. Hver kategori får sin egen
listeside. `Description` er valgfri.

### Side (page)

Frittstående side, f.eks. Om meg eller Kontakt. Adressen kommer fra `Slug`.
`SEO description` er teksten som vises under tittelen i Google og når lenken
deles (120–160 tegn). Tomt felt = beskrivelsen fra Innstillinger brukes.

### Kontaktsiden (Contact Page)

Kontaktsiden har sin egen plass i menyen i Studio, fordi skjemaet er en del av
malen og ikke kan bygges som en vanlig side. Åpne **Contact Page** for å redigere
den – du trenger ikke lete i sidelisten.

| Felt | Betyr |
|---|---|
| Title | Overskriften øverst på siden, per språk |
| Body | Innledningen over skjemaet. Tomt felt = den innebygde teksten brukes |
| Contact form → Heading above the form | Valgfri overskrift rett over skjemaet, f.eks. «Send meg en melding». Tomt = ingen overskrift |
| Contact form → Send button | Teksten på send-knappen. Tomt = «Send message» / «Send melding» |
| Contact form → Thank-you heading | Overskriften som vises etter at meldingen er sendt |
| Contact form → Thank-you text | Setningen under takke-overskriften |
| SEO description / Share image | Som på andre sider |

Feltene i skjemaet (navn, e-post, emne, melding) og feilmeldingene er en del av
malen og kan ikke endres her. Vil du ha andre felt, må utvikleren endre dem.

## Søk og deling (SEO)

Feltene som styrer hvordan nettstedet ser ut i Google og når en lenke deles:

| Hvor | Felt | Betyr |
|---|---|---|
| Innstillinger | Site title | Tittelen som vises i søkeresultater og i nettleserfanen |
| Innstillinger | Site description | Standardbeskrivelse for alle sider som ikke har sin egen |
| Innstillinger | Share image (link previews) | Standardbilde når lenken deles |
| Side / Innlegg | SEO description | Beskrivelse for akkurat den siden |
| Side / Innlegg | Share image (link previews) | Bilde for akkurat den siden |

- 120–160 tegn er det som vises. Lengre tekst blir kuttet – Studio viser en
  advarsel når du passerer 160.
- Bilder bør være liggende, ca. 1200 × 630 px.
- Endringer slår først inn når Google har besøkt siden på nytt. Det kan ta dager.

## Bilder

- **Hotspot**: dobbeltklikk på bildet og dra sirkelen dit motivet er. Da beskjæres
  bildet riktig uansett skjermstørrelse.
- **Alternative Text (alt)**: kort beskrivelse av bildet. Viktig for
  tilgjengelighet og søkemotorer. Skriv hva bildet viser, ikke «bilde av».
- Last opp bilder i god oppløsning (minst 1600 px bredde). Bruk JPG eller PNG.

## Vanlige oppgaver

**Nytt innlegg:** Content → Innlegg → **Create new** → fyll ut tittel (slug
lager seg selv), bilder, kategori og publiser.

**Endre menyen:** Content → Navigation → endre label/lenke → Publish.

**Endre kontaktsiden:** Content → Contact Page → endre tekstene (overskrift,
innledning, tekst i og rundt skjemaet) → Publish. Finnes dokumentet ikke ennå,
opprettes det med riktig adresse når du åpner det.

**Fjerne kontaktlenken fra menyen:** Content → Navigation → slå av **Show the
contact link** → Publish. Siden blir fortsatt liggende på `/contact`.

**Ny side:** Content → Side → **Create new** → tittel (slug lager seg selv),
innhold → Publish.

**Endre farge:** Content → Tema → Colors → velg farge → Publish.

**Slette innhold:** åpne dokumentet → **⋯** øverst til høyre → **Delete**.
Sletting kan ikke angres, men alle tidligere versjoner finnes under
**Review changes / History**.

## Gode råd

- Sjekk at både `en` og `nb` er fylt ut der du vil ha to språkversjoner.
- Bruk alltid alt-tekst på bilder.
- Endre `Slug` så lite som mulig – gamle lenker slutter å virke.
- Er du usikker på en endring: la den ligge som utkast. Nettsiden påvirkes ikke
  før du trykker Publish.
- Innstillinger, Navigasjon, Tema, Footer og Contact Page skal det bare finnes
  én av. Lag dem ikke på nytt.
- Kontaktsiden redigeres under **Contact Page**, ikke under Side-listen.
