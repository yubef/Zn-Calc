# Zinc Consumption Calculator

Calculator sederhana untuk menghitung Zinc Consumption line HDG berdasarkan selisih level ketel, zinc bundle masuk, EZDA masuk, dan tonase produksi.

## Rumus

Luas permukaan zinc di ketel:

```text
1.6 m × 16 m = 25.6 m²
```

Berat zinc dari selisih level:

```text
(level awal - level akhir) / 100 × 25.6 × 6570
```

Zinc Consumption:

```text
(berat zinc dari selisih level + bundle zinc + EZDA) / tonase produksi
```

Output utama dalam kg/ton.

## Cara jalan lokal

```bash
npm install
npm run dev
```

## Cara deploy ke Vercel

Framework Preset: Vite  
Build Command: npm run build  
Output Directory: dist
