import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//Importacion de la PWA Camera de Ionic
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

//Importacion de la PWA Camera de Ionic
defineCustomElements(window);
