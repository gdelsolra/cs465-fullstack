import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  constructor( private http: HttpClient, 
    @Inject(BROWSER_STORAGE) private storage: Storage) { }

    private apiBaseUrl = 'http://localhost:3000/api/'
    private tripUrl = `${this.apiBaseUrl}trips/`
  url = 'http://localhost:3000/api/trips';

  getTrips() : Observable <Trip[]> {
    
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip ): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode:string): Observable<Trip[]> {
    //console.log('Inside TripDataService::getTrips')
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }
  updateTrip(formData: Trip): Observable<Trip> {
    const token = this.storage.getItem('travlr-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put<Trip>(this.url + '/' + formData.code, formData, { headers });
  }

  private handleError(error:any): Promise<any>{
    console.error('Something has gone wrong', error); //for demo purposes only
    return Promise.reject(error.message || error);

  }

  public login(user: User): Promise<AuthResponse>{
    return this.makeAuthApiCall('login', user);
  }
  public register(user: User): Promise<AuthResponse>{
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}${urlPath}`;
    return this.http
      .post<AuthResponse>(url, user)
      .toPromise()
      .catch(this.handleError);
  }

  }
