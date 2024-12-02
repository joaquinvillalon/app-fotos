import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {}
  ngOnInit() {
    this.platform.ready().then(() => {
      // Establece el modo oscuro globalmente
      document.body.classList.add('dark');
    });
  }
}