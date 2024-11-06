// src/app/comments/comments.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../recipes/services/backend.service';
import { Comment } from '../recipes/interfaces/comment.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comment.component.html', // Asegúrate de que esta línea sea correcta
  styleUrls: ['./comment.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  newComment: Comment = { recipeId: '', user: '', content: '' };

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la receta como string
    if (recipeId) {
      this.loadComments(recipeId); // Carga los comentarios para la receta
      this.newComment.recipeId = recipeId; // Establecer el recipeId en el nuevo comentario como string
    }
  }

  loadComments(recipeId: string): void {
    this.backendService.getCommentsByRecipe(recipeId).subscribe((comments) => {
      this.comments = comments; // Asigna los comentarios obtenidos
    });
  }

  submitComment(): void {
    this.backendService.createComment(this.newComment).subscribe((comment) => {
      this.comments.push(comment); // Añadir el nuevo comentario a la lista
      this.newComment = { recipeId: this.newComment.recipeId, user: '', content: '' }; // Reiniciar el formulario
    });
  }
}
