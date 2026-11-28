# BESS Leveringskalender – GIGA Leopard

Webapplicatie voor het plannen en volgen van de levering van 320 BESS-units voor het project GIGA Leopard in Farmsum.

- **Applicatie:** https://rkkpc6b497-png.github.io/BESSLeveringen/
- **Repository:** https://github.com/rkkpc6b497-png/BESSLeveringen
- **Hoofdbranch:** `main`

Deze README beschrijft de functionaliteit zoals die in de huidige broncode van de repository staat. De applicatie kan in de toekomst wijzigen; houd deze documentatie bij wanneer functies of werkwijzen veranderen.

---

## 1. Overzicht

De applicatie combineert vier onderdelen:

1. **Totaaloverzicht** – projectvoortgang, leveringen, schepen en Maasvlaktebuffer.
2. **Maandkalenders** – dagelijkse leverplanning en leverstatus.
3. **Schepenlijst** – scheepscapaciteit, aanmeerstatus en trackinggegevens.
4. **Plattegrond** – individuele BESS-units op de projecttekening volgen, van levering tot plaatsing.

De projectbehoefte is ingesteld op **320 units**. De units zijn verdeeld over zes commerciële blokken en twaalf veldhuisjes.

## 2. Indeling en capaciteit

De capaciteit is in de applicatie als volgt geconfigureerd:

| Commercieel blok | Veldhuisjes | Capaciteit |
|---|---|---:|
| Alpha | 1A (32), 1B (32) | 64 |
| Bravo | 1C (20), 1D (24) | 44 |
| Charlie | 3A (24), 3B (28) | 52 |
| Delta | 3C (28), 3D (28) | 56 |
| Echo | 5A (24) | 24 |
| Foxtrot | 5B (28), 5C (28), 5D (24) | 80 |
| **Totaal** | **12 veldhuisjes** | **320** |

Deze waarden staan in de configuratie van `index.html`. Wijzig ze alleen als de projectindeling of vastgestelde capaciteit verandert. De plattegrond bevat daarnaast een afzonderlijke geometrische koppeling tussen unitnummers en posities op de tekening.

---

## 3. Totaaloverzicht

Het tabblad **Totaaloverzicht** toont de belangrijkste projectcijfers:

- Totale projectbehoefte.
- Totaal ingeplande units.
- Daadwerkelijk geleverde units.
- Resterend te leveren aantal.
- Aantal actieve leveringsdagen.
- Buffer op de Maasvlakte.
- Maandoverzicht met geplande, bevestigde en geleverde aantallen.
- Voortgang per commercieel blok en per veldhuisje.
- Schepen die onderweg zijn, inclusief beschikbare AIS-informatie.
- Aangemeerde en geloste schepen en de bijbehorende buffer.

De voortgangsbalken per blok en veldhuisje vergelijken de geregistreerde leveringen met de ingestelde capaciteit.

### Maasvlaktebuffer

De buffer is een berekende planningswaarde. Voor een aangemeerd schip telt de applicatie de aan dat schip gekoppelde leveringen op die nog niet de status **Geleverd** hebben.

Dit is geen zelfstandige fysieke voorraadregistratie of telling op de Maasvlakte. Zorg dat de leverstatussen en scheepsstatussen actueel zijn om de buffer bruikbaar te houden.

Compleet geleverde schepen worden standaard uit het overzicht van aangemeerde/geloste schepen gefilterd. Via de knop onder de tabel kunnen ze tijdelijk weer zichtbaar worden gemaakt.

---

## 4. Maandkalender en leveringen

Voor iedere maand is een apart tabblad beschikbaar. De kalender toont werkdagen van maandag tot en met vrijdag, met per dag de leveringen en het weektotaal.

Per maand worden de volgende totalen getoond:

- Leverdagen.
- Gepland.
- Bevestigd.
- Geleverd.
- Maandtotaal.

### Levering toevoegen

1. Ontgrendel de bewerkmodus met het slotje rechtsboven.
2. Open de juiste maand.
3. Klik op het plusteken bij de gewenste dag.
4. Vul het aantal units in.
5. Selecteer een schip.
6. Selecteer het bestemmingsveldhuisje.
7. Kies de status: **Gepland**, **Bevestigd** of **Geleverd**.
8. Controleer de capaciteitsinformatie en eventuele validatiemeldingen.
9. Sla de levering op.

### Levering wijzigen of verwijderen

- Klik op een bestaande leveringskaart om de gegevens te openen en te wijzigen.
- De status op de kaart kan worden doorgeschakeld door op de statusknop te klikken. De volgorde is **Gepland → Bevestigd → Geleverd → Gepland**.
- Verwijderen gebeurt vanuit het bewerkingsvenster en vraagt om een bevestiging.

### Huidige validatieregels

De huidige broncode controleert:

- Per leveringsregel mag een positief geheel aantal units worden ingevoerd.
- De daglimiet van 8 units geldt uitsluitend voor leveringen met status **Gepland**.
- Bevestigde en geleverde aantallen mogen boven 8 uitkomen; daarvoor geldt geen vooraf ingestelde harde dagbovengrens.
- Er mogen maximaal twee verschillende schepen op één kalenderdag worden ingepland.
- De totale toewijzing aan een schip mag de scheepscapaciteit niet overschrijden.
- De totale toewijzing aan een veldhuisje mag de ingestelde veldhuiscapaciteit niet overschrijden.

De tabel **Dagen boven de planningslimiet** op het totaaloverzicht signaleert kalenderdagen met meer dan 8 units. Een dag blijft in deze tabel staan zolang nog niet alle units van die dag als geleverd zijn geregistreerd. Zodra de volledige dag is geleverd, verdwijnt deze uit het overzicht. Dit is een signalering, geen harde bovengrens voor bevestigde of geleverde leveringen.

---

## 5. Schepenlijst en scheepstracking

Het tabblad **Schepenlijst** bevat per schip:

- Naam.
- Capaciteit.
- Eerste geplande leverdatum.
- Uiterste aanmeerdatum.
- Status onderweg/aangemeerd.
- Status vertrokken (gelost).
- MarineTraffic-link.
- MMSI-nummer.
- Totaal aantal aan het schip toegewezen units.

### Aanmeer- en losstatus

De uiterste aanmeerdatum wordt automatisch berekend als zeven dagen vóór de eerste geplande levering vanaf het betreffende schip.

In de bewerkmodus kan een schip als **Aangemeerd** worden gemarkeerd. Pas daarna kan het als **Vertrokken (gelost)** worden gemarkeerd. De units blijven in de buffer staan totdat de bijbehorende leveringen in Farmsum op **Geleverd** zijn gezet.

Een schip kan niet worden verwijderd zolang er leveringen aan gekoppeld zijn.

### AIS-informatie

Voor AIS-weergave gebruikt de applicatie het MMSI-nummer van het schip. Wanneer trackinginformatie beschikbaar is, kunnen onder andere worden getoond:

- Laatst bekende positie.
- Navigatie- of bewegingsstatus.
- Snelheid.
- Bestemming.
- ETA.
- Leeftijd van de positie.
- Een kaartlink naar de positie.

AIS-informatie kan vertraagd of verouderd zijn. De applicatie markeert posities die ouder zijn dan twaalf uur als verouderd. Gebruik AIS als operationele indicatie en verifieer belangrijke aankomstinformatie bij een betrouwbare actuele bron.

De MarineTraffic-link is een afzonderlijke link die per schip kan worden opgeslagen.

---

## 6. Plattegrond en individuele unitregistratie

Het tabblad **Plattegrond** koppelt individuele unitnummers aan de projecttekening. De tekening wordt geladen uit het bestand `plattegrond.svg`. De posities en afmetingen van de unitvlakken zijn in `index.html` vastgelegd.

Elke unit heeft een eigen identificatie, bijvoorbeeld `BP01-1A`. De unit is gekoppeld aan een veldhuisje en een commercieel blok.

### Statussen op de plattegrond

Levering en plaatsing vinden voor iedere unit op dezelfde dag plaats. Daarom gebruikt de plattegrond één gecombineerde status voor de afgeronde handeling en één status voor een toekomstige planning:

| Kleur | Betekenis |
|---|---|
| Groen | Geleverd en geplaatst |
| Oranje | Levering en plaatsing gepland |
| Grijs | Nog niet gepland |

Een rode rand betekent dat de geplande datum is verstreken en de unit nog niet als geleverd en geplaatst is geregistreerd.

Boven de tekening wordt het aantal geleverde en geplaatste units getoond. Wanneer dit aantal afwijkt van het aantal leveringen met status **Geleverd** in de kalender, wordt dat verschil gemeld.

### Navigeren op de plattegrond

- **Zoeken:** zoek op unit-ID of veldhuisje, bijvoorbeeld `BP12-3B` of `3B`.
- **Ga naar veldhuisje:** zoomt in op het gekozen veldhuisje.
- **+ / −:** zoom in of uit.
- **Alles:** toont de volledige tekening.
- **Verplaatsen:** sleep om de tekening te verschuiven.
- **Selecteren:** sleep een kader om meerdere units tegelijk te selecteren.
- **Shift ingedrukt houden:** selecteer meerdere units of voeg units toe aan de selectie.
- **Statusfilter:** klik op een status boven de tekening om andere statussen visueel te dimmen.

Op een unit klikken toont de registratiegegevens in het paneel onder de tekening. Bij meerdere geselecteerde units kan dezelfde datum in één handeling voor alle geselecteerde units worden ingesteld of gewist.

### Datum registreren

Per unit worden maximaal twee datums bijgehouden:

- **Levering en plaatsing gepland op:** de datum waarop de levering en plaatsing naar verwachting plaatsvinden.
- **Geleverd en geplaatst op:** de datum waarop beide handelingen daadwerkelijk zijn afgerond.

Er is bewust geen afzonderlijke leverdatum en plaatsingsdatum: de applicatie behandelt dit als één gecombineerde gebeurtenis. Bestaande registraties met de oude afzonderlijke velden worden bij het laden samengevoegd tot één datum voor **Geleverd en geplaatst op**.

### Geplande plaatsingen en voortgang per veldhuisje

Onder de tekening staan:

- **Geplande leveringen en plaatsingen:** overzicht van geplande data, aantallen units en betrokken veldhuisjes. Met **Toon** selecteer je de betreffende units op de tekening.
- **Voortgang per veldhuisje:** overzicht van afgeronde units en eventueel geplande units, met knoppen om naar een veldhuisje te gaan of alle units daarvan te selecteren.

### Afgeronde units synchroniseren vanuit de kalender

In de bewerkmodus is de knop **Afronding invullen vanuit leveringen** beschikbaar. Deze functie kijkt per veldhuisje naar de kalenderleveringen met status **Geleverd** en vult de datum voor **Geleverd en geplaatst op** in op de eerste nog niet afgeronde units van dat veldhuisje.

Deze synchronisatie is eenrichtingsverkeer: zij vult unitregistraties aan vanuit de leverkalender. Controleer de plattegrond na synchronisatie, vooral als individuele unitnummers of de fysieke volgorde afwijken van de standaardvolgorde.

### Unitexport

Met de knop **CSV** op de plattegrond exporteer je de unitregistratie met onder andere unit-ID, veldhuisje, blok, geplande leverings-/plaatsingsdatum, datum van levering en plaatsing en status.

---

## 7. Bewerken en publiceren

### Bewerkmodus

De applicatie opent in de alleen-lezenmodus. Klik op het slotje rechtsboven en voer het ingestelde wachtwoord in om bewerken te activeren. Klik opnieuw op het slotje om de bewerkmodus te vergrendelen.

De bewerkmodus is een gebruiksdrempel en geen sterke beveiliging: het wachtwoord is in de client-side broncode opgenomen en kan door iemand met toegang tot de broncode worden achterhaald. Gebruik dit niet als enige beveiliging voor vertrouwelijke gegevens.

### Lokale wijzigingen

Na een wijziging bewaart de applicatie de conceptgegevens in de lokale browseropslag. Er verschijnt een melding **Niet-gepubliceerde wijzigingen**. Andere gebruikers zien deze wijzigingen nog niet.

Als je niet-gepubliceerde wijzigingen verwerpt, wordt de lokale conceptversie verwijderd en wordt de gedeelde planning opnieuw geladen. Dit kan lokale wijzigingen onherroepelijk kwijtraken.

### Publiceren naar GitHub

De gedeelde planningsgegevens staan in `planning.json` op de branch `main`.

Om te publiceren is een GitHub Personal Access Token nodig met toegang tot deze repository en de repository-permissie **Contents: Read and write**.

Token instellen:

1. Open het menu rechtsboven en kies **GitHub-token**.
2. Maak via GitHub een token aan met toegang tot alleen deze repository.
3. Geef de permissie **Contents: Read and write**.
4. Plak het token in de applicatie en sla het op.

Het token wordt in de lokale browseropslag bewaard. Deel het token niet en zet het nooit in de repository of in documentatie. Verwijder of trek het token in via GitHub als het niet meer nodig is of mogelijk is blootgesteld.

Automatisch publiceren staat standaard aan. Na een wijziging probeert de applicatie na een korte wachttijd te publiceren als de bewerkmodus actief is en een geldig token beschikbaar is. Automatisch publiceren kan via het menu worden uitgeschakeld; wijzigingen kunnen dan met de knop **Publiceer** handmatig worden gepubliceerd.

### Gelijktijdig werken

De applicatie controleert ongeveer iedere twee minuten of er een nieuwere planning op GitHub staat. Als er lokaal niet-gepubliceerde wijzigingen zijn en er een nieuwere gedeelde versie wordt gevonden, verschijnt een waarschuwing.

Verwerp je lokale wijzigingen alleen als je zeker weet dat je ze niet meer nodig hebt. Bij handmatig publiceren kan de applicatie waarschuwen wanneer de gedeelde planning nieuwer is dan de lokale basisversie. Overschrijf wijzigingen van collega's niet zonder controle.

---

## 8. Export, import en afdrukken

Via het menu rechtsboven zijn de volgende functies beschikbaar:

| Functie | Resultaat |
|---|---|
| Back-up (JSON) | Exporteert de volledige planning als JSON |
| Importeren (JSON) | Leest een JSON-planning in; beschikbaar in de bewerkmodus |
| Excel | Exporteert een werkmap met totaaloverzicht, maandgegevens, schepen, leveringen en units |
| CSV | Exporteert het huidige tabblad |
| Afdrukken | Print het huidige tabblad |
| Afdrukken – alle tabbladen | Maakt een afdrukbestand van de beschikbare overzichts-, maand- en schepentabbladen |

De afdrukopmaak is ingesteld op **A3 liggend**. De plattegrond is een apart tabblad en valt niet onder de functie die alle tabbladen afdrukt.

Importeren vervangt de planning in de huidige browseromgeving. Maak bij voorkeur eerst een JSON-back-up en controleer na import de planning voordat je publiceert.

---

## 9. Technische opbouw

De applicatie is een statische webapplicatie met HTML, CSS en JavaScript. GitHub Pages publiceert de bestanden uit de repository.

| Bestand / onderdeel | Functie |
|---|---|
| `index.html` | Applicatie, interface, styling, validatie en JavaScript-logica |
| `planning.json` | Gedeelde planning op de branch `main`: schepen, leveringen, unitregistraties en laatste zichtbare maand |
| `plattegrond.svg` | Onderliggende projecttekening voor het plattegrondtabblad |
| `scripts/track.mjs` | Script voor het ophalen en verwerken van scheepsposities |
| `.github/workflows/tracking.yml` | GitHub Actions-workflow voor scheepstracking |
| Branch `tracking`, bestand `tracking.json` | Gegenereerde trackinggegevens die de applicatie inleest |

### Planningsgegevens

Het gedeelde JSON-bestand bevat onder andere:

- `updatedAt`: tijdstip van de laatste publicatie.
- `lastMonth`: laatste zichtbare planningsmaand.
- `ships`: schepen en hun eigenschappen/statussen.
- `deliveries`: leveringen met datum, aantal, schip, veldhuisje en status.
- `units`: individuele unitregistraties.

De individuele unitregistraties gebruiken de unit-ID als sleutel. Per unit kunnen de datums voor levering (`d`), geplande plaatsing (`p`) en daadwerkelijke plaatsing (`g`) worden opgeslagen.

### Configuratie en onderhoud

Belangrijke configuratie staat in `index.html`:

- Projectbehoefte: `NEED = 320`.
- Eerste planningsmaand: november 2026.
- Maximum zichtbare planningsperiode: 36 maanden.
- Blok- en veldhuiscapaciteiten: `BL`.
- Unitnummers, posities en afmetingen op de tekening: `PLAN_GEO`.
- Koppeling tussen unit, veldhuisje en blok: `PLAN_HUTS` en `PLAN_BLOK`.
- GitHub-repository en gegevensbestand: `GH`.

Als de tekening wordt vervangen of gewijzigd, controleer dan ook de geometrische posities in `PLAN_GEO`. De SVG-achtergrond en de interactieve unitvlakken moeten op elkaar blijven aansluiten.

### Scheepstracking

De applicatie leest trackinggegevens uit `tracking.json` op de branch `tracking`. De workflow `.github/workflows/tracking.yml` voert `scripts/track.mjs` uit en publiceert de uitkomst naar die branch.

De workflow gebruikt de GitHub Actions-secret `AISSTREAM_API_KEY`. De workflow bevat een geplande uitvoering als vangnet en handmatige uitvoering. In het workflowbestand staat expliciet dat de reguliere trigger via een externe planner loopt; die externe planning moet dus eveneens worden onderhouden. De applicatie probeert trackinggegevens ongeveer iedere vijf minuten opnieuw te laden.

---

## 10. Aanbevolen beheerprocedure

### Bij dagelijks gebruik

1. Controleer nieuwe leverinformatie en pas de juiste leveringen aan.
2. Werk de status van schepen bij wanneer aankomst of lossen is bevestigd.
3. Controleer de Maasvlaktebuffer en de voortgang per blok/veldhuisje.
4. Werk de individuele unitstatussen op de plattegrond bij.
5. Controleer of de plattegrond en de leverkalender met elkaar overeenkomen.
6. Controleer of wijzigingen zijn gepubliceerd.

### Bij wijzigingen aan de applicatie

1. Maak een kopie of controleer eerst de actuele versie in GitHub.
2. Pas `index.html`, `plattegrond.svg` of de betreffende workflow/scriptbestanden aan.
3. Test toevoegen, wijzigen en verwijderen van leveringen.
4. Test scheepsstatussen en capaciteitsvalidatie.
5. Test unitselectie, datumregistratie, synchronisatie en CSV-export op de plattegrond.
6. Test JSON-import/export en publiceren naar GitHub.
7. Controleer de live GitHub Pages-versie na publicatie.

### Veelvoorkomende problemen

| Probleem | Controle |
|---|---|
| Collega ziet mijn wijziging niet | Controleer of de wijziging is gepubliceerd en of GitHub Pages de laatste versie serveert |
| Publiceren lukt niet | Controleer token, vervaldatum en Contents-rechten |
| Melding over nieuwere planning | Vergelijk lokale wijzigingen met de versie op GitHub voordat je iets verwerpt of overschrijft |
| Levering kan niet worden opgeslagen | Controleer de limiet van 8 per regel en per dag, het maximum van twee schepen per dag en de scheeps-/veldhuiscapaciteit |
| AIS-informatie ontbreekt | Controleer MMSI, de trackingbranch, de workflow, de externe planner en de secret `AISSTREAM_API_KEY` |
| Plattegrondachtergrond ontbreekt | Controleer of `plattegrond.svg` op de juiste plek in de hoofdbranch staat |
| Unitkleuren of posities kloppen niet | Controleer unitstatussen en de geometrische koppeling `PLAN_GEO` in `index.html` |

---

## 11. Eigenaarschap

Vul hier de interne contactpersonen in:

- **Functioneel eigenaar:** _[naam/team invullen]_
- **Technisch beheer:** _[naam/team invullen]_
- **Projectcontact:** _[naam/team invullen]_

---

*Laatste documentatiecontrole: 28 november 2026. Beschrijving gebaseerd op de broncode en repositorybestanden op de branch `main` op het moment van controle.*
