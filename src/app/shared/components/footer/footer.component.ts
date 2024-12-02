import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  navigate(link: string) {
    console.log('navegando a: ', link);
    this.utilsSvc.routerLink(link);
  }
}
