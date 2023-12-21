import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ToastModule,
        DialogModule,
        PagesRoutingModule,
    ]
})
export class PagesModule { }
