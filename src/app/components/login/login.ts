import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  constructor(private router: Router) { }

  avatars: string[] = [
    'assets/imgs/nico-feliz.png',
    'assets/imgs/nico-ser.png',
    'assets/imgs/nico-core.png',
  ];

  descripcionesAvatar: { [key: string]: string } = {
    'assets/imgs/nico-feliz.png': 'Feliz',
    'assets/imgs/nico-ser.png': 'Ser',
    'assets/imgs/nico-core.png': 'Core'
  };

  currentIndex = 1;

  ambientSound = new Audio('assets/sounds/corazon.mp3');
  telonSound = new Audio('assets/sounds/pase-preguntas.mp3');

  iniciarTransicion = false;

  descripcionHover = '';
  hoverActivo = false;

  descripcionActual = '';
  animarDescripcion = false;

  get visibleAvatars(): string[] {
    const len = this.avatars.length;
    const left = (this.currentIndex - 1 + len) % len;
    const center = this.currentIndex;
    const right = (this.currentIndex + 1) % len;
    return [this.avatars[left], this.avatars[center], this.avatars[right]];
  }


  ngOnInit(): void {
    this.actualizarDescripcion(); 
    setTimeout(() => {
      this.ambientSound.loop = true;
      this.ambientSound.volume = 0.5;
      this.ambientSound.play().catch(() => { });
    }, 500);

    setTimeout(() => this.initScrollAndKeyListeners(), 1500);
  }

  actualizarDescripcion() {
    this.animarDescripcion = false;
  
    setTimeout(() => {
      const avatarCentro = this.avatars[this.currentIndex];
      this.descripcionActual = this.descripcionesAvatar[avatarCentro] || '';
      this.animarDescripcion = true;
    }, 10);
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
      this.actualizarDescripcion();
    }
  }
  
  rotateCarouselUp() {
    if (this.canGoLeft()) {
      this.currentIndex--;
      this.actualizarDescripcion();
    }
  }

  avatarSeleccionado(i: number) {
    if (i !== 1) return;

    const ruta = this.obtenerRutaPorAvatar(this.avatars[this.currentIndex]);
    if (!ruta) return;

    this.ambientSound.pause();
    this.ambientSound.currentTime = 0;

    this.iniciarTransicion = true;
    this.telonSound.play().catch(() => { });

    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 1400);
  }

  obtenerRutaPorAvatar(avatar: string): string | null {
    switch (avatar) {
      case 'assets/imgs/nico-feliz.png':
        return '/feliz';
      case 'assets/imgs/nico-ser.png':
        return '/core';
      case 'assets/imgs/nico-core.png':
        return '/ser';
      default:
        return null;
    }
  }

  volverAlInicio() {
    this.ambientSound.pause();
    this.ambientSound.currentTime = 0;
    this.router.navigate(['/inicio']);
  }


}
