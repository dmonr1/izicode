import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    
  }

  isLoginPage(): boolean {
    return this.router.url === '/inicio' || this.router.url === '/login' || this.router.url === '/core' || this.router.url === '/feliz' || this.router.url === '/triste' ||this.router.url === '/';
  }


}
