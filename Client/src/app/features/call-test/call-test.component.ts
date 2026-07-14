import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimliProvider } from './AnamAvatar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simli-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
   

    V<video
  #video
  autoplay
  playsinline
  muted>
</video>

<audio
  #audio
  autoplay>
</audio>

<button (click)="activateMic()">
  Activate Mic
</button>
  `
})
export class SimliTestComponent {
  @ViewChild('video')
  videoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild('audio')
  audioRef!: ElementRef<HTMLAudioElement>;

  // Replace with the token from your backend
  constructor(private simli: SimliProvider
  ) { }
  async ngAfterViewInit() {

    const sessionToken =
      'gAAAAABqURStY_exLTusXTz_rPcEPYs_Km1R_2gw1ETfLK3NSHDUUXD19TiEokdsZW8nY0dtfIdmlZyS0iKdBAAsi2K-IaLpVAZ_iSr-OWcYX0ejLkbxJ_d7D6lTLSL_rsjpPvsMnhXnVNClZFGYaUNae3BMbPrb2eRID0NxYzyacJbQOy2gbA6qjVr_sNjT3x5E1pCiuzhJRSR7A72tJcNdHWALWekUV2xaSCpph2MRh7cUyCJbrXBpu0dCuoxX6YoZ4SSBlxplD_nAhJeUf5GWr07G9wLEew3zS3X6jW430bbgAm9OS6HM7_4qlwZq-eCErHaNcodK2vbwroc7eh_oEU4Uu6ROvOUtKpsOsyfd3uHacvr0GLXzD48dMgtxkXVbb64wpCgpdAFrA-xxbIhkWhfqGPj-94W_Qw8ZFHvQbnz1tBXrayZMj71EUfJJgG9RGZCiIiPdhfzuvKsnoiGY90jPAb1dds46Bk7I_6LoU3v3StbFkjGesm3z9dBQndJPzwrv142k0Nzhq4w-ZjiQbaDgCX5gLYq7B_TIQeoZuNvg8z1d03Kv-DpuBmuQRseWGf8SaBl75rVSIzaoXIjA1cCKa4F_f36qU38H1a7V3yUBf4D6sKYgT6AG6SqgA_0dmF6uT4Yz9CZHjJbrGArz0tkfj10-qhnOy5M0o2bOznIN4EFMmaOYQmbjQr2E7ld0zNqSjA26NhQ8MTFEqSI5Uc6YF-sdoMoxBn4c3vqYHo-f21dXgwCNJaxXbc3CJNBQY0qjJSnaJiNcRfYpkypSl73seTOCWNDEzGO2rF33eEEdqsk3Xu7HO-JGLv1fPOToHWRMVKOj5v1fjj7x5dPEFXyGP1TaVCOph9w8jZwcfBW01KHibLLukjwE0k1-xnO7-gp-ZeIITKXBh2vVbbiFmPkFYH0rM4jVg-84t6ueVc4AJLbSG2bJe3KBMWO1NrDS--vM3cPmMcf4YngMP03orfwKKP-vKThMPbrnDgBqsMN2FDJDjyMWIzfpVBu5aBNWSbLkXMBU7vHwWANlzcmxSZyPHH0x80e2dbNOoWXCeQ0Ox3Q9ixoYFhhgO-FvOWCmCVl00SreX5tWOnCjX_FyzE4xhhBohZchZNc0pBeXTZ6KRn-suvwP9dgzVLOnSCe6lZfqs6_j';

    await this.simli.connect(
      sessionToken,
      this.videoRef.nativeElement,
      this.audioRef.nativeElement
    );
  }

  async activateMic() {
    await this.simli.startMicrophone();
  }
}