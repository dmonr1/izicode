import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  constructor(private router: Router) {}

  line1 = 'Porque tú siempre existes dondequiera,';
  line2 = 'pero existes mejor donde te quiero.';

  typedLine1 = '';
  typedLine2 = '';

  showCursor1 = false;
  showCursor2 = false;
  showAuthor = false;
  showButton = false;
  isTyping = false;

  typingSound = new Audio('assets/sounds/videoplayback.mp3');
  startupSound = new Audio('assets/sounds/entrada.mp3');

  comenzarTyping() {
    this.isTyping = true;
    this.showCursor1 = true;
    this.typingSound.loop = true;
    this.typingSound.volume = 0.8;

    this.typingSound.play().then(() => {
      this.typeLine(this.line1, 1, () => {
        this.showCursor1 = false;
        this.showCursor2 = true;

        this.typeLine(this.line2, 2, () => {
          this.typingSound.pause();
          this.typingSound.currentTime = 0;
          this.showCursor2 = false;
          setTimeout(() => (this.showAuthor = true), 300);
          setTimeout(() => (this.showButton = true), 1200);
        });
      });
    }).catch(() => {
      console.warn('⚠️ El navegador bloqueó el sonido. Espera clic del usuario.');
    });
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

  expandirCirculo() {
    this.startupSound.play().catch(() => {});
    this.router.navigate(['/login']);
  }
}
