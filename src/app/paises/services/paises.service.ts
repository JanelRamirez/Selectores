import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { combineLatest, Observable, of } from 'rxjs';

import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v2/'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }
  constructor(private http: HttpClient) { }


  getPaisesRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisesFronterizos(codigoPais: string): Observable<Pais | null> {
    if (!codigoPais) { return of(null) }

    const url: string = `${this._baseUrl}alpha/${codigoPais}`
    return this.http.get<Pais>(url);

  }
  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}alpha/${codigo}/?fields=alpha3Code,name`
    return this.http.get<PaisSmall>(url);
  }
  getPaisesPorCodigos(codigos: string[]): Observable<PaisSmall[]> {
    if (codigos.length) { return of([]) }

    const peticiones: Observable<PaisSmall>[] = []
    codigos.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })
    return combineLatest(peticiones);
  }

}

