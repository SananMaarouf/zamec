# Brukerveiledning – Sanity Studio

Studio er fagverktøyet der du redigerer innholdet på nettsiden. Alt du lagrer og
publiserer her, blir til sider på nettstedet.

## Kom i gang

1. Åpne Studio på adressen du har fått av utvikleren.
2. Logg inn med e-post/passord, Google eller GitHub.
3. Velg **Content** i menyen til venstre.

Hurtigtaster:

| Tast | Gjør |
|---|---|
| `Ctrl/Cmd + K` | Søk i alt innhold |
| `Ctrl/Cmd + S` | Lagre utkast |
| `Ctrl/Cmd + Z` | Angre |

## Slik er Studio bygget opp

Menyen til venstre har to slags innhold:

**Faste dokumenter.** Det finnes bare ett av hver, og de kan ikke opprettes på
nytt – du redigerer det som allerede ligger der:

`Site Settings` · `Navigation` · `Theme` · `Footer` · `Contact Page`

**Lister.** Ett dokument per innlegg, kategori eller side:

`Category` · `Post` · `Pages`

Øverst i en liste lager **Create new** et nytt dokument. Kontaktsiden ligger
bevisst ikke i `Pages` – den har sin egen oppføring, se
[Kontaktsiden](#kontaktsiden-contact-page).

## Utkast og publisering

- Endringer lagres automatisk som **utkast** (draft). De er ikke synlige på nettsiden.
- Trykk **Publish** nederst til venstre for å gjøre endringene offentlige.
- **Discard** forkaster utkastet og går tilbake til sist publiserte versjon.
- Alle tidligere versjoner finnes under **Review changes / History**.
- Nettsiden er bygget som statiske filer, så publisert innhold blir synlig først
  når nettstedet er bygget på nytt. Bygget kjøres ved kodeendringer; trenger du
  en innholdsendring ut umiddelbart, si fra til utvikleren.

## Språk

Alt tekstinnhold finnes på to språk: **English** (`en`) og **Norsk bokmål** (`nb`).

- Engelsk ligger på `/`, norsk på `/nb/…`.
- Fyller du bare ut ett språk, finnes bare den ene siden. Tomt felt = ingen side
  på det språket.
- Felt som ikke er språkdelte (telefonnummer, lenker, bilder, farger) gjelder
  begge språk.

## Innstillinger (Site Settings)

Fast dokument for hele nettstedet.

| Felt | Betyr |
|---|---|
| Site title | Firmanavn/tittel som brukes i meny og metadata, per språk |
| Site description | Kort beskrivelse (SEO og deling), per språk. 120–160 tegn |
| Share image (link previews) | Bildet som vises ved siden av lenken når nettstedet deles i sosiale medier eller meldinger. Brukes på alle sider som ikke har sitt eget delebilde. Liggende JPG/PNG, ca. 1200 × 630 px |
| Site URL | Nettadressen, f.eks. `https://www.sarazamecznik.com` |

## Navigasjon (Navigation)

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

## Tema (Theme)

Farger, fonter og avrunding for hele nettstedet.

- **Colors**: `Light mode` og `Dark mode` har hver sin palett. Klikk på en
  fargefirkant for å endre, eller skriv inn en hex-kode (`#c96442`).
- **Fonts**: velg overskriftsfont og brødtekstfont fra listen. Forhåndsvisningen
  viser hvordan de ser ut.
- **Layout**: `Corner radius` styrer hvor avrundede knapper og kort er.

## Footer

Kontaktinformasjon nederst på alle sider.

| Felt | Betyr |
|---|---|
| Instagram URL | Hele lenken til profilen. Tomt = Instagram skjules i footeren |
| Phone Number | Nummeret slik du ringer det. Tomt = telefon skjules |
| Email | E-postadressen. Tomt = e-post skjules |
| Address | Adresse, per språk |
| Copyright | Copyright-linjen, per språk |

## Innlegg (Post)

Prosjekt som vises i galleriet på forsiden.

| Felt | Betyr |
|---|---|
| Title | Tittel, per språk |
| Slug | Adressen til innlegget (`/post/min-side`). Fylles ut automatisk fra den engelske tittelen – du trenger ikke trykke på noe. Endre den bare hvis adressen skal være noe annet |
| SEO description | Teksten som vises under tittelen i Google og når lenken deles. 120–160 tegn. Tomt = starten av brødteksten brukes |
| Cover image | Forsidebilde i galleriet og øverst i innlegget. Tomt = første bilde i galleriet brukes |
| Gallery images | Alle bildene i innlegget. Dra for å endre rekkefølge. Klikk på et bilde for å se det større |
| Categories | Én eller flere kategorier |
| Published At | Dato og klokkeslett. Nyeste vises først |
| Body | Brødtekst med formatering, per språk |

## Kategori (Category)

Grupperer innlegg, f.eks. Keramikk og Tekstiler. Hver kategori får sin egen
listeside. `Description` er valgfri og vises øverst på kategorisiden.

## Sider (Pages)

Frittstående sider som Om meg eller FAQ. Adressen kommer fra `Slug`, som fylles
ut automatisk fra tittelen.

`SEO description` er teksten som vises under tittelen i Google og når lenken
deles (120–160 tegn). Tomt felt = beskrivelsen fra Innstillinger brukes.

Kontaktsiden ligger **ikke** her, og du kan ikke lage en ny: den er en egen
oppføring i menyen (se under).

## Kontaktsiden (Contact Page)

Kontaktsiden har sin egen plass i menyen i Studio, fordi skjemaet er en del av
malen og ikke kan bygges som en vanlig side. Åpne **Contact Page** for å redigere
den – du trenger ikke lete i sidelisten. Det finnes bare én kontaktside: den
kan ikke opprettes på nytt, og det er ingen adresse (slug) å passe på.

| Felt | Betyr |
|---|---|
| Title | Overskriften øverst på siden, per språk |
| Body | Innledningen over skjemaet. Tomt felt = den innebygde teksten brukes |
| Contact form → Heading above the form | Valgfri overskrift rett over skjemaet, f.eks. «Send meg en melding». Tomt = ingen overskrift |
| Contact form → Send button | Teksten på send-knappen. Tomt = «Send message» / «Send melding» |
| Contact form → Thank-you heading | Overskriften som vises etter at meldingen er sendt |
| Contact form → Thank-you text | Setningen under takke-overskriften |
| Other ways to get in touch → Column heading | Valgfri overskrift over kontaktkolonnen. Tomt felt = «Andre måter å ta kontakt» / «Other ways to reach me» |
| Other ways to get in touch → Contact details | Én rad per kanal som skal vises ved siden av skjemaet (se under) |
| SEO description / Share image | Som på andre sider |

Feltene i skjemaet (navn, e-post, emne, melding) og feilmeldingene er en del av
malen og kan ikke endres her. Vil du ha andre felt, må utvikleren endre dem.

### Other ways to get in touch

En kolonne ved siden av skjemaet med telefon, e-post og profiler. Kolonnen vises
bare når den har minst én rad. Hver rad har:

| Felt | Betyr |
|---|---|
| Type | Telefon, e-post, Instagram, Facebook, YouTube eller nettside. Bestemmer ikonet |
| Link, number or address | Telefon: nummeret slik du ringer det (`+47 900 12 345`). E-post: adressen. Sosiale medier / nettside: hele lenken (`https://instagram.com/brukernavn`) |
| Text shown (optional) | Teksten som vises. Tomt felt = nummeret/adressen for telefon og e-post, ellers navnet på kanalen (f.eks. «Instagram»). Skriv f.eks. `@brukernavn` om du vil ha det i stedet |

Rader som mangler type eller innhold vises ikke. Sletter du alle radene,
forsvinner kolonnen og skjemaet står alene.

## Søk og deling (SEO)

Feltene som styrer hvordan nettstedet ser ut i Google og når en lenke deles:

| Hvor | Felt | Betyr |
|---|---|---|
| Site Settings | Site title | Tittelen som vises i søkeresultater og i nettleserfanen |
| Site Settings | Site description | Standardbeskrivelse for alle sider som ikke har sin egen |
| Site Settings | Share image (link previews) | Standardbilde når lenken deles |
| Page / Post / Contact Page | SEO description | Beskrivelse for akkurat den siden |
| Page / Post / Contact Page | Share image (link previews) | Bilde for akkurat den siden |

- 120–160 tegn er det som vises. Lengre tekst blir kuttet – Studio viser en
  advarsel når du passerer 160.
- Bilder bør være liggende, ca. 1200 × 630 px.
- Endringer slår først inn når Google har besøkt siden på nytt. Det kan ta dager.

## Bilder

- **Hotspot**: dobbeltklikk på bildet og dra sirkelen dit motivet er. Da beskjæres
  bildet riktig uansett skjermstørrelse.
- **Alternative Text (alt)**: kort beskrivelse av bildet. Viktig for
  tilgjengelighet og søkemotorer. Skriv hva bildet viser, ikke «bilde av».
  Studio advarer når alt-teksten mangler på innleggsbilder.
- Last opp bilder i god oppløsning (minst 1600 px bredde). Bruk JPG eller PNG.

## Vanlige oppgaver

**Nytt innlegg:** Content → Post → **Create new** → fyll ut tittel (slug lager
seg selv), bilder, kategori og publiser.

**Ny side:** Content → Pages → **Create new** → tittel (slug lager seg selv),
innhold → Publish.

**Endre menyen:** Content → Navigation → endre label/lenke → Publish.

**Endre kontaktsiden:** Content → Contact Page → endre tekstene (overskrift,
innledning, tekst i og rundt skjemaet) → Publish.

**Legge til telefon/Instagram ved skjemaet:** Content → Contact Page → **Other
ways to get in touch** → fyll ut **Column heading** → **Add item** per kanal →
velg **Type**, skriv nummer/adresse/lenke → Publish. Vil du fjerne kolonnen,
slett radene (eller la dem stå tomme) og publiser.

**Fjerne kontaktlenken fra menyen:** Content → Navigation → slå av **Show the
contact link** → Publish. Siden blir fortsatt liggende på `/contact`.

**Endre farge:** Content → Theme → Colors → velg farge → Publish.

**Slette innhold:** åpne dokumentet → **⋯** øverst til høyre → **Delete**.
Sletting kan ikke angres, men alle tidligere versjoner finnes under
**Review changes / History**.

## Hvis noe ikke stemmer

| Problem | Årsak / løsning |
|---|---|
| Jeg har publisert, men nettsiden viser det gamle | Nettsiden er statisk og må bygges på nytt – si fra til utvikleren, eller vent til neste utbygg. Innhold du publiserte er lagret |
| Kontaktsiden ligger ikke i `Pages` | Den har sin egen oppføring, **Contact Page**. Slik skal det være |
| Jeg vil fjerne hele kontaktsiden, ikke bare lenken | Slå av **Show the contact link** i Navigation og si fra til utvikleren, som må fjerne selve adressen |
| Skjemaet sender ikke melding | Skjemaet er koblet til en ekstern tjeneste (Formspree). Si fra til utvikleren med tidspunkt og hvilken nettleser du brukte |
| Endringen i `Slug` gjorde at en gammel lenke sluttet å virke | Slugs bør endres så lite som mulig. Be utvikleren sette opp omdirigering hvis en lenke er delt |

## Gode råd

- Sjekk at både `en` og `nb` er fylt ut der du vil ha to språkversjoner.
- Bruk alltid alt-tekst på bilder.
- Endre `Slug` så lite som mulig – gamle lenker slutter å virke.
- Er du usikker på en endring: la den ligge som utkast. Nettsiden påvirkes ikke
  før du trykker Publish.
- `Site Settings`, `Navigation`, `Theme`, `Footer` og `Contact Page` skal det
  bare finnes én av. Lag dem ikke på nytt.
