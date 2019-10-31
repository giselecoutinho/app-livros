import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Livro } from '../interfaces/livro';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private livrosCollection: AngularFirestoreCollection<Livro>;

  constructor(private afs: AngularFirestore) {
    this.livrosCollection = this.afs.collection<Livro>('Livros');
  }

  getLivros() {
    return this.livrosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addLivro(livro: Livro) {
    return this.livrosCollection.add(livro);
  }

  getLivro(id: string) {
    return this.livrosCollection.doc<Livro>(id).valueChanges();
  }

  updateLivro(id: string, Livro: Livro) {
    return this.livrosCollection.doc<Livro>(id).update(Livro);
  }

  deleteLivro(id: string) {
    return this.livrosCollection.doc(id).delete();
  }
}