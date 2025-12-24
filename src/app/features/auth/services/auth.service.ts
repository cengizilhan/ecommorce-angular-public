import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'app_users';
  private readonly CURRENT_USER_KEY = 'app_current_user';

  currentUser = signal<User | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.restoreSession();
  }

  private restoreSession() {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        console.error('Session restore failed', e);
        this.currentUser.set(null);
      }
    }
  }

  register(user: Omit<User, 'id'>): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) {
      return false; // User already exists
    }

    const newUser: User = {
      ...user,
      id: crypto.randomUUID()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    this.login(user.email, user.password!);
    return true;
  }

  login(email: string, password?: string): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const users = this.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      
      this.currentUser.set(userWithoutPassword);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentUser.set(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/']);
  }

  private getUsers(): User[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
