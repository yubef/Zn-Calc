import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Info, RotateCcw } from 'lucide-react';
import './styles.css';

const KETTLE = {
  widthM: 1.6,
  depthM: 3,
  lengthM: 16,
  liquidZincDensityKgM3: 6600,
};

const surfaceAreaM2 = KETTLE.widthM * KETTLE.lengthM;
const kgPerCm = surfaceAreaM2 * 0.01 * KETTLE.liquidZincDensityKgM3;

function parseInput(value) {
  if (value === '' || value === null || value === undefined) return 0;

  const normalized = String(value).replace(',', '.');
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function InputField({ label, unit, value, onChange, helper }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>

      <div className="input-wrap">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="decimal"
          placeholder="0"
          autoComplete="off"
        />
        <span>{unit}</span>
      </div>

      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

function App() {
  const [form, setForm] = useState({
    startLevelCm: '',
    endLevelCm: '',
    productionTon: '',
    zincBundleKg: '',
    ezdaKg: '',
  });

  const data = useMemo(() => {
    const startLevelCm = parseInput(form.startLevelCm);
    const endLevelCm = parseInput(form.endLevelCm);
    const productionTon = parseInput(form.productionTon);
    const zincBundleKg = parseInput(form.zincBundleKg);
    const ezdaKg = parseInput(form.ezdaKg);

    const levelDifferenceCm = startLevelCm - endLevelCm;
    const zincFromLevelKg = levelDifferenceCm * kgPerCm;
    const totalZincUsedKg = zincFromLevelKg + zincBundleKg + ezdaKg;

    const zincConsumptionKgTon =
      productionTon > 0 ? totalZincUsedKg / productionTon : 0;

    const zincConsumptionPercent = zincConsumptionKgTon / 10;

    return {
      startLevelCm,
      endLevelCm,
      productionTon,
      zincBundleKg,
      ezdaKg,
      levelDifferenceCm,
      zincFromLevelKg,
      totalZincUsedKg,
      zincConsumptionKgTon,
      zincConsumptionPercent,
    };
  }, [form]);

  const setValue = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    setForm({
      startLevelCm: '',
      endLevelCm: '',
      productionTon: '',
      zincBundleKg: '',
      ezdaKg: '',
    });
  };

  const status =
    data.productionTon <= 0
      ? 'Masukkan tonase produksi untuk menghitung zinc consumption.'
      : data.totalZincUsedKg < 0
        ? 'Cek ulang level awal/akhir. Total zinc terhitung negatif.'
        : 'Zinc consumption sudah termasuk penurunan level, bundle zinc, dan EZDA.';

  return (
    <main className="page">
      <section className="hero">
        <div className="icon-box">
          <Calculator size={24} />
        </div>

        <div>
          <p className="eyebrow">HDG Calculator</p>
          <h1>Zinc Consumption</h1>
          <p className="subtitle">
            Hitung pemakaian zinc per ton produksi berdasarkan selisih level
            ketel.
          </p>
        </div>
      </section>

      <section className="panel result-panel">
        <p className="panel-title">Zinc Cons</p>

        <div className="main-result">
          <span>{formatNumber(data.zincConsumptionPercent, 2)}</span>
          <small>%</small>
        </div>

        <div className="result-grid">
          <div>
            <p>Total zinc terpakai</p>
            <strong>{formatNumber(data.totalZincUsedKg, 1)} kg</strong>
          </div>

          <div>
            <p>Setara kg/ton</p>
            <strong>
              {formatNumber(data.zincConsumptionKgTon, 2)} kg/ton
            </strong>
          </div>
        </div>

        <p className="status">{status}</p>
      </section>

      <section className="panel input-panel">
        <div className="section-head">
          <p className="panel-title">Input shift / harian</p>

          <button type="button" onClick={reset} className="ghost-btn">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <InputField
          label="Level awal"
          unit="cm"
          value={form.startLevelCm}
          onChange={(value) => setValue('startLevelCm', value)}
          helper="Level zinc sebelum periode hitung."
        />

        <InputField
          label="Level akhir"
          unit="cm"
          value={form.endLevelCm}
          onChange={(value) => setValue('endLevelCm', value)}
          helper="Level zinc setelah periode hitung."
        />

        <InputField
          label="Tonase produksi"
          unit="ton"
          value={form.productionTon}
          onChange={(value) => setValue('productionTon', value)}
        />

        <InputField
          label="Bundle zinc masuk"
          unit="kg"
          value={form.zincBundleKg}
          onChange={(value) => setValue('zincBundleKg', value)}
        />

        <InputField
          label="EZDA masuk"
          unit="kg"
          value={form.ezdaKg}
          onChange={(value) => setValue('ezdaKg', value)}
        />
      </section>

      <section className="panel breakdown-panel">
        <p className="panel-title">Breakdown hitungan</p>

        <div className="break-row">
          <span>Selisih level</span>
          <strong>{formatNumber(data.levelDifferenceCm, 2)} cm</strong>
        </div>

        <div className="break-row">
          <span>Berat zinc dari level</span>
          <strong>{formatNumber(data.zincFromLevelKg, 1)} kg</strong>
        </div>

        <div className="break-row">
          <span>Bundle zinc</span>
          <strong>{formatNumber(data.zincBundleKg, 1)} kg</strong>
        </div>

        <div className="break-row">
          <span>EZDA</span>
          <strong>{formatNumber(data.ezdaKg, 1)} kg</strong>
        </div>

        <div className="break-row">
          <span>Total zinc terpakai</span>
          <strong>{formatNumber(data.totalZincUsedKg, 1)} kg</strong>
        </div>
      </section>

      <section className="note">
        <Info size={18} />

        <p>
          Asumsi: ketel {KETTLE.widthM} × {KETTLE.depthM} ×{' '}
          {KETTLE.lengthM} m, luas permukaan level{' '}
          {formatNumber(surfaceAreaM2, 1)} m², densitas zinc cair{' '}
          {formatNumber(KETTLE.liquidZincDensityKgM3, 0)} kg/m³. Maka 1 cm
          level ≈ {formatNumber(kgPerCm, 1)} kg zinc.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
