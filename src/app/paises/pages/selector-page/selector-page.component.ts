import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    this.regionValueChanges();
    this.paisValueChanges();
  }
  guardar() {
    console.log(this.miFormulario.value);

  }


  regionValueChanges() {
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => { this.miFormulario.get('pais')?.reset(''); this.cargando = true }),
        switchMap(region => this.paisesService.getPaisesRegion(region))
      ).subscribe(paises => { this.paises = paises; this.cargando = false })
  }

  paisValueChanges() {
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => { this.miFormulario.get('frontera')?.reset(''); this.cargando = true }),
        switchMap(codigoPais => this.paisesService.getPaisesFronterizos(codigoPais)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
      )
    // .subscribe(paises => { this.fronteras = pais?.borders || []; this.cargando = false });
  }

}
