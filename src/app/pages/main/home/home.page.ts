import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { orderBy } from 'firebase/firestore';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { EditProductComponent } from 'src/app/shared/components/edit-product/edit-product.component';

import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  emailService = inject(EmailService);


  products: Product[] = [];
  filteredProducts: Product[] = []; // Productos filtrados según el segmento
  loading: boolean = false;
  segmentValue: string = 'own'; // Valor inicial: "own" para productos propios
  currentUserId: string; // UID del usuario autenticado
  

  ngOnInit() {

    this.getProducts();
    const user: User = this.utilsSvc.getFromLocalStorage('user');
    this.currentUserId = user?.uid || null; // Carga el UID del usuario autenticado
    
    
  }

  // ====== Obtener usuario para traer sus productos ======
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // ======= Ejecutar funcion cada vez que el usuario entra en la pagina ========
  ionViewWillEnter() {
    this.getProducts();
  }

  //==== Arrastrar hacia arriba y recargar productos =====

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }



//==== Obtener productos =====
getProducts() {
  let path = 'products'; // Ruta para obtener todos los productos
  this.loading = true;

  let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any) => {
      this.products = res;
      this.getUsersInfo(); // Obtener la información del usuario
      this.loading = false;
      sub.unsubscribe();
    },
  });
}

//==== Obtener la foto de perfil del usuario =====
async getUsersInfo() {
  for (let product of this.products) {
    const userDoc = await this.firebaseSvc.getDocument(`users/${product.userId}`);
    
    // Asegúrate de que userDoc sea tratado como un User
    const user = userDoc as User;

    // Si no tiene imagen de perfil, asignamos un color de fondo predeterminado
    if (user && user.image) {
      product.userImage = user.image;  // Asignamos la imagen del usuario
    } else {
      product.userImage = '';  // Asignamos una cadena vacía para indicar sin imagen
    }
  }
  this.filterProducts(); // Filtrar los productos después de agregar la foto de perfil
}



  // Filtrar productos según el valor del segmento
  filterProducts() {
    if (this.segmentValue === 'own') {
      this.filteredProducts = this.products.filter(p => p.userId === this.user().uid);
    } else {
      this.filteredProducts = this.products;
    }
  }

  // Manejar el cambio de segmento
  segmentChanged() {
    this.filterProducts(); // Filtrar los productos cuando el segmento cambia
  }

  //==== Agregar o actualizar un producto =====
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }

  //==== Agregar o actualizar un producto =====
  async editProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: EditProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }

  //==== Agregar o actualizar un producto =====
  async addProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }

  //==== Confirmar la eliminacion de un producto =====

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteProduct(product),
        },
      ],
    });
  }

  //==== Borrar un producto =====
  async deleteProduct(product: Product) {
    let path = `products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc
      .deleteDocument(path)



      .then(async (res) => {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.filterProducts(); // Recarga los productos filtrados
        this.utilsSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Error al eliminar el producto',
          duration: 1500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
             // Enviar correo al usuario
             this.emailService
             .sendEmail(product.userEmail, product.userName, product.name)
             .then(() => {
               console.log('Correo enviado exitosamente.');
             })
             .catch((error) => {
               console.error('Error al enviar el correo:', error);
             });
  }
}
