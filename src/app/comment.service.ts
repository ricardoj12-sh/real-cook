import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Comment } from '../../../real-cook-app/src/app/recipes/interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private backendUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) {}

  // Método para crear un comentario
  createComment(comment: Comment): Observable<Comment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Asegúrate de que se envíe como JSON
    });

    return this.http.post<Comment>(this.backendUrl, comment, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear comentario', error);
        throw error; // O maneja el error como prefieras
      })
    );
  }

  // Método para obtener comentarios por ID de receta
  getCommentsByRecipe(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.backendUrl}/${recipeId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener comentarios', error);
        throw error; // O maneja el error como prefieras
      })
    );
  }
}
