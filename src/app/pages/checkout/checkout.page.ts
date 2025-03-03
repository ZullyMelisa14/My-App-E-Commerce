import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/services/loadingser/loading.service';
import { CartService } from 'src/app/shared/services/localstorage/cart.service';
import { ToastService } from 'src/app/shared/services/toastser/toast.service';

@Component({
  standalone: false,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit {

  checkOut: FormGroup;
  isProcessing: boolean = false;
  showCVV: boolean = false;

  constructor(private fb: FormBuilder, private readonly cartS: CartService, private readonly toastS: ToastService, private router: Router, private readonly loadingS: LoadingService) {
    this.checkOut = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  ngOnInit() {
    this.checkOut.get('fullName')?.valueChanges.subscribe(() => {
      this.validateName();

      this.checkOut.get('cardNumber')?.valueChanges.subscribe(() => {
        this.validateCardNumber();
      });
    
      this.checkOut.get('cvv')?.valueChanges.subscribe(() => {
        this.validateCVV();

        this.checkOut.get('expiryDate')?.valueChanges.subscribe(() => {
          this.validateExpiryDate();
        });
      });
    })
  }

  processPayment() {
    if (this.checkOut.invalid) {
      this.toastS.showToast('Porfavor, completa todos los campos correctamente.', 'warning');
      return;
    }

    this.isProcessing = true;

    this.loadingS.show('Procesando pago...');

    setTimeout(() => {
      this.isProcessing = false;
      this.loadingS.dismiss();

      let cartItem: any[] = [];
      this.cartS.getCart().subscribe(cart => {
        cartItem = [...cart];
      })

      localStorage.setItem('lastPurchase', JSON.stringify({
        customer: this.checkOut.value,
        cart: cartItem
      }));

      this.cartS.clearCart();
      
      this.toastS.showToast('Pago exitoso. Redirigiendo...', 'success');

      this.router.navigate(['/summary']);
    }, 3000);
  }
  
  validateName() {
    let name = this.checkOut.get('fullName')?.value || '';
    name = name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.checkOut.get('fullName')?.setValue(name, { emitEvent: false });
  }

validateCardNumber() {
  let cardNumber = this.checkOut.get('cardNumber')?.value || '';
  cardNumber = cardNumber.replace(/[^0-9]/g, '').slice(0, 16);
  this.checkOut.get('cardNumber')?.setValue(cardNumber, { emitEvent: false });
}

validateCVV() {
  let cvv = this.checkOut.get('cvv')?.value || '';
  cvv = cvv.replace(/[^0-9]/g, '').slice(0, 3);
  this.checkOut.get('cvv')?.setValue(cvv, { emitEvent: false });
}

validateExpiryDate() {
  let expiryDate = this.checkOut.get('expiryDate')?.value || '';
  expiryDate = expiryDate.replace(/[^0-9/]/g, '').slice(0, 5);
  this.checkOut.get('expiryDate')?.setValue(expiryDate, { emitEvent: false });
}

toggleShowCVV() {
  this.showCVV = !this.showCVV;
}
}
