import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, NzIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login implements OnInit {

  constructor(private router: Router) { }

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
    'assets/imgs/nico-feliz.png',
    'assets/imgs/avatar_centrado_recortado.png',
    'assets/imgs/nico-core.png',
  ];

  currentIndex = 1;

  typingSound = new Audio('assets/sounds/videoplayback.mp3');
  startupSound = new Audio('assets/sounds/entrada.mp3');
  ambientSound = new Audio('assets/sounds/corazon.mp3');
  telonSound = new Audio('assets/sounds/pase-preguntas.mp3');

  isTyping = false;

  get visibleAvatars(): string[] {
    const len = this.avatars.length;
    const left = (this.currentIndex - 1 + len) % len;
    const center = this.currentIndex;
    const right = (this.currentIndex + 1) % len;

    return [this.avatars[left], this.avatars[center], this.avatars[right]];
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.ambientSound.loop = true;
      this.ambientSound.volume = 0.5;
      this.ambientSound.play().catch(() => {});
    }, 500); 
  
    setTimeout(() => this.initScrollAndKeyListeners(), 1500);

  }

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

    setTimeout(() => {
      this.ambientSound.loop = true;
      this.ambientSound.volume = 0.5;
      this.ambientSound.play().catch(() => {});
    }, 800); 

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


  iniciarTransicion = false;  

  avatarSeleccionado(i: number) {
    if (i !== 1) return; 
  
    const ruta = this.obtenerRutaPorAvatar(this.avatars[this.currentIndex]);
    if (!ruta) return;
  
    this.ambientSound.pause();
    this.ambientSound.currentTime = 0;
  
    this.iniciarTransicion = true;
    this.telonSound.play().catch(() => {});
  
    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 1400);
  }
  
  obtenerRutaPorAvatar(avatar: string): string | null {
    switch (avatar) {
      case 'assets/imgs/nico-feliz.png':
        return '/feliz';
      case 'assets/imgs/avatar_centrado_recortado.png':
        return '/triste';
      case 'assets/imgs/nico-core.png':
        return '/core';
      default:
        return null;
    }
  }
  
  
}



