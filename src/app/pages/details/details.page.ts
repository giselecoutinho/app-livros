import { Component, OnInit } from '@angular/core';
import { LivroService } from 'src/app/services/livro.service';
import { ActivatedRoute } from '@angular/router';
import { Livro } from 'src/app/interfaces/livro';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public livro: Livro = {};
  public uploadPercent: Observable<number>;
  public downloardUrl: Observable<string>;

  private livroId: string = null;  
  private loading: any;
  private livroSubscription: Subscription;
  

  constructor(
    private livroService: LivroService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.livroId = this.activatedRoute.snapshot.params['id'];

    if (this.livroId) this.loadLivro();
  }

  ngOnInit() { }

  

  ngOnDestroy() {
    if (this.livroSubscription) this.livroSubscription.unsubscribe();
  }

  loadLivro() {
    this.livroSubscription = this.livroService.getLivro(this.livroId).subscribe(data => {
      this.livro = data;
    });
  }

  async saveLivro() {
    await this.presentLoading();

    this.livro.userId = this.authService.getAuth().currentUser.uid;

    if (this.livroId) {
      try {
        await this.livroService.updateLivro(this.livroId, this.livro);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    } else {
      this.livro.createdAt = new Date().getTime();

      try {
        await this.livroService.addLivro(this.livro);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}