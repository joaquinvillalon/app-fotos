import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    userName: new FormControl(''), 
    description: new FormControl('', [Validators.required, Validators.minLength(10)]), 
  });
  

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    
    // Configurar el formulario
    if (this.product) {
      this.form.setValue(this.product);
    } else {
      // Asignar el nombre del usuario al campo userName
      this.form.controls.userName.setValue(this.user.name || this.user.email);
    }
  }
  

  // ==== Tomar/Seleccionar una imagen ====
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }



  //==== Crear un producto ======
  async createProduct() {
    const path = `products`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      const dataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
  
      const productData = {
        ...this.form.value,
        userId: this.user.uid,
        userName: this.user.name,
        userEmail: this.user.email, 
        description: this.form.value.description || '', 
      };
      delete productData.id;
  
      await this.firebaseSvc.addDocument(path, productData);
  
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Foto añadida exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al crear la foto:', error);
      this.utilsSvc.presentToast({
        message: error.message || 'Ocurrió un error al añadir la foto',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }
  
  
  
  

  //==== Actualizar un producto =====
  async updateProduct() {
    const path = `products/${this.product.id}`;
  
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    //---> Al cambiar la imagen, subimos una nueva y obtenemos su URL <---//
    if (this.form.value.image !== this.product.image) {
      const dataUrl = this.form.value.image;
      const imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
  
    const updatedProduct = { ...this.form.value, userId: this.user.uid };
    delete updatedProduct.id;
  
    this.firebaseSvc
      .updateDocument(path, updatedProduct)
      .then(async () => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Foto actualizada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.error(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  
  async updateProductPartial() {
    if (this.form.invalid) {
      this.utilsSvc.presentToast({
        message: 'Por favor, completa todos los campos obligatorios.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }
  
    const path = `products/${this.product.id}`;
  
    // Mostrar un indicador de carga
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      // Crear un objeto solo con los campos que queremos actualizar
      const updatedFields = {
        name: this.form.value.name,
        description: this.form.value.description,
      };
      
  
      // Actualizar el documento en Firestore
      await this.firebaseSvc.updateDocument(path, updatedFields);
  
      // Mostrar un mensaje de éxito
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Foto actualizada exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al actualizar la foto:', error);
      // Mostrar un mensaje de error
      this.utilsSvc.presentToast({
        message: error.message || 'Ocurrió un error al actualizar la foto.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      // Quitar el indicador de carga
      loading.dismiss();
    }
  }
  

}
