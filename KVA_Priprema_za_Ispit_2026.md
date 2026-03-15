# Klijentske Veb Aplikacije - Kompletna priprema za ispit (Mart 2026)

---

## ISPITNI ROK - MART 2026

**Beograd:** 18.03.2026, sa pocetkom u 12 casova, elektronska ucionica 117, Kumodraska

**Nis:** 20.03.2026, sa pocetkom u 11 casova, Racunarski kabinet 3

**Rok za predaju radova:**
- Studenti iz Beograda: **17.03.2026. do 23:59**
- Studenti iz Nisa: **19.03.2026. do 23:59**

**Nacin predaje:** GitHub link na repozitorijum, poslati na email:
- mjovanovic@singidunum.ac.rs (profesor)
- pkresoja@singidunum.ac.rs (asistent)
- Slati sa studentske singimail.rs adrese, obavezno navesti predmet u mejlu

**Napomena:** U terminu ispita je moguce polagati i kolokvijum.

---

## STRUKTURA ISPITA (ukupno 100 poena)

| Komponenta | Poeni | Opis |
|---|---|---|
| Nastava i aktivnost | 10 | Redovno pohadjanje nastave i aktivnost na casu |
| Kolokvijum 1 | 30 | MTutor test - JavaScript (teorija + zadaci) |
| Kolokvijum 2 | 30 | Prva faza projekta - Angular osnove |
| Zavrsni ispit | 30 | Druga faza projekta - Angular Material |

**Kolokvijum 2 i zavrsni ispit se mogu braniti zajedno u terminu ispita.**

---

## STA UCITI ZA PRVI KOLOKVIJUM (30 poena)

Kolokvijum 1 je **test u sistemu MTutor** koji obuhvata oblasti obradene do prvog kolokvijuma (JavaScript). Lekcije 1-6:

### Lekcija 1: Uvod u klijentske web aplikacije
- Principi rada web aplikacija
- Gradivni elementi i tehnologije (MEAN stek: MongoDB, Express, Angular, Node)
- Klijent-server arhitektura

### Lekcija 2: HTML i CSS (prvi deo)
- HTML struktura dokumenta, tagovi, atributi
- CSS selektori, svojstva, vrednosti
- Box model, margin, padding, border

### Lekcija 3: HTML i CSS (drugi deo)
- Napredni CSS (pozicioniranje, display, float)
- Responsive dizajn osnove
- CSS Grid i osnove layouta

### Lekcija 4: JavaScript
- Promenljive, tipovi podataka
- Operatori, uslovi (if/else, switch)
- Petlje (for, while, do-while)
- Funkcije, scope

### Lekcija 5: JavaScript napredne teme i DOM
- Document Object Model (DOM)
- Selekcija i manipulacija elemenata
- Kreiranje i brisanje elemenata
- Napredne teme (closure, hoisting, itd.)

### Lekcija 6: JavaScript dogadjaji i funkcije
- Event handling (addEventListener)
- Event propagation (bubbling, capturing)
- Callback funkcije
- Arrow funkcije, higher-order funkcije

---

## STA UCITI ZA DRUGI KOLOKVIJUM (30 poena)

Kolokvijum 2 je **prva faza prakticnog semestralnog projekta**. Obuhvata osnovne Angular elemente: komponente, module, rutiranje i navigaciju, interfejse, servise. Lekcije 7-10 (+ prakticni rad):

### Lekcija 7: MVC Angular arhitektura i gradivni elementi
- Angular arhitektura (komponente, moduli, servisi)
- MVC/MVVM pattern
- Angular CLI, kreiranje projekta
- Komponente: @Component dekorator, template, styles

### Lekcija 8: Angular rutiranje i konfiguracija projekta
- Angular Router modul
- Definisanje ruta (Routes)
- RouterLink, RouterOutlet
- Navigacija izmedju komponenti
- Route parametri

### Lekcija 9: Angular Material Komponente
- Instalacija i konfiguracija Angular Material
- Osnovne komponente (MatButton, MatCard, MatToolbar, itd.)
- Teme i stilizacija

### Lekcija 10: Angular TypeScript, Flexbox, FlexLayout
- TypeScript osnove u Angular kontekstu
- Interfejsi za definisanje strukture podataka
- Flexbox layout sistem
- Angular Flex-Layout biblioteka

---

## STA UCITI ZA ZAVRSNI ISPIT (30 poena)

Zavrsni ispit je **druga faza prakticnog projekta**. Obuhvata Angular Material (AM) elemente: AM kontrole korisnickog interfejsa, elementi stila (CSS, predefinisane Angular teme, Flexbox, FlexLayout). Lekcije 11-17:

### Lekcija 11: Vizuelni dizajn korisnickog interfejsa
- Principi vizuelnog dizajna
- Tipografija, boje, kontrast

### Lekcija 12: Firebase, HttpClient, Angular Material
- HTTP komunikacija u Angularu
- HttpClient modul
- Firebase integracija
- Napredne Angular Material komponente

### Lekcija 13: Ulazni elementi korisnickog interfejsa
- Forme u Angularu (Reactive Forms, Template-driven Forms)
- Input polja, select, checkbox, radio
- Validacija formi

### Lekcija 14: Izlazni elementi korisnickog interfejsa
- Tabele (MatTable), liste
- Paginacija, sortiranje, filtriranje
- Dijalozi (MatDialog)

### Lekcija 15: Graficki dizajn
- Principi grafickog dizajna za web
- Ikone, slike, vizuelni elementi

### Lekcija 16: Elementi grafickog korisnickog interfejsa
- Napredne UI komponente
- Custom komponente

### Lekcija 17: Principi dizajna korisnickog interfejsa
- UX principi
- Upotrebljivost, pristupacnost
- Best practices za korisnicki interfejs

---

## PROJEKAT - TEMA 2026: Digitalna prodavnica igracaka za decu

### Opis teme
Potrebno je realizovati **prototip korisnickog interfejsa digitalne prodavnice igracaka za decu** koristeci Angular. Aplikacija treba da omoguci **pretragu** i **rezervaciju** igracaka.

### Funkcionalni zahtevi

**1. Igracke (minimum 10 predefinisanih):**
Svaka igracka ima sledece atribute:
- Naziv
- Opis
- Tip (slagalica, slikovnica, figura, karakter, i drugi)
- Uzrast
- Ciljna grupa (devojcica, decak, svi)
- Datum proizvodnje
- Cena
- Status narudzbine (rezervisano, pristiglo, otkazano)
- Ocena (samo za igracke u statusu 'pristiglo')
- Recenzije korisnika

**2. Pretraga:**
- Pretraga po svim kriterijumima: naziv, opis, tip, uzrast, ciljna grupa, datum proizvodnje, cena, recenzije
- Kupac moze rucno pregledati i birati igracke iz ponudjenog skupa

**3. Rezervacija i Korpa:**
- Rezervacija igracke → dodaje se u korisnikovu Korpu
- Korpa prikazuje sve rezervisane igracke
- Automatski racuna ukupnu cenu
- Kupac moze menjati podatke igracke u statusu 'rezervisano'
- Kupac moze brisati igracke iz korpe u statusu 'pristiglo'
- Modifikacija i brisanje igracaka iz korpe

**4. Ocenjivanje:**
- Kupac moze oceniti samo igracke koje je prethodno rezervisao i koje imaju status 'pristiglo'
- Prezentacija ocene je slobodna (simboli, tekst, kombinacija) ali mora biti vidljivo istaknuta

**5. Korisnik (kupac):**
- Profil: ime, prezime, kontakt podaci (email, telefon, adresa), omiljene vrste igracaka, podaci za prijavljivanje
- Podaci profila se mogu menjati
- Moze pregledati dostupan sadrzaj, citati recenzije, dodavati rezervacije
- Za rezervaciju i pristup korpi MORA da se prijavi ili registruje

**6. Prijava/Registracija:**
- Prijava za postojece korisnike
- Registracija za nove korisnike (unos svih podataka profila)

### Tehnicki zahtevi

**Tehnologije:**
- Angular framework (obavezan)
- TypeScript interfejsi za strukturu podataka
- Angular servisi za simulaciju pozadinske logike (backend simulacija)
- Angular Material komponente za UI
- CSS, Angular teme, Flexbox, FlexLayout za stilizaciju
- Rutiranje i navigacija izmedju komponenti

**Prototip aplikacije obuhvata:**
- Izgled stranica i dijaloga (kontrole interfejsa i njihov raspored)
- Navigacija izmedju stranica i dijaloga (otvaranje/zatvaranje)
- Simulacija pozadinske logike (CRUD operacije sa dummy podacima - nizovi u servisima)

### API za podatke o igrackama (opciono - umesto lokalnih podataka)

Profesor je pripremio API koji se moze koristiti umesto lokalno definisanih podataka:

| Metoda | URL | Opis |
|---|---|---|
| GET | https://toy.pequla.com/api/toy | Lista svih igracaka |
| GET | https://toy.pequla.com/api/toy/{toyId} | Jedna igracka po ID-u |
| GET | https://toy.pequla.com/api/toy/permalink/{permalink} | Jedna igracka po permalinku |
| POST | https://toy.pequla.com/api/toy/list | Vise igracaka po nizu ID-jeva (body) |
| GET | https://toy.pequla.com/api/age-group | Lista starosnih grupa |
| GET | https://toy.pequla.com/api/type | Lista tipova igracaka |

- Slike igracaka: bazni URL https://toy.pequla.com + vrednost polja imageUrl (npr. https://toy.pequla.com/img/1.png)
- Polje targetGroup moze imati 3 vrednosti: **svi, decak, devojcica**

### Isporuka projekta

**Za kolokvijum 2 (prva faza):**
- Osnovne Angular komponente
- Rutiranje i navigacija
- TypeScript interfejsi i servisi

**Za zavrsni ispit (druga faza):**
- Angular Material komponente
- Stilovi (Angular teme, CSS, Flexbox, FlexLayout)
- Kompletna funkcionalnost

**Sta se predaje:**
1. Programski kod prototipa (GitHub repozitorijum)
2. PDF dokument sa kopijama ekrana prototipa (jedan ekran po stranici, sa kratkim opisom funkcije)
3. Opciono: Video snimak simulacije aplikacije (do 5 minuta, postaviti online)

---

## RESURSI ZA UCENJE

- Materijali sa predavanja (Teams > Deljeno > Class Materials > Predavanja)
- Materijali sa vezbi (Teams > Deljeno > Class Materials > Vezbe - 2025)
- Holmes, S., (2019). Getting MEAN with Mongo, Express, Angular, and Node. Manning Publications, 2nd Ed.
- HTML/CSS/DOM: https://developer.mozilla.org/en-US/docs/Web
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- Angular: https://angular.io/docs
- Angular Material: https://material.angular.io
- Node.js: https://nodejs.org/en/doc

---

## PLAN PRIPREME - PRIORITETI

### Hitno (do 17.03.):
1. **Projekat** - najvazniji deo, nosi 60 poena (Kol2 + Zavrsni)
2. Napraviti Angular aplikaciju sa svim zahtevima
3. Postaviti na GitHub i poslati link

### Za kolokvijum 1 (ako se polaze):
1. Proci lekcije 1-6 (HTML, CSS, JavaScript)
2. Vezbati JavaScript zadatke (DOM, eventi, funkcije)
3. Pripremiti se za MTutor test

### Redosled rada na projektu:
1. Kreiranje Angular projekta (ng new)
2. Definisanje TypeScript interfejsa (Toy, User, CartItem)
3. Kreiranje servisa za podatke (ToyService, UserService, CartService)
4. Kreiranje komponenti (Home, ToyList, ToyDetail, Cart, Profile, Login, Register)
5. Implementacija rutiranja
6. Dodavanje Angular Material komponenti
7. Stilizacija sa CSS/Flexbox/FlexLayout
8. Testiranje i PDF dokumentacija
