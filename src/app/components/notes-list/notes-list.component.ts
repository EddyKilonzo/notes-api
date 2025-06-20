import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotesService, Note } from '../../services/notes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  newNote: Note = { title: '', content: '' };
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router
  ) {}

  get currentUser() {
    const user = this.authService.getCurrentUser();
    return user ? user.name : '';
  }

  /**
   * get all notes
   */

  ngOnInit(): void {
    this.loadNotes();
  }

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: (error) => {
        this.showMessage('Failed to load notes', 'error');
      }
    });
  }
  /**
   * create a new note
   * @param note
   */

  addNote(): void {
    if (this.newNote.title.trim() && this.newNote.content.trim()) {
      this.notesService.createNote(this.newNote).subscribe({
        next: (note) => {
          this.notes.unshift(note);
          this.newNote = { title: '', content: '' };
          this.showMessage('Note added successfully!');
        },
        error: (error) => {
          this.showMessage('Failed to create note', 'error');
        }
      });
    } else {
      this.showMessage('Please fill in both title and content', 'error');
    }
  }
  /**
   * delete a note
   * @param id
   */

  deleteNote(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note.id !== id);
          this.showMessage('Note deleted successfully!');
        },
        error: (error) => {
          this.showMessage('Failed to delete note', 'error');
        }
      });
    }
  }
  /**
   * logout
   */

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 