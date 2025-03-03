import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { LoadingService } from '../../services/loadingser/loading.service';

@Component({
  standalone: false,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  categories: string[] = ['Todas']; // Se agrega "Todas" por defecto
  selectedCategory: string = 'Todas';

  constructor(private apiStore: HttpService, private readonly loadingS: LoadingService) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.apiStore.getCategories().subscribe((data: string[]) => {
      this.categories = ['Todas', ...data]; // Agregamos "Todas" al inicio
    });
  }

  loadProducts() {
    this.loadingS.show('Cargando productos...');
    this.apiStore.getProducts().subscribe((data: any[]) => {
      this.products = data;
      this.filterProducts();
      this.loadingS.dismiss();
    });
  }

  loadProductsByCategory(category: string) {
    this.selectedCategory = category;

    if (category === 'Todas') {
      this.loadProducts();
      return;
    }

    this.loadingS.show('Cargando productos...');
    this.apiStore.getProductsByCategory(category).subscribe((data) => {
      this.products = data;
      this.filterProducts();
      this.loadingS.dismiss();
    },
    (error) => console.error('Error al cargar los productos por categoría', error));
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  sortProducts(order: string) {
    if (!this.filteredProducts.length) return;

    switch (order) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
  }
}
