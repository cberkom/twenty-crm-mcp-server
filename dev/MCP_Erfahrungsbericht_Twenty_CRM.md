# Erfahrungsbericht: Twenty CRM MCP-Server

**Datum:** 02.03.2026
**Kontext:** Nutzung des Twenty CRM MCP-Servers über Claude Code für CRM-Pflege (BUGA-Projekt)

---

## Zusammenfassung der durchgeführten Aktionen

### Erfolgreich
- **Personensuche** (`list_people` mit `searchTerm`) – funktionierte zuverlässig
- **Opportunity aktualisieren** (`update_opportunity`) – Stage, Close-Date setzen funktionierte
- **Notiz erstellen** (`create_note`) – Markdown-Body wird korrekt in BlockNote-Format konvertiert
- **Notiz verknüpfen** (`create_note_target`) – Verlinkung mit Person, Company und Opportunity funktionierte jeweils einzeln

### Probleme

#### 1. ~~Fehlende Enum-Dokumentation bei Opportunity Stages~~ ✅ Behoben (v0.6.2)
**Problem:** Der erste Versuch, die Opportunity auf `WON` zu setzen, scheiterte mit:
```
Value "WON" does not exist in "OpportunityStageEnum" enum.
```
Die verfügbaren Werte (`NEW`, `SCREENING`, `MEETING`, `PROPOSAL`, `CUSTOMER`) waren nur indirekt aus der `create_opportunity`-Tool-Beschreibung ersichtlich, nicht bei `update_opportunity`.

**Verbesserungsvorschlag:** Die `update_opportunity`-Tool-Beschreibung sollte die gültigen Enum-Werte für `stage` direkt auflisten – identisch wie bei `create_opportunity`.

#### 2. Kein Weg, bestehende Notizen eines Kontakts effizient abzurufen
**Problem:** Um bestehende Notizen einer Person zu finden, muss man:
1. `list_note_targets` aufrufen (liefert alle Targets, nicht filterbar nach Person)
2. Manuell durch alle Targets iterieren und nach `personId` filtern
3. Für jeden Treffer `get_note` einzeln aufrufen

Bei vielen Notizen im System ist das extrem ineffizient und erzeugt viele API-Calls.

**Verbesserungsvorschlag:**
- `list_note_targets` sollte Filter-Parameter unterstützen: `personId`, `companyId`, `opportunityId`
- Alternativ: `list_notes` mit einem `linkedTo`-Filter (z.B. `linkedTo=person:UUID`)
- Idealerweise: Direkt bei `get_person` oder `get_company` eine Option, verknüpfte Notizen mitzuliefern (`expand=notes`)

#### 3. Keine Volltextsuche über Notizen
**Problem:** Es gibt keine Möglichkeit, Notizen nach Inhalt zu durchsuchen. `list_notes` liefert nur eine paginierte Liste ohne Suchparameter.

**Verbesserungsvorschlag:** `list_notes` sollte einen `searchTerm`-Parameter unterstützen, der Titel und Body durchsucht.

#### 4. ~~Notiz-Targets erfordern separate API-Calls pro Verknüpfung~~ ✅ Behoben (v0.6.2)
**Problem:** Eine Notiz mit Person UND Company UND Opportunity zu verknüpfen erfordert 3 separate `create_note_target`-Aufrufe. Das ist fehleranfällig und langsam.

**Verbesserungsvorschlag:** `create_note` sollte optionale Parameter `personId`, `companyId`, `opportunityId` direkt akzeptieren, um die Verknüpfungen in einem Schritt zu erstellen.

#### 5. Amount-Handling ist verwirrend (Micros)
**Problem:** Beträge werden intern als "Micros" gespeichert (3.492,65€ → `3492650000`). Bei `create_opportunity` akzeptiert der MCP-Server den normalen Betrag und konvertiert automatisch, aber bei `get_opportunity` kommt der Micros-Wert zurück. Das führt zu Verwirrung.

**Verbesserungsvorschlag:** Konsistente Darstellung – entweder immer als normaler Betrag mit expliziter Währung, oder zumindest ein Feld `amountFormatted` in der Ausgabe.

---

## Jira MCP – Kurztest

Der Jira-MCP-Server (`mcp-atlassian`) wurde ebenfalls getestet:

| Aktion | Ergebnis |
|:---|:---|
| `jira_get_all_projects` | Leere Liste `[]` |
| `jira_get_agile_boards` | Leere Liste `[]` |
| `jira_search` (JQL) | Fehler ohne Details |
| `jira_get_user_profile` | Konnte E-Mail nicht auflösen |
| `jira_create_issue` | Fehler ohne Details |

**Fazit:** Die Jira-Verbindung scheint nicht korrekt konfiguriert zu sein. Entweder fehlen Zugangsdaten, das Projekt existiert nicht, oder die API-Berechtigungen sind nicht ausreichend. Die Fehlermeldungen sind leider nicht aussagekräftig genug, um die Ursache zu bestimmen.

---

## Priorisierte Verbesserungsvorschläge für Twenty CRM MCP

| Prio | Verbesserung | Aufwand |
|:---|:---|:---|
| ~~**P0**~~ | ~~Filter für `list_note_targets` (personId, companyId, opportunityId)~~ | ✅ Bereits implementiert (v0.5.0) |
| ~~**P0**~~ | ~~Enum-Werte in allen Tool-Beschreibungen dokumentieren~~ | ✅ Behoben in v0.6.2 |
| ~~**P1**~~ | ~~`create_note` mit direkter Verknüpfung (personId, companyId, opportunityId)~~ | ✅ Implementiert in v0.6.2 |
| **P1** | Volltextsuche in `list_notes` | Mittel – offen |
| **P2** | Konsistentes Amount-Format in Responses | Klein – offen |
| **P2** | `expand`-Parameter bei `get_person`/`get_company` für verknüpfte Entitäten | Groß – offen |
