import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meal } from '../interfaces/recipes.interface';
import { Comment } from '../interfaces/comment.interface'; 

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private backendUrl = 'http://localhost:3000/api'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para añadir una receta al backend
  addRecipe(recipe: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${this.backendUrl}/recipes`, recipe);
  }

  // Método para obtener una receta por ID del backend
  getRecipeById(id: string): Observable<Meal> {
    return this.http.get<Meal>(`${this.backendUrl}/recipes/${id}`);
  }

  // Método para buscar recetas por nombre
  searchRecipesByDishName(name: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.backendUrl}/search?s=${name}`);
  }

  // Método para buscar recetas por categoría
  searchRecipesByCategories(category: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.backendUrl}/category/${category}`);
  }

  // Método para buscar recetas por país
  searchRecipesByCountry(country: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.backendUrl}/country/${country}`);
  }
    // Método para crear un comentario
    createComment(comment: Comment): Observable<Comment> {
      return this.http.post<Comment>(`${this.backendUrl}/comments`, comment);
    }
  
    // Método para obtener comentarios por ID de receta
    getCommentsByRecipe(recipeId: string): Observable<Comment[]> {
      return this.http.get<Comment[]>(`${this.backendUrl}/comments/${recipeId}`);
    }

}

