// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },
  {
    path: 'catalogo',
    component: CatalogoComponent,
    title: 'Catálogo'
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Administración'
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];
