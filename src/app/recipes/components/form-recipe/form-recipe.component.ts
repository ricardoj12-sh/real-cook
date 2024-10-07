import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipesService } from '../../services/Recipes.service';
import { NgForm } from '@angular/forms';
import { Category, Country, Meal } from '../../interfaces/recipes.interface';

@Component({
  selector: 'app-form-recipe',
  templateUrl: './form-recipe.component.html',
  styleUrls: ['./form-recipe.component.css'],
})
export class FormRecipeComponent implements OnInit {
  @ViewChild('myForm') form!: NgForm;
  categories: Category[] = [];
  countries: Country[] = [];
  ingredients: { name: string; measure: string }[] = [{ name: '', measure: '' }];

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.recipeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {},
    });

    this.recipeService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: () => {},
    });
    this.getRecipesDefault();
  }

  getRecipesDefault() {
    this.recipeService.searchRecipesByDishName('a');
  }

  searchRecipeByCategory(event: Event) {
    const category = (<HTMLInputElement>event?.target).value;
    if (category === '' || category === null) {
      this.getRecipesDefault();
      return;
    }
    this.recipeService.searchRecipesByCategories(category);
  }

  searchRecipeByCountry(event: Event) {
    const country = (<HTMLInputElement>event?.target).value;
    if (country === '' || country === null) {
      this.getRecipesDefault();
      return;
    }
    this.recipeService.searchRecipesByCountry(country);
  }

  searchRecipe(event: any) {
    const nombre = event.target.value;
    this.recipeService.searchRecipesByDishName(nombre);
  }

  addIngredient() {
    this.ingredients.push({ name: '', measure: '' });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
  
    const newRecipe: Meal = {
      idMeal: '',
      strMeal: form.value.strMeal || '',
      strCategory: form.value.strCategory || '',
      strInstructions: form.value.strInstructions || '',
      strDrinkAlternate: '',
      strArea: '',
      strMealThumb: '',
      strTags: '',
      strYoutube: '',
      strSource: '',
      strImageSource: undefined,
      strCreativeCommonsConfirmed: undefined,
      dateModified: undefined,
      strIngredient1: this.ingredients[0]?.name || '',
      strIngredient2: this.ingredients[1]?.name || '',
      strIngredient3: this.ingredients[2]?.name || '',
      strIngredient4: this.ingredients[3]?.name || '',
      strIngredient5: this.ingredients[4]?.name || '',
      strIngredient6: this.ingredients[5]?.name || '',
      strIngredient7: this.ingredients[6]?.name || '',
      strIngredient8: this.ingredients[7]?.name || '',
      strIngredient9: this.ingredients[8]?.name || '',
      strIngredient10: this.ingredients[9]?.name || '',
      strIngredient11: this.ingredients[10]?.name || '',
      strIngredient12: this.ingredients[11]?.name || '',
      strIngredient13: this.ingredients[12]?.name || '',
      strIngredient14: this.ingredients[13]?.name || '',
      strIngredient15: this.ingredients[14]?.name || '',
      strIngredient16: this.ingredients[15]?.name || '',
      strIngredient17: this.ingredients[16]?.name || '',
      strIngredient18: this.ingredients[17]?.name || '',
      strIngredient19: this.ingredients[18]?.name || '',
      strIngredient20: this.ingredients[19]?.name || '',
      strMeasure1: this.ingredients[0]?.measure || '',
      strMeasure2: this.ingredients[1]?.measure || '',
      strMeasure3: this.ingredients[2]?.measure || '',
      strMeasure4: this.ingredients[3]?.measure || '',
      strMeasure5: this.ingredients[4]?.measure || '',
      strMeasure6: this.ingredients[5]?.measure || '',
      strMeasure7: this.ingredients[6]?.measure || '',
      strMeasure8: this.ingredients[7]?.measure || '',
      strMeasure9: this.ingredients[8]?.measure || '',
      strMeasure10: this.ingredients[9]?.measure || '',
      strMeasure11: this.ingredients[10]?.measure || '',
      strMeasure12: this.ingredients[11]?.measure || '',
      strMeasure13: this.ingredients[12]?.measure || '',
      strMeasure14: this.ingredients[13]?.measure || '',
      strMeasure15: this.ingredients[14]?.measure || '',
      strMeasure16: this.ingredients[15]?.measure || '',
      strMeasure17: this.ingredients[16]?.measure || '',
      strMeasure18: this.ingredients[17]?.measure || '',
      strMeasure19: this.ingredients[18]?.measure || '',
      strMeasure20: this.ingredients[19]?.measure || '',
    };
  
    this.recipeService.addRecipe(newRecipe).subscribe({
      next: (recipe) => {
        console.log('Receta agregada exitosamente:', recipe);
        form.reset();
        this.ingredients = [{ name: '', measure: '' }];
      },
      error: (err) => {
        console.error('Error al agregar la receta:', err);
      },
    });
  }
  
  
}