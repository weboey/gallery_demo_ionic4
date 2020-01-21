import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  taskItem = <any>{title: ''};
  title = '';
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
              public toastController: ToastController) { }
  isEdit = false;
  @ViewChild('textInputEl', {static: true}) textInputEl: any;
  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((q: any) => {
      console.log(q.params);
      this.taskItem = q.params;
      this.title = this.taskItem.title;
    })
  }
  openSelectDateModal() {

  }
  doEdit() {
    this.isEdit = true;
    setTimeout(()=>{
      this.textInputEl.setFocus()
    }, 0)
  }
  changeTitle(v) {
    console.log(v);
    console.log(this.taskItem);
    this.title = v;
  }
  async saveTaskHandler() {
    console.log(this.taskItem);
    const toast = await this.toastController.create({
      message: '修改成功',
      duration: 2000
    });
    this.isEdit = false;
    this.http.put('/api_note/v1/note_view', {
      id: this.taskItem.id,
      title: this.title,
      tip_time: this.taskItem.tip_time
    }).subscribe(() => {
      toast.present();
    })
  }
}
