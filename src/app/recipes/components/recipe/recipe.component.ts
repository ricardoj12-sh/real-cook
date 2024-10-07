import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Meal } from '../../interfaces/recipes.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../services/Recipes.service';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  recipe!: Meal | null;

  ingredientsWithMeasures: { ingredient: string; measure: string }[] = [];
  constructor(
    private route: ActivatedRoute,
    private serviceRecipes: RecipesService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params)
      const id = params['id'];
      if (!id) {
        this.router.navigate(['/']);
      }
      this.serviceRecipes.getRecipeById(id).subscribe({
        next: (recipe) => {
          this.recipe = recipe;
          let count = Object.keys(recipe).filter((key) =>
            key.startsWith('strIngredient')
          ).length;

          for (let i = 1; i <= count; i++) {
            const ingredient =
              recipe[`strIngredient${i}` as keyof Meal]?.trim();
            const measure = recipe[`strMeasure${i}` as keyof Meal]?.trim();
            if (ingredient) {
              this.ingredientsWithMeasures.push({ ingredient, measure });
            }
          }
        },
        error: (error) => {
          this.router.navigate(['/']);
        },
      });
    });
  }
}
