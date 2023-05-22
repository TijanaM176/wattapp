import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditDto } from '../models/editDto';
import { environment } from 'src/enviroment/enviroment';
import { SendPhoto } from '../models/sendPhoto';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ProsumerService {
  baseUrl = environment.apiUrl;
  cityId!: number;
  neighId!: string;
  constructor(private http: HttpClient, private cookie : CookieService) {}

  getInforamtion(id: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + 'Prosumer/getProsumerByID?id=' + id
    );
  }

  editInfo(id: string, dto: EditDto) {
    return this.http.put(
      this.baseUrl + 'Prosumer/UpdateProsumer?id=' + id,
      dto
    );
  }

  getDevicesByProsumerId(id: string, role: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        'Devices/GetAllDevicesForProsumer?id=' +
        id +
        '&role=' +
        role
    );
  }

  getDeviceById(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Devices/GetDevice?id=' + id);
  }
  getCityById(): Observable<string> {
    return this.http.get(
      this.baseUrl + 'GenericData/GetCityNameById?id=' + this.cityId,
      {
        responseType: 'text',
      }
    );
  }
  getNeighborhoodById(): Observable<string> {
    return this.http.get(
      this.baseUrl + 'GenericData/GetNeighborhoodByName?id=' + this.neighId,
      { responseType: 'text' }
    );
  }

  UploadImage(sp : any)
  {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.post(this.baseUrl+'Prosumer/'+id+'/UploadImage', sp);
  }
  DeleteImage()
  {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.delete(this.baseUrl+'Prosumer/'+id+'/DeleteImage');
  }
}
