import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-list-group',
  templateUrl: './task-list-group.component.html',
  styleUrls: ['./task-list-group.component.scss']
})
export class TaskListGroupComponent implements OnInit {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef,
              private router: Router,
              public toastController: ToastController) { }
  @Input() items = [];
  ngOnInit() {
  }
  // public items = [
  //     { val: '开会', isChecked: false, date: '14:00' },
  //     { val: '打羽毛球', isChecked: false, date: '2019/04/08 16:55' },
  //     { val: '见客户', isChecked: false, date: '2019/07/07 12:15' },
  //     { val: '开会2', isChecked: false, date: '14:00' },
  //     { val: '打羽毛球2', isChecked: false, date: '2019/04/08 16:55' },
  //     { val: '见客户2', isChecked: false, date: '2019/07/07 12:15' },
  //     { val: '开会3', isChecked: false, date: '14:00' },
  //     { val: '打羽毛球3', isChecked: false, date: '2019/04/08 16:55' },
  //     { val: '见客户3', isChecked: false, date: '2019/07/07 12:15' },
  //     { val: '开会999999999', isChecked: false, date: '14:00' },
  //     { val: '打羽毛球999999999', isChecked: false, date: '2019/04/08 16:55' },
  //     { val: '见客户999999999', isChecked: false, date: '2019/07/07 12:15' }
  // ];
  async removeItem(item) {
    const toast = await this.toastController.create({
      message: '删除成功',
      duration: 2000
    });
    this.http.delete('/api_note/v1/note_view', {
      params: {
        id: item.id
      }
    }).subscribe((res: any) =>{
      if(res.code === '200') {
        toast.present();
        this.items = this.items.filter(taskItem => item.id != taskItem.id);
        // this.cd.detectChanges();
      }
    })
  }

  editItem(task) {
    this.router.navigate(['/task-detail'], {
      queryParams: task
    })
  }
}
