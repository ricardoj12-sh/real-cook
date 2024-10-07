import { Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { Meal } from '../../interfaces/recipes.interface';
@Component({
  selector: 'app-card-recipe',
  templateUrl: './card-recipe.component.html',
  styleUrls: ['./card-recipe.component.css'],
})
export class CardRecipeComponent {
  imagenLoading: boolean = false;
  @Input() meal!: Meal;

  onImagenLoad(): void {
    this.imagenLoading = true;
  }
}
