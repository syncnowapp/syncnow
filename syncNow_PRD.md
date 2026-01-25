# PRD – SyncNow

**Nome applicazione:** SyncNow

Sottotitolo: Telepathy Training WebApp

## Versione
- **v0.1 (MVP)**

---

## 1. Visione del prodotto
**SyncNow** è una webapp concepita come
La webapp è un **esperimento serio** di allenamento e osservazione della comunicazione non verbale/telepatica, strutturato come gioco 1‑vs‑1, con **raccolta dati sistematica** per analisi statistiche nel tempo.

Non dichiara né nega l’esistenza della telepatia: **permette di sperimentare e studiare**.

Tono: **scientifico / spirituale**, essenziale, privo di elementi ludici inutili.

---

## 2. Obiettivo dell’MVP
- Consentire partite 1‑vs‑1 in tempo reale
- Ruoli scelti dagli utenti: **Trasmettitore / Ricevitore**
- Trasmissione di **figure geometriche semplici nere su sfondo bianco**
- Raccolta completa dei dati di gioco
- Prime statistiche personali

---

## 3. Target
- Utenti curiosi e sperimentatori
- Persone interessate a pratiche mentali
- Futuro: ricercatori indipendenti, gruppi di studio

---

## 4. Accesso e identità
### Account
- Registrazione con **email + password**
- **Nessuna verifica email** in MVP
- ID considerato persistente

### Futuro
- Classifiche
- Storico avanzato
- Eventuale export dati per ricerca

---

## 5. Modalità di gioco
### Tipologia
- **1 vs 1**
- Match:
  - tramite **link di invito**
  - oppure **matchmaking casuale**

### Ruoli
- Decisi alla creazione della partita
- Non intercambiabili durante il round

### Dopo il round
Al termine di ogni round viene mostrata una schermata di decisione.

- CTA principali:
  - **Gioca ancora**
  - **Esci** (torna alla Home)

- Se l’utente seleziona **Gioca ancora**, viene chiesto:
  - **Confermare i ruoli attuali** (stesso Trasmettitore / Ricevitore)
  - **Invertire i ruoli**

La scelta determina la configurazione del round successivo senza uscire dalla partita.

- CTA:
  - “Gioca ancora”
  - “Torna alla Home”

---

## 6. Struttura del round
### Configurazione
- Durata risposta: **30 secondi (MVP)**
- Fase di sincronizzazione iniziale: **10 secondi**
- Segnali sonori: **Gong inizio / Gong fine**
- Livelli:
  - **Base**: 3 forme
  - **Medio**: 6 forme
  - **Avanzato**: 9 forme

### Flusso
1. Trasmettitore sceglie una figura
2. Click su “Inizia trasmissione”
3. **Fase di sincronizzazione (10 secondi)**
   - Animazione lenta condivisa
   - Testo di centratura mentale
4. **Gong – Inizio trasmissione**
5. Ricevitore entra in fase di ricezione attiva
6. **30 secondi di trasmissione**
7. **Gong – Fine trasmissione**
8. Il ricevitore effettua la scelta (se non già fatta)
9. Risultato mostrato

---

## 7. UI – Esperienza mentale
### Ricevitore vede:
- Animazione lenta (pulsazione / respiro)
- Countdown discreto
- Testo modificabile, es:
  > “Rilassati. Osserva ciò che emerge senza giudicare.”

### Trasmettitore vede:
- Figura selezionata
- Stato di trasmissione

---

## 8. Feedback post‑round
### Mostrato subito:
- Giusto / Sbagliato
- Figura corretta
- Figura scelta
- Percentuale cumulativa

---

## 9. Statistiche utente
### MVP
- Accuratezza totale
- Accuratezza per livello
- Andamento nel tempo

### Futuro
- Streak
- Confronto con media globale
- Classifiche

---

## 10. Raccolta dati (core scientifico)
Per **ogni round** vengono salvati:
- ID trasmettitore
- ID ricevitore
- Figura trasmessa
- Figura scelta
- Livello
- Tempo di risposta
- Esito (0/1)
- Timestamp

Dati associati a utenti reali (account).

---

## 11. Architettura tecnica
### Frontend
- **React / Next.js**
- Mobile‑first

### Backend
- WebSocket per realtime
- DB relazionale (es. Supabase)

### Realtime
- Stato partita
- Sincronizzazione round
- Timer server‑side

---

## 12. Sicurezza e semplicità
- Nessuna moderazione in MVP
- Nessun disclaimer esplicito
- Nessuna sezione “metodo” (per ora)

---

## 13. Cose volutamente escluse dall’MVP
- IA
- Bot
- Gruppi >2 persone
- Export dati
- Classifiche globali
- Validazioni scientifiche

---

## 14. Evoluzioni previste
- Dataset anonimo per ricerca
- Modalità blind (randomizzazione avanzata)
- Analisi statistica automatica
- Sessioni guidate
- Studi longitudinali

---

## 15. User Flow dettagliato (MVP)

Questa sezione definisce **stati e transizioni** dell’applicazione ed è da considerarsi riferimento operativo per lo sviluppo.

### 15.1 Autenticazione
**Stati:**
- logged_out
- logging_in
- logged_in

**Transizione:**
- login / registrazione → Home

---

### 15.2 Home
**Stato:** home

**Azioni disponibili:**
- Crea partita
- Gioca casuale
- Statistiche

**Transizioni:**
- Crea partita → create_match
- Gioca casuale → matchmaking
- Statistiche → stats

---

### 15.3 Creazione partita
**Stato:** create_match

**Input:**
- Livello (Base 3 / Medio 6 / Avanzato 9)
- Ruolo (Trasmettitore / Ricevitore)

**Output:**
- match_id
- link di invito

**Transizione:**
- partita creata → lobby_host

---

### 15.4 Lobby / Attesa
La lobby prevede due stati distinti.

#### Host
**Stato:** lobby_host
- visualizza link di invito
- pulsante “Pronto” (attivo solo dopo ingresso guest)

#### Guest
**Stato:** lobby_guest
- entra tramite link
- pulsante “Pronto”

---

### 15.5 Controllo pronti
**Stato:** lobby_ready_check

**Condizione:**
- entrambi gli utenti hanno premuto “Pronto”

**Transizione automatica:**
- lobby_ready_check → sync_phase

---

### 15.6 Fase di sincronizzazione
**Stato:** sync_phase

- durata: 10 secondi
- animazione lenta condivisa
- testo di centratura mentale
- countdown server-side

**Evento:**
- fine countdown → Gong

**Transizione:**
- sync_phase → transmission_active

---

### 15.7 Trasmissione attiva
**Stato:** transmission_active

- durata: 30 secondi
- Gong di inizio e Gong di fine

**Trasmettitore:**
- visualizza solo la figura selezionata

**Ricevitore:**
- animazione + timer
- selezione figura

**Eventi:**
- invio scelta ricevitore
- oppure timeout

**Transizione:**
- transmission_active → result

---

### 15.8 Risultato round
**Stato:** result

**Mostrato a entrambi:**
- figura trasmessa
- figura scelta
- esito (corretto / errato)
- tempo di risposta
- percentuale cumulativa

**Azioni:**
- Gioca ancora
- Esci

---

### 15.9 Nuovo round
(se selezionato “Gioca ancora”)

**Stato:** next_round_choice

**Opzioni:**
- Conferma ruoli
- Inverti ruoli

**Transizione:**
- scelta effettuata → lobby_ready_check

---

### 15.10 Uscita
**Transizione:**
- Esci → Home

---

**Nota di progetto:**
Il flusso è progettato per garantire coerenza temporale, ripetibilità dei round e qualità dei dati raccolti.
