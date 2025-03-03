import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  standalone: false,
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  purchase: any = null;
  totalItems: number = 0;
  totalPaid: number = 0;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    this.purchase = JSON.parse(localStorage.getItem('lastPurchase') || 'null');

    if (this.purchase && this.purchase.cart) {
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.totalItems = this.purchase.cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    this.totalPaid = this.purchase.cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  }

  getMaskedCardNumber(): string {
    const cardNumber = this.purchase?.customer?.cardNumber || '';
    if (cardNumber.length >= 16) {
      return '•••• •••• •••• ' + cardNumber.slice(-4);
    }
    return 'Número inválido';
  }
  goHome() {
    this.router.navigate(['/home']);
  }
  async downloadPDF() {
    const element = this.pdfContent.nativeElement;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('resumen-de-compra.pdf');
  }

}
