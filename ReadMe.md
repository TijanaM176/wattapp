# Tehnologije

.NET 6 SDK  
Angular CLI (15.2.1)  
MongoDB Server  
SQLite3

# Backend

## MongoDB


1.Skinuti MongoDB server sa https://www.mongodb.com/download-center/community. Izaberite operativni sistem na koji zelite da instalirate mongoDB server i preuzmite egzekucioni fajl.
2.Pokretanje MongoDB servera: 
	2.1.Otvorite command prompt ili terminal window. 
	2.2.Komandom cd se prebacite na folder gde ste instalirali MongoDB server. 
	2.3.Kada ste unutar foldera izvrsite komandu cd bin kako bi ste se prebacili do bin foldera.
	2.4.Ukucajte i pokrenite mongod komandu kako bi ste pokrenuli server.

3.Konfiguracija - Postaviti u asppsettings.json u .Net projektu u objektu

	"devicesDatabase" {
		"ConnectionString": "mongodb://localhost:PORT ", Umesto PORT treba napisati zapravo broj porta na kojem zelite da vam radi .NET projekat
		"DatabaseName": "DevicesDB",
        	"CollectionName": "PowerUsage"
	}

4.Skinuti MongoDB Compass aplikaciju zbog lakseg rukovodjenja
3.Otvorite MongoDBCompass i napraviti konekciju na `mongodb://localhost:PORT` koji ste postavili u ConnectionString.  
Napraviti bazu koja ima ime *DevicesDB* i u njoj napraviti kolekciju *PowerUsage*, u koju cete podatke uneti rucno, pomocu opcije AddData i ucitati `PowerUsage.json`.

## Pokretanje API-ja

1. Otvorite command prompt ili terminal window
2. Uneti komandu `cd src\backApp\API\API`
3. Uneti komandu `dotnet restore` 
4. Zatim uneti komandu `dotnet ef database update` kako bi kreirali bazu.  
5. Pokrenuti aplikaciju komandom `dotnet run`. 
6. Build-ovanje projekta se radi vrsi komandom `dotnet build`.
7. Kada ste spremni da objavite projekat na sever, to mozete uraditi komandom `dotnet publish`

#  Postavljanje .NET projekta na udaljeni server

1. Nakon `dotnet publish` koamnde projekat je spreman za postavljanje na server.
2. Na udaljenom serveru napravite folder back i u njega smestite sve foldere i podatke iz `src/backApp/API/API/bin/Debug/net6.0/publish`
3. U njega treba prebaciti i folder Uploads sa `src/backApp/API/API/Uploads` putanje.
4. Nakon toga upalite terminal i prebacite se na folder /back komandom `cd back`
5. Pokrenite komandu export ASPNETCORE_URLS="http:///website-address:PORT", Umesto PORT treba napisati zapravo broj porta na kojem zelite da vam radi .NET projekat
6. Konacno pokrenite komandu `dotnet API.dll` koja ce da pokrene vas .NET projekat na serveru. Nakon ove komande vas API je aktivan.

# Frontend

## DSO aplikacija

1. U terminalu promeniti lokaciju na src\appDistributer\Frontend\DSO komandom `cd src\appDistributer\Frontend\DSO`.  
2. Uneti komandu `npm install` da se instaliraju svi neophodni node.js paketi.
3. Zatim uneti komandu `ng serve` koja pokrece aplikaciju.
4. Otvoriti web browser i ukucati http://localhost:4200/ u url-u. Otvorice vam se pocetna strana aplikacije.
5. Build-ovanje projekta se vrsi komandom `ng build`. Nakon ove komande kreiraju se paketi i folderi koji sluze za postavljanje aplikacije na server.

## Prosumer aplikacija

1. U terminalu promeniti lokaciju na src\appProsumer\Frontend\Korisnik komamdom `cd src\appDistributer\Frontend\Korisnik`.
2. Uneti iste komande kao i za DSO aplikaciju.  

#  Postavljanje na server Angular aplikacije

## DSO aplikacija

1. Nakon `ng-build` komande vasa aplikacije je spremna za postavljanje na udaljeni server.
2. Nakon ove komande na vasem racunaru ce se pojaviti novi folder sa nazivom dist i nalazice se na putanji `src/appProsumer/Frontend/Dso/dist`
2. Na serveru napraviti folder dso
3. Skinuti folder server.rar sa putanje (https://cdn.discordapp.com/attachments/1100106229482786848/1100110066000081007/server.rar). Dati folder sadrzi potrebne stvari za pokretanje angular aplikacije
4. Otpakovati server.rar i podatke prebaciti u dso folder kreiran na serveru.
6. Prekopirato folder dist iz stavke 2 u app folder na serveru.
7. Otvoriti fajl index.js u dso folderu i pronadji liniju gde pise PORT || 10052. Promeniti 10052 na broj porta koji zelite da koristite za vasu angular aplikaciju
8. Na kraju u terminalu promenite lokaciju na dso komandom `cd dso` i pokrenite komandu `node index.js`
9. Vasa aplikacija je postavljena na server i aktivirana.

## Prosumer aplikacija

1. Ponovoti sve tacke kao za DSO aplikaciju samo sto treba promeniti ime foldera koji se pravi na serveru, kao i broj porta na kojem ce aplikacija da radi.