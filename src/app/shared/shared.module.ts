import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';
import {EditProductComponent} from './components/edit-product/edit-product.component'

@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    FooterComponent,
    CustomInputComponent,
    AddUpdateProductComponent,
    EditProductComponent,
    
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    FooterComponent,
    CustomInputComponent,
    AddUpdateProductComponent,
    EditProductComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
