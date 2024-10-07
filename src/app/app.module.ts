import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { ListRecipesComponent } from './recipes/components/list-recipes/list-recipes.component';
import { CardRecipeComponent } from './recipes/components/card-recipe/card-recipe.component';
import { FormRecipeComponent } from './recipes/components/form-recipe/form-recipe.component';
import { PageHomeComponent } from './recipes/pages/page-home/page-home.component';
import { PageRecipeComponent } from './recipes/pages/page-recipe/page-recipe.component';
import { HeaderComponent } from './shared/header/header.component';
import { PaginationComponent } from './recipes/components/pagination/pagination.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RecipeComponent } from './recipes/components/recipe/recipe.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ListRecipesComponent,
    CardRecipeComponent,
    FormRecipeComponent,
    PageHomeComponent,
    PageRecipeComponent,
    HeaderComponent,
    PaginationComponent,
    FooterComponent,
    RecipeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RecipesRoutingModule,
    FormsModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
