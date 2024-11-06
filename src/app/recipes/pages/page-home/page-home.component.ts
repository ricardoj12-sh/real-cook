import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/Recipes.service';
import { Category, Meal } from '../../interfaces/recipes.interface';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {
  categories: Category[] = [];
  recipes: Meal[] = []; // Agrega un array para almacenar las recetas

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    // Suscribirse al observable de categorías
    this.recipeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {},
    });

    // Suscribirse al observable de recetas nuevas
    this.recipeService.newRecipe$.subscribe({
      next: (newRecipe) => {
        if (newRecipe) {
          this.recipes.unshift(newRecipe); // Agrega la receta nueva al inicio de la lista de recetas
        }
      },
    });

    this.getRecipesDefault(); // Cargar las recetas iniciales
  }

  getRecipesDefault() {
    this.recipeService.searchRecipesByDishName('a');
    // Suscribirse al observable de recetas para recibir las recetas iniciales
    this.recipeService.recipes$.subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
    });
  }

  searchRecipeByCategory(event: Event) {
    const category = (<HTMLInputElement>event?.target).value;
    if (category === '' || category === null) {
      this.getRecipesDefault();
      return;
    }
    this.recipeService.searchRecipesByCategories(category);
  }

  searchRecipe(event: any) {
    const nombre = event.target.value;
    this.recipeService.searchRecipesByDishName(nombre);
  }
}
