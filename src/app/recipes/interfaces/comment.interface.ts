// interfaces/comment.interface.ts
export interface Comment {
  commentId?: string; // Optional for the server response
  recipeId: string; // ID de la receta a la que pertenece el comentario
  user: string; // Usuario que dejó el comentario
  content: string; // Contenido del comentario
}
