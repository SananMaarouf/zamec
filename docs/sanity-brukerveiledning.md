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

- Norsk ligger på `/`, engelsk på `/en/…`.
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
| Default OG Image | Standardbilde for deling i sosiale medier |
| Site URL | Nettadressen, f.eks. `https://sarazamecznik.no` |
| Primary Navigation | Hvilken navigasjon som brukes (velg den som heter Navigation) |

### Navigasjon (singleton)

Hovedmenyen øverst på siden.

- **Add item** legger til en lenke.
- **Label** er teksten som vises, per språk.
- Velg **Internal reference** for å lenke til et innlegg, en side eller en
  kategori. Da følger lenken automatisk med om adressen endres.
- Bruk **External / manual URL** bare for eksterne nettsteder.
- Rekkefølgen kan endres ved å dra i håndtaket til venstre.

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
| Slug | Adressen til innlegget (`/post/min-side`). Genereres fra tittelen |
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
`SEO description` er teksten som vises i søkeresultater.

## Bilder

- **Hotspot**: dobbeltklikk på bildet og dra sirkelen dit motivet er. Da beskjæres
  bildet riktig uansett skjermstørrelse.
- **Alternative Text (alt)**: kort beskrivelse av bildet. Viktig for
  tilgjengelighet og søkemotorer. Skriv hva bildet viser, ikke «bilde av».
- Last opp bilder i god oppløsning (minst 1600 px bredde). Bruk JPG eller PNG.

## Vanlige oppgaver

**Nytt innlegg:** Content → Innlegg → **Create new** → fyll ut tittel, slug,
bilder, kategori og publiser.

**Endre menyen:** Content → Navigation → endre label/lenke → Publish.

**Ny side:** Content → Side → **Create new** → tittel, slug, innhold → Publish.

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
- Innstillinger, Navigasjon, Tema og Footer skal det bare finnes én av. Lag dem
  ikke på nytt.
