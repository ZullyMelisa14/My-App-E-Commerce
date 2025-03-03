import { Component, OnInit } from '@angular/core';
import { CartService } from '../shared/services/localstorage/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  isLoading = true;
  categorySelected = '';
  sortOrder = 'price-asc';
  cartItemCount = 0;

  constructor(private readonly cartS: CartService) {}

  ngOnInit() {
    this.simulateLoading();
    this.listenCartUpdates();
  }

  private simulateLoading() {
    setTimeout(() => this.isLoading = false, 3000);
  }

  private listenCartUpdates() {
    this.cartS.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }
}
