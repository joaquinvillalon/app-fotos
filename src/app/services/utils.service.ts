import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  router = inject(Router);
  loadingCtrl = inject(LoadingController);
  modalCtrl = inject(ModalController);
  toastCtrl = inject(ToastController);
  alertCtrl = inject(AlertController);

  //==== Capacitor camera =====//
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }

  //======= Router ========
  // Enruta a cualquier pagina.
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //===== Loading =====//
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  //===== Toast =====//
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  //===== Modal =====//
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  //===== Alert =====//

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);

    await alert.present();
  }

  //========= LocalStorage =========//
  // Guardar en local storage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener de local storage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
