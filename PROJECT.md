# KVA Projekat 2026 - Digitalna Prodavnica Igracaka za Decu

## Pregled projekta

Angular web aplikacija - prototip digitalne prodavnice igracaka za decu. Aplikacija omogucava pretragu, pregled, rezervaciju i ocenjivanje igracaka. Koristi Angular Material za UI komponente, simulira backend logiku kroz TypeScript interfejse i Angular servise (dummy data u nizovima). Nema pravog backend-a - sve se cuva u memoriji tokom sesije.

## Tehnicke tehnologije

- **Framework:** Angular 17+ (standalone components)
- **Jezik:** TypeScript
- **UI biblioteka:** Angular Material
- **Layout:** CSS Flexbox + Angular Flex-Layout (@angular/flex-layout)
- **Routing:** Angular Router
- **State:** Angular servisi sa BehaviorSubject (RxJS)
- **Podaci:** Lokalni dummy podaci u servisima (nizovi) ILI opciono API: https://toy.pequla.com

## API Endpointi (opcioni - mogu se koristiti umesto lokalnih podataka)

```
GET  https://toy.pequla.com/api/toy              - lista svih igracaka
GET  https://toy.pequla.com/api/toy/<toyId>       - jedna igracka po ID-u
GET  https://toy.pequla.com/api/toy/permalink/<p>  - igracka po permalinku
POST https://toy.pequla.com/api/toy/list          - body: niz ID-jeva, vraca listu
GET  https://toy.pequla.com/api/age-group         - lista starosnih grupa
GET  https://toy.pequla.com/api/type              - lista tipova igracaka
```

Slike: `https://toy.pequla.com` + `imageUrl` polje (npr. `/img/1.png` → `https://toy.pequla.com/img/1.png`)

Polje `targetGroup` ima 3 vrednosti: `svi`, `decak`, `devojcica`

## TypeScript Interfejsi

```typescript
// models/toy.model.ts
export interface Toy {
  id: number;
  name: string;                    // naziv
  description: string;             // opis
  type: string;                    // tip: slagalica, slikovnica, figura, karakter, itd.
  ageGroup: string;                // uzrast (npr. "3-5", "6-8", "9-12")
  targetGroup: 'svi' | 'decak' | 'devojcica';  // ciljna grupa
  manufacturingDate: string;       // datum proizvodnje (ISO string)
  price: number;                   // cena u RSD
  imageUrl: string;                // putanja do slike
  reviews: Review[];               // recenzije korisnika
  averageRating: number;           // prosecna ocena
}

// models/review.model.ts
export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;                  // ocena 1-5
  comment: string;
  date: string;
  reviewerType: 'dete' | 'roditelj';  // ko je napisao recenziju
}

// models/user.model.ts
export interface User {
  id: number;
  firstName: string;               // ime
  lastName: string;                // prezime
  email: string;
  phone: string;
  address: string;
  favoriteTypes: string[];         // omiljene vrste igracaka
  username: string;
  password: string;
}

// models/cart-item.model.ts
export interface CartItem {
  id: number;
  toy: Toy;
  quantity: number;
  status: 'rezervisano' | 'pristiglo' | 'otkazano';
  dateAdded: string;
  userRating?: number;             // ocena korisnika (samo za status 'pristiglo')
}
```

## Struktura Angular Komponenti

```
src/
├── app/
│   ├── app.component.ts           # Root komponenta sa toolbar-om i router-outlet
│   ├── app.routes.ts              # Definicija ruta
│   │
│   ├── models/                    # TypeScript interfejsi
│   │   ├── toy.model.ts
│   │   ├── review.model.ts
│   │   ├── user.model.ts
│   │   └── cart-item.model.ts
│   │
│   ├── services/                  # Angular servisi (simulacija backend-a)
│   │   ├── toy.service.ts         # CRUD za igracke, pretraga, filtriranje
│   │   ├── user.service.ts        # Registracija, prijava, profil
│   │   ├── cart.service.ts        # Korpa: dodavanje, brisanje, izmena, ukupna cena
│   │   └── auth.service.ts        # Autentifikacija (login/logout stanje)
│   │
│   ├── guards/
│   │   └── auth.guard.ts          # Route guard za zasticene stranice
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header/            # Toolbar sa navigacijom, logo, korpa ikonica, login
│   │   │   └── footer/            # Footer sa info
│   │   │
│   │   ├── home/                  # Pocetna stranica (featured igracke, kategorije)
│   │   │
│   │   ├── toys/
│   │   │   ├── toy-list/          # Lista svih igracaka sa pretragom i filterima
│   │   │   ├── toy-card/          # Kartica jedne igracke (za listu)
│   │   │   └── toy-detail/        # Detaljan prikaz igracke sa recenzijama
│   │   │
│   │   ├── search/
│   │   │   └── search-filter/     # Komponenta za pretragu i filtriranje
│   │   │
│   │   ├── cart/
│   │   │   ├── cart-page/         # Stranica korpe sa svim rezervacijama
│   │   │   └── cart-item/         # Jedan item u korpi
│   │   │
│   │   ├── auth/
│   │   │   ├── login/             # Login forma
│   │   │   └── register/          # Registracija forma
│   │   │
│   │   ├── profile/
│   │   │   └── profile-page/      # Korisnicki profil sa mogucnoscu izmene
│   │   │
│   │   └── shared/
│   │       ├── rating/            # Komponenta za prikaz/unos ocene (zvezdice)
│   │       ├── review-list/       # Lista recenzija
│   │       └── confirm-dialog/    # Potvrdni dijalog (MatDialog)
│   │
│   └── data/
│       └── mock-toys.ts           # Predefinisani podaci (minimum 10 igracaka)
```

## Rutiranje (app.routes.ts)

```
/                    → HomeComponent (pocetna)
/toys                → ToyListComponent (sve igracke + pretraga)
/toys/:id            → ToyDetailComponent (detalj igracke)
/cart                → CartPageComponent (korpa - ZASTITCENO, zahteva login)
/login               → LoginComponent
/register            → RegisterComponent
/profile             → ProfilePageComponent (ZASTICENO, zahteva login)
```

Rute `/cart` i `/profile` su zasticene AuthGuard-om - ako korisnik nije prijavljen, preusmerava se na `/login`.

## Funkcionalni zahtevi po komponentama

### 1. Header (layout/header)
- Logo i naziv aplikacije
- Navigacioni linkovi: Pocetna, Igracke
- Ikonica korpe sa badge-om (broj stavki u korpi)
- Login/Register dugmad (ako korisnik NIJE prijavljen)
- Ime korisnika + Profil link + Logout (ako korisnik JESTE prijavljen)
- Responsive - hamburger meni na manjim ekranima (MatSidenav)

### 2. Home (Pocetna stranica)
- Hero sekcija sa naslovom i pozivom na akciju
- Prikaz istaknutih/preporucenih igracaka (npr. 4-6 kartica)
- Sekcija sa kategorijama igracaka (po tipu)
- Poziv na pretragu

### 3. ToyList (Lista igracaka)
- Prikaz svih igracaka u grid layoutu (MatCard za svaku)
- Integrisana pretraga i filteri sa strane ili na vrhu:
  - Pretraga po nazivu (text input)
  - Filter po tipu (MatSelect ili MatChip)
  - Filter po ciljnoj grupi (MatButtonToggle: svi/decak/devojcica)
  - Filter po uzrastu (MatSelect)
  - Filter po opsegu cene (MatSlider ili dva input polja)
  - Sortiranje (po ceni, po oceni, po datumu)
- Svaka kartica prikazuje: sliku, naziv, tip, cenu, prosecnu ocenu, dugme "Rezervisi"

### 4. ToyDetail (Detalj igracke)
- Velika slika igracke
- Svi podaci: naziv, opis, tip, uzrast, ciljna grupa, datum proizvodnje, cena
- Prosecna ocena (vizuelno - zvezdice)
- Dugme "Rezervisi" (dodaje u korpu)
- Sekcija sa recenzijama drugih korisnika
- Mogucnost dodavanja recenzije (ako je prijavljen i ima igracku u statusu 'pristiglo')

### 5. Cart (Korpa)
- Lista svih rezervisanih igracaka
- Za svaku stavku: slika, naziv, cena, status, dugmad za akcije
- Ako je status 'rezervisano': moze se menjati (edit) ili otkazati
- Ako je status 'pristiglo': moze se obrisati iz korpe + mogucnost ocenjivanja
- Ako je status 'otkazano': samo prikaz
- Ukupna cena na dnu (automatski racunanje)
- Dugme za promenu statusa (simulacija: rezervisano → pristiglo)

### 6. Login
- Forma sa username i password (MatFormField)
- Validacija (required polja)
- Link ka registraciji
- Nakon uspesnog logina → preusmerenje na prethodnu stranicu ili pocetnu

### 7. Register
- Forma sa svim podacima profila:
  - Ime, prezime
  - Email, telefon, adresa
  - Omiljene vrste igracaka (MatChip sa multi-select)
  - Username, password, potvrda passworda
- Validacija svih polja
- Nakon uspesne registracije → automatski login i preusmerenje

### 8. Profile
- Prikaz svih podataka korisnika
- Mogucnost izmene svih polja (edit mode)
- Dugme "Sacuvaj izmene"
- Prikaz istorije rezervacija

### 9. Rating komponenta (shared)
- Vizuelni prikaz ocene pomocu zvezdica (1-5)
- Interaktivni mod: klik na zvezdicu za ocenjivanje
- Read-only mod: samo prikaz prosecne ocene

### 10. Confirm Dialog (shared)
- MatDialog za potvrdu brisanja ili otkazivanja
- "Da li ste sigurni?" sa dugmadima Potvrdi/Otkazi

## Dummy podaci (minimum 10 igracaka)

Kreirati fajl `data/mock-toys.ts` sa najmanje 10 igracaka razlicitih tipova. Primer:

```typescript
export const MOCK_TOYS: Toy[] = [
  {
    id: 1,
    name: 'Slagalica Svet Zivotinja',
    description: 'Edukativna slagalica sa 100 delova...',
    type: 'slagalica',
    ageGroup: '3-5',
    targetGroup: 'svi',
    manufacturingDate: '2025-06-15',
    price: 1299,
    imageUrl: '/assets/images/toy1.jpg',
    reviews: [],
    averageRating: 4.5
  },
  // ... jos 9+ igracaka razlicitih tipova
];
```

Tipovi igracaka: slagalica, slikovnica, figura, karakter, plisana igracka, edukativna, konstrukciona, drustvena igra, vozilo, lutka

## Angular Material komponente koje treba koristiti

- **Layout:** MatToolbar, MatSidenav, MatCard, MatDivider, MatGrid
- **Navigacija:** MatMenu, MatTab, MatSidenav
- **Forme:** MatFormField, MatInput, MatSelect, MatCheckbox, MatRadioButton, MatSlider, MatChip, MatDatepicker
- **Dugmad:** MatButton, MatIconButton, MatFab, MatButtonToggle
- **Prikaz:** MatTable, MatPaginator, MatSort, MatList, MatBadge, MatIcon
- **Dijalozi:** MatDialog, MatSnackBar, MatTooltip
- **Ostalo:** MatProgressSpinner, MatExpansionPanel

## Stilizacija

- Koristiti predefinisanu Angular Material temu (npr. indigo-pink ili custom tema sa decijem tematikom)
- Responsive dizajn koristeci Flexbox i/ili Flex-Layout
- Prilagodjen za razlicite velicine ekrana (telefon, tablet, laptop)
- Vesele boje prikladne za deciju prodavnicu
- Zaobljeni uglovi, prijatna tipografija

## Koraci za inicijalizaciju projekta

```bash
# 1. Kreiranje projekta
ng new toy-store --routing --style=scss --standalone

# 2. Dodavanje Angular Material
ng add @angular/material
# Izabrati temu: Custom ili Indigo/Pink
# Izabrati tipografiju: Yes
# Izabrati animacije: Yes

# 3. Dodavanje Flex-Layout (ako je potrebno)
npm install @angular/flex-layout

# 4. Generisanje komponenti
ng g c components/layout/header --standalone
ng g c components/layout/footer --standalone
ng g c components/home/home --standalone
ng g c components/toys/toy-list --standalone
ng g c components/toys/toy-card --standalone
ng g c components/toys/toy-detail --standalone
ng g c components/search/search-filter --standalone
ng g c components/cart/cart-page --standalone
ng g c components/cart/cart-item --standalone
ng g c components/auth/login --standalone
ng g c components/auth/register --standalone
ng g c components/profile/profile-page --standalone
ng g c components/shared/rating --standalone
ng g c components/shared/review-list --standalone
ng g c components/shared/confirm-dialog --standalone

# 5. Generisanje servisa
ng g s services/toy
ng g s services/user
ng g s services/cart
ng g s services/auth

# 6. Generisanje guard-a
ng g guard guards/auth

# 7. Kreiranje model fajlova
# Rucno kreirati fajlove u src/app/models/
```

## Napomene

- Ovo je PROTOTIP - nema pravog backend-a, sve se simulira u Angular servisima
- Podaci se cuvaju u memoriji (nizovi u servisima), gube se pri refreshu stranice
- CRUD operacije (citanje, upis, izmena, brisanje) se rade nad nizovima u servisima
- Za slike igracaka mogu se koristiti placeholder slike ili slike sa API-ja
- Aplikacija treba da bude funkcionalna i vizuelno uredna
- Svaka stranica treba da ima smislenu navigaciju i da bude intuitivna za koriscenje
