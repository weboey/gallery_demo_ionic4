import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private transfer: FileTransfer, private file: File) { }
  fileTransfer: FileTransferObject = this.transfer.create();
  upload(fileUrl) {
    // const url = this.settings.system_url + '/api_article/v1/first_page/upImage/';
    const url = 'http://47.112.218.7:81/api_note/v1/upload_wav';
    const filename = this.createFileName(); //定义上传后的文件名
    const options: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'file': filename},
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
      //开始正式地上传
    return new Promise((resolve, reject) => {
        fileTransfer.upload(fileUrl, url, options).then((data: any) => {
            //在用户看清弹窗提示后进行页面的关闭
            let resp = JSON.parse(data.response);
            console.log(resp);
            resolve(resp);
        }, err => {
            reject(err);
        });
    })
  }
  download() {
    const url = 'http://www.example.com/file.pdf';
    this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
        console.log('download complete: ' + entry.toURL());
    }, (error) => {
        // handle error
    });
  }
  createFileName() {
    const d = new Date();
    const n = d.getTime();
    return n + ".mp3"; //拼接文件名
  }
}
