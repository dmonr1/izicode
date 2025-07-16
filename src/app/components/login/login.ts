import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  imports: [CommonModule, NzIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login implements OnInit {

  line1 = 'Porque tú siempre existes dondequiera,';
  line2 = 'pero existes mejor donde te quiero.';

  typedLine1 = '';
  typedLine2 = '';

  showCursor1 = true;
  showCursor2 = false;
  showAuthor = false;
  showButton = false;
  expande = false;
  avatarVisible = false;



  ngOnInit(): void {
    this.typeLine(this.line1, 1, () => {
      this.showCursor1 = false;
      this.showCursor2 = true;

      this.typeLine(this.line2, 2, () => {
        this.showCursor2 = false;

        setTimeout(() => {
          this.showAuthor = true;
        }, 800);
        setTimeout(() => {
          this.showButton = true;
        }, 2300);
      });
    });
  }

  expandirCirculo() {
    this.expande = true;
    setTimeout(() => {
      this.avatarVisible = true;
    }, 300); 
  }


  typeLine(text: string, line: number, callback: () => void) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        if (line === 1) this.typedLine1 += text[i];
        else this.typedLine2 += text[i];
        i++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 100);
  }
}
