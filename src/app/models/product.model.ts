export interface Product {
  id: string;
  name: string;
  image: string;
  userId: string;
  userImage?: string; // Agrega esta propiedad
  userName: string; // Nombre del usuario que creó el producto
  userEmail: string; // Correo del usuario que creó el producto
  description: string; // Nuevo campo
}
