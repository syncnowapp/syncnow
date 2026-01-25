# Implementazione SyncNow - Roadmap

## 1. Fondamenta (Completato) 
- [x] Inizializzazione Next.js + TypeScript
- [x] Design System "Titanium & Gold" (CSS Variables, Glassmorphism, Font)
- [x] Landing Page Premium
- [x] Pagina Configurazione Partita (Level/Role selection)
- [x] Struttura Pagina Match (Lobby, Sync, Transmission, Result)
- [x] Mock Stats Page

## 2. Realtime & Backend (In corso)
- [ ] Configurazione Database Supabase
- [ ] Creazione tabella `matches` (id, state, transmitter_id, receiver_id, level, current_shape, selected_shape)
- [ ] Creazione tabella `rounds` (per storico scientifico)
- [ ] Implementazione Realtime Channels per sincronizzare gli stati del match
- [ ] Auth (Email/Password)

## 3. Esperienza Utente (Polishing)
- [ ] Effetti sonori (Gong inizio/fine)
- [ ] Animazioni di respiro migliorate nella fase di sincronizzazione
- [ ] Mobile-first responsive checks
- [ ] Feedback visivi per errori di connessione

## 4. Analisi Dati (MVP Final)
- [ ] Calcolo statistiche reali dal DB
- [ ] Grafici di accuratezza per livello
- [ ] Export dati in CSV (opzionale per MVP)
