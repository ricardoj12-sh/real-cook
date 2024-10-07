import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { PageRecipeComponent } from './pages/page-recipe/page-recipe.component';

const routes: Routes = [
  {
    path: '',
    component: PageHomeComponent,
  },
  {
    path: ':id',
    component: PageRecipeComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
