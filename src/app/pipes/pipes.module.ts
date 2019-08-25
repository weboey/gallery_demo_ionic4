import { NgModule } from '@angular/core';
import {FilterTaskPipe} from "./filter-task.pipe";
import { DateViewPipe } from './date-view.pipe';


@NgModule({
	declarations: [FilterTaskPipe, DateViewPipe],
	imports: [],
	exports: [FilterTaskPipe, DateViewPipe]
})
export class PipesModule {}
