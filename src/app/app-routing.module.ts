import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TaskListComponent} from "./pages/task-list/task-list.component";
import {TaskDetailComponent} from "./pages/task-detail/task-detail.component";
import {TaskCreateComponent} from "./pages/task-create/task-create.component";

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomeModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordModule'},
  // { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'register', loadChildren: './pages/register/register.module#RegisterModule' },
  { path: 'list-viewer', component: TaskListComponent },
  { path: 'task-create', component: TaskCreateComponent },
  { path: 'task-detail', component: TaskDetailComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
