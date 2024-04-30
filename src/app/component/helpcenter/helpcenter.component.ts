import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


interface QnaNode {
  name: string;
  children?: QnaNode[];
}

const TREE_DATA: QnaNode[] = [
  {
    name: 'Berapa nomor customerCare yang dapat dihubungi?',
    children: [{name: 'Anda dapat menghubungi whatsApp 081394561217'}],
  },
  {
    name: 'Apakah customer dapat menghubungi vendor tanpa melakukan pemesanan produk?',
    children: [{name: 'Tentu Saja bisa, customer dapat memilih salah satu vendor dan menekan tombol chat'}],
  },
  {
    name: 'Bagaimana customer mengetahui jika pesanannya diterima / ditolak vendor?',
    children: [{name: 'Pesan otomatis akan terkirim dari akun Vendor ke akun customer untuk notifikasi penerimaan / penolakan pesanan'}],
  },
  {
    name: 'Bagaimana cara merubah data pemesan saat hendak melakukan pembayaran pesanan?',
    children: [{name: 'Data pemesan merupakan data akun yang Anda miliki, segera update profil melalui fitur yang ada di pojok kanan atas (ketika klik profil) jika data perlu dilakukan update'}],
  },
  {
    name: 'Apakah Saya dapat membatalkan pesanan vendor?',
    children: [{name: 'TTentu saja Anda dapat melakukan pembatalan pesanan dengan melakukan klik "Batalkan pesanan" akan tetapi, uang tidak langsung dikembalikan karena perlu dilakukan konfirmasi terlebih dahulu oleh admin website'}],
  },
  {
    name: 'Apakah Saya dapat melakukan perubahan data pemesan setelah melakukan pembayaran transaksi?',
    children: [{name: 'Ya, data pembayaran transaksi akan terupdate otomatis sesuai data akun Anda'}],
  },
  {
    name: 'Apakah Saya dapat melakukan perubahan tiket? Merubah tanggal dan pax setelah pembayaran dilakukan?',
    children: [{name: 'Anda tidak dapat merubah data pemesanan yang telah dilunaskan, silakan periksa dengan teliti dan lakukan konfirmasi secara berkala'}],
  },
  {
    name: 'Bagaimana jika customer tidak segera melakukan konfirmasi pesanan selesai?',
    children: [{name: 'Anda dapat menghubungi pihak evone untuk dibantu dilakukan penyelesaian pesanan sesuai SK'}],
  },
  {
    name: 'Apa saja produk yang ditawarkan evone?',
    children: [{name: 'Event Organizer'},{name: 'Sound System'},{name: 'Catering'},{name: 'Dekorasi'},],
  },
  {
    name: 'Apa Saja jenis acara yang ditawarkan evone?',
    children: [{name: 'Pernikahan'},{name: 'Ulang tahun'},{name: 'Acara Kantor'},{name: 'Seminar'},],
  }
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-helpcenter',
  templateUrl: './helpcenter.component.html',
  styleUrls: ['./helpcenter.component.css'],
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule]
})
export class HelpcenterComponent{
private _transformer = (node: QnaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
