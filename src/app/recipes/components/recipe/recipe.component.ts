import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../services/Recipes.service';
import { Meal } from '../../interfaces/recipes.interface';
import { CommentService } from '../../../comment.service';
import { Comment } from '../../interfaces/comment.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  recipe: Meal | null = null;
  ingredientsWithMeasures: { ingredient: string; measure: string }[] = [];
  comments: Comment[] = [];
  newComment: Comment = { recipeId: '', user: '', content: '' };
  isRecipeSaved: boolean = false; // Nuevo indicador para verificar si la receta está guardada

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private commentService: CommentService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getRecipeDetails(id);
      this.loadComments(id);
    });
  }

  getRecipeDetails(id: string) {
    this.recipesService.getRecipeById(id).subscribe({
      next: (recipe) => {
        if (recipe) {
          this.recipe = recipe;
          this.isRecipeSaved = false; // La receta ya está en la base de datos
          console.log('Receta encontrada en la base de datos.');
          this.setupIngredients();
        } else {
          this.isRecipeSaved = true; // La receta no está en la base de datos
          console.log('Receta no encontrada en la base de datos, mostrar botón de guardar.');
        }
      },
      error: (error) => {
        console.error('Error al obtener la receta:', error);
        this.router.navigate(['/']);
      },
    });
  }
  
  setupIngredients() {
    this.ingredientsWithMeasures = [];
    if (this.recipe) {
      for (let i = 1; i <= 20; i++) { // Asumiendo un máximo de 20 ingredientes
        const ingredientKey = `strIngredient${i}` as keyof Meal;
        const measureKey = `strMeasure${i}` as keyof Meal;
        
        const ingredient = this.recipe[ingredientKey]?.trim();
        const measure = this.recipe[measureKey]?.trim();
        
        if (ingredient) {
          this.ingredientsWithMeasures.push({ ingredient, measure });
        }
      }
    }
  }

  saveRecipe() {
    if (this.recipe && this.recipe.idMeal) {
      this.recipesService.saveRecipeFromApi(this.recipe.idMeal).subscribe({
        next: (savedRecipe) => {
          this.isRecipeSaved = true; // Actualizar el estado para ocultar el botón
          console.log('Receta guardada exitosamente');
        },
        error: (error) => {
          console.error('Error al guardar la receta:', error);
        },
      });
    }
  }
  
  loadComments(recipeId: string) {
    this.commentService.getCommentsByRecipe(recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
      },
    });
  }

  submitComment() {
    if (this.recipe && this.recipe.idMeal) {
      this.newComment.recipeId = this.recipe.idMeal;
      this.commentService.createComment(this.newComment).subscribe({
        next: (comment) => {
          this.comments.push(comment);
          this.newComment = { recipeId: '', user: '', content: '' };
        },
        error: (error) => {
          console.error('Error al enviar comentario:', error);
        },
      });
    } else {
      console.error('Recipe ID is undefined. Cannot submit comment.');
    }
  }
}
