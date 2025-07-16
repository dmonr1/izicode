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

  avatars: string[] = [
    'assets/nico-1.png',
    'assets/avatar_centrado_recortado.png',
    'assets/nico2.png',
  ];

  currentIndex = 1;

  typingSound = new Audio('assets/videoplayback.mp3');
  startupSound = new Audio('assets/entrada.mp3');

  isTyping = false;

  get visibleAvatars(): string[] {
    const len = this.avatars.length;
    const left = (this.currentIndex - 1 + len) % len;
    const center = this.currentIndex;
    const right = (this.currentIndex + 1) % len;

    return [this.avatars[left], this.avatars[center], this.avatars[right]];
  }

  ngOnInit(): void {
    this.typeLine(this.line1, 1, () => {
      this.showCursor1 = false;
      this.showCursor2 = true;

      this.typeLine(this.line2, 2, () => {
        this.showCursor2 = false;

        setTimeout(() => this.showAuthor = true, 300);
        setTimeout(() => this.showButton = true, 1200);
      });
    });

  }


  fondoActual: string = '#1d1c1c'; // color inicial

  initScrollAndKeyListeners(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && this.canGoRight()) {
        this.rotateCarouselDown();
      } else if (e.key === 'ArrowLeft' && this.canGoLeft()) {
        this.rotateCarouselUp();
      }
    });

    let lastScrollTime = 0;
    window.addEventListener('wheel', (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < 300) return;

      if (e.deltaX > 10 || e.deltaY < -10) {
        if (this.canGoRight()) {
          this.rotateCarouselDown();
          lastScrollTime = now;
        }
      } else if (e.deltaX < -10 || e.deltaY > 10) {
        if (this.canGoLeft()) {
          this.rotateCarouselUp();
          lastScrollTime = now;
        }
      }
    }, { passive: true });
  }

  canGoLeft(): boolean {
    return this.currentIndex > 0;
  }

  canGoRight(): boolean {
    return this.currentIndex < this.avatars.length - 1;
  }

  rotateCarouselDown() {
    if (this.canGoRight()) {
      this.currentIndex++;
    }
  }

  rotateCarouselUp() {
    if (this.canGoLeft()) {
      this.currentIndex--;
    }
  }


  expandirCirculo() {
    this.startupSound.play().catch(() => { });
    this.avatarVisible = true;

    setTimeout(() => this.initScrollAndKeyListeners(), 1500);
  }

  typeLine(text: string, line: number, callback: () => void) {
    let i = 0;

    this.typingSound.loop = true;
    this.typingSound.volume = 0.8;
    this.typingSound.play().catch(() => { });

    const interval = setInterval(() => {
      if (i < text.length) {
        if (line === 1) this.typedLine1 += text[i];
        else this.typedLine2 += text[i];
        i++;
      } else {
        clearInterval(interval);
        this.typingSound.pause();
        this.typingSound.currentTime = 0;
        callback();
      }
    }, 100);
  }

  mostrarPregunta: boolean = false;
  pantallaInundada: boolean = false;

  irAPregunta() {
    this.pantallaInundada = true;
    setTimeout(() => {
      this.mostrarPregunta = true;
    }, 1200); 
  }

  avatarSeleccionado(i: number) {
    this.avatarVisible = false;
    this.showButton = false;
    this.showAuthor = false;
    this.showCursor1 = false;
    this.showCursor2 = false;
  
    this.pantallaInundada = true;
  
    // Espera a que suba y baje la ola antes de mostrar la pregunta
    setTimeout(() => {
      this.fondoActual = 'rgb(255 177 177)'; // o el color que usaste en la ola que baja
      this.mostrarPregunta = true;
      this.pantallaInundada = false; // oculta la animación
    }, 2000); // espera que termine el efecto visual
  }
  


}

