import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { RoleAdminService } from '../../core/services/role-admin.service';
import { UserAdminService } from '../../core/services/user-admin.service';
import { ApplicationUser } from '../../core/models/application-user.model';
import { ROLES } from '../../core/models/role.model';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2 class="panel-title">Users</h2>
    <p class="panel-sub">
      Create accounts and assign roles. Basic users can only join and launch sessions.
    </p>

    <div class="banner-error" *ngIf="error">{{ error }}</div>

    <!-- New role, in case "Manager" doesn't exist yet on the backend -->
    <form class="create-form" (ngSubmit)="createRole()" style="margin-bottom: 14px;">
      <div class="field">
        <label for="newRole">New role name</label>
        <input id="newRole" [(ngModel)]="newRoleName" name="newRole" placeholder="e.g. Manager" />
      </div>
      <button class="btn ghost" type="submit" [disabled]="!newRoleName">Create role</button>
    </form>

    <!-- New user + role assignment -->
    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">
      <div class="field">
        <label for="displayName">Display name</label>
        <input id="displayName" formControlName="displayName" />
      </div>
      <div class="field">
        <label for="userName">Username</label>
        <input id="userName" formControlName="userName" />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
      </div>
      <div class="field">
        <label for="role">Role</label>
        <select id="role" formControlName="role">
          <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
        </select>
      </div>
      <button class="btn" type="submit" [disabled]="form.invalid || saving">
        {{ saving ? 'Creating…' : 'Create user' }}
      </button>
    </form>
    <p class="panel-sub" style="margin-top:-10px;">
      Note: this calls the same /api/Account/register endpoint as public sign-up (it has no
      password field), then assigns the chosen role via /api/Account/roles/assign.
    </p>

    <table *ngIf="users.length; else empty">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Roles</th><th>Assign role</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of users">
          <td>{{ u.displayName || u.userName }}</td>
          <td>{{ u.email }}</td>
          <td>
            <span class="tag" [class.admin]="r === 'Admin'" [class.manager]="r === 'Manager'" [class.user]="r === 'User'"
                  *ngFor="let r of u.roles" style="margin-right:4px;">
              {{ r }}
              <button (click)="removeRole(u, r)" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:4px;">×</button>
            </span>
            <!-- <span *ngIf="!u.roles?.length" style="color:#8d90a6;">No role</span> -->
          </td>
          <td>
            <select #roleSelect (change)="assignRole(u, roleSelect.value)">
              <option value="" disabled selected>Add role…</option>
              <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p class="empty-state">No users yet.</p></ng-template>
  `,
  styleUrl: './admin.css',
})
export class UserManageComponent implements OnInit {
  users: ApplicationUser[] = [];
  roles = ROLES;
  saving = false;
  error = '';
  newRoleName = '';
  private fb = inject(FormBuilder);

  form = this.fb.group({
    displayName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['User', Validators.required],
  });

  constructor(
    private auth: AuthService,
    private roleAdminService: RoleAdminService,
    private userAdminService: UserAdminService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.userAdminService.getAll().subscribe((data) => (this.users = data));
  }

  createRole(): void {
    if (!this.newRoleName) return;
    this.roleAdminService.createRole(this.newRoleName).subscribe({
      next: () => (this.newRoleName = ''),
      error: (err) => (this.error = err?.error?.message ?? 'Could not create the role.'),
    });
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const { displayName, userName, email, role } = this.form.getRawValue();

    this.auth
      .register({ displayName: displayName!, userName: userName!, email: email! })
      .pipe(switchMap(() => this.roleAdminService.assignRole({ email: email!, role: role! })))
      .subscribe({
        next: () => {
          this.saving = false;
          this.form.reset({ role: 'User' });
          this.load();
        },
        error: (err) => {
          this.saving = false;
          this.error = err?.error?.message ?? 'Could not create the user or assign the role.';
        },
      });
  }

  assignRole(u: ApplicationUser, role: string): void {
    if (!role) return;
    this.roleAdminService.assignRole({ email: u.email, role }).subscribe(() => this.load());
  }

  removeRole(u: ApplicationUser, role: string): void {
    this.roleAdminService.removeRoleFromUser({ email: u.email, role }).subscribe(() => this.load());
  }
}
