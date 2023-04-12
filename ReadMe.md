# Tehnologije

.NET 7 SDK  
Angular CLI (15.2.1)  
MongoDB Server  
SQLite3

# Backend

## MongoDB

Pokrenuti MongoDB Compass i napraviti konekciju na `mongodb://localhost:27017`.  
Napraviti bazu *DevicesDB* i u njoj kolekciju PowerUsage, u koju cete podatke uneti rucno, pomocu opcije AddData i ucitati `PowerUsage.json`.

## Pokretanje API-ja

Uneti komandu `dotnet restore` u Packet Manager Console unutar Visual Studia kako bi instalirali potrebne pakete.  
Zatim uneti komandu `Update-Database` kako bi kreirali bazu.  
Pokrenuti aplikaciju.  

# Frontend

## DSO aplikacija

U terminalu promeniti lokaciju na src\appDistributer\Frontend\DSO.  
Uneti komandu `npm install`, ukoliko to ne uspe, uneti `npm install --force`.  
Zatim uneti komandu `ng serve --o`.  

## Prosumer aplikacija

U terminalu promeniti lokaciju na src\appProsumer\Frontend\Korisnik.  
Uneti iste komande kao i za DSO aplikaciju.  
Nakon unosenja komande `ng serve --o`, uneti `Y` kada iskoci prompt *Would you like to use a different port?*.
