import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private serviceId = 'service_2gmnqrb'; // Reemplaza con tu Service ID
  private templateId = 'template_2o39phj'; // Reemplaza con tu Template ID
  private publicKey = 'OWQBbHI9H2vUtGezd'; // Reemplaza con tu Public Key

  constructor() {}

  sendEmail(toEmail: string, userName: string, productName: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      user_email: toEmail,
      user_name: userName,
      product_name: productName,
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey);
  }
}
