import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { CrudComponent } from './demo/components/pages/crud/crud.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
                {
                    path: '',
                    component: CrudComponent,
                    children: [
                      { path: '', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                    ]
                  },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
