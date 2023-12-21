import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;
    cartVisible: boolean = false;
    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];
    cartProducts: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductService, private messageService: MessageService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    addToCartProduct(product: Product) {
        // Find existing product in the cart
        const existingProduct = this.cartProducts.find(item => item.id === product.id);

        if (existingProduct?.cartQuantity) {
            existingProduct.cartQuantity++;
        } else {
            product.cartQuantity = 1; // Set cartQuantity for new product
            this.cartProducts.push(product);
        }

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart!', life: 3000 });
    }

    openCart() {
        this.cartVisible = true;
    }

    decreaseQuantity(product: Product) {
        if (product.cartQuantity) {
            product.cartQuantity--;
            if (product.cartQuantity === 0) {
                // Remove product when cartQuantity is 0
                this.cartProducts = this.cartProducts.filter(item => item.id !== product.id);
                this.cartProducts.length === 0 ? this.cartVisible = false : true;
            }
        }
    }

    increaseQuantity(product: Product) {
        if (product.cartQuantity) {
            product.cartQuantity++;
        }
    }

    calculateTotalPrice(): number {
        let total = 0;
        for (const product of this.cartProducts) {
            total += (product.price ?? 0) * (product.cartQuantity ?? 0);
        }
        return total;
    }

    checkout() {
        // Implement checkout logic
        // ...

        this.cartProducts = [];
        this.messageService.add({ severity: 'info', summary: 'Checkout', detail: 'Your order is being processed.' });
        this.cartVisible = false; // Close the dialog
    }

    emptyCart() {
        this.cartProducts = [];
        this.cartVisible = false; // Close the dialog
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart emptied.' });
    }

    saveCart() {
        this.cartVisible = false; // Close the dialog
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart Saved.' });
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
